import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Star, Clock, Target, Play, ZoomIn, Calendar } from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';
import { useState } from 'react';
import { useChartData } from '@/hooks/useApiData';
import { PracticeModal } from '@/components/PracticeModal';

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

  const [selectedTimeRange, setSelectedTimeRange] = useState<'1Y' | '3Y' | '5Y'>('1Y');
  const [isZoomed, setIsZoomed] = useState(false);
  const [showPracticeModal, setShowPracticeModal] = useState(false);

  // Use the API hook to fetch chart data
  const { data: chartApiData, loading: chartLoading, error: chartError } = useChartData(
    params.topicId as string, 
    selectedTimeRange
  );

  // Use transformed API data
  const currentData = chartApiData;

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

  const timeRanges = [
    { key: '1Y' as const, label: '1 Year', description: 'Last year of available data' },
    { key: '3Y' as const, label: '3 Years', description: 'Last 3 years of available data' },
    { key: '5Y' as const, label: '5 Years', description: 'Last 5 years of available data' }
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
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-1">
              <Text className="text-lg font-bold text-slate-800 mb-1">Question Frequency Trend</Text>
              <Text className="text-sm text-slate-500">
                How often this topic appears in exams over time
              </Text>
            </View>
            <TouchableOpacity 
              className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center"
              onPress={() => setIsZoomed(!isZoomed)}
            >
              <ZoomIn size={16} color="#3b82f6" />
            </TouchableOpacity>
          </View>
          
          {/* Time Range Selector */}
          <View className="flex-row bg-slate-100 rounded-xl p-1 mb-4">
            {timeRanges.map((range) => (
              <TouchableOpacity
                key={range.key}
                className={`flex-1 py-2 px-3 rounded-lg items-center ${
                  selectedTimeRange === range.key ? 'bg-white' : ''
                }`}
                onPress={() => setSelectedTimeRange(range.key)}
              >
                <Text className={`text-sm font-semibold ${
                  selectedTimeRange === range.key ? 'text-blue-600' : 'text-slate-600'
                }`}>
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Chart Description */}
          <View className="bg-blue-50 p-3 rounded-xl mb-4">
            <View className="flex-row items-center gap-2 mb-1">
              <Calendar size={16} color="#3b82f6" />
              <Text className="text-sm font-semibold text-blue-800">
                {timeRanges.find(r => r.key === selectedTimeRange)?.description}
              </Text>
            </View>
            <Text className="text-xs text-blue-700">
              {currentData?.timeRange && `Showing data: ${currentData.timeRange}`}
              {!currentData?.timeRange && 'Loading time range...'}
            </Text>
          </View>
          
          {/* Enhanced Chart */}
          <ScrollView 
            horizontal={isZoomed}
            showsHorizontalScrollIndicator={false}
            className="rounded-xl"
          >
            {chartLoading && (
              <View className="items-center justify-center h-52">
                <Text className="text-sm text-slate-500">Loading chart data...</Text>
              </View>
            )}
            
            {chartError && (
              <View className="items-center justify-center h-52">
                <Text className="text-sm text-red-500">Error loading chart: {chartError}</Text>
              </View>
            )}
            
            {!chartLoading && !chartError && (
            currentData && currentData.labels.length > 0 && currentData.labels[0] !== 'No Data' && (
            (() => {
              // Calculate dynamic Y-axis configuration
              const maxValue = Math.max(...currentData.datasets[0].data);
              
              // Smart Y-axis scaling based on max value
              let yAxisMax, yAxisInterval, segments;
              
              if (maxValue === 0) {
                yAxisMax = 5;
                yAxisInterval = 1;
                segments = 5;
              } else if (maxValue === 1) {
                yAxisMax = 1;
                yAxisInterval = 1;
                segments = 1;
              } else if (maxValue <= 5) {
                yAxisMax = maxValue;
                yAxisInterval = 1;
                segments = maxValue;
              } else if (maxValue <= 10) {
                yAxisMax = Math.ceil(maxValue * 1.1);
                yAxisInterval = Math.ceil(yAxisMax / 5);
                segments = 5;
              } else {
                yAxisMax = Math.ceil(maxValue * 1.2);
                yAxisInterval = Math.ceil(yAxisMax / 5);
                segments = 5;
              }
              
              return (
            <LineChart
              data={currentData}
              width={isZoomed ? width * 1.8 : width - 40}
              height={240}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#f8fafc',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(71, 85, 105, ${opacity})`,
                propsForVerticalLabels: {
                  fontSize: 10,
                  rotation: isZoomed ? 0 : -45,
                },
                propsForHorizontalLabels: {
                  fontSize: 10,
                },
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "3",
                  stroke: "#3b82f6",
                  fill: "#ffffff"
                },
                propsForBackgroundLines: {
                  strokeDasharray: "5,5",
                  stroke: "#e2e8f0",
                  strokeWidth: 1
                }
              }}
              className="rounded-xl"
              bezier
              withDots={true}
              withShadow={false}
              withVerticalLabels={true}
              withHorizontalLabels={true}
              fromZero={true}
              withInnerLines={true}
              withOuterLines={true}
              yAxisInterval={yAxisInterval}
              yAxisSuffix=""
              segments={segments}
            />
            );
            })()
            ))}
            
            {!chartLoading && !chartError && (!currentData || currentData.labels[0] === 'No Data') && (
              <View className="items-center justify-center h-52">
                <Text className="text-sm text-slate-500">No chart data available</Text>
              </View>
            )}
          </ScrollView>
          
          {isZoomed && (
            <Text className="text-xs text-slate-500 text-center mt-2">
              💡 Scroll horizontally to view detailed chart data
            </Text>
          )}
          
          {/* Data Insights */}
          <View className="mt-4 p-3 bg-slate-50 rounded-xl">
            <Text className="text-sm font-semibold text-slate-800 mb-2">Key Insights:</Text>
            <View className="gap-1">
              {currentData?.insights && currentData.insights.length > 0 ? (
                currentData.insights.map((insight, index) => (
                  <Text key={index} className="text-xs text-slate-600">
                    • {insight.description}
                    {insight.percentage && ` (${insight.percentage}%)`}
                  </Text>
                ))
              ) : (
                <Text className="text-xs text-slate-600">• No insights available for this topic</Text>
              )}
            </View>
          </View>
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

      {/* Floating Practice Button */}
      <View className="absolute bottom-6 left-0 right-0 items-center">
        <TouchableOpacity
          className="bg-blue-500 px-8 py-4 items-center justify-center shadow-lg flex-row gap-2"
          onPress={() => setShowPracticeModal(true)}
          style={{
            borderRadius: 50,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          }}
        >
          <Play size={20} color="#ffffff" />
          <Text className="text-white font-semibold text-base">Start Practice</Text>
        </TouchableOpacity>
      </View>

      {/* Practice Modal */}
      <PracticeModal
        visible={showPracticeModal}
        onClose={() => setShowPracticeModal(false)}
        topicName={topicName as string}
      />
    </View>
  );
}