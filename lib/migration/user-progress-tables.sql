-- User Progress Tracking Tables for UPSC App

-- ============================================
-- 1. USER STUDY STREAK TABLE
-- ============================================
create table if not exists user_streaks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_study_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  unique(user_id)
);

-- RLS for user_streaks
alter table user_streaks enable row level security;

create policy "Users can view own streak" on user_streaks
  for select using ((select auth.uid()) = user_id);

create policy "Users can insert own streak" on user_streaks
  for insert with check ((select auth.uid()) = user_id);

create policy "Users can update own streak" on user_streaks
  for update using ((select auth.uid()) = user_id);

-- ============================================
-- 2. TOPIC MASTERY TABLE
-- ============================================
create table if not exists user_topic_mastery (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  topic_id text not null,
  subtopic_id text not null,
  is_completed boolean default false,
  questions_attempted integer default 0,
  questions_correct integer default 0,
  last_practiced_at timestamp with time zone,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  unique(user_id, subtopic_id)
);

-- RLS for user_topic_mastery
alter table user_topic_mastery enable row level security;

create policy "Users can view own mastery" on user_topic_mastery
  for select using ((select auth.uid()) = user_id);

create policy "Users can insert own mastery" on user_topic_mastery
  for insert with check ((select auth.uid()) = user_id);

create policy "Users can update own mastery" on user_topic_mastery
  for update using ((select auth.uid()) = user_id);

-- ============================================
-- 3. STUDY TIME TRACKING TABLE
-- ============================================
create table if not exists user_study_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  session_date date not null,
  duration_seconds integer not null default 0,
  topic_id text,
  subtopic_id text,
  activity_type text check (activity_type in ('study', 'test', 'practice')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint valid_duration check (duration_seconds >= 0)
);

-- Index for faster queries
create index idx_study_sessions_user_date on user_study_sessions(user_id, session_date desc);

-- RLS for user_study_sessions
alter table user_study_sessions enable row level security;

create policy "Users can view own sessions" on user_study_sessions
  for select using ((select auth.uid()) = user_id);

create policy "Users can insert own sessions" on user_study_sessions
  for insert with check ((select auth.uid()) = user_id);

-- ============================================
-- 4. TEST RECORDS TABLE
-- ============================================
create table if not exists user_test_records (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  test_title text not null,
  topic_id text,
  subtopic_id text not null,
  total_questions integer not null,
  correct_answers integer not null,
  score_percentage numeric(5,2) generated always as (
    case 
      when total_questions > 0 then (correct_answers::numeric / total_questions::numeric * 100)
      else 0
    end
  ) stored,
  time_taken_seconds integer not null,
  test_type text check (test_type in ('practice', 'mock', 'chapter')),
  answers_data jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint valid_questions check (total_questions > 0),
  constraint valid_correct check (correct_answers >= 0 and correct_answers <= total_questions),
  constraint valid_time check (time_taken_seconds >= 0)
);

-- Index for faster queries
create index idx_test_records_user_created on user_test_records(user_id, created_at desc);
create index idx_test_records_subtopic on user_test_records(user_id, subtopic_id);

-- RLS for user_test_records
alter table user_test_records enable row level security;

create policy "Users can view own test records" on user_test_records
  for select using ((select auth.uid()) = user_id);

create policy "Users can insert own test records" on user_test_records
  for insert with check ((select auth.uid()) = user_id);

-- ============================================
-- 5. RECENT ACTIVITIES TABLE
-- ============================================
create table if not exists user_activities (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  activity_type text not null check (activity_type in ('test_completed', 'topic_completed', 'study_session', 'streak_milestone', 'achievement')),
  activity_title text not null,
  activity_description text,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for faster queries
create index idx_activities_user_created on user_activities(user_id, created_at desc);

-- RLS for user_activities
alter table user_activities enable row level security;

create policy "Users can view own activities" on user_activities
  for select using ((select auth.uid()) = user_id);

create policy "Users can insert own activities" on user_activities
  for insert with check ((select auth.uid()) = user_id);

-- ============================================
-- 6. USER SETTINGS/PREFERENCES TABLE
-- ============================================
create table if not exists user_settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  
  -- Notification preferences
  notifications_enabled boolean default true,
  daily_reminder_enabled boolean default true,
  daily_reminder_time time default '09:00:00',
  streak_reminder_enabled boolean default true,
  
  -- Study preferences
  questions_per_test integer default 10,
  test_timer_enabled boolean default true,
  show_explanations_immediately boolean default false,
  
  -- Display preferences
  theme text default 'light' check (theme in ('light', 'dark', 'auto')),
  language text default 'en',
  
  -- Privacy preferences
  show_profile_publicly boolean default false,
  show_streak_publicly boolean default false,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  unique(user_id)
);

-- RLS for user_settings
alter table user_settings enable row level security;

create policy "Users can view own settings" on user_settings
  for select using ((select auth.uid()) = user_id);

