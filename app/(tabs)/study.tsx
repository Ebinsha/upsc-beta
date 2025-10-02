import { View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { Search, Settings, Star, Flame } from 'lucide-react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { TopicCard } from '@/components/TopicCard';
import { Topic } from '@/types/api';
import { useTopics } from '@/hooks/useApiData';


const { width } = Dimensions.get('window');

export default function Study() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use the API hook to fetch topics
  const { data: topicsData, loading, error, refetch } = useTopics();
  const topics: Topic[] = topicsData?.topics || [];

  // Fallback to mock data if API fails
  const mockTopics: Topic[] = [
    {
      id: "1",
      name: "Environment",
      priority: 10,
      rating: 4.8,
      isHot: true,
      color: "#F5A3A3",
      icon: "🌱",
      subtopicCount: 145,
      difficulty: "High"
    },
    {
      id: "2",
      name: "History",
      priority: 8,
      rating: 4.5,
      isHot: false,
      color: "#A3C3F5",
      icon: "📚",
      subtopicCount: 120,
      difficulty: "Medium"
    },
    {
      id: "3",
      name: "Geography",
      priority: 7,
      rating: 4.3,
      isHot: false,
      color: "#7DB8E8",
      icon: "🌍",
      subtopicCount: 98,
      difficulty: "Medium"
    },
    {
      id: "4",
      name: "Economy",
      priority: 9,
      rating: 4.7,
      isHot: true,
      color: "#E67E22",
      icon: "💰",
      subtopicCount: 132,
      difficulty: "High"
    },
    {
      id: "5",
      name: "Ethics",
      priority: 6,
      rating: 4.1,
      isHot: false,
      color: "#C39BD3",
      icon: "⚖️",
      subtopicCount: 87,
      difficulty: "Low"
    }
  ];

  const displayTopics = topics.length > 0 ? topics : mockTopics;

  const getCardSize = (priority: number) => {
    if (priority >= 9) return { width: width - 40, height: 140 }; // Large
    if (priority >= 7) return { width: (width - 52) / 2, height: 120 }; // Medium
    return { width: (width - 52) / 2, height: 100 }; // Small
  };

  // const handleTopicPress = (topic: Topic) => {
  //   router.push({
  //     pathname: '/topic-justify',
  //     params: { 
  //       topicId: topic.id,
  //       topicName: topic.name,
  //       topicColor: topic.color,
  //       rating: topic.rating.toString(),
  //       questionsCount: topic.subtopicCount.toString(),
  //       difficulty: topic.difficulty,
  //       isHot: topic.isHot.toString()
  //     }
  //   });
  // };

      const handleTopicPress = (topic: Topic) => {
        router.push({
          pathname:'/subtopics',
          params: { 
            topicId: topic.id,
            topicName: topic.name,
            topicColor: topic.color
          }
        });
      };
  


  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-white pt-16 px-5 pb-5 border-b border-slate-200">
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-3xl font-bold text-slate-800">Smart Study</Text>
          <TouchableOpacity>
            <Settings size={24} color="#64748b" />
          </TouchableOpacity>
        </View>
        
        <View className="flex-row items-center bg-slate-100 rounded-xl px-4 py-3 gap-3">
          <Search size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 text-base text-slate-800"
            placeholder="Search notes, articles, and more"
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        {loading && (
          <Text className="text-sm text-slate-500 mt-2">Loading topics...</Text>
        )}
        
        {error && (
          <View className="mt-2">
            <Text className="text-sm text-red-500">Error: {error}</Text>
            <TouchableOpacity onPress={refetch} className="mt-1">
              <Text className="text-sm text-blue-500">Tap to retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-5">
        <Text className="text-xl font-bold text-slate-800 mb-5">Tend Based Topic Distribution</Text>
        
        <View className="flex-row flex-wrap gap-3">
          {displayTopics
            .sort((a, b) => b.priority - a.priority)
            .map((topic) => {
              const cardSize = getCardSize(topic.priority);
              
              return (
                <TopicCard
                  key={topic.id}
                  id={topic.id}
                  name={topic.name}
                  priority={topic.priority}
                  rating={topic.rating}
                  isHot={topic.isHot}
                  icon={topic.icon}
                  color={topic.color}
                  width={cardSize.width}
                  height={cardSize.height}
                  bottomLeftText=""
                  bottomRightText={[`${topic.subtopicCount} Questions`, topic.difficulty]}
                  onPress={() => handleTopicPress(topic)}
                />
              );
            })}
        </View>
      </ScrollView>
    </View>
  );
}