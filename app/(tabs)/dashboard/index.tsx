import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { setAllPets } from '@/src/store/petSlice';
import { getAllPets } from '@/src/api/catApi';
import ModalScreen from './modal';
import { PetItem } from './petItem';

const Dashboard = () => {
  const pets = useAppSelector((state) => state.pet.pets);
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchPets = useCallback(async (forceRefresh = false) => {
    try {
      const fetchedPets = await getAllPets(forceRefresh);
      dispatch(setAllPets(fetchedPets));
    } catch (error) {
      console.error('Error fetching pets:', error);
      // Optionally, show an error message to the user
    }
  }, [dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPets(true); // Force refresh from server
    setRefreshing(false);
  }, [fetchPets]);
  

  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  return (
    <SafeAreaView className="flex-1 bg-[#060606]">

      <View className="flex-row justify-between items-center p-4">
        <Text className="text-white text-lg">👋 Hi {'There'}!</Text>
        <TouchableOpacity className="bg-[#FFFC9F] w-10 h-10 rounded-full items-center justify-center">
          <Text className="text-black font-bold">ST</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
              <PetItem key={pet.id} pet={pet} index={index} />
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