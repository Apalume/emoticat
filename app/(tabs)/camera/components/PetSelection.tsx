import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/src/store/hooks';
import { RootState } from '@/src/store';
import { setSelectedPet, setStage } from '@/src/store/cameraFlowSlice';

export default function PetSelection() {
  const dispatch = useDispatch();
  const pets = useAppSelector((state: RootState) => state.pet.pets);
  const selectedPet = useAppSelector((state: RootState) => state.cameraFlow.selectedPet);

  const handleSelectPet = (index: number) => {
    dispatch(setSelectedPet(index));
  };

  const handleContinue = () => {
    dispatch(setStage('imageCapture'));
  };

    const getRecentMood = (pet) => {
    if (pet.emotionHistory.length === 0) return 'No mood data';
    const latestMood = emotionHistory[0];
    const timeDiff = Date.now() - new Date(latestMood.timestamp).getTime();
    const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
    return `${latestMood.emotion} (${hoursAgo} hours ago)`;
  };

  const calculateAge = (birthday) => {
    if (!birthday) return 'Unknown';
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };


  return (
    <View className="p-4 rounded-2xl mb-4 w-full flex-grow">
      <Text className="text-white text-lg mb-2 text-center">Select a pet to continue</Text>
      <ScrollView>
        <View className="flex-row flex-wrap px-2">
          {pets.map((item, index) => (
            <TouchableOpacity 
              key={index}
              className={`p-2 rounded-2xl m-1 flex flex-row items-center w-full ${selectedPet === index ? 'bg-[#FFFC9F]' : 'bg-[#272727]'}`}
              onPress={() => handleSelectPet(index)}
            >
              <Image
                source={{ uri: item.coverPicture || 'https://via.placeholder.com/100' }}
                className="w-32 h-32 rounded-2xl mr-2"
              />
              <View>
                <Text className={`font-bold text-lg ${selectedPet === index ? 'text-black' : 'text-white'}`}>{item.name}</Text>
                <Text className={`${selectedPet === index ? 'text-black' : 'text-white'}`}>Age: {calculateAge(item.birthday)}</Text>
                <Text className={`${selectedPet === index ? 'text-black' : 'text-white'}`}>Breed: {item.breed || 'Unknown'}</Text>
                <Text className={`${selectedPet === index ? 'text-black' : 'text-white'}`}>Recent mood: {getRecentMood(item)}</Text>
              </View>
            </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
      {selectedPet !== null && (
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