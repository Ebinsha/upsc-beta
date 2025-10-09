import { MCQCard } from '@/components/MCQCard';
import { TestTimer } from '@/components/TestTimer';
import { Question, TestAnswer } from '@/types/test';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ChevronLeft, ChevronRight, Flag } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// Mock questions data
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

export default function PracticeTest() {
  const params = useLocalSearchParams();
  const { testTitle, duration, difficulty, questionsCount } = params;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  const [startTime] = useState(new Date());
  const [questionStartTime, setQuestionStartTime] = useState(new Date());
  const [isTestActive, setIsTestActive] = useState(true);

  // Initialize answers array
  useEffect(() => {
    const initialAnswers: TestAnswer[] = mockQuestions.map(q => ({
      questionId: q.id,
      selectedAnswer: null,
      isCorrect: false,
      timeTaken: 0
    }));
    setAnswers(initialAnswers);
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    const timeTaken = Math.floor((new Date().getTime() - questionStartTime.getTime()) / 1000);
    const isCorrect = answerIndex === mockQuestions[currentQuestion].correctAnswer;
    
    console.log('Answer selected:', answerIndex, 'for question:', mockQuestions[currentQuestion].id, 'Current answers:', answers);
    
    setAnswers(prev => prev.map(answer => 
      answer.questionId === mockQuestions[currentQuestion].id
        ? { ...answer, selectedAnswer: answerIndex, isCorrect, timeTaken }
        : answer
    ));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setQuestionStartTime(new Date());
    } else {
      handleSubmitTest();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setQuestionStartTime(new Date());
    }
  };

  const handleSubmitTest = () => {
    Alert.alert(
      'Submit Test',
      'Are you sure you want to submit the test? You cannot change your answers after submission.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Submit', 
          onPress: () => {
            setIsTestActive(false);
            const totalTime = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
            const score = answers.filter(a => a.isCorrect).length;
            
            router.push({
              pathname: '/test-results',
              params: {
                score: score.toString(),
                totalQuestions: mockQuestions.length.toString(),
                timeTaken: totalTime.toString(),
                testTitle: testTitle as string,
                answersData: JSON.stringify(answers)
              }
            });
          }
        }
      ]
    );
  };

  const handleTimeUp = () => {
    Alert.alert(
      'Time Up!',
      'The test time has ended. Your test will be submitted automatically.',
      [{ text: 'OK', onPress: handleSubmitTest }]
    );
  };

  const currentAnswer = answers.find(a => a.questionId === mockQuestions[currentQuestion]?.id);
  const answeredCount = answers.filter(a => a.selectedAnswer !== null).length;

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white pt-16 px-5 pb-4 border-b border-slate-200">
        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center"
          >
            <ArrowLeft size={24} color="#1e293b" />
          </TouchableOpacity>
          
          <TestTimer 
            duration={parseInt(duration as string) || 45}
            onTimeUp={handleTimeUp}
            isActive={isTestActive}
          />
          
          <TouchableOpacity
            onPress={handleSubmitTest}
            className="bg-blue-500 px-4 py-2 rounded-xl flex-row items-center gap-2"
          >
            <Flag size={16} color="#ffffff" />
            <Text className="text-white font-semibold">Submit</Text>
          </TouchableOpacity>
        </View>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-xl font-bold text-slate-800">{testTitle}</Text>
          <Text className="text-sm text-slate-500">
            {answeredCount}/{mockQuestions.length} answered
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="bg-white px-5 py-3">
        <View className="bg-slate-200 h-2 rounded-full overflow-hidden">
          <View 
            className="bg-blue-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / mockQuestions.length) * 100}%` }}
          />
        </View>
      </View>

      {/* Question */}
      <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
        {mockQuestions[currentQuestion] && (
          <MCQCard
            question={mockQuestions[currentQuestion].question}
            options={mockQuestions[currentQuestion].options}
            selectedAnswer={currentAnswer?.selectedAnswer ?? null}
            onSelectAnswer={handleAnswerSelect}
            questionNumber={currentQuestion + 1}
            totalQuestions={mockQuestions.length}
          />
        )}
      </ScrollView>

      {/* Navigation */}
      <View className="bg-white px-5 py-4 border-t border-slate-200">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity
            onPress={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            className={`flex-row items-center gap-2 px-4 py-3 rounded-xl ${
              currentQuestion === 0 ? 'bg-slate-100' : 'bg-slate-200'
            }`}
          >
            <ChevronLeft size={20} color={currentQuestion === 0 ? '#94a3b8' : '#475569'} />
            <Text className={`font-semibold ${
              currentQuestion === 0 ? 'text-slate-400' : 'text-slate-700'
            }`}>
              Previous
            </Text>
          </TouchableOpacity>

          <Text className="text-sm text-slate-500">
            {currentQuestion + 1} of {mockQuestions.length}
          </Text>

          <TouchableOpacity
            onPress={handleNextQuestion}
            className="flex-row items-center gap-2 px-4 py-3 rounded-xl bg-blue-500"
          >
            <Text className="text-white font-semibold">
              {currentQuestion === mockQuestions.length - 1 ? 'Submit' : 'Next'}
            </Text>
            <ChevronRight size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}