import { View, Text, TouchableOpacity } from 'react-native';
import { Flame } from 'lucide-react-native';
import { StarRating } from './StarRating';

interface TopicCardProps {
  id: string;
  name: string;
  priority: number;
  rating: number;
  isHot: boolean;
  icon: string;
  color: string;
  width: number;
  height: number;
  bottomLeftText: string;
  bottomRightText: string[];
  onPress: () => void;
}

export function TopicCard({
  name,
  rating,
  isHot,
  icon,
  color,
  width,
  height,
  bottomLeftText,
  bottomRightText,
  onPress,
}: TopicCardProps) {
  return (
    <TouchableOpacity
      className="rounded-2xl p-4 shadow-md"
      style={{
        width,
        height,
        backgroundColor: color,
      }}
      onPress={onPress}
    >
      <View className="flex-1 justify-between">
        {/* Top Section */}
        <View className="flex-row justify-between items-start">
          <Text className="text-2xl">{icon}</Text>
          {isHot && (
            <View className="bg-red-500 rounded-xl p-1">
              <Flame size={12} color="#ffffff" />
            </View>
          )}
        </View>
        
        {/* Middle Section - Topic Name */}
        <View className="flex-1 justify-center">
          <Text 
            className="text-lg font-bold text-slate-800 leading-tight"
            numberOfLines={2}
            adjustsFontSizeToFit
          >
            {name}
          </Text>
        </View>
        
        {/* Bottom Section */}
        <View className="flex-row justify-between items-end">
          <View className="flex-shrink">
            <StarRating rating={rating} size={12} />
          </View>
          
          <View className="items-end flex-shrink-0 ml-2">
            {bottomRightText && bottomRightText.map((text, index) => (
              <Text 
                key={index}
                className="text-xs text-slate-600 font-medium leading-tight"
                numberOfLines={1}
              >
                {text}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}