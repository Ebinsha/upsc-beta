import { useAvailableExamTopics } from '@/hooks/useApiData';
import { useTestRecords } from '@/hooks/useUserProgress';
import { router } from 'expo-router';
import { BookOpen, Clock, TrendingUp, Trophy, X } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function Tests() {
  const { tests, overallScore, loading: progressLoading } = useTestRecords();
  const { data: availableExams, loading: examsLoading } = useAvailableExamTopics();
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState<any>(null);

  const completedTests = tests?.length || 0;
  const avgScore = Math.round(overallScore || 0);

  const loading = progressLoading || examsLoading;

  const handleStartTest = (test: any) => {
    setSelectedTest(test);
    setShowDifficultyModal(true);
  };

  const handleDifficultySelect = (difficulty: 'medium' | 'hard' | 'pyq') => {
    if (!selectedTest) return;
    
    // Calculate duration based on question count (2 minutes per question)
    let questionsCount = 0;
    if (difficulty === 'medium') {
      questionsCount = selectedTest.mediumQuestions;
    } else if (difficulty === 'hard') {
      questionsCount = selectedTest.hardQuestions;
    } else if (difficulty === 'pyq') {
      questionsCount = selectedTest.pyqQuestions;
    }
    
    const duration = Math.ceil(questionsCount * 2);
    
    setShowDifficultyModal(false);
    router.push({
      pathname: '/practice-test',
      params: {
        testId: selectedTest.id,
        testTitle: `${selectedTest.title} - ${difficulty.toUpperCase()} Practice`,
        duration: duration.toString(),
        difficulty: difficulty,
        questionsCount: questionsCount.toString(),
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
        
        {!availableExams || availableExams.length === 0 ? (
          <View className="bg-white rounded-2xl p-8 items-center">
            <Text className="text-slate-500 text-center">No tests available at the moment</Text>
          </View>
        ) : (
          availableExams.map((test) => (
            <TouchableOpacity 
              key={test.id} 
              className="bg-white rounded-2xl p-5 mb-4 shadow-sm"
              onPress={() => handleStartTest(test)}
            >
              <View className="flex-row items-center mb-3 gap-3">
                <BookOpen size={20} color="#3b82f6" />
                <Text className="text-lg font-bold text-slate-800 flex-1">{test.title}</Text>
              </View>
              
              <View className="flex-row items-center mb-4 gap-2 flex-wrap">
                <View className="flex-row items-center gap-1">
                  <Clock size={16} color="#64748b" />
                  <Text className="text-sm text-slate-500">
                    {Math.ceil(test.totalQuestions * 2)} min (approx)
                  </Text>
                </View>
                <Text className="text-sm text-slate-500">•</Text>
                <Text className="text-sm text-slate-500">{test.totalQuestions} Questions</Text>
                {test.mediumQuestions > 0 && (
                  <>
                    <Text className="text-sm text-slate-500">•</Text>
                    <Text className="text-sm text-amber-600">{test.mediumQuestions} Medium</Text>
                  </>
                )}
                {test.hardQuestions > 0 && (
                  <>
                    <Text className="text-sm text-slate-500">•</Text>
                    <Text className="text-sm text-red-600">{test.hardQuestions} Hard</Text>
                  </>
                )}
                {test.pyqQuestions > 0 && (
                  <>
                    <Text className="text-sm text-slate-500">•</Text>
                    <Text className="text-sm text-purple-600">{test.pyqQuestions} PYQ</Text>
                  </>
                )}
              </View>
              
              <View className="py-3 rounded-xl items-center bg-blue-500">
                <Text className="text-base font-semibold text-white">
                  Start Test
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
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
              className={`bg-white border-2 rounded-2xl p-5 mb-3 shadow-sm ${
                selectedTest?.mediumQuestions > 0 
                  ? 'border-blue-500' 
                  : 'border-slate-200 opacity-50'
              }`}
              onPress={() => selectedTest?.mediumQuestions > 0 && handleDifficultySelect('medium')}
              disabled={!selectedTest?.mediumQuestions || selectedTest?.mediumQuestions === 0}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-slate-800 mb-1">Medium</Text>
                  <Text className="text-sm text-slate-600">
                    {selectedTest?.mediumQuestions > 0 
                      ? `${selectedTest.mediumQuestions} moderate difficulty questions`
                      : 'No questions available'}
                  </Text>
                  {selectedTest?.mediumQuestions > 0 && (
                    <View className="bg-amber-100 px-2 py-1 rounded-md self-start mt-2">
                      <Text className="text-xs font-semibold text-amber-800">
                        {selectedTest.mediumQuestions} QUESTIONS
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>

            {/* Hard Option */}
            <TouchableOpacity
              className={`bg-white border-2 rounded-2xl p-5 mb-3 shadow-sm ${
                selectedTest?.hardQuestions > 0 
                  ? 'border-blue-500' 
                  : 'border-slate-200 opacity-50'
              }`}
              onPress={() => selectedTest?.hardQuestions > 0 && handleDifficultySelect('hard')}
              disabled={!selectedTest?.hardQuestions || selectedTest?.hardQuestions === 0}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-slate-800 mb-1">Hard</Text>
                  <Text className="text-sm text-slate-600">
                    {selectedTest?.hardQuestions > 0 
                      ? `${selectedTest.hardQuestions} challenging advanced questions`
                      : 'No questions available'}
                  </Text>
                  {selectedTest?.hardQuestions > 0 && (
                    <View className="bg-red-100 px-2 py-1 rounded-md self-start mt-2">
                      <Text className="text-xs font-semibold text-red-800">
                        {selectedTest.hardQuestions} QUESTIONS
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>

            {/* PYQ Option */}
            {selectedTest?.pyqQuestions > 0 ? (
              <TouchableOpacity
                className="bg-white border-2 border-blue-500 rounded-2xl p-5 mb-4 shadow-sm"
                onPress={() => handleDifficultySelect('pyq')}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-slate-800 mb-1">PYQ</Text>
                    <Text className="text-sm text-slate-600">
                      {selectedTest.pyqQuestions} previous year questions
                    </Text>
                    <View className="bg-purple-100 px-2 py-1 rounded-md self-start mt-2">
                      <Text className="text-xs font-semibold text-purple-800">
                        {selectedTest.pyqQuestions} QUESTIONS
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ) : (
              <View className="bg-slate-100 border-2 border-slate-200 rounded-2xl p-5 mb-4 opacity-50">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-slate-600 mb-1">PYQ</Text>
                    <Text className="text-sm text-slate-500">Previous Year Questions</Text>
                    <View className="bg-slate-200 px-2 py-1 rounded-md self-start mt-2">
                      <Text className="text-xs font-semibold text-slate-600">NOT AVAILABLE</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

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