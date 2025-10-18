import { useTestRecords } from '@/hooks/useUserProgress';
import { router } from 'expo-router';
import { BookOpen, Clock, TrendingUp, Trophy, X } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function Tests() {
  const { tests, overallScore, loading } = useTestRecords();
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState<any>(null);

  const practiceTests = [
    {
      id: '1',
      title: 'Environment Mock Test',
      questions: 50,
      duration: '90',
      subtopicId: 'environment-basics',
      completed: false,
      score: null,
    },
    {
      id: '2',
      title: 'Economy Practice Set',
      questions: 30,
      duration: '45',
      subtopicId: 'economy-basics',
      completed: false,
      score: null,
    },
    {
      id: '3',
      title: 'History Quick Quiz',
      questions: 20,
      duration: '30',
      subtopicId: 'history-basics',
      completed: false,
      score: null,
    },
  ];

  const completedTests = tests?.length || 0;
  const avgScore = Math.round(overallScore || 0);

  const handleStartTest = (test: any) => {
    setSelectedTest(test);
    setShowDifficultyModal(true);
  };

  const handleDifficultySelect = (difficulty: 'medium' | 'hard' | 'pyq') => {
    if (!selectedTest) return;
    
    setShowDifficultyModal(false);
    router.push({
      pathname: '/practice-test',
      params: {
        testId: selectedTest.id,
        testTitle: selectedTest.title,
        duration: selectedTest.duration.toString(),
        difficulty: difficulty,
        questionsCount: selectedTest.questions.toString(),
        subtopicId: selectedTest.subtopicId
      }
    });
    setSelectedTest(null);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-base text-slate-600 mt-4">Loading tests...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-white pt-16 px-5 pb-5 border-b border-slate-200">
        <Text className="text-3xl font-bold text-slate-800 mb-1">Practice Tests</Text>
        <Text className="text-base text-slate-500">Test your knowledge and track progress</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-5">
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-white p-5 rounded-2xl items-center shadow-sm">
            <Trophy size={24} color="#f59e0b" />
            <Text className="text-2xl font-bold text-slate-800 mt-2 mb-1">{completedTests}</Text>
            <Text className="text-sm text-slate-500">Completed</Text>
          </View>
          <View className="flex-1 bg-white p-5 rounded-2xl items-center shadow-sm">
            <TrendingUp size={24} color="#10b981" />
            <Text className="text-2xl font-bold text-slate-800 mt-2 mb-1">{avgScore}%</Text>
            <Text className="text-sm text-slate-500">Avg Score</Text>
          </View>
        </View>

        <Text className="text-xl font-bold text-slate-800 mb-4">Available Tests</Text>
        
        {practiceTests.map((test) => (
          <TouchableOpacity 
            key={test.id} 
            className="bg-white rounded-2xl p-5 mb-4 shadow-sm"
            onPress={() => handleStartTest(test)}
          >
            <View className="flex-row items-center mb-3 gap-3">
              <BookOpen size={20} color="#3b82f6" />
              <Text className="text-lg font-bold text-slate-800 flex-1">{test.title}</Text>
            </View>
            
            <View className="flex-row items-center mb-4 gap-2">
              <View className="flex-row items-center gap-1">
                <Clock size={16} color="#64748b" />
                <Text className="text-sm text-slate-500">{test.duration} min</Text>
              </View>
              <Text className="text-sm text-slate-500">•</Text>
              <Text className="text-sm text-slate-500">{test.questions} Questions</Text>
            </View>
            
            <View className="py-3 rounded-xl items-center bg-blue-500">
              <Text className="text-base font-semibold text-white">
                Start Test
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Difficulty Selection Modal */}
      <Modal
        visible={showDifficultyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDifficultyModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-slate-800">Select Difficulty</Text>
              <TouchableOpacity onPress={() => setShowDifficultyModal(false)}>
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <Text className="text-base text-slate-600 mb-6">
              Choose the difficulty level for your practice test
            </Text>

            {/* Medium Option */}
            <TouchableOpacity
              className="bg-white border-2 border-blue-500 rounded-2xl p-5 mb-3 shadow-sm"
              onPress={() => handleDifficultySelect('medium')}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-slate-800 mb-1">Medium</Text>
                  <Text className="text-sm text-slate-600">Moderate difficulty questions</Text>
                  <View className="bg-yellow-100 px-2 py-1 rounded-md self-start mt-2">
                    <Text className="text-xs font-semibold text-yellow-800">MEDIUM</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {/* Hard Option */}
            <TouchableOpacity
              className="bg-white border-2 border-blue-500 rounded-2xl p-5 mb-3 shadow-sm"
              onPress={() => handleDifficultySelect('hard')}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-slate-800 mb-1">Hard</Text>
                  <Text className="text-sm text-slate-600">Challenging advanced questions</Text>
                  <View className="bg-red-100 px-2 py-1 rounded-md self-start mt-2">
                    <Text className="text-xs font-semibold text-red-800">HARD</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {/* PYQ Option */}
            <TouchableOpacity
              className="bg-white border-2 border-blue-500 rounded-2xl p-5 mb-4 shadow-sm"
              onPress={() => handleDifficultySelect('pyq')}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-slate-800 mb-1">PYQ</Text>
                  <Text className="text-sm text-slate-600">Previous Year Questions</Text>
                  <View className="bg-green-100 px-2 py-1 rounded-md self-start mt-2">
                    <Text className="text-xs font-semibold text-green-800">PREVIOUS YEAR</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-slate-100 rounded-2xl p-4 mt-2"
              onPress={() => setShowDifficultyModal(false)}
            >
              <Text className="text-slate-700 font-semibold text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}