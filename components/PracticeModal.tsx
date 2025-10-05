import { View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { X, Play, Clock, Target } from 'lucide-react-native';
import { router } from 'expo-router';

const { height } = Dimensions.get('window');

interface PracticeOption {
  title: string;
  questions: number;
  time: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
}

interface PracticeModalProps {
  visible: boolean;
  onClose: () => void;
  topicName: string;
}

export function PracticeModal({ visible, onClose, topicName }: PracticeModalProps) {
  const practiceOptions: PracticeOption[] = [
    {
      title: 'Easy Practice',
      questions: 10,
      time: '15 min',
      difficulty: 'Easy',
      description: 'Quick practice with basic questions'
    },
    {
      title: 'Standard Practice',
      questions: 25,
      time: '35 min',
      difficulty: 'Medium',
      description: 'Comprehensive practice with mixed difficulty'
    },
    {
      title: 'Advanced Practice',
      questions: 50,
      time: '60 min',
      difficulty: 'Hard',
      description: 'Full-length test with challenging questions'
    }
  ];

  const handlePracticeSelect = (option: PracticeOption) => {
    onClose();
    router.push({
      pathname: '/practice-test',
      params: {
        testId: `${topicName.toLowerCase()}-${option.difficulty.toLowerCase()}`,
        testTitle: `${topicName} - ${option.title}`,
        duration: option.time.replace(' min', ''),
        difficulty: option.difficulty,
        questionsCount: option.questions.toString()
      }
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <TouchableOpacity 
          className="flex-1" 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <View 
          className="bg-white rounded-t-3xl p-6"
          style={{ maxHeight: height * 0.7 }}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-slate-800 mb-1">
                Practice {topicName}
              </Text>
              <Text className="text-base text-slate-500">
                Choose your practice level
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center"
            >
              <X size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Practice Options */}
          <View className="gap-4">
            {practiceOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                className="bg-slate-50 rounded-2xl p-5 border border-slate-200"
                onPress={() => handlePracticeSelect(option)}
              >
                <View className="flex-row items-center mb-3 gap-3">
                  <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center">
                    <Play size={20} color="#3b82f6" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-slate-800 mb-1">
                      {option.title}
                    </Text>
                    <Text className="text-sm text-slate-500">
                      {option.description}
                    </Text>
                  </View>
                  <View className={`px-3 py-1 rounded-lg ${getDifficultyColor(option.difficulty)}`}>
                    <Text className="text-xs font-semibold">
                      {option.difficulty}
                    </Text>
                  </View>
                </View>
                
                <View className="flex-row items-center gap-4">
                  <View className="flex-row items-center gap-1">
                    <Target size={16} color="#64748b" />
                    <Text className="text-sm text-slate-600">
                      {option.questions} Questions
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Clock size={16} color="#64748b" />
                    <Text className="text-sm text-slate-600">
                      {option.time}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bottom spacing for safe area */}
          <View className="h-6" />
        </View>
      </View>
    </Modal>
  );
}