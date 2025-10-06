import { View, Text, TouchableOpacity } from 'react-native';
import { Flame, Star } from 'lucide-react-native';

interface SubtopicChipProps {
  id: string;
  name: string;
  priority: number;
  rating: number;
  isHot: boolean;
  questionsCount: number;
  difficulty: 'Low' | 'Medium' | 'High';
  onPress: () => void;
}

export function SubtopicChip({
  name,
  priority,
  rating,
  isHot,
  questionsCount,
  difficulty,
  onPress,
}: SubtopicChipProps) {
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = () => {
    if (priority >= 8) return 'border-red-300 bg-red-50';
    if (priority >= 6) return 'border-orange-300 bg-orange-50';
    if (priority >= 4) return 'border-blue-300 bg-blue-50';
    return 'border-gray-300 bg-gray-50';
  };

  return (
    <TouchableOpacity
      className={`rounded-xl p-4 border-2 ${getPriorityColor()} mb-3`}
      onPress={onPress}
    >
      <View className="flex-row items-start justify-between mb-2">
        <Text className="text-base font-semibold text-slate-800 flex-1 leading-5" numberOfLines={2}>
          {name}
        </Text>
        {isHot && (
          <View className="ml-2 bg-red-500 rounded-full p-1">
            <Flame size={12} color="#ffffff" />
          </View>
        )}
      </View>
      
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="flex-row items-center gap-1">
            <Star size={12} color="#fbbf24" fill="#fbbf24" />
            <Text className="text-xs font-medium text-slate-600">{rating}</Text>
          </View>
          
          <Text className="text-xs text-slate-500">
            {questionsCount} Q's
          </Text>
          
          <View className={`px-2 py-0.5 rounded-md ${getDifficultyColor()}`}>
            <Text className="text-xs font-medium">{difficulty}</Text>
          </View>
        </View>
        
        <View className="bg-slate-200 px-2 py-0.5 rounded-md">
          <Text className="text-xs font-semibold text-slate-700">P{priority}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}