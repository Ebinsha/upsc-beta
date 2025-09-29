import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Star, Clock, Target, Play } from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

export default function TopicJustify() {
  const params = useLocalSearchParams();
  const {
    topicName,
    topicColor,
    rating,
    questionsCount,
    difficulty,
    isHot
  } = params;

  // Mock analytics data
  const analyticsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [12, 18, 15, 22, 28, 35],
      strokeWidth: 3,
    }]
  };

  const recommendations = [
    {
      title: 'High Frequency Topic',
      description: 'This topic appeared in 78% of recent exams',
      score: 85
    },
    {
      title: 'Trending Upward',
      description: 'Questions from this topic increased by 45% this year',
      score: 92
    },
    {
      title: 'Score Impact',
      description: 'Students who master this topic score 23% higher',
      score: 78
    }
  ];

  const practiceOptions = [
    { title: 'Quick Practice', questions: 10, time: '15 min', difficulty: 'Easy' },
    { title: 'Standard Practice', questions: 25, time: '35 min', difficulty: 'Medium' },
    { title: 'Advanced Practice', questions: 50, time: '60 min', difficulty: 'Hard' },
  ];

  return (
    <View className="flex-1 bg-slate-50">
      <View className="pt-16 px-5 pb-6" style={{ backgroundColor: topicColor as string }}>
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/90 items-center justify-center mb-4"
        >
          <ArrowLeft size={24} color="#1e293b" />
        </TouchableOpacity>
        
        <View className="gap-2">
          <Text className="text-3xl font-bold text-slate-800">{topicName}</Text>
          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center gap-1">
              <Star size={16} color="#fbbf24" fill="#fbbf24" />
              <Text className="text-base font-semibold text-slate-800">{rating}</Text>
            </View>
            <Text className="text-sm text-slate-600">
              {questionsCount} Questions Available
            </Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="bg-white m-5 p-5 rounded-2xl shadow-sm">
          <Text className="text-lg font-bold text-slate-800 mb-1">Question Frequency Trend</Text>
          <Text className="text-sm text-slate-500 mb-4">
            How often this topic appears in exams over time
          </Text>
          
          <LineChart
            data={analyticsData}
            width={width - 40}
            height={200}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            className="rounded-xl"
            bezier
          />
        </View>

        <View className="mx-5 mb-5">
          <Text className="text-lg font-bold text-slate-800 mb-4">Why We Recommend This Topic</Text>
          
          {recommendations.map((rec, index) => (
            <View key={index} className="bg-white p-4 rounded-xl mb-3 shadow-sm">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-base font-semibold text-slate-800 flex-1">{rec.title}</Text>
                <View className="bg-blue-100 px-2 py-1 rounded-lg">
                  <Text className="text-xs font-semibold text-blue-800">{rec.score}%</Text>
                </View>
              </View>
              <Text className="text-sm text-slate-500 leading-5">
                {rec.description}
              </Text>
            </View>
          ))}
        </View>

        <View className="mx-5 mb-10">
          <Text className="text-lg font-bold text-slate-800 mb-4">Start Practicing</Text>
          
          {practiceOptions.map((option, index) => (
            <TouchableOpacity key={index} className="bg-white p-5 rounded-2xl mb-3 shadow-sm">
              <View className="flex-row items-center mb-3 gap-3">
                <Play size={20} color="#3b82f6" />
                <Text className="text-lg font-bold text-slate-800">{option.title}</Text>
              </View>
              
              <View className="flex-row items-center gap-4">
                <View className="flex-row items-center gap-1">
                  <Target size={16} color="#64748b" />
                  <Text className="text-sm text-slate-500">
                    {option.questions} Questions
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Clock size={16} color="#64748b" />
                  <Text className="text-sm text-slate-500">
                    {option.time}
                  </Text>
                </View>
                <Text className={`text-xs font-semibold px-2 py-1 rounded-md ${
                  option.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                  option.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }`}>
                  {option.difficulty}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}