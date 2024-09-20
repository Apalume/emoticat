import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';

interface AllMoodsModalProps {
  visible: boolean;
  onClose: () => void;
  moods: [string, number][] | undefined;
}

const AllMoodsModal: React.FC<AllMoodsModalProps> = ({ visible, onClose, moods }) => {
  const emotionColorMap = {
    "Content": "#FFE0CC", "Happy": "#FFDCE2", "Curious": "#D5F5C4", "Affectionate": "#D7FAFE",
    "Scared": "#FFE8D6", "Aggressive": "#FFD6D6", "Annoyed": "#F0E6FF", "Anxious": "#E6F9FF",
    "Sad": "#E6E6FF", "Bored": "#FFF0E6", "Sleepy": "#E6FFE6"
  };

  const maxCount = moods ? Math.max(...moods.map(([, c]) => c)) : 0;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
    >
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
        <View className="bg-[#1D1D1D] p-4 rounded-2xl w-[90%] max-h-[80%]">
          <Text className="text-white text-xl font-bold mb-4">All Moods</Text>
          <ScrollView>
            {moods && moods.length > 0 ? (
              moods.map(([mood, count]) => (
                <View key={mood} className="flex-row items-center mb-4">
                  <View 
                    style={{
                      width: `${(count / maxCount) * 100}%`,
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
              ))
            ) : (
              <Text className="text-white">No mood data available.</Text>
            )}
          </ScrollView>
          <TouchableOpacity 
            className="bg-[#FFFC9F] py-2 px-4 rounded-lg mt-4"
            onPress={onClose}
          >
            <Text className="text-black font-bold text-center">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AllMoodsModal;