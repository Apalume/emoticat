import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';;
import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { RootState } from '@/src/store';
import { setSelectedPet, setStage } from '@/src/store/cameraFlowSlice';
import { useImageLoader } from '@/hooks/useImageLoader';

export default function PetSelection() {
  const dispatch = useAppDispatch();
  const pets = useAppSelector((state: RootState) => state.pet.pets);
  const selectedPetId = useAppSelector((state) => state.cameraFlow.selectedPet);

  const handleSelectPet = (id: number) => {
    console.log(id)
    dispatch(setSelectedPet(id));
  };

  const handleContinue = () => {
    dispatch(setStage('imageCapture'));
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


  return (
    <View className="p-4 rounded-2xl mb-4 w-full flex-grow">
      <Text className="text-white text-lg mb-2 text-center">Select a pet to continue</Text>
      <ScrollView>
        <View className="flex-row flex-wrap">
          {pets.map((pet) => {
            const { imageUri, loading } = useImageLoader(pet.image_key);
            const isSelected = selectedPetId === pet.id;
            return (
              <TouchableOpacity 
                key={pet.id}
                className={`p-4 rounded-2xl m-1 flex flex-row items-center w-[90vw] ${isSelected ? 'bg-[#FFFC9F]' : 'bg-[#272727]'}`}
                onPress={() => handleSelectPet(pet.id)}
              >
                {loading ? (
                  <View className="w-20 h-20 rounded-2xl mr-4 bg-gray-600 justify-center items-center">
                    <Text className="text-white">Loading...</Text>
                  </View>
                ) : imageUri ? (
                  <Image 
                    source={{ uri: imageUri }}
                    className="w-20 h-20 rounded-2xl mr-4"
                  />
                ) : (
                  <View className="w-20 h-20 rounded-2xl mr-4 bg-gray-600 justify-center items-center">
                    <Text className="text-white">No Image</Text>
                  </View>
                )}
                <View>
                  <Text className={`text-xl font-bold ${isSelected ? 'text-black' : 'text-white'}`}>{pet.name}</Text>
                  <Text className={isSelected ? 'text-black' : 'text-white'}>Age: {calculateAge(pet.birthday)}</Text>
                  <Text className={isSelected ? 'text-black' : 'text-white'}>Breed: {pet.breed || 'Unknown'}</Text>
                  <Text className={isSelected ? 'text-black' : 'text-white'}>Recent mood: {getRecentMood(pet)}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      {selectedPetId !== null && (
        <TouchableOpacity 
          className="bg-[#FBF79C] py-4 rounded-2xl mt-4 self-center w-full absolute bottom-0"
          onPress={handleContinue}
        >
          <Text className="text-black font-bold text-center">Continue</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}