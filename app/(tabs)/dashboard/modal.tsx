import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Platform, Image } from 'react-native';
import { Link, router} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

export default function Modal() {

  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [breed, setBreed] = useState('');
  const [image, setImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthday;
    setShowModal(Platform.OS === 'ios');
    setBirthday(currentDate);
  };
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    router.back();
  };

  return (
    <View className="flex-1 bg-[#1D1D1D] p-6 flex justify-end">
      <Text className="text-white text-2xl font-bold mb-2">🐈 Pet Info</Text>
      <Text className="text-white text-lg mb-6">{`Let's get your pet profile setup`}</Text>

      {image ? (
        <TouchableOpacity className="mb-6 items-center" onPress={pickImage}>
          <Image source={{ uri: image }} className="w-full h-60 rounded-lg" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity className="bg-gray-800 p-4 rounded-lg mb-6 items-center" onPress={pickImage}>
          <Text className="text-white">+ Add Pet Picture</Text>
        </TouchableOpacity>
      )}

      <TextInput
        className="bg-gray-800 text-white p-4 rounded-lg mb-4"
        placeholder="Pet Name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />

<TouchableOpacity
        className="bg-gray-800 p-4 rounded-lg mb-4"
        onPress={() => setShowModal(true)}
      >
        <Text className="text-white">{birthday.toDateString()}</Text>
      </TouchableOpacity>

      {Platform.OS === 'ios' ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <View className="flex-1 justify-end bg-black bg-opacity-50">
            <View className="bg-white rounded-t-lg p-4">
              <DateTimePicker
                value={birthday}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
              />
              <TouchableOpacity
                className="bg-gray-800 p-4 rounded-lg mt-4"
                onPress={() => setShowModal(false)}
              >
                <Text className="text-white text-center">Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ) : (
        showModal && (
          <DateTimePicker
            value={birthday}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )
      )}

      <TextInput
        className="bg-gray-800 text-white p-4 rounded-lg mb-6"
        placeholder="Breed"
        placeholderTextColor="#999"
        value={breed}
        onChangeText={setBreed}
      />

      <TouchableOpacity
        className="bg-yellow-400 p-4 rounded-lg mb-4"
        onPress={handleSave}
      >
        <Text className="text-black text-center font-bold">Save</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-gray-700 p-4 rounded-lg"
        onPress={() => router.back()}
      >
        <Text className="text-white text-center">Cancel</Text>
      </TouchableOpacity>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}