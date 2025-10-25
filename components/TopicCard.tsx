import { TrendingUp } from 'lucide-react-native';
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
              borderColor: 'transparent',
            }}
          >
            <View className="flex-row items-center gap-1">
              <TrendingUp size={isSmallCard ? 10 : isMediumCard ? 12 : 14} color={"#64748b"} />
              <Text 
                className="font-bold"
                style={{ 
                  color: '#64748b',
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


// new implementation with BlurView

// import { TrendingUp } from 'lucide-react-native';
// import React from 'react';
// import { Text, TouchableOpacity, View } from 'react-native';
// import { BlurView } from 'expo-blur';

// export interface TopicCardProps {
//   id: string;
//   name: string;
//   priority: number;
//   rating: number;
//   // isHot: boolean;
//   icon: string;
//   color: string;
//   width: number;
//   height: number;
//   bottomLeftText: string;
//   bottomRightText: string[];
//   onPress: () => void;
// }

// export function TopicCard({
//   name,
//   rating,
//   // isHot,
//   // icon,
//   color,
//   width,
//   height,
//   // bottomLeftText,
//   bottomRightText,
//   onPress,
// }: TopicCardProps) {
//   const weightage = parseFloat(rating.toString());
//   const isHighPriority = weightage >= 8;
//   const isSmallCard = width < 150;
//   const isMediumCard = height <= 140 && !isSmallCard;

//   const metricColor = '#000000'; 
//   const blurTintColor = 'default'; // <-- Changed to 'default' which often results in white/light neutral
//   const blurIntensity = 70;

//   return (
//     <TouchableOpacity
//       className="rounded-2xl shadow-md"
//       style={{
//         width,
//         height,
//         backgroundColor: color,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.15,
//         shadowRadius: 8,
//         elevation: 6,
//         padding: isSmallCard ? 10 : isMediumCard ? 12 : 16,
//       }}
//       onPress={onPress}
//       activeOpacity={0.8}
//     >
//       <View className="flex-1 justify-between">
//         <View className="flex-row justify-end items-start">
//           <BlurView
//             intensity={blurIntensity}
//             tint={blurTintColor} // <-- Updated here
//             className="rounded-full shadow-sm"
//             style={{
//               paddingHorizontal: isSmallCard ? 6 : isMediumCard ? 8 : 12,
//               paddingVertical: isSmallCard ? 3 : isMediumCard ? 4 : 6,
//               borderWidth: 1,
//               borderColor: 'rgba(255, 255, 255, 0.3)',
//               overflow: 'hidden',
//             }}
//           >
//             <View className="flex-row items-center gap-1">
//               <TrendingUp
//                 size={isSmallCard ? 10 : isMediumCard ? 12 : 14}
//                 color={metricColor}
//               />
//               <Text
//                 className="font-bold"
//                 style={{
//                   color: metricColor,
//                   fontSize: isSmallCard ? 10 : isMediumCard ? 11 : 13,
//                 }}
//               >
//                 {rating}%
//               </Text>
//             </View>
//           </BlurView>
//         </View>

//         <View className="flex-1 justify-start" style={{ marginVertical: isSmallCard ? 6 : 8 }}>
//           <Text
//             className="font-bold text-white leading-tight"
//             numberOfLines={isSmallCard ? 3 : 2}
//             style={{
//               fontSize: isSmallCard ? 13 : isMediumCard ? 15 : 18,
//               textShadowColor: 'rgba(0, 0, 0, 0.15)',
//               textShadowOffset: { width: 0, height: 1 },
//               textShadowRadius: 3,
//             }}
//           >
//             {name}
//           </Text>
//         </View>

//         <View className="items-start">
//           {bottomRightText && bottomRightText.map((text, index) => (
//             <Text
//               key={index}
//               className="text-white/80 font-semibold"
//               numberOfLines={1}
//               style={{
//                 fontSize: isSmallCard ? 10 : isMediumCard ? 11 : 12,
//                 lineHeight: isSmallCard ? 14 : 16,
//               }}
//             >
//               {text}
//             </Text>
//           ))}
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// }

