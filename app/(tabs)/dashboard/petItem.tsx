import { Link } from 'expo-router';
import { useImageLoader } from '@/hooks/useImageLoader';
import { View, Text, TouchableOpacity, Image } from 'react-native';

export const PetItem = ({ pet }) => {
    const { imageUri, loading } = useImageLoader(pet.image_key);
  
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
      <Link key={pet.id} href={`/dashboard/pet-history/${pet.id}`} asChild>
        <TouchableOpacity className="flex-row my-2 bg-[#1D1D1D] p-4 rounded-2xl">
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
            <Text className="text-white text-xl font-bold">{pet.name}</Text>
            <Text className="text-white">Age: {calculateAge(pet.birthday)}</Text>
            <Text className="text-white">Breed: {pet.breed || 'Unknown'}</Text>
            <Text className="text-white">Recent mood: {getRecentMood(pet)}</Text>
          </View>
        </TouchableOpacity>
      </Link>
    );
  };