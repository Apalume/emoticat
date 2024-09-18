import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Link } from 'expo-router';
import { useAppSelector } from '@/src/store/hooks';
import ModalScreen from './modal';

const Dashboard = () => {
  const pets = useAppSelector((state) => state.pet.pets);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
    <SafeAreaView className="flex-1 bg-[#060606]">

      <View className="flex-row justify-between items-center p-4">
        <Text className="text-white text-lg">👋 Hi {'There'}!</Text>
        <TouchableOpacity className="bg-[#FFFC9F] w-10 h-10 rounded-full items-center justify-center">
          <Text className="text-black font-bold">ST</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4">
        <Text className="text-white text-2xl font-bold my-4">Dashboard</Text>
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-white text-lg">🐈 Your Pets</Text>
            <TouchableOpacity
              onPress={() => setIsModalVisible(true)}
              className="border border-[#FFFC9F] rounded-xl px-2 py-1 active:opacity-90"
            >
              <Text className="text-[#FFFC9F]">+ Add a pet</Text>
            </TouchableOpacity>
          </View>
          {pets.length === 0 ? (
            <Text className="text-white text-center mt-4">
              Add a pet using the add pet button to get started!
            </Text>
          ) : (
            pets.map((pet, index) => (
              <Link key={index} href={`/dashboard/pet-history?index=${index}`} asChild>
                <TouchableOpacity className="flex-row my-4 bg-[#1D1D1D] p-4 rounded-2xl">
                  <Image 
                    source={{ uri: pet.coverPicture || 'https://placekitten.com/200/200' }} 
                    className="w-20 h-20 rounded-2xl mr-4"
                  />
                  <View>
                    <Text className="text-white text-xl font-bold">{pet.name}</Text>
                    <Text className="text-white">Age: {calculateAge(pet.birthday)}</Text>
                    <Text className="text-white">Breed: {pet.breed || 'Unknown'}</Text>
                    <Text className="text-white">Recent mood: {getRecentMood(pet)}</Text>
                  </View>
                </TouchableOpacity>
              </Link>
            ))
          )}
        </View>
      </ScrollView>
      {isModalVisible && (
        <ModalScreen
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
      )}
    </SafeAreaView>
  );
};

export default Dashboard;