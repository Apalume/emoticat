import React from 'react';
import { SafeAreaView, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useAppSelector } from '@/src/store/hooks';
import { BarChart } from 'react-native-chart-kit';

const PetHistory = () => {
  const pet = useAppSelector((state) => state.pet);
  const emotionHistory = pet.emotionHistory;

  const calculateAge = (birthday) => {
    if (!birthday) return 'Unknown';
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const getRecentMood = () => {
    if (emotionHistory.length === 0) return 'No mood data';
    const latestMood = emotionHistory[0];
    const timeDiff = Date.now() - latestMood.timestamp;
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

  return (
    <SafeAreaView className="flex-1 bg-[#060606]">

      <View className="flex-row justify-between items-center p-4">
        <Text className="text-white text-lg">👋 Hi {'Syed'}!</Text>
        <TouchableOpacity className="bg-[#FFFC9F] w-10 h-10 rounded-full items-center justify-center">
          <Text className="text-black font-bold">ST</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="flex-row my-4">
          <Image 
            source={{ uri: pet.coverPicture || 'https://placekitten.com/200/200' }} 
            className="w-20 h-20 rounded-full mr-4"
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
            <BarChart
              data={{
                labels: getTopMoods().map(([mood]) => mood),
                datasets: [{
                  data: getTopMoods().map(([, count]) => count)
                }]
              }}
              width={300}
              height={220}
              yAxisLabel=""
              chartConfig={{
                backgroundColor: '#1e1e1e',
                backgroundGradientFrom: '#1e1e1e',
                backgroundGradientTo: '#1e1e1e',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          ) : (
            <Text className="text-white">No mood history available.</Text>
          )}
      <Text className="text-white text-xl font-bold mt-6 mb-2">Mood Details</Text>
      {emotionHistory.length > 0 ? (
        <View className="flex-row flex-wrap justify-between">
          {Object.entries(emotionEmojiMap).map(([emotion, emoji]) => {
            const count = emotionHistory.filter(record => record.emotion === emotion).length;
            if (count === 0) return null;
            const latestImage = emotionHistory.find(record => record.emotion === emotion)?.image;
            return (
              <View key={emotion} className="w-[48%] bg-gray-800 rounded-lg p-2 mb-4">
                <Image 
                  source={{ uri: latestImage || 'https://placekitten.com/100/100' }} 
                  className="w-full h-24 rounded-lg mb-2"
                />
                <Text className="text-white font-bold">{emoji} {emotion} ({count})</Text>
              </View>
            );
          })}
        </View>
      ) : (
        <Text className="text-white">No mood details available.</Text>
      )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PetHistory;