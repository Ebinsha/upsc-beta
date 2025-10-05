import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Trophy, Clock, Target, BookOpen, ExternalLink, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';
import { MCQCard } from '@/components/MCQCard';
import { Question, TestAnswer } from '@/types/test';

const { width } = Dimensions.get('window');

// Mock questions data (same as practice-test)
const mockQuestions: Question[] = [
  {
    id: '1',
    question: 'Which of the following is the primary cause of climate change according to the IPCC reports?',
    options: [
      'Natural climate variations',
      'Solar radiation changes',
      'Human activities, particularly greenhouse gas emissions',
      'Volcanic eruptions'
    ],
    correctAnswer: 2,
    explanation: 'According to the Intergovernmental Panel on Climate Change (IPCC), human activities, particularly the emission of greenhouse gases like CO2, CH4, and N2O, are the primary drivers of climate change since the mid-20th century.',
    context: 'This question tests understanding of climate science fundamentals, which is crucial for environmental policy and UPSC preparation.',
    references: [
      {
        title: 'IPCC Sixth Assessment Report',
        type: 'Article',
        url: 'https://www.ipcc.ch/ar6-syr/',
        description: 'Comprehensive report on climate change science and impacts'
      },
      {
        title: 'Climate Change and India - NCERT',
        type: 'Book',
        description: 'Detailed coverage of climate change impacts on India'
      }
    ],
    difficulty: 'Medium',
    topic: 'Environment',
    subtopic: 'Climate Change'
  },
  {
    id: '2',
    question: 'The Paris Agreement aims to limit global temperature rise to:',
    options: [
      'Below 1.5°C above pre-industrial levels',
      'Well below 2°C, with efforts to limit to 1.5°C above pre-industrial levels',
      'Below 3°C above pre-industrial levels',
      'Below 2.5°C above pre-industrial levels'
    ],
    correctAnswer: 1,
    explanation: 'The Paris Agreement aims to strengthen the global response to climate change by keeping global temperature rise this century well below 2°C above pre-industrial levels and pursuing efforts to limit the temperature increase even further to 1.5°C.',
    context: 'Understanding international climate agreements is essential for questions related to India\'s climate commitments and global environmental governance.',
    references: [
      {
        title: 'Paris Agreement - UNFCCC',
        type: 'Website',
        url: 'https://unfccc.int/process-and-meetings/the-paris-agreement',
        description: 'Official text and explanation of the Paris Agreement'
      },
      {
        title: 'India and Paris Agreement',
        type: 'Article',
        description: 'India\'s commitments and progress under the Paris Agreement'
      }
    ],
    difficulty: 'Easy',
    topic: 'Environment',
    subtopic: 'International Agreements'
  },
  {
    id: '3',
    question: 'Which of the following is NOT a component of India\'s Nationally Determined Contributions (NDCs)?',
    options: [
      'Reduce emissions intensity of GDP by 33-35% by 2030',
      'Achieve 40% cumulative electric power capacity from non-fossil fuel sources by 2030',
      'Create additional carbon sink of 2.5-3 billion tonnes of CO2 equivalent',
      'Achieve net-zero emissions by 2025'
    ],
    correctAnswer: 3,
    explanation: 'India has committed to achieve net-zero emissions by 2070, not 2025. The other three options are correct components of India\'s NDCs submitted under the Paris Agreement.',
    context: 'This question tests knowledge of India\'s specific climate commitments, which frequently appear in current affairs and environmental policy questions.',
    references: [
      {
        title: 'India\'s Updated NDC',
        type: 'Article',
        description: 'Official document outlining India\'s climate commitments'
      },
      {
        title: 'Net Zero Commitments by Countries',
        type: 'Website',
        description: 'Comparison of net-zero targets by different countries'
      }
    ],
    difficulty: 'Hard',
    topic: 'Environment',
    subtopic: 'Climate Policy'
  }
];

