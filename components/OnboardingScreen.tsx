import { ArrowRight, ChartBar as BarChart3, Brain, FileText, Target, TrendingUp } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  // Animation values
  const fadeIn = useSharedValue(0);
  const slideUp = useSharedValue(50);
  const scale = useSharedValue(0.8);
  const brainPulse = useSharedValue(1);
  const dataFlow1 = useSharedValue(0);
  const dataFlow2 = useSharedValue(0);
  const dataFlow3 = useSharedValue(0);
  const cardScale1 = useSharedValue(0.5);
  const cardScale2 = useSharedValue(0.5);
  const cardScale3 = useSharedValue(0.5);
  const priorityBadge1 = useSharedValue(0);
  const priorityBadge2 = useSharedValue(0);
  const priorityBadge3 = useSharedValue(0);
  const sparkleOpacity = useSharedValue(0);

  const steps = [
    {
      icon: Brain,
      title: "AI Analyzes Current Affairs",
      description: "Our advanced AI continuously scans current affairs, news, and trending topics to identify what's most relevant for your upcoming exams.",
      color: "bg-purple-500",
      detail: "Real-time analysis of thousands of sources"
    },
    {
      icon: BarChart3,
      title: "Probability-Based Topic Sizing",
      description: "Each topic's card size represents the probability of it appearing in your exam. Larger cards = higher probability based on current trends and historical data.",
      color: "bg-blue-500",
      detail: "Smart sizing based on exam probability"
    },
    {
      icon: Target,
      title: "Priority-Based Organization",
      description: "Topics are organized into Hot, Trending, and Medium priority based on current affairs analysis and previous exam patterns for maximum efficiency.",
      color: "bg-green-500",
      detail: "Hot • Trending • Medium priorities"
    },
  ];

  useEffect(() => {
    startAnimation();
  }, [currentStep]);

  const startAnimation = () => {
    // Reset animations
    fadeIn.value = 0;
    slideUp.value = 50;
    scale.value = 0.8;

    // Animate in
    fadeIn.value = withTiming(1, { duration: 600 });
    slideUp.value = withTiming(0, { duration: 600 });
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });

    // Special animations for each step
    if (currentStep === 0) {
      // Brain pulsing animation
      brainPulse.value = withSequence(
        withTiming(1.2, { duration: 800 }),
        withTiming(1, { duration: 800 }),
        withTiming(1.2, { duration: 800 }),
        withTiming(1, { duration: 800 })
      );

      // Data flow animation
      dataFlow1.value = withDelay(500, withTiming(1, { duration: 1000 }));
      dataFlow2.value = withDelay(700, withTiming(1, { duration: 1000 }));
      dataFlow3.value = withDelay(900, withTiming(1, { duration: 1000 }));

      // Sparkle effect
      sparkleOpacity.value = withSequence(
        withDelay(1200, withTiming(1, { duration: 300 })),
        withTiming(0, { duration: 300 }),
        withTiming(1, { duration: 300 }),
        withTiming(0, { duration: 300 })
      );
    } else if (currentStep === 1) {
      // Card size demonstration based on probability
      cardScale1.value = withDelay(500, withSpring(1.4, { damping: 10 })); // High probability
      cardScale2.value = withDelay(700, withSpring(1.0, { damping: 10 })); // Medium probability
      cardScale3.value = withDelay(900, withSpring(0.7, { damping: 10 })); // Low probability
    } else if (currentStep === 2) {
      // Priority badges animation
      priorityBadge1.value = withDelay(500, withSpring(1, { damping: 12 }));
      priorityBadge2.value = withDelay(700, withSpring(1, { damping: 12 }));
      priorityBadge3.value = withDelay(900, withSpring(1, { damping: 12 }));
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const skip = () => {
    onComplete();
  };

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
    transform: [
      { translateY: slideUp.value },
      { scale: scale.value }
    ],
  }));

  const brainStyle = useAnimatedStyle(() => ({
    transform: [{ scale: brainPulse.value }],
  }));

  const dataFlow1Style = useAnimatedStyle(() => ({
    opacity: dataFlow1.value,
    transform: [{ translateX: dataFlow1.value * 20 }],
  }));

  const dataFlow2Style = useAnimatedStyle(() => ({
    opacity: dataFlow2.value,
    transform: [{ translateX: dataFlow2.value * -15 }],
  }));

  const dataFlow3Style = useAnimatedStyle(() => ({
    opacity: dataFlow3.value,
    transform: [{ translateX: dataFlow3.value * 25 }],
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value,
  }));

  const card1Style = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale1.value }],
  }));

  const card2Style = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale2.value }],
  }));

  const card3Style = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale3.value }],
  }));

  const priorityBadge1Style = useAnimatedStyle(() => ({
    transform: [{ scale: priorityBadge1.value }],
    opacity: priorityBadge1.value,
  }));

  const priorityBadge2Style = useAnimatedStyle(() => ({
    transform: [{ scale: priorityBadge2.value }],
    opacity: priorityBadge2.value,
  }));

  const priorityBadge3Style = useAnimatedStyle(() => ({
    transform: [{ scale: priorityBadge3.value }],
    opacity: priorityBadge3.value,
  }));

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <View className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50 justify-center items-center px-6">
      <Animated.View style={fadeStyle} className="items-center">
        {/* Icon Section with Animations */}
        <View className="relative mb-8">
          <View className={`w-28 h-28 rounded-full ${currentStepData.color} items-center justify-center shadow-2xl`}>
            {currentStep === 0 ? (
              <Animated.View style={brainStyle}>
                <IconComponent size={44} color="white" />
              </Animated.View>
            ) : (
              <IconComponent size={44} color="white" />
            )}
          </View>

          {/* Data Flow Animation for AI Analysis */}
          {currentStep === 0 && (
            <View className="absolute -top-8 -left-8 -right-8 -bottom-8">
              <Animated.View style={[dataFlow1Style, { position: 'absolute', top: 10, left: 0 }]}>
                <View className="flex-row items-center">
                  <FileText size={16} color="#8B5CF6" />
                  <View className="w-12 h-0.5 bg-purple-400 ml-1" />
                </View>
              </Animated.View>
              <Animated.View style={[dataFlow2Style, { position: 'absolute', top: 30, right: 0 }]}>
                <View className="flex-row items-center">
                  <View className="w-10 h-0.5 bg-blue-400 mr-1" />
                  <TrendingUp size={16} color="#3B82F6" />
                </View>
              </Animated.View>
              <Animated.View style={[dataFlow3Style, { position: 'absolute', bottom: 20, left: 5 }]}>
                <View className="flex-row items-center">
                  <BarChart3 size={16} color="#10B981" />
                  <View className="w-8 h-0.5 bg-green-400 ml-1" />
                </View>
              </Animated.View>
            </View>
          )}

          {/* Sparkle Effect for AI Analysis */}
          {currentStep === 0 && (
            <Animated.View style={[sparkleStyle, { position: 'absolute', top: -12, right: -8 }]}>
              <View className="flex-row space-x-1">
                <View className="w-2 h-2 bg-yellow-400 rounded-full" />
                <View className="w-1.5 h-1.5 bg-yellow-300 rounded-full" />
                <View className="w-2 h-2 bg-yellow-500 rounded-full" />
              </View>
            </Animated.View>
          )}

          {/* Card Size Demo for Probability */}
          {currentStep === 1 && (
            <View className="absolute -top-16 flex-row space-x-3 items-end">
              <View className="items-center">
                <Animated.View style={card1Style} className="w-16 h-12 bg-red-400 rounded-lg shadow-lg" />
                <Text className="text-xs text-gray-600 mt-1 font-medium">High</Text>
              </View>
              <View className="items-center">
                <Animated.View style={card2Style} className="w-12 h-9 bg-orange-400 rounded-lg shadow-lg" />
                <Text className="text-xs text-gray-600 mt-1 font-medium">Med</Text>
              </View>
              <View className="items-center">
                <Animated.View style={card3Style} className="w-10 h-7 bg-green-400 rounded-lg shadow-lg" />
                <Text className="text-xs text-gray-600 mt-1 font-medium">Low</Text>
              </View>
            </View>
          )}

          {/* Priority Badges for Organization */}
          {currentStep === 2 && (
            <View className="absolute -top-12 flex-row space-x-2">
              <Animated.View style={priorityBadge1Style} className="bg-red-500 px-3 py-1 rounded-full">
                <Text className="text-white text-xs font-bold">HOT</Text>
              </Animated.View>
              <Animated.View style={priorityBadge2Style} className="bg-orange-500 px-2 py-1 rounded-full">
                <Text className="text-white text-xs font-bold">TRENDING</Text>
              </Animated.View>
              <Animated.View style={priorityBadge3Style} className="bg-blue-500 px-2 py-1 rounded-full">
                <Text className="text-white text-xs font-bold">MEDIUM</Text>
              </Animated.View>
            </View>
          )}
        </View>

        {/* Title */}
        <Text className="text-3xl font-bold text-gray-800 text-center mb-3">
          {currentStepData.title}
        </Text>

        {/* Detail Badge */}
        <View className="bg-white px-4 py-2 rounded-full shadow-sm mb-4">
          <Text className="text-sm font-medium text-gray-600">
            {currentStepData.detail}
          </Text>
        </View>

        {/* Description */}
        <Text className="text-lg text-gray-600 text-center leading-7 mb-12 max-w-sm">
          {currentStepData.description}
        </Text>

        {/* Progress Indicators */}
        <View className="flex-row space-x-3 mb-12">
          {steps.map((_, index) => (
            <View key={index} className="flex-row items-center">
              <View
                className={`w-4 h-4 rounded-full ${
                  index === currentStep
                    ? currentStepData.color.replace('bg-', 'bg-')
                    : index < currentStep
                      ? 'bg-green-400'
                      : 'bg-gray-300'
                }`}
              />
              {index < steps.length - 1 && (
                <View className={`w-8 h-0.5 ${index < currentStep ? 'bg-green-400' : 'bg-gray-300'}`} />
              )}
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View className="flex-row space-x-4 w-full">
          <TouchableOpacity
            onPress={skip}
            className="flex-1 py-4 px-6 rounded-xl border-2 border-gray-200 bg-white"
            activeOpacity={0.8}
          >
            <Text className="text-gray-600 text-center font-semibold">Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={nextStep}
            className={`flex-1 py-4 px-6 rounded-xl ${currentStepData.color} flex-row items-center justify-center shadow-lg`}
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold mr-2">
              {currentStep === steps.length - 1 ? 'Start Learning' : 'Next'}
            </Text>
            <ArrowRight size={18} color="white" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default OnboardingScreen;