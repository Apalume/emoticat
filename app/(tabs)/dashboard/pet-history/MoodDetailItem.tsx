import React from 'react';
import { View, Text, Image } from 'react-native';
import { useImageLoader } from '@/hooks/useImageLoader';

interface MoodDetailItemProps {
  emotion: string;
  emoji: string;
  count: number;
  imageKey: string | null;
  backgroundColor: string;
}

export const MoodDetailItem: React.FC<MoodDetailItemProps> = ({ 
  emotion, 
  emoji, 
  count, 
  imageKey, 
  backgroundColor 
}) => {
  const { imageUri, loading } = useImageLoader(imageKey || '');

  console.log(imageKey)
  if (count === 0) return null;

  return (
    <View 
      className="w-[48%] rounded-lg p-2 mb-4"
      style={{ backgroundColor }}
    >
      {loading ? (
        <View className="w-full h-24 rounded-lg mb-2 bg-gray-600 justify-center items-center">
          <Text className="text-white">Loading...</Text>
        </View>
      ) : (
        <Image 
          source={{ uri: imageUri || 'https://placekitten.com/100/100' }} 
          className="w-full h-24 rounded-lg mb-2"
        />
      )}
      <Text className="text-black font-bold">{emoji} {emotion} ({count})</Text>
    </View>
  );
};