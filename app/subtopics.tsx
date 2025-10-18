import { SubtopicGroup } from '@/components/SubtopicGroup';
import { useSubtopics } from '@/hooks/useApiData';
import { Subtopic } from '@/types/api';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, BookOpen, Flame, Search, Target } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Dimensions, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function Subtopics() {
  const params = useLocalSearchParams();
  const { topicId, topicName, topicColor } = params;
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  
  // Use the API hook to fetch subtopics
  const { data: subtopics, loading, error, refetch } = useSubtopics(topicName as string);
  
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Refresh error:', error);
    }
    setRefreshing(false);
  };

  const handleSubtopicPress = (subtopic: Subtopic) => {
    router.push({
      pathname: '/topic-justify',
      params: { 
        topicId: subtopic.id,
        topicName: subtopic.name,
        topicColor: topicColor,
        // rating: subtopic.rating.toString(),
        questionsCount: subtopic.questionsCount.toString(),
        // difficulty: subtopic.difficulty,
        // isHot: subtopic.isHot.toString()
      }
    });
  };

  // Group subtopics by priority (trending, hot, medium)
  const groupSubtopics = (subtopicsData: Subtopic[]) => {
    const hotTopics = subtopicsData.filter(s => s.priority.toLowerCase() === 'trending');
    const highPriority = subtopicsData.filter(s => s.priority.toLowerCase() === 'hot');
    const mediumPriority = subtopicsData.filter(s => s.priority.toLowerCase() === 'medium');

    return { hotTopics, highPriority, mediumPriority };
  };

  // Filter and group subtopics
  const filteredSubtopics = subtopics?.filter(subtopic =>
    subtopic.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const { hotTopics, highPriority, mediumPriority } = groupSubtopics(filteredSubtopics);

  return (
    <View className="flex-1 bg-slate-50">
      <View className="pt-16 px-5 pb-5" style={{ backgroundColor: topicColor as string }}>
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/90 items-center justify-center mb-4"
        >
          <ArrowLeft size={24} color="#1e293b" />
        </TouchableOpacity>
        
        <View className="gap-2 mb-5">
          <Text className="text-3xl font-bold text-slate-800">{topicName}</Text>
          <View className="flex-row items-center gap-4">
            <Text className="text-sm text-slate-600">
              {subtopics ? subtopics.length : 0} subtopics
            </Text>
            {hotTopics.length > 0 && (
              <View className="flex-row items-center gap-1">
                <Flame size={14} color="#ef4444" />
                <Text className="text-sm text-red-600 font-medium">
                  {hotTopics.length} trending
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <View className="flex-row items-center bg-white/90 rounded-xl px-4 py-3 gap-3">
          <Search size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 text-base text-slate-800"
            placeholder="Search subtopics..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-base text-slate-600 mt-4">Loading subtopics...</Text>
        </View>
      ) : error && !subtopics ? (
        <View className="flex-1 justify-center items-center px-5">
          <Text className="text-6xl mb-4">😕</Text>
          <Text className="text-xl font-bold text-slate-800 mb-2 text-center">Oops! Something went wrong</Text>
          <Text className="text-base text-slate-500 mb-6 text-center">
            We couldn&apos;t load the subtopics. Please check your connection and try again.
          </Text>
          <TouchableOpacity 
            className="bg-blue-500 px-6 py-3 rounded-xl"
            onPress={refetch}
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          className="flex-1 p-5"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3b82f6']}
              tintColor="#3b82f6"
            />
          }
        >
          {subtopics && subtopics.length > 0 ? (
            <>
              {/* Hot Topics Section - Trending */}
              {hotTopics.length > 0 && (
                <SubtopicGroup
                  title="🔥 Trending Topics"
                  subtitle={`${hotTopics.length} trending topics • High exam frequency`}
                  subtopics={hotTopics}
                  color="#FEE2E2"
                  icon={Flame}
                  onSubtopicPress={handleSubtopicPress}
                  defaultExpanded={false}
                />
              )}

              {/* High Priority Section - Hot */}
              {highPriority.length > 0 && (
                <SubtopicGroup
                  title="🎯 Hot Topics"
                  subtitle={`${highPriority.length} hot topics • Important areas`}
                  subtopics={highPriority}
                  color="#DBEAFE"
                  icon={Target}
                  onSubtopicPress={handleSubtopicPress}
                  defaultExpanded={false}
                />
              )}

              {/* Medium Priority Section */}
              {mediumPriority.length > 0 && (
                <SubtopicGroup
                  title="📚 Medium Priority"
                  subtitle={`${mediumPriority.length} topics • Standard coverage`}
                  subtopics={mediumPriority}
                  color="#FEF3C7"
                  icon={BookOpen}
                  onSubtopicPress={handleSubtopicPress}
                />
              )}
            </>
          ) : (
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-4xl mb-4">📚</Text>
              <Text className="text-lg font-semibold text-slate-800 mb-2">No subtopics available</Text>
              <Text className="text-base text-slate-500 text-center">
                Pull down to refresh and load subtopics
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Floating Practice Button */}
      {/* <View className="absolute bottom-6 left-0 right-0 items-center">
        <TouchableOpacity
          className="bg-blue-500 px-8 py-4 items-center justify-center shadow-lg flex-row gap-2"
          onPress={() => setShowPracticeModal(true)}
          style={{
            borderRadius: 50,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          }}
        >
          <Play size={20} color="#ffffff" />
          <Text className="text-white font-semibold text-base">Start Practice</Text>
        </TouchableOpacity>
      </View> */}

      {/* Practice Modal */}
      {/* <PracticeModal
        visible={showPracticeModal}
        onClose={() => setShowPracticeModal(false)}
        topicName={topicName as string}
      /> */}
    </View>
  );
}