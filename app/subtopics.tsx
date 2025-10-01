import { View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Search, Package, ChevronRight, Flame } from 'lucide-react-native';
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

interface GroupedSubtopic {
  id: string;
  name: string;
  count: number;
  subtopics: Subtopic[];
  avgPriority: number;
  color: string;
}

// Mock data with 60+ subtopics
const mockSubtopics: Subtopic[] = [
  // High Priority (8-10)
  { id: '1', name: 'Climate Change and India', priority: 9, rating: 4.8, isHot: true, icon: '🌡️', questionsCount: 45, difficulty: 'High' },
  { id: '2', name: 'Air Pollution Control', priority: 8, rating: 4.6, isHot: true, icon: '💨', questionsCount: 38, difficulty: 'High' },
  { id: '3', name: 'Water Scarcity Management', priority: 8, rating: 4.5, isHot: true, icon: '💧', questionsCount: 42, difficulty: 'High' },
  { id: '4', name: 'Renewable Energy Policy', priority: 8, rating: 4.7, isHot: true, icon: '⚡', questionsCount: 40, difficulty: 'High' },
  { id: '5', name: 'Human-Wildlife Conflict', priority: 9, rating: 4.6, isHot: true, icon: '🐅', questionsCount: 35, difficulty: 'High' },
  
  // Medium-High Priority (6-7)
  { id: '6', name: 'Forest Conservation Act', priority: 7, rating: 4.3, isHot: false, icon: '🌲', questionsCount: 32, difficulty: 'Medium' },
  { id: '7', name: 'Plastic Waste Management', priority: 7, rating: 4.2, isHot: false, icon: '♻️', questionsCount: 28, difficulty: 'Medium' },
  { id: '8', name: 'National Green Tribunal', priority: 7, rating: 4.4, isHot: false, icon: '⚖️', questionsCount: 30, difficulty: 'Medium' },
  { id: '9', name: 'Himalayan Ecology', priority: 6, rating: 4.1, isHot: false, icon: '🏔️', questionsCount: 25, difficulty: 'Medium' },
  { id: '10', name: 'Carbon Sequestration', priority: 6, rating: 4.0, isHot: false, icon: '🌿', questionsCount: 22, difficulty: 'Medium' },
  { id: '11', name: 'Mangrove Conservation', priority: 7, rating: 4.3, isHot: false, icon: '🌿', questionsCount: 28, difficulty: 'Medium' },
  { id: '12', name: 'National Action Plan Climate', priority: 6, rating: 4.2, isHot: false, icon: '📋', questionsCount: 24, difficulty: 'Medium' },
  
  // Medium Priority (4-5)
  { id: '13', name: 'Biodiversity Conservation', priority: 4, rating: 3.8, isHot: false, icon: '🦋', questionsCount: 18, difficulty: 'Medium' },
  { id: '14', name: 'Wetlands and Ramsar Sites', priority: 4, rating: 3.9, isHot: false, icon: '🦆', questionsCount: 20, difficulty: 'Medium' },
  { id: '15', name: 'Wildlife Protection Act', priority: 5, rating: 4.0, isHot: false, icon: '🐅', questionsCount: 22, difficulty: 'Medium' },
  { id: '16', name: 'Project Tiger Elephant', priority: 5, rating: 3.9, isHot: false, icon: '🐘', questionsCount: 21, difficulty: 'Medium' },
  { id: '17', name: 'Clean Air Programme', priority: 5, rating: 4.1, isHot: false, icon: '🌬️', questionsCount: 23, difficulty: 'Medium' },
  { id: '18', name: 'Green Hydrogen Mission', priority: 5, rating: 4.0, isHot: false, icon: '💡', questionsCount: 19, difficulty: 'Medium' },
  { id: '19', name: 'E-Waste Management', priority: 4, rating: 3.8, isHot: false, icon: '📱', questionsCount: 17, difficulty: 'Medium' },
  { id: '20', name: 'Compensatory Afforestation', priority: 4, rating: 3.7, isHot: false, icon: '🌱', questionsCount: 16, difficulty: 'Medium' },
  { id: '21', name: 'Invasive Alien Species', priority: 4, rating: 3.6, isHot: false, icon: '🦎', questionsCount: 15, difficulty: 'Medium' },
  { id: '22', name: 'Mission LiFE', priority: 4, rating: 3.8, isHot: false, icon: '🎯', questionsCount: 18, difficulty: 'Medium' },
  { id: '23', name: 'Biodiversity Heritage Sites', priority: 4, rating: 3.7, isHot: false, icon: '🏛️', questionsCount: 16, difficulty: 'Medium' },
  { id: '24', name: 'Bioremediation Techniques', priority: 4, rating: 3.9, isHot: false, icon: '🧪', questionsCount: 19, difficulty: 'Medium' },
  { id: '25', name: 'Aravalli Range Conservation', priority: 4, rating: 3.8, isHot: false, icon: '🏔️', questionsCount: 17, difficulty: 'Medium' },
  { id: '26', name: 'Forest Rights Act', priority: 5, rating: 4.0, isHot: false, icon: '📜', questionsCount: 21, difficulty: 'Medium' },
  { id: '27', name: 'Sustainable Agriculture', priority: 5, rating: 4.1, isHot: false, icon: '🌾', questionsCount: 23, difficulty: 'Medium' },
  { id: '28', name: 'Extreme Weather Events', priority: 4, rating: 3.9, isHot: false, icon: '⛈️', questionsCount: 20, difficulty: 'Medium' },
  
  // Low Priority (1-3)
  { id: '29', name: 'Environmental Impact Assessment', priority: 3, rating: 3.5, isHot: false, icon: '📊', questionsCount: 12, difficulty: 'Low' },
  { id: '30', name: 'Coastal Regulation Zone', priority: 3, rating: 3.4, isHot: false, icon: '🏖️', questionsCount: 11, difficulty: 'Low' },
  { id: '31', name: 'GM Crops Regulation', priority: 3, rating: 3.6, isHot: false, icon: '🧬', questionsCount: 13, difficulty: 'Low' },
  { id: '32', name: 'Desertification Control', priority: 3, rating: 3.3, isHot: false, icon: '🏜️', questionsCount: 10, difficulty: 'Low' },
  { id: '33', name: 'Coral Reefs Marine Ecosystems', priority: 2, rating: 3.2, isHot: false, icon: '🐠', questionsCount: 8, difficulty: 'Low' },
  { id: '34', name: 'Single Use Plastic Ban', priority: 2, rating: 3.1, isHot: false, icon: '🗑️', questionsCount: 7, difficulty: 'Low' },
  { id: '35', name: 'Land Degradation', priority: 3, rating: 3.4, isHot: false, icon: '🌱', questionsCount: 11, difficulty: 'Low' },
  { id: '36', name: 'Climate Finance', priority: 3, rating: 3.5, isHot: false, icon: '💰', questionsCount: 12, difficulty: 'Low' },
  { id: '37', name: 'Ethanol Blending', priority: 2, rating: 3.0, isHot: false, icon: '⛽', questionsCount: 6, difficulty: 'Low' },
  { id: '38', name: 'Biodiversity Hotspots India', priority: 3, rating: 3.3, isHot: false, icon: '🔥', questionsCount: 10, difficulty: 'Low' },
  { id: '39', name: 'Western Ghats Ecology', priority: 2, rating: 3.1, isHot: false, icon: '⛰️', questionsCount: 7, difficulty: 'Low' },
  { id: '40', name: 'Stubble Burning', priority: 3, rating: 3.4, isHot: false, icon: '🔥', questionsCount: 11, difficulty: 'Low' },
  { id: '41', name: 'Greenhouse Gas Emissions', priority: 3, rating: 3.6, isHot: false, icon: '🏭', questionsCount: 13, difficulty: 'Low' },
  { id: '42', name: 'Ganga Action Plan', priority: 3, rating: 3.5, isHot: false, icon: '🏞️', questionsCount: 12, difficulty: 'Low' },
  { id: '43', name: 'Smog Towers', priority: 2, rating: 3.0, isHot: false, icon: '🏗️', questionsCount: 6, difficulty: 'Low' },
  { id: '44', name: 'Zoonotic Diseases', priority: 2, rating: 3.2, isHot: false, icon: '🦠', questionsCount: 8, difficulty: 'Low' },
  { id: '45', name: 'Fly Ash Management', priority: 1, rating: 2.8, isHot: false, icon: '🏭', questionsCount: 4, difficulty: 'Low' },
  { id: '46', name: 'Cloud Seeding', priority: 1, rating: 2.9, isHot: false, icon: '☁️', questionsCount: 5, difficulty: 'Low' },
  { id: '47', name: 'Heatwaves in India', priority: 3, rating: 3.4, isHot: false, icon: '🌡️', questionsCount: 11, difficulty: 'Low' },
  { id: '48', name: 'Drought Management', priority: 2, rating: 3.1, isHot: false, icon: '🏜️', questionsCount: 7, difficulty: 'Low' },
  { id: '49', name: 'Sand Mining', priority: 2, rating: 3.0, isHot: false, icon: '⛏️', questionsCount: 6, difficulty: 'Low' },
  { id: '50', name: 'Landslides Avalanches', priority: 2, rating: 3.2, isHot: false, icon: '⛰️', questionsCount: 8, difficulty: 'Low' },
  { id: '51', name: 'Glacial Lake Outburst Floods', priority: 3, rating: 3.5, isHot: false, icon: '🧊', questionsCount: 12, difficulty: 'Low' },
  { id: '52', name: 'Urban Flooding', priority: 2, rating: 3.1, isHot: false, icon: '🏙️', questionsCount: 7, difficulty: 'Low' },
  { id: '53', name: 'Soil Health Card Scheme', priority: 2, rating: 3.0, isHot: false, icon: '🌱', questionsCount: 6, difficulty: 'Low' },
  { id: '54', name: 'Microplastics Pollution', priority: 1, rating: 2.9, isHot: false, icon: '🔬', questionsCount: 5, difficulty: 'Low' },
  { id: '55', name: 'Deep Ocean Mission', priority: 3, rating: 3.4, isHot: false, icon: '🌊', questionsCount: 11, difficulty: 'Low' },
  { id: '56', name: 'Light Pollution', priority: 1, rating: 2.7, isHot: false, icon: '💡', questionsCount: 3, difficulty: 'Low' },
  { id: '57', name: 'Ocean Acidification', priority: 1, rating: 2.8, isHot: false, icon: '🌊', questionsCount: 4, difficulty: 'Low' },
  { id: '58', name: 'Waste to Energy', priority: 2, rating: 3.1, isHot: false, icon: '⚡', questionsCount: 7, difficulty: 'Low' },
  { id: '59', name: 'Green Building Standards', priority: 2, rating: 3.2, isHot: false, icon: '🏢', questionsCount: 8, difficulty: 'Low' },
  { id: '60', name: 'Environmental Governance', priority: 3, rating: 3.5, isHot: false, icon: '⚖️', questionsCount: 12, difficulty: 'Low' },
];

