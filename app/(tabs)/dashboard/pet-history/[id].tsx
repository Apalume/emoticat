import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { getPetDetails } from '@/src/api/catApi';
import { useImageLoader } from '@/hooks/useImageLoader';
import AllMoodsModal from './AllMoodsModal';
import { MoodDetailItem } from './MoodDetailItem';

const emotionColorMap = {
  "Content": "#FFE0CC", "Happy": "#FFDCE2", "Curious": "#D5F5C4", "Affectionate": "#D7FAFE",
  "Scared": "#FFE8D6", "Aggressive": "#FFD6D6", "Annoyed": "#F0E6FF", "Anxious": "#E6F9FF",
  "Sad": "#E6E6FF", "Bored": "#FFF0E6", "Sleepy": "#E6FFE6"
};

const emotionEmojiMap = {
  "Content": "😌", "Happy": "😊", "Curious": "🧐", "Affectionate": "😍",
  "Scared": "😨", "Aggressive": "😠", "Annoyed": "😒", "Anxious": "😰",
  "Sad": "😢", "Bored": "😑", "Sleepy": "😴"
};

export default function PetHistory() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllMoods, setShowAllMoods] = useState(false);

  const { imageUri, loading: imageLoading } = useImageLoader(pet?.image_key || null);

  useEffect(() => {
    const fetchPetDetails = async () => {
      if (!id) {
        setError('No pet ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const petDetails = await getPetDetails(Number(id));
        setPet(petDetails);
      } catch (err) {
        console.error('Error fetching pet details:', err);
        setError('Failed to load pet details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPetDetails();
  }, [id]);

  const calculateAge = (birthday: string) => {
    if (!birthday) return 'Unknown';
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const getRecentMood = () => {
    if (!pet?.emotionHistory || pet.emotionHistory.length === 0) return 'No mood data';
    const latestMood = pet.emotionHistory[0];
    const timeDiff = Date.now() - new Date(latestMood.timestamp).getTime();
    const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
    return `${latestMood.emotion} (${hoursAgo} hours ago)`;
  };

  const getTopMoods = () => {
    if (!pet?.emotionHistory) return [];
    const counts = pet.emotionHistory.reduce((acc, record) => {
      acc[record.emotion] = (acc[record.emotion] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-white">Loading pet details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-white">{error}</Text>
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
          {imageLoading ? (
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
            <Text className="text-white">Recent mood: {getRecentMood()}</Text>
          </View>
        </View>

        <Text className="text-white text-xl font-bold mt-6 mb-2">Mood History</Text>
        {pet.emotionHistory && pet.emotionHistory.length > 0 ? (
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
            No mood history available. Navigate to the Camera tab to start tracking your pet's moods!
          </Text>
        )}

        <Text className="text-white text-xl font-bold mt-6 mb-2">Mood Details</Text>
        {pet.emotionHistory && pet.emotionHistory.length > 0 ? (
          <View className="flex-row flex-wrap justify-between">
            {Object.entries(emotionEmojiMap).map(([emotion, emoji]) => {
              const count = pet.emotionHistory.filter(record => record.emotion === emotion).length;
              const latestImage = pet.emotionHistory
                                     .filter(record => record.emotion === emotion)
                                     .reduce((latest, current) => {
                                        if (!latest || (current.timestamp > latest.timestamp)) {
                                          return current;
                                        }
                                        return latest;
                                      }, null as EmotionRecord | null)?.image_key || null;

              return (
                <MoodDetailItem
                  key={emotion}
                  emotion={emotion}
                  emoji={emoji}
                  count={count}
                  imageKey={latestImage || null}
                  backgroundColor={emotionColorMap[emotion] || '#1D1D1D'}
                />
              );
            })}
        </View>
        ) : (
          <Text className="text-white">
            No mood details available. Use the Camera tab to capture and analyze your pet's emotions!
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
}