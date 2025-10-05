import { View, Text } from 'react-native';
import { Clock } from 'lucide-react-native';
import { useEffect, useState } from 'react';

interface TestTimerProps {
  duration: number; // in minutes
  onTimeUp: () => void;
  isActive: boolean;
}

export function TestTimer({ duration, onTimeUp, isActive }: TestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    const percentage = (timeLeft / (duration * 60)) * 100;
    if (percentage <= 10) return 'text-red-600';
    if (percentage <= 25) return 'text-orange-600';
    return 'text-slate-600';
  };

  return (
    <View className="flex-row items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm">
      <Clock size={16} color="#64748b" />
      <Text className={`text-sm font-semibold ${getTimerColor()}`}>
        {formatTime(timeLeft)}
      </Text>
    </View>
  );
}