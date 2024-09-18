import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAppSelector } from '@/src/store/hooks';
import { RootState } from '@/src/store';
import PetSelection from './components/PetSelection';
import ImageCapture from './components/ImageCapture';
import AnalysisResult from './components/AnalysisResult';

export default function Camera() {
  const { stage } = useAppSelector((state: RootState) => state.cameraFlow);
  const userName = useAppSelector((state: RootState) => state.auth.user?.name || '');

  if (!stage) {
    return (
      <SafeAreaView className="flex-1 flex flex-row bg-[#060606] justify-center items-center">
        <ActivityIndicator size="large" color="#FFFC9F" />
        <Text className="text-white mt-4">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#060606]">
      <View className="flex-row justify-between items-center p-4">
        <Text className="text-white text-lg">👋 Hi {userName}!</Text>
        <TouchableOpacity className="bg-[#FFFC9F] w-10 h-10 rounded-full items-center justify-center">
          <Text className="text-black font-bold">ST</Text>
        </TouchableOpacity>
      </View>
      
      <View className="flex-1 justify-center">
        {stage === 'petSelection' && <PetSelection />}
        {stage === 'imageCapture' && <ImageCapture />}
        {stage === 'analysisResult' && <AnalysisResult />}
      </View>
    </SafeAreaView>
  );
}