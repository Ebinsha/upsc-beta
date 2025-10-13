import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { Brain, TrendingUp, Zap, ArrowRight } from 'lucide-react-native';

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
  const cardScale1 = useSharedValue(0.5);
  const cardScale2 = useSharedValue(0.5);
  const cardScale3 = useSharedValue(0.5);
  const brainRotate = useSharedValue(0);
  const sparkleOpacity = useSharedValue(0);

  const steps = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Our advanced AI analyzes your learning patterns, preferences, and performance to curate personalized study topics just for you.",
      color: "bg-purple-500",
    },
    {
      icon: TrendingUp,
      title: "Priority-Based Visualization",
      description: "Topics are displayed as cards where size matters! Larger cards represent higher priority topics that need your immediate attention.",
      color: "bg-blue-500",
    },
    {
      icon: Zap,
      title: "Smart Study Experience",
      description: "Focus on what matters most. The treemap layout helps you quickly identify which topics to study first for maximum learning efficiency.",
      color: "bg-green-500",
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
      // Brain rotation animation
      brainRotate.value = withSequence(
        withTiming(10, { duration: 1000 }),
        withTiming(-10, { duration: 1000 }),
        withTiming(0, { duration: 1000 })
      );
      
      // Sparkle effect
      sparkleOpacity.value = withSequence(
        withDelay(500, withTiming(1, { duration: 500 })),
        withTiming(0, { duration: 500 })
      );
    } else if (currentStep === 1) {
      // Card size demonstration
      cardScale1.value = withDelay(500, withSpring(1.2, { damping: 10 }));
      cardScale2.value = withDelay(700, withSpring(0.9, { damping: 10 }));
      cardScale3.value = withDelay(900, withSpring(0.7, { damping: 10 }));
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
    transform: [{ rotate: `${brainRotate.value}deg` }],
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

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <View className="flex-1 bg-gray-50 justify-center items-center px-6">
      <Animated.View style={fadeStyle} className="items-center">
        {/* Icon Section */}
        <View className={`w-24 h-24 rounded-full ${currentStepData.color} items-center justify-center mb-8 shadow-lg`}>
          {currentStep === 0 ? (
            <Animated.View style={brainStyle}>
              <IconComponent size={40} color="white" />
            </Animated.View>
          ) : (
            <IconComponent size={40} color="white" />
          )}
        </View>

        {/* Sparkle Effect for AI step */}
        {currentStep === 0 && (
          <Animated.View style={[sparkleStyle, { position: 'absolute', top: -20 }]}>
            <View className="flex-row space-x-2">
              <View className="w-2 h-2 bg-yellow-400 rounded-full" />
              <View className="w-1 h-1 bg-yellow-300 rounded-full" />
              <View className="w-2 h-2 bg-yellow-500 rounded-full" />
            </View>
          </Animated.View>
        )}

        {/* Card Demo for Priority step */}
        {currentStep === 1 && (
          <View className="absolute -top-10 flex-row space-x-2">
            <Animated.View style={card1Style} className="w-12 h-8 bg-purple-300 rounded" />
            <Animated.View style={card2Style} className="w-10 h-6 bg-green-300 rounded" />
            <Animated.View style={card3Style} className="w-8 h-5 bg-blue-300 rounded" />
          </View>
        )}

        {/* Title */}
        <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
          {currentStepData.title}
        </Text>

        {/* Description */}
        <Text className="text-lg text-gray-600 text-center leading-7 mb-12 max-w-sm">
          {currentStepData.description}
        </Text>

        {/* Progress Indicators */}
        <View className="flex-row space-x-2 mb-12">
          {steps.map((_, index) => (
            <View
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentStep ? currentStepData.color.replace('bg-', 'bg-') : 'bg-gray-300'
              }`}
            />
          ))}
        </View>

        {/* Action Buttons */}
        <View className="flex-row space-x-4 w-full">
          <TouchableOpacity
            onPress={skip}
            className="flex-1 py-4 px-6 rounded-xl border border-gray-300"
            activeOpacity={0.8}
          >
            <Text className="text-gray-600 text-center font-semibold">Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={nextStep}
            className={`flex-1 py-4 px-6 rounded-xl ${currentStepData.color} flex-row items-center justify-center`}
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold mr-2">
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <ArrowRight size={18} color="white" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default OnboardingScreen;