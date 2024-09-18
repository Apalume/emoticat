import React, { useState } from 'react';
import { SafeAreaView, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAppSelector } from '@/src/store/hooks';
import AllMoodsModal from './AllMoodsModal';

const PetHistory = () => {
  const { index } = useLocalSearchParams();
  const pets = useAppSelector((state) => state.pet.pets);
  const pet = pets[Number(index)];
  const emotionHistory = pet?.emotionHistory || [];
  const [showAllMoods, setShowAllMoods] = useState(false);

  const calculateAge = (birthday) => {
    if (!birthday) return 'Unknown';
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const getRecentMood = () => {
    if (emotionHistory.length === 0) return 'No mood data';
    const latestMood = emotionHistory[0];
    const timeDiff = Date.now() - new Date(latestMood.timestamp).getTime();
    const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
    return `${latestMood.emotion} (${hoursAgo} hours ago)`;
  };

  const getTopMoods = () => {
    const moodCounts = emotionHistory.reduce((acc, record) => {
      acc[record.emotion] = (acc[record.emotion] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  };

  const emotionEmojiMap = {
    "Content": "😺", "Happy": "😸", "Curious": "🐱", "Affectionate": "😽",
    "Scared": "🙀", "Aggressive": "😾", "Annoyed": "😼", "Anxious": "😿",
    "Sad": "😿", "Bored": "🐈", "Sleepy": "😴"
  };

  const emotionColorMap = {
    "Content": "#FFE0CC", "Happy": "#FFDCE2", "Curious": "#D5F5C4", "Affectionate": "#D7FAFE",
    "Scared": "#FFE8D6", "Aggressive": "#FFD6D6", "Annoyed": "#F0E6FF", "Anxious": "#E6F9FF",
    "Sad": "#E6E6FF", "Bored": "#FFF0E6", "Sleepy": "#E6FFE6"
  };

  if (!pet) {
    return (
      <View className="flex-1 justify-center items-center bg-[#060606]">
        <Text className="text-white text-lg">Pet not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#060606]">
      <View className="flex-row justify-between items-center p-4">
        <Text className="text-white text-lg">👋 Hi {'Syed'}!</Text>
        <TouchableOpacity className="bg-[#FFFC9F] w-10 h-10 rounded-full items-center justify-center">
          <Text className="text-black font-bold">ST</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="flex-row my-4 bg-[#1D1D1D] p-4 rounded-2xl">
          <Image 
            source={{ uri: pet.coverPicture || 'https://placekitten.com/200/200' }} 
            className="w-20 h-20 rounded-2xl mr-4"
          />
          <View>
            <Text className="text-white text-xl font-bold">{pet.name}</Text>
            <Text className="text-white">Age: {calculateAge(pet.birthday)}</Text>
            <Text className="text-white">Breed: {pet.breed || 'Unknown'}</Text>
            <Text className="text-white">Recent mood: {getRecentMood()}</Text>
          </View>
        </View>

        <Text className="text-white text-xl font-bold mt-6 mb-2">Mood History</Text>
        {emotionHistory.length > 0 ? (
          <View className="border-l-2 border-white p-4">
              {getTopMoods().slice(0, 3).map(([mood, count], index) => (
                <View key={mood} className="flex-row items-center mb-4">
                  <View 
                    style={{
                      width: `${(count / Math.max(...getTopMoods().map(([, c]) => c))) * 100}%`,
                      height: 30,
                      backgroundColor: emotionColorMap[mood] || '#1D1D1D',
                      borderRadius: 5,
                      justifyContent: 'center',
                      paddingLeft: 8,
                    }}
                  >
                    <Text className="text-black font-bold">{`${mood} (${count})`}</Text>
                  </View>
                </View>
              ))}
            {getTopMoods().length > 3 && (
              <TouchableOpacity 
                className="bg-[#D7FAFE] py-2 px-4 rounded-lg mt-2"
                onPress={() => setShowAllMoods(true)}
              >
                <Text className="text-black font-bold text-center">See More</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Text className="text-white">
            {`No mood history available. Navigate to the Camera tab to start tracking your pet's moods!`}
          </Text>
        )}

      <Text className="text-white text-xl font-bold mt-6 mb-2">Mood Details</Text>
      {emotionHistory.length > 0 ? (
        <View className="flex-row flex-wrap justify-between">
        {Object.entries(emotionEmojiMap).map(([emotion, emoji]) => {
          const count = emotionHistory.filter(record => record.emotion === emotion).length;
          if (count === 0) return null;
          const latestImage = emotionHistory.find(record => record.emotion === emotion)?.image;
          return (
            <View 
              key={emotion} 
              className="w-[48%] rounded-lg p-2 mb-4"
              style={{ backgroundColor: emotionColorMap[emotion] || '#1D1D1D' }}
            >
              <Image 
                source={{ uri: latestImage || 'https://placekitten.com/100/100' }} 
                className="w-full h-24 rounded-lg mb-2"
              />
              <Text className="text-black font-bold">{emoji} {emotion} ({count})</Text>
            </View>
          );
        })}
      </View>
      ) : (
        <Text className="text-white">
       {` No mood details available. Use the Camera tab to capture and analyze your pet's emotions!`}
      </Text>
      )}
      </ScrollView>
      <AllMoodsModal
        visible={showAllMoods}
        onClose={() => setShowAllMoods(false)}
        moods={getTopMoods()}
      />
    </SafeAreaView>
  );
};

export default PetHistory;