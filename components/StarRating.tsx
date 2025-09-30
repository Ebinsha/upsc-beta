import { View, Text } from 'react-native';
import { Star } from 'lucide-react-native';

interface StarRatingProps {
  rating: number;
  size?: number;
  showRating?: boolean;
}

export function StarRating({ rating, size = 14, showRating = true }: StarRatingProps) {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={size} color="#fbbf24" fill="#fbbf24" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" size={size} color="#fbbf24" />);
    }
    
    return stars;
  };

  return (
    <View className="flex-row items-center gap-1">
      {renderStars()}
      {showRating && (
        <Text className="text-sm font-semibold text-slate-800 ml-1">{rating}</Text>
      )}
    </View>
  );
}