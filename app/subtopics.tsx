import { View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Search, Package, ChevronRight, Flame } from 'lucide-react-native';
import { useState } from 'react';
import { TopicCard } from '@/components/TopicCard';
import { useSubtopics } from '@/hooks/useApiData';
import { Subtopic } from '@types/topic';

const { width } = Dimensions.get('window');

interface GroupedSubtopic {
  id: string;
  name: string;
  count: number;
  subtopics: Subtopic[];
  avgPriority: number;
  color: string;
}


export default function Subtopics() {
  const params = useLocalSearchParams();
  const { topicId, topicName, topicColor } = params;
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  // Use the API hook to fetch subtopics
  const { data: subtopics, loading, error, refetch } = useSubtopics(topicName as string);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  console.log(subtopics , topicName);

  // Helper functions - moved before usage
  const getSubtopicColor = (index: number, baseColor: string) => {
    const colors = [
      '#F5A3A3', '#A3C3F5', '#7DB8E8', '#E67E22', '#C39BD3', '#85C1E9',
      '#F8C471', '#82E0AA', '#D7BDE2', '#F9E79F', '#AED6F1', '#A9DFBF',
      '#F5B7B1', '#D5A6BD', '#A3E4D7', '#F4D03F', '#85C1E9', '#D2B4DE'
    ];
    return colors[index % colors.length];
  };

  const getCardSize = (priority: number, isGrouped: boolean = false) => {
    if (isGrouped) return { width: width - 40, height: 100 };
    if (priority >= 8) return { width: width - 40, height: 140 };
    if (priority >= 6) return { width: (width - 52) / 2, height: 120 };
    if (priority >= 4) return { width: (width - 52) / 2, height: 100 };
    return { width: (width - 52) / 2, height: 80 };
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
        difficulty: subtopic.difficulty,
        isHot: subtopic.isHot.toString()
      }
    });
  };

  const handleGroupPress = (group: GroupedSubtopic) => {
    console.log('Group pressed:', group.name, 'Topics:', group.subtopics.length);
  };

  // Group subtopics by priority
  const groupSubtopics = (subtopicsData: Subtopic[]) => {
    const highPriority = subtopicsData.filter(s => s.priority >= 6);
    const mediumPriority = subtopicsData.filter(s => s.priority >= 4 && s.priority < 6);
    const lowPriority = subtopicsData.filter(s => s.priority < 4);

    // Group low priority by priority level
    const grouped: GroupedSubtopic[] = [];
    const priorityGroups: Record<number, Subtopic[]> = {};

    lowPriority.forEach(subtopic => {
      if (!priorityGroups[subtopic.priority]) {
        priorityGroups[subtopic.priority] = [];
      }
      priorityGroups[subtopic.priority].push(subtopic);
    });

    Object.entries(priorityGroups).forEach(([priority, items]) => {
      const priorityNum = parseInt(priority);
      grouped.push({
        id: `group-${priority}`,
        name: `Priority ${priority} Topics`,
        count: items.length,
        subtopics: items,
        avgPriority: priorityNum,
        color: getSubtopicColor(priorityNum + 3, topicColor as string) // Offset for better colors
      });
    });

    return { highPriority, mediumPriority, grouped };
  };

  // Only group subtopics if we have data
  const { highPriority, mediumPriority, grouped } = subtopics ? groupSubtopics(subtopics) : { highPriority: [], mediumPriority: [], grouped: [] };

  const filteredHighPriority = highPriority.filter(subtopic =>
    subtopic.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMediumPriority = mediumPriority.filter(subtopic =>
    subtopic.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = grouped.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.subtopics.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
          <Text className="text-base text-slate-600">
            {subtopics ? subtopics.length : 0} subtopics • {highPriority.length} high priority • {mediumPriority.length} medium priority
          </Text>
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
        {/* High Priority Section */}
        {filteredHighPriority.length > 0 && (
          <>
            <Text className="text-xl font-bold text-slate-800 mb-4">🔥 High Priority Topics</Text>
            
            <View className="flex-row flex-wrap gap-3 mb-6">
              {filteredHighPriority
                .sort((a, b) => b.priority - a.priority)
                .map((subtopic, index) => {
                  const cardSize = getCardSize(subtopic.priority);
                  const cardColor = getSubtopicColor(index, topicColor as string);
                  
                  return (
                    <TopicCard
                      key={subtopic.id}
                      id={subtopic.id}
                      name={subtopic.name}
                      priority={subtopic.priority}
                      rating={subtopic.rating}
                      isHot={subtopic.isHot}
                      icon={subtopic.icon}
                      color={cardColor}
                      width={cardSize.width}
                      height={cardSize.height}
                      bottomLeftText=""
                      bottomRightText={[`${subtopic.questionsCount} Questions`, subtopic.difficulty]}
                      onPress={() => handleSubtopicPress(subtopic)}
                    />
                  );
                })}
            </View>
          </>
        )}

        {/* Medium Priority Section */}
        {filteredMediumPriority.length > 0 && (
          <>
            <Text className="text-xl font-bold text-slate-800 mb-4">📚 Medium Priority Topics</Text>
            
            <View className="flex-row flex-wrap gap-3 mb-6">
              {filteredMediumPriority
                .sort((a, b) => b.priority - a.priority)
                .map((subtopic, index) => {
                  const cardSize = getCardSize(subtopic.priority);
                  const cardColor = getSubtopicColor(index + 6, topicColor as string); // Offset for different shades
                  
                  return (
                    <TopicCard
                      key={subtopic.id}
                      id={subtopic.id}
                      name={subtopic.name}
                      priority={subtopic.priority}
                      rating={subtopic.rating}
                      isHot={subtopic.isHot}
                      icon={subtopic.icon}
                      color={cardColor}
                      width={cardSize.width}
                      height={cardSize.height}
                      bottomLeftText=""
                      bottomRightText={[`${subtopic.questionsCount} Questions`, subtopic.difficulty]}
                      onPress={() => handleSubtopicPress(subtopic)}
                    />
                  );
                })}
            </View>
          </>
        )}

        {/* Grouped Low Priority Section */}
        {filteredGroups.length > 0 && (
          <>
            <Text className="text-xl font-bold text-slate-800 mb-4">📋 Other Topics (Grouped)</Text>
            
            <View className="gap-3">
              {filteredGroups.map((group, index) => {
                const cardSize = getCardSize(group.avgPriority, true);
                
                return (
                  <TouchableOpacity
                    key={group.id}
                    className="rounded-2xl p-5 shadow-sm flex-row items-center justify-between"
                    style={{
                      width: cardSize.width,
                      height: cardSize.height,
                      backgroundColor: group.color,
                    }}
                    onPress={() => handleGroupPress(group)}
                  >
                    <View className="flex-row items-center flex-1">
                      <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mr-4">
                        <Package size={24} color="#64748b" />
                      </View>
                      
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-slate-800 mb-1" numberOfLines={1}>
                          {group.name}
                        </Text>
                        <Text className="text-sm text-slate-600">
                          {group.count} topics • Priority Level {group.avgPriority}
                        </Text>
                        <Text className="text-xs text-slate-500 mt-1">
                          Tap to view all topics in this group
                        </Text>
                      </View>
                    </View>
                    
                    <ChevronRight size={20} color="#64748b" />
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
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
    </View>
  );
}