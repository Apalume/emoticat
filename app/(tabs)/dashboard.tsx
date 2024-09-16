import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useAppSelector } from '@/src/store/hooks';

const Dashboard = () => {
  const pet = useAppSelector((state) => state.pet);

  const calculateAge = (birthday) => {
    if (!birthday) return 'Unknown';
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#060606]">
      <View className="flex-row justify-between items-center p-4">
        <Text className="text-white text-lg">👋 Hi {pet.name || 'there'}!</Text>
        <TouchableOpacity className="bg-[#FFFC9F] w-10 h-10 rounded-full items-center justify-center">
          <Text className="text-black font-bold">ST</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView className="flex-1 px-4">
        <Text className="text-white text-2xl font-bold my-4">Dashboard</Text>
        
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-white text-lg">🐈 Your Pets</Text>
            <TouchableOpacity>
              <Text className="text-[#FFFC9F]">+ Add a pet</Text>
            </TouchableOpacity>
          </View>
          <Link href="/dashboard/pet-history" asChild>
            <TouchableOpacity className="bg-gray-800 p-4 rounded-lg mb-2">
              <Text className="text-white font-bold">{pet.name}</Text>
              <Text className="text-white">Breed: {pet.breed || 'Unknown'}</Text>
              <Text className="text-white">Age: {calculateAge(pet.birthday)}</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;