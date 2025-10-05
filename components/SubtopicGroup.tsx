import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp, Flame, Package } from 'lucide-react-native';
import { useState } from 'react';
import { SubtopicChip } from './SubtopicChip';
import { Subtopic } from '@/types/api';

interface SubtopicGroupProps {
  title: string;
  subtitle: string;
  subtopics: Subtopic[];
  color: string;
  icon: React.ComponentType<any>;
  onSubtopicPress: (subtopic: Subtopic) => void;
  defaultExpanded?: boolean;
}

export function SubtopicGroup({
  title,
  subtitle,
  subtopics,
  color,
  icon: IconComponent,
  onSubtopicPress,
  defaultExpanded = false
}: SubtopicGroupProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  const hotTopicsCount = subtopics.filter(s => s.isHot).length;

  return (
    <View className="mb-4">
      <TouchableOpacity
        className="rounded-2xl p-4 shadow-sm flex-row items-center justify-between"
        style={{ backgroundColor: color }}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mr-4">
            <IconComponent size={24} color="#64748b" />
          </View>
          
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-1">
              <Text className="text-lg font-bold text-slate-800" numberOfLines={1}>
                {title}
              </Text>
              {hotTopicsCount > 0 && (
                <View className="bg-red-500 rounded-full px-2 py-0.5 flex-row items-center gap-1">
                  <Flame size={10} color="#ffffff" />
                  <Text className="text-xs font-bold text-white">{hotTopicsCount}</Text>
                </View>
              )}
            </View>
            <Text className="text-sm text-slate-600">{subtitle}</Text>
          </View>
        </View>
        
        <View className="ml-2">
          {isExpanded ? (
            <ChevronUp size={20} color="#64748b" />
          ) : (
            <ChevronDown size={20} color="#64748b" />
          )}
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View className="mt-3 px-2">
          {subtopics.map((subtopic) => (
            <SubtopicChip
              key={subtopic.id}
              id={subtopic.id}
              name={subtopic.name}
              priority={subtopic.priority}
              rating={subtopic.rating}
              isHot={subtopic.isHot}
              questionsCount={subtopic.questionsCount}
              difficulty={subtopic.difficulty}
              onPress={() => onSubtopicPress(subtopic)}
            />
          ))}
        </View>
      )}
    </View>
  );
}