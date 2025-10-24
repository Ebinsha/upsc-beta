import { ArrowRight, BarChart3, Brain, Flame, Play, Sparkles, Target, TrendingUp } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const fadeIn = useSharedValue(0);
  const slideUp = useSharedValue(50);
  
  const brainGlow = useSharedValue(1);
  const newsFlow = useSharedValue(0);
  const pyqFlow = useSharedValue(0);
  const analysisParticle1 = useSharedValue(0);
  const analysisParticle2 = useSharedValue(0);
  const analysisParticle3 = useSharedValue(0);
  const scanLine = useSharedValue(-100);
  
  const topicCard1 = useSharedValue(0);
  const topicCard2 = useSharedValue(0);
  const topicCard3 = useSharedValue(0);
  const scoreReveal1 = useSharedValue(0);
  const scoreReveal2 = useSharedValue(0);
  const scoreReveal3 = useSharedValue(0);
  const sizeIndicator = useSharedValue(0);
  
  const hotBadge = useSharedValue(0);
  const trendingBadge = useSharedValue(0);
  const mediumBadge = useSharedValue(0);
  const reasoningBox = useSharedValue(0);
  const practiceButton = useSharedValue(0);
  const subtopicGroup1 = useSharedValue(0);
  const subtopicGroup2 = useSharedValue(0);
  const subtopicGroup3 = useSharedValue(0);

  const steps = [
    {
      icon: Brain,
      title: "AI Analyzes Everything",
      description: "Our AI continuously scans current affairs, news, and previous year questions (PYQs) to predict exam topics with precision.",
      color: "bg-purple-500",
      detail: "Current Affairs + PYQs  Smart Predictions"
    },
    {
      icon: BarChart3,
      title: "Priority by Size & Score",
      description: "Each topic gets a 1-10 priority score. Card size reflects importance—bigger cards mean higher exam probability.",
      color: "bg-blue-500",
      detail: "Card Size = Exam Probability (1-10 Scale)"
    },
    {
      icon: Target,
      title: "Smart Subtopic Grouping",
      description: "Subtopics are organized as Hot, Trending, or Medium priority. Each shows reasoning, score, and practice questions.",
      color: "bg-green-500",
      detail: "Reasoning  Score  Practice"
    },
  ];

  useEffect(() => {
    startAnimation();
  }, [currentStep]);

  const startAnimation = () => {
    fadeIn.value = 0;
    slideUp.value = 50;
    
    fadeIn.value = withTiming(1, { duration: 500 });
    slideUp.value = withSpring(0, { damping: 15, stiffness: 120 });

    if (currentStep === 0) {
      brainGlow.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
      
      newsFlow.value = 0;
      pyqFlow.value = 0;
      newsFlow.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500, easing: Easing.linear }),
          withTiming(0, { duration: 0 })
        ),
        -1,
        false
      );
      pyqFlow.value = withDelay(
        300,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 1500, easing: Easing.linear }),
            withTiming(0, { duration: 0 })
          ),
          -1,
          false
        )
      );
      
      analysisParticle1.value = withDelay(
        700,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 1200, easing: Easing.out(Easing.ease) }),
            withTiming(0, { duration: 0 })
          ),
          -1,
          false
        )
      );
      analysisParticle2.value = withDelay(
        1000,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 1200, easing: Easing.out(Easing.ease) }),
            withTiming(0, { duration: 0 })
          ),
          -1,
          false
        )
      );
      analysisParticle3.value = withDelay(
        1300,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 1200, easing: Easing.out(Easing.ease) }),
            withTiming(0, { duration: 0 })
          ),
          -1,
          false
        )
      );
      
      scanLine.value = withRepeat(
        withSequence(
          withTiming(100, { duration: 2000, easing: Easing.linear }),
          withTiming(-100, { duration: 0 })
        ),
        -1,
        false
      );
      
    } else if (currentStep === 1) {
      topicCard1.value = 0;
      topicCard2.value = 0;
      topicCard3.value = 0;
      scoreReveal1.value = 0;
      scoreReveal2.value = 0;
      scoreReveal3.value = 0;
      
      topicCard1.value = withDelay(300, withSpring(1, { damping: 12, stiffness: 100 }));
      scoreReveal1.value = withDelay(900, withSpring(1, { damping: 10 }));
      
      topicCard2.value = withDelay(500, withSpring(1, { damping: 12, stiffness: 100 }));
      scoreReveal2.value = withDelay(1100, withSpring(1, { damping: 10 }));
      
      topicCard3.value = withDelay(700, withSpring(1, { damping: 12, stiffness: 100 }));
      scoreReveal3.value = withDelay(1300, withSpring(1, { damping: 10 }));
      
      sizeIndicator.value = withDelay(
        1500,
        withRepeat(
          withSequence(
            withTiming(1.1, { duration: 600 }),
            withTiming(1, { duration: 600 })
          ),
          -1,
          false
        )
      );
      
    } else if (currentStep === 2) {
      hotBadge.value = 0;
      trendingBadge.value = 0;
      mediumBadge.value = 0;
      reasoningBox.value = 0;
      practiceButton.value = 0;
      subtopicGroup1.value = 0;
      subtopicGroup2.value = 0;
      subtopicGroup3.value = 0;
      
      hotBadge.value = withDelay(300, withSpring(1, { damping: 10, stiffness: 150 }));
      trendingBadge.value = withDelay(500, withSpring(1, { damping: 10, stiffness: 150 }));
      mediumBadge.value = withDelay(700, withSpring(1, { damping: 10, stiffness: 150 }));
      
      subtopicGroup1.value = withDelay(900, withSpring(1, { damping: 12 }));
      subtopicGroup2.value = withDelay(1100, withSpring(1, { damping: 12 }));
      subtopicGroup3.value = withDelay(1300, withSpring(1, { damping: 12 }));
      
      reasoningBox.value = withDelay(1500, withSpring(1, { damping: 13 }));
      
      practiceButton.value = withDelay(
        1800,
        withRepeat(
          withSequence(
            withSpring(1.15, { damping: 8 }),
            withSpring(1, { damping: 8 })
          ),
          -1,
          false
        )
      );
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
    transform: [{ translateY: slideUp.value }],
  }));

  const brainGlowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: brainGlow.value }],
  }));

  const newsFlowStyle = useAnimatedStyle(() => ({
    opacity: newsFlow.value,
    transform: [
      { translateX: -80 + newsFlow.value * 80 },
      { translateY: newsFlow.value * -20 }
    ],
  }));

  const pyqFlowStyle = useAnimatedStyle(() => ({
    opacity: pyqFlow.value,
    transform: [
      { translateX: 80 - pyqFlow.value * 80 },
      { translateY: pyqFlow.value * -15 }
    ],
  }));

  const analysisParticle1Style = useAnimatedStyle(() => ({
    opacity: analysisParticle1.value * (1 - analysisParticle1.value),
    transform: [
      { translateY: -analysisParticle1.value * 60 },
      { translateX: analysisParticle1.value * 30 },
      { scale: 1 - analysisParticle1.value * 0.5 }
    ],
  }));

  const analysisParticle2Style = useAnimatedStyle(() => ({
    opacity: analysisParticle2.value * (1 - analysisParticle2.value),
    transform: [
      { translateY: -analysisParticle2.value * 65 },
      { translateX: -analysisParticle2.value * 25 },
      { scale: 1 - analysisParticle2.value * 0.5 }
    ],
  }));

  const analysisParticle3Style = useAnimatedStyle(() => ({
    opacity: analysisParticle3.value * (1 - analysisParticle3.value),
    transform: [
      { translateY: -analysisParticle3.value * 70 },
      { scale: 1 - analysisParticle3.value * 0.5 }
    ],
  }));

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLine.value }],
  }));

  const topicCard1Style = useAnimatedStyle(() => ({
    opacity: topicCard1.value,
    transform: [{ scale: topicCard1.value }, { translateY: (1 - topicCard1.value) * 20 }],
  }));

  const topicCard2Style = useAnimatedStyle(() => ({
    opacity: topicCard2.value,
    transform: [{ scale: topicCard2.value }, { translateY: (1 - topicCard2.value) * 20 }],
  }));

  const topicCard3Style = useAnimatedStyle(() => ({
    opacity: topicCard3.value,
    transform: [{ scale: topicCard3.value }, { translateY: (1 - topicCard3.value) * 20 }],
  }));

  const scoreReveal1Style = useAnimatedStyle(() => ({
    opacity: scoreReveal1.value,
    transform: [{ scale: scoreReveal1.value }],
  }));

  const scoreReveal2Style = useAnimatedStyle(() => ({
    opacity: scoreReveal2.value,
    transform: [{ scale: scoreReveal2.value }],
  }));

  const scoreReveal3Style = useAnimatedStyle(() => ({
    opacity: scoreReveal3.value,
    transform: [{ scale: scoreReveal3.value }],
  }));

  const sizeIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sizeIndicator.value }],
  }));

  const hotBadgeStyle = useAnimatedStyle(() => ({
    opacity: hotBadge.value,
    transform: [{ scale: hotBadge.value }, { rotate: `${(1 - hotBadge.value) * 180}deg` }],
  }));

  const trendingBadgeStyle = useAnimatedStyle(() => ({
    opacity: trendingBadge.value,
    transform: [{ scale: trendingBadge.value }, { rotate: `${(1 - trendingBadge.value) * 180}deg` }],
  }));

  const mediumBadgeStyle = useAnimatedStyle(() => ({
    opacity: mediumBadge.value,
    transform: [{ scale: mediumBadge.value }, { rotate: `${(1 - mediumBadge.value) * 180}deg` }],
  }));

  const reasoningBoxStyle = useAnimatedStyle(() => ({
    opacity: reasoningBox.value,
    transform: [{ translateX: (1 - reasoningBox.value) * -50 }],
  }));

  const practiceButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: practiceButton.value }],
  }));

  const subtopicGroup1Style = useAnimatedStyle(() => ({
    opacity: subtopicGroup1.value,
    transform: [{ translateY: (1 - subtopicGroup1.value) * 30 }],
  }));

  const subtopicGroup2Style = useAnimatedStyle(() => ({
    opacity: subtopicGroup2.value,
    transform: [{ translateY: (1 - subtopicGroup2.value) * 30 }],
  }));

  const subtopicGroup3Style = useAnimatedStyle(() => ({
    opacity: subtopicGroup3.value,
    transform: [{ translateY: (1 - subtopicGroup3.value) * 30 }],
  }));

  const currentStepData = steps[currentStep];

  return (
    <View className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 justify-center items-center px-6">
      <Animated.View style={fadeStyle} className="items-center w-full">
        {currentStep === 0 && (
          <View className="items-center mb-8">
            <View className="relative h-64 w-full items-center justify-center">
              <Animated.View style={newsFlowStyle} className="absolute left-8 top-24">
                <View className="flex-row items-center">
                  <View className="bg-orange-100 px-3 py-1.5 rounded-lg border-2 border-orange-300">
                    <Text className="text-orange-600 font-bold text-xs">NEWS</Text>
                  </View>
                  <View className="w-12 h-1 bg-orange-400 ml-1" />
                </View>
              </Animated.View>
              <Animated.View style={pyqFlowStyle} className="absolute right-8 top-24">
                <View className="flex-row items-center">
                  <View className="w-12 h-1 bg-blue-400 mr-1" />
                  <View className="bg-blue-100 px-3 py-1.5 rounded-lg border-2 border-blue-300">
                    <Text className="text-blue-600 font-bold text-xs">PYQs</Text>
                  </View>
                </View>
              </Animated.View>
              <Animated.View style={brainGlowStyle}>
                <View className="relative">
                  <View className="absolute -inset-4 bg-purple-300 rounded-full opacity-30" />
                  <View className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 items-center justify-center shadow-2xl">
                    <Brain size={56} color="white" strokeWidth={2.5} />
                  </View>
                </View>
              </Animated.View>
              <View className="absolute inset-0 overflow-hidden">
                <Animated.View style={scanLineStyle} className="absolute inset-x-0 h-1 bg-purple-400 opacity-50" />
              </View>
              <Animated.View style={analysisParticle1Style} className="absolute top-24 left-1/2">
                <View className="w-3 h-3 rounded-full bg-green-400 shadow-lg" />
              </Animated.View>
              <Animated.View style={analysisParticle2Style} className="absolute top-24 left-1/2">
                <View className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-lg" />
              </Animated.View>
              <Animated.View style={analysisParticle3Style} className="absolute top-24 left-1/2">
                <View className="w-2 h-2 rounded-full bg-pink-400 shadow-lg" />
              </Animated.View>
              <View className="absolute bottom-2">
                <View className="bg-white px-4 py-2 rounded-full shadow-md border border-purple-200">
                  <Text className="text-purple-600 font-bold text-sm"> Analyzing...</Text>
                </View>
              </View>
            </View>
          </View>
        )}
        {currentStep === 1 && (
          <View className="items-center mb-8">
            <View className="relative h-64 w-full items-center justify-center">
              <Animated.View style={sizeIndicatorStyle} className="absolute top-0">
                <View className="bg-blue-500 px-4 py-2 rounded-full shadow-lg">
                  <Text className="text-white font-bold text-xs"> Size = Priority</Text>
                </View>
              </Animated.View>
              <View className="flex-row items-end justify-center space-x-3">
                <Animated.View style={topicCard1Style}>
                  <View className="items-center">
                    <View className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-2xl p-6 w-28 h-36 justify-between">
                      <View>
                        <Text className="text-white font-bold text-xs mb-1">International</Text>
                        <Text className="text-white text-xs opacity-90">Relations</Text>
                      </View>
                      <Animated.View style={scoreReveal1Style} className="bg-white/30 rounded-lg px-2 py-1">
                        <Text className="text-white font-black text-xl">9/10</Text>
                      </Animated.View>
                    </View>
                    <View className="mt-2 bg-red-100 px-3 py-1 rounded-full">
                      <Text className="text-red-700 font-bold text-xs">HIGH</Text>
                    </View>
                  </View>
                </Animated.View>
                <Animated.View style={topicCard2Style}>
                  <View className="items-center">
                    <View className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-4 w-24 h-28 justify-between">
                      <View>
                        <Text className="text-white font-bold text-xs mb-1">Science &</Text>
                        <Text className="text-white text-xs opacity-90">Tech</Text>
                      </View>
                      <Animated.View style={scoreReveal2Style} className="bg-white/30 rounded-lg px-2 py-1">
                        <Text className="text-white font-black text-lg">6/10</Text>
                      </Animated.View>
                    </View>
                    <View className="mt-2 bg-orange-100 px-3 py-1 rounded-full">
                      <Text className="text-orange-700 font-bold text-xs">MED</Text>
                    </View>
                  </View>
                </Animated.View>
                <Animated.View style={topicCard3Style}>
                  <View className="items-center">
                    <View className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-3 w-20 h-24 justify-between">
                      <View>
                        <Text className="text-white font-bold text-xs mb-1">Sports</Text>
                      </View>
                      <Animated.View style={scoreReveal3Style} className="bg-white/30 rounded-lg px-1.5 py-0.5">
                        <Text className="text-white font-black text-base">3/10</Text>
                      </Animated.View>
                    </View>
                    <View className="mt-2 bg-blue-100 px-2 py-1 rounded-full">
                      <Text className="text-blue-700 font-bold text-xs">LOW</Text>
                    </View>
                  </View>
                </Animated.View>
              </View>
              <View className="absolute bottom-0">
                <View className="flex-row items-center space-x-2">
                  <Text className="text-gray-400 text-xs">1</Text>
                  <View className="w-32 h-2 bg-gradient-to-r from-blue-300 via-orange-400 to-red-500 rounded-full" />
                  <Text className="text-gray-800 font-bold text-xs">10</Text>
                </View>
              </View>
            </View>
          </View>
        )}
        {currentStep === 2 && (
          <View className="items-center mb-8">
            <View className="relative h-64 w-full px-2">
              <View className="flex-row justify-center space-x-2 mb-4">
                <Animated.View style={hotBadgeStyle}>
                  <View className="bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 rounded-full shadow-lg flex-row items-center">
                    <Flame size={14} color="white" />
                    <Text className="text-white font-black text-xs ml-1">HOT</Text>
                  </View>
                </Animated.View>
                <Animated.View style={trendingBadgeStyle}>
                  <View className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 rounded-full shadow-lg flex-row items-center">
                    <TrendingUp size={14} color="white" />
                    <Text className="text-white font-black text-xs ml-1">TREND</Text>
                  </View>
                </Animated.View>
                <Animated.View style={mediumBadgeStyle}>
                  <View className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 rounded-full shadow-lg flex-row items-center">
                    <Target size={14} color="white" />
                    <Text className="text-white font-black text-xs ml-1">MEDIUM</Text>
                  </View>
                </Animated.View>
              </View>
              <View className="space-y-2">
                <Animated.View style={subtopicGroup1Style}>
                  <View className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-xl p-3">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-red-900 font-bold text-sm flex-1">India-US Relations</Text>
                      <View className="bg-red-500 px-2 py-0.5 rounded-full">
                        <Text className="text-white font-black text-xs">8.5</Text>
                      </View>
                    </View>
                    <Text className="text-red-700 text-xs">3 recent news  5 PYQs matched</Text>
                  </View>
                </Animated.View>
                <Animated.View style={subtopicGroup2Style}>
                  <View className="bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-3">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-orange-900 font-bold text-sm flex-1">Climate Change</Text>
                      <View className="bg-orange-500 px-2 py-0.5 rounded-full">
                        <Text className="text-white font-black text-xs">7.2</Text>
                      </View>
                    </View>
                    <Text className="text-orange-700 text-xs">2 trending topics  4 PYQs</Text>
                  </View>
                </Animated.View>
                <Animated.View style={subtopicGroup3Style}>
                  <View className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-3">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-blue-900 font-bold text-sm flex-1">Digital Economy</Text>
                      <View className="bg-blue-500 px-2 py-0.5 rounded-full">
                        <Text className="text-white font-black text-xs">5.8</Text>
                      </View>
                    </View>
                    <Text className="text-blue-700 text-xs">1 current affair  2 PYQs</Text>
                  </View>
                </Animated.View>
              </View>
              <View className="mt-3 flex-row items-center justify-center space-x-2">
                <Animated.View style={reasoningBoxStyle}>
                  <View className="bg-purple-100 border border-purple-300 px-3 py-1.5 rounded-lg">
                    <Text className="text-purple-700 font-semibold text-xs"> AI Reasoning</Text>
                  </View>
                </Animated.View>
                <Text className="text-gray-400 font-bold"></Text>
                <View className="bg-green-100 border border-green-300 px-3 py-1.5 rounded-lg">
                  <Text className="text-green-700 font-semibold text-xs"> Score</Text>
                </View>
                <Text className="text-gray-400 font-bold"></Text>
                <Animated.View style={practiceButtonStyle}>
                  <View className="bg-gradient-to-r from-green-500 to-green-600 px-3 py-1.5 rounded-lg shadow-lg flex-row items-center">
                    <Play size={12} color="white" fill="white" />
                    <Text className="text-white font-bold text-xs ml-1">Practice</Text>
                  </View>
                </Animated.View>
              </View>
            </View>
          </View>
        )}
        <View className="items-center w-full">
          <Text className="text-3xl font-black text-gray-900 text-center mb-2 mt-4">
            {currentStepData.title}
          </Text>
          <View className="bg-white px-4 py-2 rounded-full shadow-md mb-4 border border-gray-200">
            <Text className="text-sm font-bold text-gray-700">
              {currentStepData.detail}
            </Text>
          </View>
          <Text className="text-base text-gray-600 text-center leading-6 mb-8 max-w-sm px-2">
            {currentStepData.description}
          </Text>
          <View className="flex-row space-x-2 mb-8">
            {steps.map((_, index) => (
              <View
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep 
                    ? 'w-8 bg-purple-500' 
                    : index < currentStep 
                      ? 'w-2 bg-green-500' 
                      : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </View>
          <View className="flex-row space-x-3 w-full px-4">
            <TouchableOpacity
              onPress={skip}
              className="flex-1 py-4 px-6 rounded-2xl border-2 border-gray-300 bg-white shadow-sm"
              activeOpacity={0.7}
            >
              <Text className="text-gray-700 text-center font-bold text-base">Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={nextStep}
              className={`flex-2 py-4 px-8 rounded-2xl ${currentStepData.color} flex-row items-center justify-center shadow-xl`}
              activeOpacity={0.8}
            >
              <Text className="text-white font-black text-base mr-2">
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              </Text>
              {currentStep === steps.length - 1 ? (
                <Sparkles size={20} color="white" />
              ) : (
                <ArrowRight size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default OnboardingScreen;
