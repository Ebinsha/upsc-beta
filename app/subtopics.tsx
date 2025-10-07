
import { View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Search, Flame, Target, BookOpen, Play } from 'lucide-react-native';
import { useState } from 'react';
import { SubtopicGroup } from '@/components/SubtopicGroup';
import { useSubtopics } from '@/hooks/useApiData';
import { Subtopic } from '@/types/api';
import { PracticeModal } from '@/components/PracticeModal';

const { width } = Dimensions.get('window');

export default function Subtopics() {
  const params = useLocalSearchParams();
  const { topicId, topicName, topicColor } = params;
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  
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
        rating: subtopic.rating.toString(),
        questionsCount: subtopic.questionsCount.toString(),
        // difficulty: subtopic.difficulty,
        isHot: subtopic.isHot.toString()
      }
    });
  };

  // Group subtopics by hot topics and priority
  const groupSubtopics = (subtopicsData: Subtopic[]) => {
    const hotTopics = subtopicsData.filter(s => s.isHot);
    const highPriority = subtopicsData.filter(s => !s.isHot && s.priority >= 7);
    const mediumPriority = subtopicsData.filter(s => !s.isHot && s.priority >= 4 && s.priority < 7);
    const lowPriority = subtopicsData.filter(s => !s.isHot && s.priority < 4);

    return { hotTopics, highPriority, mediumPriority, lowPriority };
  };

  // Filter and group subtopics
  const filteredSubtopics = subtopics?.filter(subtopic =>
    subtopic.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const { hotTopics, highPriority, mediumPriority, lowPriority } = groupSubtopics(filteredSubtopics);

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
            We couldn't load the subtopics. Please check your connection and try again.
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
              {/* Hot Topics Section */}
              {hotTopics.length > 0 && (
                <SubtopicGroup
                  title="🔥 Trending Topics"
                  subtitle={`${hotTopics.length} hot topics • High exam frequency`}
                  subtopics={hotTopics.sort((a, b) => b.priority - a.priority)}
                  color="#FEE2E2"
                  icon={Flame}
                  onSubtopicPress={handleSubtopicPress}
                  defaultExpanded={true}
                />
              )}

              {/* High Priority Section */}
              {highPriority.length > 0 && (
                <SubtopicGroup
                  title="🎯 High Priority"
                  subtitle={`${highPriority.length} topics • Priority 7+ • Focus areas`}
                  subtopics={highPriority.sort((a, b) => b.priority - a.priority)}
                  color="#DBEAFE"
                  icon={Target}
                  onSubtopicPress={handleSubtopicPress}
                  defaultExpanded={hotTopics.length === 0}
                />
              )}

              {/* Medium Priority Section */}
              {mediumPriority.length > 0 && (
                <SubtopicGroup
                  title="📚 Medium Priority"
                  subtitle={`${mediumPriority.length} topics • Priority 4-6 • Important concepts`}
                  subtopics={mediumPriority.sort((a, b) => b.priority - a.priority)}
                  color="#FEF3C7"
                  icon={BookOpen}
                  onSubtopicPress={handleSubtopicPress}
                />
              )}

              {/* Low Priority Section */}
              {lowPriority.length > 0 && (
                <SubtopicGroup
                  title="📋 Other Topics"
                  subtitle={`${lowPriority.length} topics • Priority <4 • Additional coverage`}
                  subtopics={lowPriority.sort((a, b) => b.priority - a.priority)}
                  color="#F3F4F6"
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
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-16 h-16 bg-blue-500 rounded-full items-center justify-center shadow-lg"
        onPress={() => setShowPracticeModal(true)}
        style={{
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        }}
      >
        <Play size={24} color="#ffffff" />
      </TouchableOpacity>

      {/* Practice Modal */}
      <PracticeModal
        visible={showPracticeModal}
        onClose={() => setShowPracticeModal(false)}
        topicName={topicName as string}
      />
    </View>
  );
}