export default function TestResults() {
  const params = useLocalSearchParams();
  const { score, totalQuestions, timeTaken, testTitle, answersData } = params;
  
  const answers: TestAnswer[] = answersData ? JSON.parse(answersData as string) : [];
  const scoreNum = parseInt(score as string);
  const totalNum = parseInt(totalQuestions as string);
  const timeNum = parseInt(timeTaken as string);
  
  const percentage = Math.round((scoreNum / totalNum) * 100);
  const correctAnswers = answers.filter(a => a.isCorrect).length;
  const incorrectAnswers = totalNum - correctAnswers;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = () => {
    if (percentage >= 80) return 'bg-green-100';
    if (percentage >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white pt-16 px-5 pb-5 border-b border-slate-200">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mb-4"
        >
          <ArrowLeft size={24} color="#1e293b" />
        </TouchableOpacity>
        
        <Text className="text-2xl font-bold text-slate-800">Test Results</Text>
        <Text className="text-base text-slate-500">{testTitle}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Score Summary */}
        <View className="m-5 bg-white rounded-2xl p-6 shadow-sm">
          <View className="items-center mb-6">
            <View className={`w-24 h-24 rounded-full items-center justify-center mb-4 ${getScoreBgColor()}`}>
              <Trophy size={40} color={percentage >= 80 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444'} />
            </View>
            <Text className={`text-4xl font-bold mb-2 ${getScoreColor()}`}>
              {percentage}%
            </Text>
            <Text className="text-lg text-slate-600">
              {scoreNum} out of {totalNum} correct
            </Text>
          </View>

          <View className="flex-row justify-around">
            <View className="items-center">
              <View className="w-12 h-12 rounded-full bg-green-100 items-center justify-center mb-2">
                <CheckCircle size={24} color="#10b981" />
              </View>
              <Text className="text-xl font-bold text-slate-800">{correctAnswers}</Text>
              <Text className="text-sm text-slate-500">Correct</Text>
            </View>
            
            <View className="items-center">
              <View className="w-12 h-12 rounded-full bg-red-100 items-center justify-center mb-2">
                <XCircle size={24} color="#ef4444" />
              </View>
              <Text className="text-xl font-bold text-slate-800">{incorrectAnswers}</Text>
              <Text className="text-sm text-slate-500">Incorrect</Text>
            </View>
            
            <View className="items-center">
              <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mb-2">
                <Clock size={24} color="#3b82f6" />
              </View>
              <Text className="text-xl font-bold text-slate-800">{formatTime(timeNum)}</Text>
              <Text className="text-sm text-slate-500">Time Taken</Text>
            </View>
          </View>
        </View>

        {/* Question Review */}
        <View className="mx-5 mb-5">
          <Text className="text-xl font-bold text-slate-800 mb-4">Question Review</Text>
          
          {mockQuestions.map((question, index) => {
            const answer = answers.find(a => a.questionId === question.id);
            
            return (
              <View key={question.id} className="mb-6">
                <MCQCard
                  question={question.question}
                  options={question.options}
                  selectedAnswer={answer?.selectedAnswer || null}
                  onSelectAnswer={() => {}}
                  showResult={true}
                  correctAnswer={question.correctAnswer}
                  disabled={true}
                  questionNumber={index + 1}
                  totalQuestions={mockQuestions.length}
                />
                
                {/* Explanation */}
                <View className="bg-blue-50 rounded-2xl p-5 mt-3">
                  <Text className="text-base font-semibold text-blue-800 mb-2">
                    Explanation
                  </Text>
                  <Text className="text-sm text-blue-700 leading-5 mb-3">
                    {question.explanation}
                  </Text>
                  
                  <Text className="text-sm font-semibold text-blue-800 mb-2">
                    Why this question matters:
                  </Text>
                  <Text className="text-sm text-blue-700 leading-5">
                    {question.context}
                  </Text>
                </View>
                
                {/* References */}
                <View className="bg-slate-50 rounded-2xl p-5 mt-3">
                  <Text className="text-base font-semibold text-slate-800 mb-3">
                    📚 Further Reading
                  </Text>
                  
                  {question.references.map((ref, refIndex) => (
                    <TouchableOpacity
                      key={refIndex}
                      className="flex-row items-center justify-between p-3 bg-white rounded-xl mb-2"
                    >
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-slate-800 mb-1">
                          {ref.title}
                        </Text>
                        <Text className="text-xs text-slate-500 mb-1">
                          {ref.type}
                        </Text>
                        <Text className="text-xs text-slate-600 leading-4">
                          {ref.description}
                        </Text>
                      </View>
                      {ref.url && (
                        <ExternalLink size={16} color="#64748b" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          })}
        </View>

        {/* Action Buttons */}
        <View className="mx-5 mb-10 gap-3">
          <TouchableOpacity
            className="bg-blue-500 py-4 rounded-2xl items-center"
            onPress={() => router.push('/(tabs)/tests')}
          >
            <Text className="text-white font-semibold text-base">Take Another Test</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-slate-200 py-4 rounded-2xl items-center"
            onPress={() => router.push('/(tabs)/study')}
          >
            <Text className="text-slate-700 font-semibold text-base">Study More Topics</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}