import { Gauge } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

interface TopicCardProps {
  id: string;
  name: string;
  priority: number;
  rating: number;
  // isHot: boolean;
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
  // isHot,
  icon,
  color,
  width,
  height,
  bottomLeftText,
  bottomRightText,
  onPress,
}: TopicCardProps) {
  const weightage = parseFloat(rating.toString());
  const isHighPriority = weightage >= 8;
  const isSmallCard = width < 150; // Detect small horizontal cards
  const isMediumCard = height <= 140 && !isSmallCard;
  
  return (
    <TouchableOpacity
      className="rounded-2xl shadow-md"
      style={{
        width,
        height,
        backgroundColor: color,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
        padding: isSmallCard ? 10 : isMediumCard ? 12 : 16,
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View className="flex-1 justify-between">
        {/* Top Section - Weightage Badge */}
        <View className="flex-row justify-between items-start">
          <View 
            className="bg-white/90 rounded-full shadow-sm"
            style={{
              paddingHorizontal: isSmallCard ? 6 : isMediumCard ? 8 : 12,
              paddingVertical: isSmallCard ? 3 : isMediumCard ? 4 : 6,
              borderWidth: isHighPriority ? 2 : 0,
              borderColor: isHighPriority ? '#ef4444' : 'transparent',
            }}
          >
            <View className="flex-row items-center gap-1">
              <Gauge size={isSmallCard ? 10 : isMediumCard ? 12 : 14} color={isHighPriority ? "#ef4444" : "#64748b"} />
              <Text 
                className="font-bold"
                style={{ 
                  color: isHighPriority ? '#ef4444' : '#64748b',
                  fontSize: isSmallCard ? 10 : isMediumCard ? 11 : 13,
                }}
              >
                {rating}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Middle Section - Topic Name */}
        <View className="flex-1 justify-center" style={{ marginVertical: isSmallCard ? 6 : isMediumCard ? 8 : 12 }}>
          <Text 
            className="font-bold text-slate-900 leading-tight"
            numberOfLines={isSmallCard ? 3 : 2}
            style={{
              fontSize: isSmallCard ? 13 : isMediumCard ? 15 : 18,
              textShadowColor: 'rgba(0, 0, 0, 0.1)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
            }}
          >
            {name}
          </Text>
        </View>
        
        {/* Bottom Section - Subtopics Count */}
        <View className="flex-row justify-between items-end">
          <View 
            className="bg-white/80 rounded-xl shadow-sm flex-1"
            style={{
              paddingHorizontal: isSmallCard ? 6 : isMediumCard ? 8 : 12,
              paddingVertical: isSmallCard ? 4 : isMediumCard ? 6 : 8,
            }}
          >
            {bottomRightText && bottomRightText.map((text, index) => (
              <Text 
                key={index}
                className="text-slate-700 font-semibold text-center"
                numberOfLines={1}
                style={{ fontSize: isSmallCard ? 9 : isMediumCard ? 10 : 11 }}
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