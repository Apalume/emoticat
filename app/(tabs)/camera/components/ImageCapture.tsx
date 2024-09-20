import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { setStage, setImage, analyzeImage } from '@/src/store/cameraFlowSlice';
import { RootState } from '@/src/store';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useImageLoader } from '@/hooks/useImageLoader';

export default function ImageCapture() {
  const dispatch = useAppDispatch();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const selectedPetId = useAppSelector((state: RootState) => state.cameraFlow.selectedPet);
  const pets = useAppSelector((state: RootState) => state.pet.pets);
  const selectedPet = pets.find(pet => pet.id === selectedPetId);

  const { imageUri, loading } = useImageLoader(selectedPet?.image_key || null);

  const handleImageSelection = async (type: 'camera' | 'library') => {
    setError(null);
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    };

    const result = type === 'camera' 
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);
  
    if (!result.canceled) {
      setAnalyzing(true);
      try {
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 512, height: 512 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );

        dispatch(setImage(result.assets[0].uri));
        const analysisResult = await dispatch(analyzeImage({ 
          image: manipulatedImage.base64, 
          petId: selectedPetId 
        })).unwrap();

        if (!analysisResult || analysisResult.message.startsWith('ERROR:')) {
          throw new Error(analysisResult?.message || 'Analysis failed');
        }
        dispatch(setStage('analysisResult'));
      } catch (err) {
        setError(err.message || 'An error occurred during analysis');
      } finally {
        setAnalyzing(false);
      }
    }
  };

  const handleCancelSelection = () => {
    dispatch(setStage('petSelection'));
  };

  const calculateAge = (birthday) => {
    if (!birthday) return 'Unknown';
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };
  
  const getRecentMood = (pet) => {
    if (!pet.emotionHistory || pet.emotionHistory.length === 0) return 'No mood data';
    const latestMood = pet.emotionHistory[0];
    const timeDiff = Date.now() - new Date(latestMood.timestamp).getTime();
    const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
    return `${latestMood.emotion} (${hoursAgo} hours ago)`;
  };
  
  if (analyzing) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Image source={{ uri: selectedImage }} className="w-64 h-64 rounded-lg mb-4" />
        <ActivityIndicator size="large" color="#FBF79C" />
        <Text className="text-white text-lg mb-4 mt-4">{`Analyzing your cat's emeowtion...`}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-between p-4">
      <View className="items-center w-full">
        {selectedPet && (
          <>
            <Text className="text-white text-xl mb-4">Selected Pet</Text>
            <View className="p-4 rounded-2xl flex flex-row items-center w-full bg-[#272727] mb-4">
              {loading ? (
                <View className="w-32 h-32 rounded-2xl mr-4 bg-gray-600 justify-center items-center">
                  <Text className="text-white">Loading...</Text>
                </View>
              ) : imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  className="w-32 h-32 rounded-2xl mr-4"
                />
              ) : (
                <View className="w-32 h-32 rounded-2xl mr-4 bg-gray-600 justify-center items-center">
                  <Text className="text-white">No Image</Text>
                </View>
              )}
              <View>
                <Text className="font-bold text-lg text-white">{selectedPet.name}</Text>
                <Text className="text-white">Age: {calculateAge(selectedPet.birthday)}</Text>
                <Text className="text-white">Breed: {selectedPet.breed || 'Unknown'}</Text>
                <Text className="text-white">Recent mood: {getRecentMood(selectedPet)}</Text>
              </View>
            </View>
          </>
        )}
         {error && (
          <View className="bg-red-500 p-4 rounded-lg mb-4 w-full">
            <Text className="text-white text-center">{error}</Text>
          </View>
        )}
        <TouchableOpacity 
          className="bg-[#FBF79C] py-3 px-5 rounded-lg mb-4"
          onPress={() => handleImageSelection('camera')}
        >
          <Text className="text-black font-bold">Take a picture</Text>
        </TouchableOpacity>
        <Text className="text-white mb-4">OR</Text>
        <TouchableOpacity 
          className="bg-[#FBF79C] py-3 px-5 rounded-lg"
          onPress={() => handleImageSelection('library')}
        >
          <Text className="text-black font-bold">Choose from library</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        className="border border-[#FBF79C] py-4 rounded-2xl w-full"
        onPress={handleCancelSelection}
      >
        <Text className="text-[#FBF79C] font-bold text-center">Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}