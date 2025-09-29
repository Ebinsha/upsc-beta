import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Clock, Trophy, BookOpen, TrendingUp } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function Tests() {
  const practiceTests = [
    {
      id: '1',
      title: 'Environment Mock Test',
      questions: 50,
      duration: '90 min',
      difficulty: 'Hard',
      completed: false,
      score: null,
    },
    {
      id: '2',
      title: 'Economy Practice Set',
      questions: 30,
      duration: '45 min',
      difficulty: 'Medium',
      completed: true,
      score: 85,
    },
    {
      id: '3',
      title: 'History Quick Quiz',
      questions: 20,
      duration: '30 min',
      difficulty: 'Easy',
      completed: true,
      score: 92,
    },
  ];

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-white pt-16 px-5 pb-5 border-b border-slate-200">
        <Text className="text-3xl font-bold text-slate-800 mb-1">Practice Tests</Text>
        <Text className="text-base text-slate-500">Test your knowledge and track progress</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-5">
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-white p-5 rounded-2xl items-center shadow-sm">
            <Trophy size={24} color="#f59e0b" />
            <Text className="text-2xl font-bold text-slate-800 mt-2 mb-1">8</Text>
            <Text className="text-sm text-slate-500">Completed</Text>
          </View>
          <View className="flex-1 bg-white p-5 rounded-2xl items-center shadow-sm">
            <TrendingUp size={24} color="#10b981" />
            <Text className="text-2xl font-bold text-slate-800 mt-2 mb-1">87%</Text>
            <Text className="text-sm text-slate-500">Avg Score</Text>
          </View>
        </View>

        <Text className="text-xl font-bold text-slate-800 mb-4">Available Tests</Text>
        
        {practiceTests.map((test) => (
          <TouchableOpacity key={test.id} className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <View className="flex-row items-center mb-3 gap-3">
              <BookOpen size={20} color="#3b82f6" />
              <Text className="text-lg font-bold text-slate-800 flex-1">{test.title}</Text>
            </View>
            
            <View className="flex-row items-center mb-4 gap-2">
              <View className="flex-row items-center gap-1">
                <Clock size={16} color="#64748b" />
                <Text className="text-sm text-slate-500">{test.duration}</Text>
              </View>
              <Text className="text-sm text-slate-500">•</Text>
              <Text className="text-sm text-slate-500">{test.questions} Questions</Text>
              <Text className="text-sm text-slate-500">•</Text>
              <Text className={`text-sm font-semibold ${
                test.difficulty === 'Hard' ? 'text-red-500' : 
                test.difficulty === 'Medium' ? 'text-amber-500' : 'text-green-500'
              }`}>
                {test.difficulty}
              </Text>
            </View>
            
            {test.completed && (
              <View className="bg-blue-50 px-3 py-1.5 rounded-lg self-start mb-4">
                <Text className="text-sm text-blue-700 font-semibold">Score: {test.score}%</Text>
              </View>
            )}
            
            <TouchableOpacity className={`py-3 rounded-xl items-center ${
              test.completed 
                ? 'bg-slate-100 border border-blue-500' 
                : 'bg-blue-500'
            }`}>
              <Text className={`text-base font-semibold ${
                test.completed ? 'text-blue-500' : 'text-white'
              }`}>
                {test.completed ? 'Retake Test' : 'Start Test'}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}