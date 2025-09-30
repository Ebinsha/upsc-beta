import { View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { Search, Settings, Star, Flame } from 'lucide-react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Topic } from '@/types/topic';
import topicData from '@/constants/topic-const.json';
const { width } = Dimensions.get('window');

export default function Study() {
  const [searchQuery, setSearchQuery] = useState('');
  const topics: Topic[] = topicData.topics;

  const getCardSize = (priority: number) => {
    if (priority >= 9) return { width: width - 40, height: 140 }; // Large
    if (priority >= 7) return { width: (width - 52) / 2, height: 120 }; // Medium
    return { width: (width - 52) / 2, height: 100 }; // Small
  };

  const handleTopicPress = (topic: Topic) => {
    router.push({
      pathname: '/subtopics',
      params: { 
        topicId: topic.id,
        topicName: topic.name,
        topicColor: topic.color
      }
    });
  };

  const handleTopicPress_old = (topic: Topic) => {
    router.push({
      pathname: '/topic-justify',
      params: { 
        topicId: topic.id,
        topicName: topic.name,
        topicColor: topic.color,
        rating: topic.rating.toString(),
        questionsCount: topic.subtopicCount.toString(),
        difficulty: topic.difficulty,
        isHot: topic.isHot.toString()
      }
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={14} color="#fbbf24" fill="#fbbf24" />);
    }
    
    if (rating % 1 !== 0) {
      stars.push(<Star key="half" size={14} color="#fbbf24" />);
    }
    
    return stars;
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
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-5">
        <Text className="text-xl font-bold text-slate-800 mb-5">Tend Based Topic Distribution</Text>
        
        <View className="flex-row flex-wrap gap-3">
          {topics
            .sort((a, b) => b.priority - a.priority)
            .map((topic) => {
              const cardSize = getCardSize(topic.priority);
              
              return (
                <TouchableOpacity
                  key={topic.id}
                  className="rounded-2xl p-5 shadow-md"
                  style={{
                    width: cardSize.width,
                    height: cardSize.height,
                    backgroundColor: topic.color,
                  }}
                  onPress={() => handleTopicPress(topic)}
                >
                  <View className="flex-1">
                    <View className="flex-row justify-between items-start mb-2">
                      <Text className="text-2xl">{topic.icon}</Text>
                      {topic.isHot && (
                        <View className="bg-red-500 rounded-xl p-1">
                          <Flame size={12} color="#ffffff" />
                        </View>
                      )}
                    </View>
                    
                    <Text className="text-lg font-bold text-slate-800 mb-auto">{topic.name}</Text>
                    
                    <View className="gap-2 flex-row w-full justify-between items-end">
                      <View className="flex-row items-center gap-1">
                        {renderStars(topic.rating)}
                        <Text className="text-sm font-semibold text-slate-800 ml-1">{topic.rating}</Text>
                      </View>
                      
                      <View className="gap-0.5 items-end">
                        <Text className="text-xs text-slate-600 font-medium">
                          {topic.subtopicCount} Subtopics
                        </Text>
                        <Text className="text-xs text-slate-600 font-medium">
                          {topic.difficulty} Priority
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
        </View>
      </ScrollView>
    </View>
  );
}