export default function Subtopics() {
  const params = useLocalSearchParams();
  const { topicId, topicName, topicColor } = params;
  const [searchQuery, setSearchQuery] = useState('');

  // Group subtopics by priority
  const groupSubtopics = (subtopics: Subtopic[]) => {
    const highPriority = subtopics.filter(s => s.priority >= 6);
    const mediumPriority = subtopics.filter(s => s.priority >= 4 && s.priority < 6);
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
        color: getSubtopicColor(priorityNum + 3, topicColor as string) // Offset for better colors
      });
    });

    return { highPriority, mediumPriority, grouped };
  };

  const { highPriority, mediumPriority, grouped } = groupSubtopics(mockSubtopics);

  const getSubtopicColor = (index: number, baseColor: string) => {
    // Generate different shades of the base color
    const baseHex = baseColor.replace('#', '');
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

  const getCardSize = (priority: number, isGrouped: boolean = false) => {
    if (isGrouped) return { width: width - 40, height: 100 }; // Full width for groups
    if (priority >= 8) return { width: width - 40, height: 140 }; // Large for high priority
    if (priority >= 6) return { width: (width - 52) / 2, height: 120 }; // Medium
    if (priority >= 4) return { width: (width - 52) / 2, height: 100 }; // Small
    return { width: (width - 52) / 2, height: 80 }; // Extra small
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
    // Could navigate to expanded view or show modal with all topics
    console.log('Group pressed:', group.name, 'Topics:', group.subtopics.length);
  };

  const filteredHighPriority = highPriority.filter(subtopic =>
    subtopic.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMediumPriority = mediumPriority.filter(subtopic =>
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
            {mockSubtopics.length} subtopics • {highPriority.length} high priority • {mediumPriority.length} medium priority
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
        {filteredHighPriority.length > 0 && (
          <>
            <Text className="text-xl font-bold text-slate-800 mb-4">🔥 High Priority Topics</Text>
            
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
          </>
        )}

        {/* Medium Priority Section */}
        {filteredMediumPriority.length > 0 && (
          <>
            <Text className="text-xl font-bold text-slate-800 mb-4">📚 Medium Priority Topics</Text>
            
            <View className="flex-row flex-wrap gap-3 mb-6">
              {filteredMediumPriority
                .sort((a, b) => b.priority - a.priority)
                .map((subtopic, index) => {
                  const cardSize = getCardSize(subtopic.priority);
                  const cardColor = getSubtopicColor(index + 6, topicColor as string); // Offset for different shades
                  
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
          </>
        )}

        {/* Grouped Low Priority Section */}
        {filteredGroups.length > 0 && (
          <>
            <Text className="text-xl font-bold text-slate-800 mb-4">📋 Other Topics (Grouped)</Text>
            
            <View className="gap-3">
              {filteredGroups.map((group, index) => {
                const cardSize = getCardSize(group.avgPriority, true);
                
                return (
                  <TouchableOpacity
                    key={group.id}
                    className="rounded-2xl p-5 shadow-sm flex-row items-center justify-between"
                    style={{
                      width: cardSize.width,
                      height: cardSize.height,
                      backgroundColor: group.color,
                    }}
                    onPress={() => handleGroupPress(group)}
                  >
                    <View className="flex-row items-center flex-1">
                      <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mr-4">
                        <Package size={24} color="#64748b" />
                      </View>
                      
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-slate-800 mb-1" numberOfLines={1}>
                          {group.name}
                        </Text>
                        <Text className="text-sm text-slate-600">
                          {group.count} topics • Priority Level {group.avgPriority}
                        </Text>
                        <Text className="text-xs text-slate-500 mt-1">
                          Tap to view all topics in this group
                        </Text>
                      </View>
                    </View>
                    
                    <ChevronRight size={20} color="#64748b" />
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