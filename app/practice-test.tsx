import { MCQCard } from '@/components/MCQCard';
import { TestTimer } from '@/components/TestTimer';
import { useAvailableTestQuestions, useExamQuestions } from '@/hooks/useApiData';
import { TestAnswer } from '@/types/test';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface QuestionFeedback {
  topicId: string;
  questionId: string;
  feedback: 'positive' | 'negative' | null;
}

export default function PracticeTest() {
  const params = useLocalSearchParams();
  const { testTitle, duration, difficulty, subtopicId, testId } = params;
  
  // Determine which API to use based on whether testId is present
  // testId is only passed from tests.tsx (available tests page)
  const isAvailableTest = !!testId;
  
  // Fetch questions from appropriate API
  // For available tests (from tests.tsx), use /exam_topic_questions endpoint
  const { 
    data: availableTestQuestions, 
    loading: availableTestLoading, 
    error: availableTestError 
  } = useAvailableTestQuestions(
    subtopicId as string,
    isAvailableTest ? (difficulty as 'medium' | 'hard' | 'pyq' | undefined) : undefined
  );
  
  // For topic-based tests (from topic-justify), use /exam endpoint (no difficulty filter)
  const { 
    data: topicQuestions, 
    loading: topicQuestionsLoading, 
    error: topicQuestionsError 
  } = useExamQuestions(
    !isAvailableTest ? (subtopicId as string) : ''
  );
  
  // Use the appropriate data based on test source
  const questions = isAvailableTest ? availableTestQuestions : topicQuestions;
  const questionsLoading = isAvailableTest ? availableTestLoading : topicQuestionsLoading;
  const questionsError = isAvailableTest ? availableTestError : topicQuestionsError;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  const [feedback, setFeedback] = useState<QuestionFeedback[]>([]);
  const [startTime] = useState(new Date());
  const [isTestActive, setIsTestActive] = useState(true);

  // Initialize answers and feedback arrays
  useEffect(() => {
    if (!questions) return;
    
    const initialAnswers: TestAnswer[] = questions.map(q => ({
      questionId: q.id,
      selectedAnswer: null,
      isCorrect: false,
      timeTaken: 0
    }));
    setAnswers(initialAnswers);
    
    const initialFeedback: QuestionFeedback[] = questions.map(q => ({
      topicId: subtopicId as string,
      questionId: q.id,
      feedback: null
    }));
    setFeedback(initialFeedback);
  }, [questions, subtopicId]);

  const handleAnswerSelect = (answerIndex: number) => {
    const question = questions?.[currentQuestion];
    if (!question) return;
    
    console.log('handleAnswerSelect:', {
    answerIndex,
    currentQuestion,
    questionId: question.id,
    previousAnswers: answers
  });
    
    setAnswers(prev => {
      return prev.map(answer => 
      answer.questionId === question.id
        ? { ...answer, selectedAnswer: Number(answerIndex) }  // Ensure number type
        : answer
    );
    });
  };

  const handleFeedback = (type: 'positive' | 'negative') => {
    const question = questions?.[currentQuestion];
    if (!question) return;
    
    console.log('Feedback received:', { type, questionId: question.id });
    
    setFeedback(prev => 
      prev.map(f => 
        f.questionId === question.id
          ? { ...f, feedback: type }
          : f
      )
    );
  };

  const handleNextQuestion = () => {
    if (questions && currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleSubmitTest();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmitTest = () => {
    console.log("submitpressed")
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
            const score = answers.filter((a, index) => {
              const question = questions?.[index];
              return question && a.selectedAnswer === question.correctAnswer;
            }).length;
            
            router.push({
              pathname: '/test-results',
              params: {
                score: score.toString(),
                totalQuestions: questions?.length.toString() || '0',
                timeTaken: totalTime.toString(),
                testTitle: testTitle as string,
                answersData: JSON.stringify(answers),
                feedbackData: JSON.stringify(feedback),
                subtopicId: subtopicId as string,
                difficulty: difficulty as string || '', // Pass difficulty for re-fetching
                testId: testId as string || '', // Pass testId to identify source
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

  const currentAnswer = answers.find(a => a.questionId === questions?.[currentQuestion]?.id);
  const currentQuestionFeedback = feedback.find(f => f.questionId === questions?.[currentQuestion]?.id);
  console.log('Current answer state:', { 
    questionId: questions?.[currentQuestion]?.id,
    currentAnswer,
    allAnswers: answers 
  });
  const answeredCount = answers.filter(a => a.selectedAnswer !== null).length;

  // Loading state
  if (questionsLoading) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-base text-slate-600 mt-4">Loading questions...</Text>
      </View>
    );
  }

  // Error state
  if (questionsError || !questions) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center px-5">
        <Text className="text-6xl mb-4">😕</Text>
        <Text className="text-xl font-bold text-slate-800 mb-2 text-center">
          Unable to load questions
        </Text>
        <Text className="text-base text-slate-500 mb-6 text-center">
          {questionsError || 'Failed to fetch questions from the server'}
        </Text>
        <TouchableOpacity 
          className="bg-blue-500 px-6 py-3 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
            className="bg-red-500 px-4 py-2 rounded-xl flex-row items-center gap-2"
          >
            <Text className="text-white font-semibold">Submit</Text>
          </TouchableOpacity>
        </View>
        
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xl font-bold text-slate-800 flex-1">{testTitle}</Text>
          {difficulty && (
            <View className={`px-3 py-1 rounded-lg ${
              difficulty === 'hard' ? 'bg-red-100' : 
              difficulty === 'pyq' ? 'bg-purple-100' : 'bg-amber-100'
            }`}>
              <Text className={`text-xs font-bold uppercase ${
                difficulty === 'hard' ? 'text-red-700' : 
                difficulty === 'pyq' ? 'text-purple-700' : 'text-amber-700'
              }`}>
                {difficulty === 'pyq' ? 'PYQ' : difficulty}
              </Text>
            </View>
          )}
        </View>
        
        <Text className="text-sm text-slate-500">
          {answeredCount}/{questions.length} answered
        </Text>
      </View>

      {/* Progress Bar */}
      <View className="bg-white px-5 py-3">
        <View className="bg-slate-200 h-2 rounded-full overflow-hidden">
          <View 
            className="bg-blue-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </View>
      </View>

      {/* Question */}
      <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
        {questions[currentQuestion] && (
          <MCQCard
            question={questions[currentQuestion].question}
            additionalQuestion={questions[currentQuestion].additionalQuestion}
            statement={questions[currentQuestion].statement}
            options={questions[currentQuestion].options}
            selectedAnswer={currentAnswer?.selectedAnswer ?? null}
            onSelectAnswer={handleAnswerSelect}
            questionNumber={currentQuestion + 1}
            totalQuestions={questions.length}
            onFeedback={handleFeedback}
            questionId={questions[currentQuestion].id}
            currentFeedback={currentQuestionFeedback?.feedback || null}
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
            {currentQuestion + 1} of {questions.length}
          </Text>

          <TouchableOpacity
            onPress={handleNextQuestion}
            className="flex-row items-center gap-2 px-4 py-3 rounded-xl bg-blue-500"
          >
            <Text className="text-white font-semibold">
              {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
            </Text>
            <ChevronRight size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}