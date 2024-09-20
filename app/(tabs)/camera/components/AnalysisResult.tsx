import React, { useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { setStage, setImage, setAnalysisResult, setEmotionDetails } from '@/src/store/cameraFlowSlice';
import { addEmotionRecord } from '@/src/store/petSlice';

export default function AnalysisResult() {
  const dispatch = useAppDispatch();
  const { image, analysisResult, emotionDetails, analysisTimestamp, selectedPet } = useAppSelector(state => state.cameraFlow);
  const pets = useAppSelector(state => state.pet.pets);

  const handleNewPicture = () => {
    dispatch(setImage(null));
    dispatch(setAnalysisResult(null));
    dispatch(setEmotionDetails(null));
    dispatch(setStage('imageCapture'));
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  useEffect(() => {
    if (analysisResult && emotionDetails && selectedPet !== null) {
      dispatch(addEmotionRecord({
        index: selectedPet,
        record: {
          image: image,
          emotion: analysisResult.emotion,
          emotionText: emotionDetails.description,
          tipsAndRecs: emotionDetails.tipsAndRecs,
          timestamp: new Date().getTime(),
        }
      }));
    }
  }, [analysisResult, emotionDetails, selectedPet, image, dispatch]);
  
  if (!analysisResult) return null;

  return (
    <View className="flex-1">
      <ScrollView className="w-full flex-1 p-4 flex gap-2">
        <View className="w-full flex flex-row items-baseline justify-between">
          <Text className="text-white text-2xl font-bold">📈 Analysis</Text>
          {analysisTimestamp && (
            <Text className="text-gray-500 text-sm mt-1">{formatTimestamp(analysisTimestamp)}</Text>
          )}
        </View>
        <Image source={{ uri: image }} className="w-full h-60 rounded-lg mb-5" />
        {analysisResult && (
          analysisResult.emotion.startsWith('ERROR:') ? (
            <Text className="text-white text-xl font-bold mb-3 w-full">
              {analysisResult.emoji} {analysisResult.emotion}
            </Text>
          ) : emotionDetails && (
            <>
              <Text className="text-white text-xl font-bold mb-3 w-full">
                {analysisResult.emoji} {selectedPet !== null && pets[selectedPet] ? pets[selectedPet].name : 'Your pet'} is {analysisResult.emotion}
              </Text>
              <Text className="text-white text-left mb-5 px-4 w-full">{emotionDetails.description}</Text>
              <Text className="text-white text-xl font-bold mb-3 w-full">🐈 Tips & Recs</Text>
              {emotionDetails.tipsAndRecs.map((tip, index) => (
                <Text key={index} className="text-white mb-2 px-4 w-full">• {tip}</Text>
              ))}
            </>
          )
        )}
      </ScrollView>
      <TouchableOpacity 
        className="absolute bottom-8 right-8 bg-[#FBF79C] w-12 h-12 rounded-full items-center justify-center shadow-lg"
        onPress={handleNewPicture}
      >
        <Text className="text-black text-3xl">+</Text>
      </TouchableOpacity>
    </View>
  );
}