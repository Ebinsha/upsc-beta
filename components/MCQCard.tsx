import { CircleCheck as CheckCircle, Circle, Clock, ThumbsDown, ThumbsUp } from 'lucide-react-native';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface MCQCardProps {
  question: string;
  additionalQuestion?: string;
  statement?: string[];
  options: string[];
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
  showResult?: boolean;
  correctAnswer?: number;
  disabled?: boolean;
  questionNumber: number;
  totalQuestions: number;
  onFeedback?: (type: 'positive' | 'negative') => void;
  questionId?: string;
  currentFeedback?: 'positive' | 'negative' | null;
}

export function MCQCard({
  question,
  additionalQuestion,
  statement,
  options,
  selectedAnswer,
  onSelectAnswer,
  showResult = false,
  correctAnswer,
  disabled = false,
  questionNumber,
  totalQuestions,
  onFeedback,
  questionId,
  currentFeedback = null,
}: MCQCardProps) {
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(currentFeedback);

  const isSelected = (index: number) => {
    return selectedAnswer !== null && selectedAnswer === index;
  };

  const getOptionStyle = (index: number) => {
    if (!showResult) {
      return isSelected(index)
        ? 'bg-blue-100 border-blue-500'
        : 'bg-white border-slate-200';
    }

    // Show results
    if (index === correctAnswer) {
      return 'bg-green-100 border-green-500';
    }
    if (selectedAnswer === index && index !== correctAnswer) {
      return 'bg-red-100 border-red-500';
    }
    return 'bg-slate-50 border-slate-200';
  };

  const getOptionTextStyle = (index: number) => {
    if (!showResult) {
      return isSelected(index) ? 'text-blue-800' : 'text-slate-800';
    }

    if (index === correctAnswer) {
      return 'text-green-800';
    }
    if (selectedAnswer === index && index !== correctAnswer) {
      return 'text-red-800';
    }
    return 'text-slate-600';
  };

  const getOptionIcon = (index: number) => {
    if (!showResult) {
      return isSelected(index) ? (
        <CheckCircle size={20} color="#3b82f6" />
      ) : (
        <Circle size={20} color="#94a3b8" />
      );
    }

    if (index === correctAnswer) {
      return <CheckCircle size={20} color="#10b981" />;
    }
    if (selectedAnswer === index && index !== correctAnswer) {
      return <CheckCircle size={20} color="#ef4444" />;
    }
    return <Circle size={20} color="#94a3b8" />;
  };

  const handleFeedback = (type: 'positive' | 'negative') => {
    console.log(`Feedback ${type} for question ${questionNumber}`);
    const newFeedback = feedback === type ? null : type; // Toggle off if clicking same button
    setFeedback(newFeedback);
    if (onFeedback) {
      onFeedback(newFeedback || type);
    }
  };

  return (
    <View className="bg-white rounded-2xl p-6 shadow-sm">
      {/* Question Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-sm font-semibold text-blue-600">
          Question {questionNumber} of {totalQuestions}
        </Text>
        {!showResult && (
          <View className="flex-row items-center gap-1">
            <Clock size={16} color="#64748b" />
            <Text className="text-sm text-slate-500">2 min</Text>
          </View>
        )}
      </View>

      {/* Question Text */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-slate-800 mb-3 leading-6">
          {question}
        </Text>
        
        {/* Statement Section */}
        {statement && statement.length > 0 && (
          <View className="mb-3">
            {statement.map((stmt, index) => (
              <Text key={index} className="text-base text-slate-700 mb-2 leading-5">
                {stmt}
              </Text>
            ))}
          </View>
        )}
        
        {/* Additional Question */}
        {additionalQuestion && (
          <Text className="text-base font-medium text-slate-800 leading-5">
            {additionalQuestion}
          </Text>
        )}
      </View>

      {/* Options */}
      <View className="gap-3">
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            className={`p-4 rounded-xl border-2 flex-row items-center gap-3 ${getOptionStyle(index)}`}
            onPress={() => {
              console.log('Option pressed:', index);
              console.log('Current selectedAnswer:', selectedAnswer);
              if (!disabled) {
                onSelectAnswer(index);
              }
            }}
            disabled={disabled}
          >
            {getOptionIcon(index)}
            <Text className={`flex-1 text-base leading-5 ${getOptionTextStyle(index)}`}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Feedback Section */}
      <View className="flex-row justify-between items-center mt-6">
        <Text className="text-sm text-slate-500">Was this helpful?</Text>
        <View className="flex-row gap-3">
          <TouchableOpacity
            className={`w-10 h-10 rounded-full items-center justify-center ${
              feedback === 'positive' ? 'bg-green-500' : 'bg-green-100'
            }`}
            onPress={() => handleFeedback('positive')}
          >
            <ThumbsUp size={18} color={feedback === 'positive' ? '#ffffff' : '#10b981'} />
          </TouchableOpacity>
          <TouchableOpacity
            className={`w-10 h-10 rounded-full items-center justify-center ${
              feedback === 'negative' ? 'bg-red-500' : 'bg-red-100'
            }`}
            onPress={() => handleFeedback('negative')}
          >
            <ThumbsDown size={18} color={feedback === 'negative' ? '#ffffff' : '#ef4444'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}