create policy "Users can insert own settings" on user_settings
  for insert with check ((select auth.uid()) = user_id);

create policy "Users can update own settings" on user_settings
  for update using ((select auth.uid()) = user_id);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to update streak
create or replace function update_user_streak(p_user_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_last_study_date date;
  v_current_streak integer;
  v_longest_streak integer;
  v_today date := current_date;
begin
  -- Get current streak data
  select last_study_date, current_streak, longest_streak
  into v_last_study_date, v_current_streak, v_longest_streak
  from user_streaks
  where user_id = p_user_id;
  
  -- If no record exists, create one
  if not found then
    insert into user_streaks (user_id, current_streak, longest_streak, last_study_date)
    values (p_user_id, 1, 1, v_today);
    return;
  end if;
  
  -- If already studied today, do nothing
  if v_last_study_date = v_today then
    return;
  end if;
  
  -- If studied yesterday, increment streak
  if v_last_study_date = v_today - interval '1 day' then
    v_current_streak := v_current_streak + 1;
  -- If missed a day, reset streak
  elsif v_last_study_date < v_today - interval '1 day' then
    v_current_streak := 1;
  end if;
  
  -- Update longest streak if needed
  if v_current_streak > v_longest_streak then
    v_longest_streak := v_current_streak;
  end if;
  
  -- Update the record
  update user_streaks
  set current_streak = v_current_streak,
      longest_streak = v_longest_streak,
      last_study_date = v_today,
      updated_at = now()
  where user_id = p_user_id;
end;
$$;

-- Function to calculate total study time
create or replace function get_total_study_time(p_user_id uuid)
returns integer
language plpgsql
security definer
as $$
declare
  v_total_seconds integer;
begin
  select coalesce(sum(duration_seconds), 0)
  into v_total_seconds
  from user_study_sessions
  where user_id = p_user_id;
  
  return v_total_seconds;
end;
$$;

-- Function to calculate overall practice score percentage
create or replace function get_overall_practice_score(p_user_id uuid)
returns numeric
language plpgsql
security definer
as $$
declare
  v_avg_score numeric;
begin
  select coalesce(avg(score_percentage), 0)
  into v_avg_score
  from user_test_records
  where user_id = p_user_id
    and test_type = 'practice';
  
  return round(v_avg_score, 2);
end;
$$;

-- Function to get topics mastered count
create or replace function get_topics_mastered_count(p_user_id uuid)
returns integer
language plpgsql
security definer
as $$
declare
  v_count integer;
begin
  select count(*)
  into v_count
  from user_topic_mastery
  where user_id = p_user_id
    and is_completed = true;
  
  return v_count;
end;
$$;

-- ============================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================

-- Trigger to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_user_streaks_updated_at
  before update on user_streaks
  for each row
  execute function update_updated_at_column();

create trigger update_user_topic_mastery_updated_at
  before update on user_topic_mastery
  for each row
  execute function update_updated_at_column();

create trigger update_user_settings_updated_at
  before update on user_settings
  for each row
  execute function update_updated_at_column();

-- ============================================
-- VIEWS FOR DASHBOARD
-- ============================================

-- View for user dashboard statistics
create or replace view user_dashboard_stats as
select 
  u.id as user_id,
  coalesce(s.current_streak, 0) as current_streak,
  coalesce(s.longest_streak, 0) as longest_streak,
  (select count(*) from user_topic_mastery where user_id = u.id and is_completed = true) as topics_mastered,
  (select coalesce(sum(duration_seconds), 0) from user_study_sessions where user_id = u.id) as total_study_time_seconds,
  (select count(*) from user_test_records where user_id = u.id) as total_tests_taken,
  (select coalesce(avg(score_percentage), 0) from user_test_records where user_id = u.id and test_type = 'practice') as overall_practice_score
from auth.users u
left join user_streaks s on s.user_id = u.id;

-- Grant access to the view
alter view user_dashboard_stats owner to postgres;

-- ============================================
-- INITIAL DATA SETUP FUNCTION
-- ============================================

-- Function to initialize user data on signup
create or replace function initialize_user_data()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Create default streak record
  insert into public.user_streaks (user_id, current_streak, longest_streak)
  values (new.id, 0, 0);
  
  -- Create default settings
  insert into public.user_settings (user_id)
  values (new.id);
  
  return new;
end;
$$;

-- Trigger to initialize user data on signup
create trigger on_user_created_initialize_data
  after insert on auth.users
  for each row
  execute function initialize_user_data();

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

comment on table user_streaks is 'Tracks user study streaks and consistency';
comment on table user_topic_mastery is 'Tracks which topics/subtopics users have mastered';
comment on table user_study_sessions is 'Records individual study sessions with duration';
comment on table user_test_records is 'Stores all test attempts with scores and answers';
comment on table user_activities is 'Recent user activities for activity feed';
comment on table user_settings is 'User preferences and settings';
