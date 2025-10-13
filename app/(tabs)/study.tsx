import { View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';

import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { TopicCard } from '@/components/TopicCard';
import { Topic } from '@/types/api';
import { useTopics } from '@/hooks/useApiData';

import OnboardingScreen from '@/components/OnboardingScreen';
import { SafeAreaView } from 'react-native-safe-area-context';


const { width } = Dimensions.get('window');
const ONBOARDING_KEY = 'smart_study_onboarding_completed';


export default function Study() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  // Use the API hook to fetch topics
  const { data: topics, loading, error, refetch } = useTopics();
    const [isLoadingOnboard, setIsLoadingOnboard] = useState(true);
  
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    checkOnboardingStatus();
  }, []);


  const checkOnboardingStatus = async () => {
    try {
      const completed = await AsyncStorage.getItem(ONBOARDING_KEY);
      setShowOnboarding(!completed);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    } finally {
      setIsLoadingOnboard(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      setShowOnboarding(false);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };


  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  

  const getCardSize = (priority: number) => {
    if (priority >= 4) return { width: width - 40, height: 140 }; // Large
    if (priority >= 3) return { width: (width - 52) / 2, height: 120 }; // Medium
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

if (isLoadingOnboard) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-base text-slate-600 mt-4">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (showOnboarding) {
    return (
      <SafeAreaView className="flex-1">
        <OnboardingScreen onComplete={completeOnboarding} />
      </SafeAreaView>
    );
  }







  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-white pt-16 px-5 pb-5 border-b border-slate-200">

         <Text className="text-3xl font-bold text-slate-800">Smart Study</Text>
          <Text className="text-base text-slate-500">AI powered topic distribution</Text>
        {/* <View className="flex-row justify-between items-center mb-5">
         
          <TouchableOpacity>
            <Settings size={24} color="#64748b" />
          </TouchableOpacity>
        </View> */}
        
        {/* <View className="flex-row items-center bg-slate-100 rounded-xl px-4 py-3 gap-3">
          <Search size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 text-base text-slate-800"
            placeholder="Search notes, articles, and more"
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View> */}
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-base text-slate-600 mt-4">Loading topics...</Text>
        </View>
      ) : error && !topics ? (
        <View className="flex-1 justify-center items-center px-5">
          <Text className="text-6xl mb-4">😕</Text>
          <Text className="text-xl font-bold text-slate-800 mb-2 text-center">Oops! Something went wrong</Text>
          <Text className="text-base text-slate-500 mb-6 text-center">
            We couldn't load the topics. Please check your connection and try again.
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
          <Text className="text-xl font-bold text-slate-800 mb-5">Trend Based Topic Distribution</Text>
          
          {topics && topics.length > 0 ? (
            <View className="flex-row flex-wrap gap-3">
              {topics
                .sort((a, b) => b.rating - a.rating)
                .map((topic) => {
                  const cardSize = getCardSize(topic.rating);
                  
                  return (
                    <TopicCard
                      key={topic.id}
                      id={topic.id}
                      name={topic.name}
                      priority={topic.priority}
                      rating={topic.rating}
                      // isHot={topic.isHot}
                      icon={topic.icon}
                      color={topic.color}
                      width={cardSize.width}
                      height={cardSize.height}
                      bottomLeftText=""
                      bottomRightText={[`${topic.subtopicCount} Subtopics`]}
                      onPress={() => handleTopicPress(topic)}
                    />
                  );
                })}
            </View>
          ) : (
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-4xl mb-4">📚</Text>
              <Text className="text-lg font-semibold text-slate-800 mb-2">No topics available</Text>
              <Text className="text-base text-slate-500 text-center">
                Pull down to refresh and load topics
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}