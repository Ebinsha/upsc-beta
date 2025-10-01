import { View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Search, Star, Flame, Package, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { TopicCard } from '@/components/TopicCard';
import topicData from '@/constants/topic.json';

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

interface GroupedSubtopic {
  id: string;
  name: string;
  count: number;
  subtopics: Subtopic[];
  avgPriority: number;
  color: string;
}

export default function Subtopics() {
  const params = useLocalSearchParams();
  const { topicId, topicName, topicColor } = params;
  const [searchQuery, setSearchQuery] = useState('');

  // Get real subtopics data from topic.json
  const getSubtopicsFromJson = (topicId: string): Subtopic[] => {
    const topicKey = topicId === "1" ? "environment" : "ethics"; // Map topic IDs
    const topicInfo = topicData[topicKey as keyof typeof topicData];
    
    if (!topicInfo || !topicInfo.subtopic) return [];

    const subtopics: Subtopic[] = [];
    const { ids, names } = topicInfo.subtopic;

    // Create subtopics from the JSON data
    Object.entries(ids).forEach(([id, name]) => {
      const priority = names[name as keyof typeof names] || 1;
      const isHot = priority >= 7;
      
      subtopics.push({
        id: `${topicId}-${id}`,
        name: name as string,
        priority,
        rating: Math.min(5, 3.5 + (priority * 0.2)), // Generate rating based on priority
        isHot,
        icon: getIconForSubtopic(name as string),
        questionsCount: Math.floor(priority * 5 + Math.random() * 10),
        difficulty: priority >= 7 ? "High" : priority >= 4 ? "Medium" : "Low"
      });
    });

    return subtopics;
  };

  // Generate appropriate icons based on subtopic name
  const getIconForSubtopic = (name: string): string => {
    const iconMap: Record<string, string> = {
      'Climate': '🌡️', 'Paris': '🌍', 'Air': '💨', 'Water': '💧', 'Waste': '♻️',
      'Plastic': '🗑️', 'Biodiversity': '🦋', 'Wetlands': '🦆', 'Forest': '🌲',
      'Wildlife': '🐅', 'Tiger': '🐅', 'Renewable': '⚡', 'Clean': '🌬️',
      'Impact': '📊', 'Coastal': '🏖️', 'GM': '🧬', 'Desert': '🏜️',
      'Himalayan': '🏔️', 'Coral': '🐠', 'Tribunal': '⚖️', 'Hydrogen': '💡',
      'Rivers': '🏞️', 'Land': '🌱', 'Finance': '💰', 'E-Waste': '📱',
      'Human': '🤝', 'Species': '🦎', 'Ethanol': '⛽', 'Mangrove': '🌿',
      'Hotspots': '🔥', 'Western': '⛰️', 'Stubble': '🔥', 'Carbon': '🌿',
      'Weather': '⛈️', 'Agriculture': '🌾', 'Light': '💡', 'Ocean': '🌊',
      'Greenhouse': '🏭', 'Mission': '🎯', 'Ganga': '🏞️', 'Action': '📋',
      'Smog': '🏗️', 'Heritage': '🏛️', 'Zoonotic': '🦠', 'Fly': '🏭',
      'Bio': '🧪', 'Cloud': '☁️', 'Heat': '🌡️', 'Drought': '🏜️',
      'Rights': '📜', 'Sand': '⛏️', 'Landslides': '⛰️', 'Cryosphere': '🧊',
      'Aravalli': '🏔️', 'Urban': '🏙️', 'Soil': '🌱', 'Micro': '🔬',
      'Deep': '🌊'
    };

    for (const [key, icon] of Object.entries(iconMap)) {
      if (name.includes(key)) return icon;
    }
    return '📋'; // Default icon
  };

  // Group low priority subtopics
  const groupSubtopics = (subtopics: Subtopic[]): { highPriority: Subtopic[], grouped: GroupedSubtopic[] } => {
    const highPriority = subtopics.filter(s => s.priority >= 4);
    const lowPriority = subtopics.filter(s => s.priority < 4);

    // Group low priority by priority level
    const grouped: GroupedSubtopic[] = [];
    const priorityGroups: Record<number, Subtopic[]> = {};

    lowPriority.forEach(subtopic => {
      if (!priorityGroups[subtopic.priority]) {
        priorityGroups[subtopic.priority] = [];
      }
      priorityGroups[subtopic.priority].push(subtopic);
    });

    Object.entries(priorityGroups).forEach(([priority, items]) => {
      const priorityNum = parseInt(priority);
      grouped.push({
        id: `group-${priority}`,
        name: `Priority ${priority} Topics`,
        count: items.length,
        subtopics: items,
        avgPriority: priorityNum,
        color: getSubtopicColor(priorityNum, topicColor as string)
      });
    });

    return { highPriority, grouped };
  };

  const allSubtopics = getSubtopicsFromJson(topicId as string);
  const { highPriority, grouped } = groupSubtopics(allSubtopics);

  const getSubtopicColor = (index: number, baseColor: string) => {
    // Generate different shades of the base color
    const shades = [
      baseColor, // Original color
      `${baseColor}E6`, // 90% opacity
      `${baseColor}CC`, // 80% opacity
      `${baseColor}B3`, // 70% opacity
      `${baseColor}99`, // 60% opacity
      `${baseColor}80`, // 50% opacity
    ];
    return shades[index % shades.length];
  };

  const getCardSize = (priority: number) => {
    if (priority >= 8) return { width: width - 40, height: 140 }; // Large
    if (priority >= 6) return { width: (width - 52) / 2, height: 120 }; // Medium
    if (priority >= 4) return { width: (width - 52) / 2, height: 100 }; // Small
    return { width: (width - 52) / 2, height: 80 }; // Extra small for groups
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

  const handleGroupPress = (group: GroupedSubtopic) => {
    // Navigate to a detailed view of grouped topics or expand inline
    console.log('Group pressed:', group.name);
  };

  const filteredHighPriority = highPriority.filter(subtopic =>
    subtopic.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = grouped.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.subtopics.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
          <Text className="text-base text-slate-600">
            {allSubtopics.length} subtopics • {highPriority.length} high priority
          </Text>
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
        {/* High Priority Section */}
        <Text className="text-xl font-bold text-slate-800 mb-4">High Priority Topics</Text>
        
        <View className="flex-row flex-wrap gap-3 mb-6">
          {filteredHighPriority
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

        {/* Grouped Low Priority Section */}
        {filteredGroups.length > 0 && (
          <>
            <Text className="text-xl font-bold text-slate-800 mb-4">Other Topics</Text>
            
            <View className="flex-row flex-wrap gap-3">
              {filteredGroups.map((group, index) => {
                const cardSize = getCardSize(group.avgPriority);
                
                return (
                  <TouchableOpacity
                    key={group.id}
                    className="rounded-2xl p-4 shadow-sm"
                    style={{
                      width: cardSize.width,
                      height: cardSize.height,
                      backgroundColor: group.color,
                    }}
                    onPress={() => handleGroupPress(group)}
                  >
                    <View className="flex-1 justify-between">
                      <View className="flex-row justify-between items-start">
                        <Package size={20} color="#64748b" />
                        <ChevronRight size={16} color="#64748b" />
                      </View>
                      
                      <View className="flex-1 justify-center">
                        <Text className="text-base font-bold text-slate-800 mb-1" numberOfLines={2}>
                          {group.name}
                        </Text>
                        <Text className="text-sm text-slate-600">
                          {group.count} topics
                        </Text>
                      </View>
                      
                      <View className="flex-row justify-between items-end">
                        <Text className="text-xs text-slate-500">
                          Avg Priority: {group.avgPriority}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}