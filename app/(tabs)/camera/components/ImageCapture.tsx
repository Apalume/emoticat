import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/src/store/hooks';
import { setStage, setImage, analyzeImage } from '@/src/store/cameraFlowSlice';
import { RootState } from '@/src/store';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export default function ImageCapture() {
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const selectedPet = useAppSelector((state: RootState) => state.cameraFlow.selectedPet);
  const pets = useAppSelector((state: RootState) => state.pet.pets);

  const compressAndResizeImage = async (uri: string) => {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 512, height: 512 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );
    return manipulatedImage.base64;
  };

  const handleImageSelection = async (type: 'camera' | 'library') => {
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
      setSelectedImage(result.assets[0].uri);
      setAnalyzing(true);
      dispatch(setImage(result.assets[0].uri));
      const compressedImage = await compressAndResizeImage(result.assets[0].uri);
      dispatch(analyzeImage(compressedImage));
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
    if (pet.emotionHistory.length === 0) return 'No mood data';
    const latestMood = pet.emotionHistory[0];
    const timeDiff = Date.now() - new Date(latestMood.timestamp).getTime();
    const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
    return `${latestMood.emotion} (${hoursAgo} hours ago)`;
  };
  
  
  if (analyzing) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Image source={{ uri: selectedImage }} className="w-64 h-64 rounded-lg mb-4" />
        <Text className="text-white text-lg mb-4">Analyzing your cat's emeowtion...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-between p-4">
      <View className="items-center">
        {selectedPet !== null && pets[selectedPet] && (
          <>
          <Text className="text-white text-xl mb-4">Selected Pet</Text>
          <View 
            className={`p-4 rounded-2xl flex flex-row items-center w-full bg-[#272727] mb-4 w-full`}
          >
            <Image
              source={{ uri: pets[selectedPet].coverPicture || 'https://via.placeholder.com/100' }}
              className="w-32 h-32 rounded-2xl mr-2"
            />
            <View>
              <Text className="font-bold text-lg text-white">{pets[selectedPet].name}</Text>
              <Text className="text-white">Age: {calculateAge(pets[selectedPet].birthday)}</Text>
              <Text className="text-white">Breed: {pets[selectedPet].breed || 'Unknown'}</Text>
              <Text className="text-white">Recent mood: {getRecentMood(pets[selectedPet])}</Text>
            </View>
          </View>
          </>
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