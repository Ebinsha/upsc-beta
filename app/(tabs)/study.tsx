import { ActivityIndicator, Dimensions, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import OnboardingScreen from '@/components/OnboardingScreen';
import { TopicCard } from '@/components/TopicCard';
import { useTopics } from '@/hooks/useApiData';
import { Topic } from '@/types/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
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

  

  const getCardSize = (weightage: string) => {
    const weight = parseFloat(weightage);
    
    if (weight >= 8) {
      // High weightage topics - Large cards (>8%)
      return { width: width - 40, height: 150, tier: 'high' };
    } else if (weight >= 5) {
      // Medium weightage topics - Medium cards (5-8%)
      return { width: (width - 52) / 2, height: 130, tier: 'medium' };
    } else {
      // Low weightage topics - Small cards (<5%)
      return { width: (width - 64) / 3, height: 120, tier: 'low' };
    }
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
          <Text className="text-base text-slate-500">AI driven insights on evolving topics</Text>
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
          contentContainerStyle={{ paddingBottom: 25 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3b82f6']}
              tintColor="#3b82f6"
            />
          }
        >
          <Text className="text-xl font-bold text-slate-800 mb-5">Current Affairs Topic Trends</Text>
          
          {topics && topics.length > 0 ? (
            <View className="gap-6">
              {/* Sort topics by weightage */}
              {(() => {
                const sortedTopics = [...topics].sort((a, b) => parseFloat(b.weightage) - parseFloat(a.weightage));
                const highWeightage = sortedTopics.filter(t => parseFloat(t.weightage) >= 8);
                const mediumWeightage = sortedTopics.filter(t => parseFloat(t.weightage) >= 5 && parseFloat(t.weightage) < 8);
                const lowWeightage = sortedTopics.filter(t => parseFloat(t.weightage) < 5);

                return (
                  <>
                    {/* High Priority Topics - Large Cards */}
                    {highWeightage.length > 0 && (
                      <View>
                        <Text className="text-base font-semibold text-slate-600 mb-3">High Priority Topics</Text>
                        <View className="gap-3">
                          {highWeightage.map((topic) => {
                            const cardSize = getCardSize(topic.weightage);
                            return (
                              <TopicCard
                                key={topic.id}
                                id={topic.id}
                                name={topic.name}
                                priority={topic.priority}
                                rating={topic.weightage}
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
                      </View>
                    )}

                    {/* Medium Priority Topics - Medium Cards */}
                    {mediumWeightage.length > 0 && (
                      <View>
                        <Text className="text-base font-semibold text-slate-600 mb-3">Medium Priority Topics</Text>
                        <View className="flex-row flex-wrap gap-3">
                          {mediumWeightage.map((topic) => {
                            const cardSize = getCardSize(topic.weightage);
                            return (
                              <TopicCard
                                key={topic.id}
                                id={topic.id}
                                name={topic.name}
                                priority={topic.priority}
                                rating={topic.weightage}
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
                      </View>
                    )}

                    {/* Low Priority Topics - Small Cards in Row */}
                    {lowWeightage.length > 0 && (
                      <View>
                        <Text className="text-base font-semibold text-slate-600 mb-3">Standard Priority Topics</Text>
                        <ScrollView 
                          horizontal 
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{ gap: 12 , paddingBottom: 5 }}
                        >
                          {lowWeightage.map((topic) => {
                            const cardSize = getCardSize(topic.weightage);
                            return (
                              <TopicCard
                                key={topic.id}
                                id={topic.id}
                                name={topic.name}
                                priority={topic.priority}
                                rating={topic.weightage}
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
                        </ScrollView>
                      </View>
                    )}
                  </>
                );
              })()}
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