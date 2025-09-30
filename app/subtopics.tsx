import { View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Search, Star, Flame } from 'lucide-react-native';
import { useState } from 'react';
import { TopicCard } from '@/components/TopicCard';

const { width } = Dimensions.get('window');

interface Subtopic {
  id: string;
  name: string;
  priority: number;
  rating: number;
  isHot: boolean;
  icon: string;
  questionsCount: number;
  difficulty: string;
}

export default function Subtopics() {
  const params = useLocalSearchParams();
  const { topicId, topicName, topicColor } = params;
  const [searchQuery, setSearchQuery] = useState('');

  // Mock subtopics data - in real app, this would come from API based on topicId
  const getSubtopics = (topicId: string): Subtopic[] => {
    const subtopicsData: Record<string, Subtopic[]> = {
      "1": [ // Environment
        {
          id: "1-1",
          name: "Climate Change",
          priority: 10,
          rating: 4.9,
          isHot: true,
          icon: "🌡️",
          questionsCount: 45,
          difficulty: "High"
        },
        {
          id: "1-2",
          name: "Biodiversity",
          priority: 8,
          rating: 4.6,
          isHot: false,
          icon: "🦋",
          questionsCount: 32,
          difficulty: "Medium"
        },
        {
          id: "1-3",
          name: "Pollution Control",
          priority: 9,
          rating: 4.7,
          isHot: true,
          icon: "🏭",
          questionsCount: 38,
          difficulty: "High"
        },
        {
          id: "1-4",
          name: "Forest Conservation",
          priority: 7,
          rating: 4.4,
          isHot: false,
          icon: "🌲",
          questionsCount: 28,
          difficulty: "Medium"
        },
        {
          id: "1-5",
          name: "Water Resources",
          priority: 6,
          rating: 4.2,
          isHot: false,
          icon: "💧",
          questionsCount: 25,
          difficulty: "Low"
        }
      ],
      "2": [ // History
        {
          id: "2-1",
          name: "Ancient India",
          priority: 9,
          rating: 4.8,
          isHot: true,
          icon: "🏛️",
          questionsCount: 42,
          difficulty: "High"
        },
        {
          id: "2-2",
          name: "Medieval Period",
          priority: 8,
          rating: 4.5,
          isHot: false,
          icon: "⚔️",
          questionsCount: 35,
          difficulty: "Medium"
        },
        {
          id: "2-3",
          name: "Modern India",
          priority: 10,
          rating: 4.9,
          isHot: true,
          icon: "🇮🇳",
          questionsCount: 48,
          difficulty: "High"
        },
        {
          id: "2-4",
          name: "Freedom Movement",
          priority: 7,
          rating: 4.3,
          isHot: false,
          icon: "✊",
          questionsCount: 30,
          difficulty: "Medium"
        }
      ],
      "4": [ // Economy
        {
          id: "4-1",
          name: "Monetary Policy",
          priority: 10,
          rating: 4.8,
          isHot: true,
          icon: "🏦",
          questionsCount: 40,
          difficulty: "High"
        },
        {
          id: "4-2",
          name: "Fiscal Policy",
          priority: 9,
          rating: 4.7,
          isHot: true,
          icon: "📊",
          questionsCount: 38,
          difficulty: "High"
        },
        {
          id: "4-3",
          name: "Banking System",
          priority: 8,
          rating: 4.5,
          isHot: false,
          icon: "💳",
          questionsCount: 33,
          difficulty: "Medium"
        },
        {
          id: "4-4",
          name: "International Trade",
          priority: 7,
          rating: 4.4,
          isHot: false,
          icon: "🌐",
          questionsCount: 29,
          difficulty: "Medium"
        }
      ]
    };

    return subtopicsData[topicId as string] || [];
  };

  const subtopics = getSubtopics(topicId as string);

  const getSubtopicColor = (index: number, baseColor: string) => {
    // Generate different shades of the base color
    const shades = [
      baseColor, // Original color
      `${baseColor}CC`, // 80% opacity
      `${baseColor}B3`, // 70% opacity
      `${baseColor}99`, // 60% opacity
      `${baseColor}80`, // 50% opacity
    ];
    return shades[index % shades.length];
  };

  const getCardSize = (priority: number) => {
    if (priority >= 9) return { width: width - 40, height: 140 }; // Large
    if (priority >= 7) return { width: (width - 52) / 2, height: 120 }; // Medium
    return { width: (width - 52) / 2, height: 100 }; // Small
  };

  const handleSubtopicPress = (subtopic: Subtopic) => {
    router.push({
      pathname: '/topic-justify',
      params: { 
        topicId: subtopic.id,
        topicName: subtopic.name,
        topicColor: topicColor,
        rating: subtopic.rating.toString(),
        questionsCount: subtopic.questionsCount.toString(),
        difficulty: subtopic.difficulty,
        isHot: subtopic.isHot.toString()
      }
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={14} color="#fbbf24" fill="#fbbf24" />);
    }
    
    if (rating % 1 !== 0) {
      stars.push(<Star key="half" size={14} color="#fbbf24" />);
    }
    
    return stars;
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View className="pt-16 px-5 pb-5" style={{ backgroundColor: topicColor as string }}>
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/90 items-center justify-center mb-4"
        >
          <ArrowLeft size={24} color="#1e293b" />
        </TouchableOpacity>
        
        <View className="gap-2 mb-5">
          <Text className="text-3xl font-bold text-slate-800">{topicName}</Text>
          <Text className="text-base text-slate-600">Choose a subtopic to study</Text>
        </View>
        
        <View className="flex-row items-center bg-white/90 rounded-xl px-4 py-3 gap-3">
          <Search size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 text-base text-slate-800"
            placeholder="Search subtopics..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-5">
        <Text className="text-xl font-bold text-slate-800 mb-5">Subtopics Tree Map</Text>
        
        <View className="flex-row flex-wrap gap-3">
          {subtopics
            .sort((a, b) => b.priority - a.priority)
            .map((subtopic, index) => {
              const cardSize = getCardSize(subtopic.priority);
              const cardColor = getSubtopicColor(index, topicColor as string);
              
              return (
           <TopicCard
                  key={subtopic.id}
                  id={subtopic.id}
                  name={subtopic.name}
                  priority={subtopic.priority}
                  rating={subtopic.rating}
                  isHot={subtopic.isHot}
                  icon={subtopic.icon}
                  color={cardColor}
                  width={cardSize.width}
                  height={cardSize.height}
                  bottomLeftText=""
                  bottomRightText={[`${subtopic.questionsCount} Questions`, subtopic.difficulty]}
                  onPress={() => handleSubtopicPress(subtopic)}
                />
              );
            })}
        </View>
      </ScrollView>
    </View>
  );
}