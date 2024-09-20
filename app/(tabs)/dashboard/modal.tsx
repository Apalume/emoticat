import React, { useState } from 'react';
import { useAppDispatch } from '@/src/store/hooks';
import { View, Text, TextInput, TouchableOpacity, Platform, Image, TouchableWithoutFeedback, KeyboardAvoidingView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { Modal as RNModal } from 'react-native';
import { addPet as addPetApi } from '@/src/api/catApi';
import { addPet } from '@/src/store/petSlice';

export default function ModalScreen({ visible, onClose }) {
  const dispatch = useAppDispatch();
  const [modalVisible, setModalVisible] = useState(visible);
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [breed, setBreed] = useState('');
  const [image, setImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthday;
    setBirthday(currentDate);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Resize and compress the image
      const manipResult = await manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 1000 } }],
        { compress: 0.8, format: SaveFormat.JPEG }
      );
      setImage(manipResult.uri);
    }
  };

  const handleSave = async () => {
    try {
      if (!image) {
        Alert.alert('Error', 'Please select an image');
        return;
      }
  
      const petData = {
        name,
        breed,
        birthday: birthday.toISOString(),
        image,
      };
  
      const response = await addPetApi(petData);
      
      if (response && response.pet && response.pet.image_key) {
        // Dispatch the addPet action with the pet data
        dispatch(addPet(response.pet));
        
        Alert.alert('Success', 'Pet added successfully');
        onClose();
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error adding pet:', error);
      Alert.alert('Error', `Failed to add pet: ${error.message}`);
    }
  };

  return (
    <RNModal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
        onClose();
      }}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
        activeOpacity={1}
        onPress={() => onClose()}
      >
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <TouchableWithoutFeedback>
            <View className="bg-[#1D1D1D] rounded-t-3xl p-6 pb-10 mt-auto">
              <Text className="text-white text-2xl font-bold mb-2">🐈 Pet Info</Text>
              <Text className="text-white text-lg mb-6">{`Let's get your pet profile setup`}</Text>

              {image ? (
                <>
                  <TouchableOpacity className="border border-[#FFFC9F] rounded-2xl py-1 mb-2" onPress={pickImage}>
                    <Text className="text-[#FFFC9F] py-1 w-full text-center ">Edit picture</Text>
                  </TouchableOpacity>
                  <Image source={{ uri: image }} className="w-full h-60 rounded-lg mb-4" />
                </>
              ) : (
                <TouchableOpacity className="text-white p-4 rounded-2xl mb-4 focus:border bg-[#272727] focus:border-[#FFFC9F] items-center" onPress={pickImage}>
                  <Text className="text-white">+ Add Pet Picture (Required)</Text>
                </TouchableOpacity>
              )}

              <TextInput
                className="text-white p-4 rounded-2xl mb-4 focus:border bg-[#272727] focus:border-[#FFFC9F]"
                placeholder="Pet Name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
              />

              <TouchableOpacity
                className="text-white p-4 rounded-2xl mb-4 focus:border bg-[#272727] focus:border-[#FFFC9F]"
                onPress={() => setShowDatePicker(!showDatePicker)}
              >
                <Text className="text-white ">{birthday.toDateString()}</Text>
                {showDatePicker && (
                  <DateTimePicker
                    value={birthday}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    textColor="#FFFFFF"
                    style={{ backgroundColor: '#1D1D1D' }}
                  />
                )}
              </TouchableOpacity>

              <View className="flex-row items-center mb-4 bg-[#272727] rounded-2xl">
                <TextInput
                  className="text-white p-4 flex-grow"
                  placeholder="Breed"
                  placeholderTextColor="#999"
                  value={breed}
                  onChangeText={setBreed}
                />
                <TouchableOpacity
                  className="p-2 rounded-xl bg-[#313131] mr-2"
                  onPress={() => alert("If you don't enter a breed, we can detect a breed based on the picture provided.")}
                >
                  <Text className="text-[#FFFC9F] font-bold text-md">i</Text>
                </TouchableOpacity>
              </View>

              <View className="flex flex-row">
                <TouchableOpacity
                  className="bg-[#FFFC9F] p-4 rounded-2xl flex-grow mr-2"
                  onPress={handleSave}
                >
                  <Text className="text-black text-center font-bold">Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="border border-[#FFFC9F] p-4 rounded-2xl"
                  onPress={() => onClose()}
                >
                  <Text className="text-white text-center">Cancel</Text>
                </TouchableOpacity>
              </View>

              <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </RNModal>
  );
}