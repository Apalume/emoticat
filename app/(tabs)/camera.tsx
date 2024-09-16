import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useSelector, useDispatch } from 'react-redux';
import { addEmotionRecord } from '@/src/store/petSlice';
import { RootState } from '@/src/store';


export default function Camera() {

  const url = `https://6e04-70-110-20-34.ngrok-free.app`

  const dispatch = useDispatch();
  const petName = useSelector((state: RootState) => state.pet.name);
  console.log(useSelector((state: RootState) => state.pet))
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [emotionDetails, setEmotionDetails] = useState(null);
  const [analysisTimestamp, setAnalysisTimestamp] = useState(null);

  const emotionEmojiMap = {
    "Content": "😺",
    "Happy": "😸",
    "Curious": "🐱",
    "Affectionate": "😽",
    "Scared": "🙀",
    "Aggressive": "😾",
    "Annoyed": "😼",
    "Anxious": "😿",
    "Sad": "😿",
    "Bored": "🐈",
    "Sleepy": "😴"
  };
  
  const getEmotionEmoji = (emotion) => {
    return emotionEmojiMap[emotion] || '🐱';
  };


  const compressAndResizeImage = async (uri) => {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 512, height: 512 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );
    return manipulatedImage.base64;
  };

  const handleImageSelection = async (type) => {
    let result;
    if (type === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
    }

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      const compressedImage = await compressAndResizeImage(result.assets[0].uri);
      analyzeImage(compressedImage);
    }
  };

  const analyzeImage = async (base64Image) => {
    setAnalyzing(true);
    setAnalysisResult(null);
    setEmotionDetails(null);
    const currentTimestamp = new Date();
    setAnalysisTimestamp(currentTimestamp);
    try {
      const response = await fetch(url + '/analyze-cat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });
      
      if (!response.ok) {
        throw new Error('Analysis failed');
      }
      
      const data = await response.json();
      
      if (!data.message.startsWith('ERROR:')) {
        const emotionDetailsResponse = await getEmotionDetails(data.message);
        
        if (emotionDetailsResponse && emotionDetailsResponse.description) {
          setAnalysisResult({ emotion: data.message, emoji: getEmotionEmoji(data.message) });
          setEmotionDetails(emotionDetailsResponse);
  
          // Dispatch action to add emotion record to Redux store
          dispatch(addEmotionRecord({
            image: image,
            emotion: data.message,
            emotionText: emotionDetailsResponse.description,
            tipsAndRecs: emotionDetailsResponse.tipsAndRecs,
            timestamp: currentTimestamp.getTime(),
          }));
        } else {
          throw new Error('Invalid emotion details response');
        }
      } else {
        setAnalysisResult({ emotion: data.message, emoji: '❓' });
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      setAnalysisResult({ emotion: 'Failed to analyze image. Please try again.', emoji: '❓' });
    } finally {
      setAnalyzing(false);
    }
  };
  
  const getEmotionDetails = async (emotion) => {
    try {
      const response = await fetch(url + '/get-emotion-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emotion }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to get emotion details');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting emotion details:', error);
      return null;
    }
  };
  const handleNewPicture = () => {
    setImage(null);
    setAnalysisResult(null);
    setEmotionDetails(null);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    return timestamp.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#060606]">
      <View className="flex-row justify-between items-center p-4">
        <Text className="text-white text-lg">👋 Hi {'Syed'}!</Text>
        <TouchableOpacity className="bg-[#FFFC9F] w-10 h-10 rounded-full items-center justify-center">
          <Text className="text-black font-bold">ST</Text>
        </TouchableOpacity>
      </View>
      
      <View className="flex-1 justify-center items-center">
        {analyzing ? (
          <View className="items-center">
            <ActivityIndicator size="large" color="#FBF79C" />
            <Text className="mt-5 text-white">Analyzing your cat 🐈...</Text>
          </View>
        ) : image ? (
          <ScrollView className="w-full flex gap-4 p-4" contentContainerStyle={{ alignItems: 'center', paddingVertical: 20 }}>
            <View className="w-full flex flex-row items-baseline justify-between">
              <Text className="text-white text-2xl font-bold">📈 Analysis</Text>
              {analysisTimestamp && (
                <Text className="text-gray-700 text-sm mt-1">{formatTimestamp(analysisTimestamp)}</Text>
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
                    {analysisResult.emoji} {petName} is {analysisResult.emotion}
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
        ) : (
          <View className=" flex items-center gap-4">
            <TouchableOpacity 
              className="bg-[#FBF79C] py-3 px-5 rounded-lg "
              onPress={() => handleImageSelection('camera')}
            >
              <Text className="text-black font-bold">Take a picture</Text>
            </TouchableOpacity>
            <Text className="text-white">OR</Text>
            <TouchableOpacity 
              className="bg-[#FBF79C] py-3 px-5 rounded-lg"
              onPress={() => handleImageSelection('library')}
            >
              <Text className="text-black font-bold">Choose from library</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {image && analysisResult && (
        <TouchableOpacity 
          className="absolute bottom-8 right-8 bg-[#FBF79C] w-12 h-12 rounded-full items-center justify-center shadow-lg"
          onPress={handleNewPicture}
        >
          <Text className="text-black text-3xl">+</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}