import { View, Text, TouchableOpacity } from 'react-native';
import { CheckCircle, Circle, Clock } from 'lucide-react-native';

interface MCQCardProps {
  question: string;
  options: string[];
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
  showResult?: boolean;
  correctAnswer?: number;
  disabled?: boolean;
  questionNumber: number;
  totalQuestions: number;
}

export function MCQCard({
  question,
  options,
  selectedAnswer,
  onSelectAnswer,
  showResult = false,
  correctAnswer,
  disabled = false,
  questionNumber,
  totalQuestions,
}: MCQCardProps) {
  const getOptionStyle = (index: number) => {
    if (!showResult) {
      return selectedAnswer === index
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
      return selectedAnswer === index ? 'text-blue-800' : 'text-slate-800';
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
      return selectedAnswer === index ? (
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
      <Text className="text-lg font-semibold text-slate-800 mb-6 leading-6">
        {question}
      </Text>

      {/* Options */}
      <View className="gap-3">
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            className={`p-4 rounded-xl border-2 flex-row items-center gap-3 ${getOptionStyle(index)}`}
            onPress={() => !disabled && onSelectAnswer(index)}
            disabled={disabled}
          >
            {getOptionIcon(index)}
            <Text className={`flex-1 text-base leading-5 ${getOptionTextStyle(index)}`}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}