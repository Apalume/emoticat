import React, { useState, useEffect, useCallback } from 'react';
import { useAppDispatch } from '@/src/store/hooks';
import { View, Text, TextInput, TouchableOpacity, Platform, Image, TouchableWithoutFeedback, KeyboardAvoidingView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { Modal as RNModal } from 'react-native';
import { updatePet as updatePetApi } from '@/src/api/catApi';
import { updatePet, fetchPetDetails } from '@/src/store/petSlice';

interface EditPetModalProps {
  visible: boolean;
  onClose: () => void;
  pet: {
    id: number;
    name: string;
    breed: string;
    birthday: string;
    image_key: string;
  };
  image: string;
}


export default function EditPetModal({ visible, onClose, pet, image }) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState(pet.name);
  const [birthday, setBirthday] = useState(new Date(pet.birthday));
  const [breed, setBreed] = useState(pet.breed);
  const [newImage, setNewImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    setName(pet.name);
    setBirthday(new Date(pet.birthday));
    setBreed(pet.breed);
    setNewImage(null);
  }, [pet, visible]);

  const resetForm = useCallback(() => {
    setName(pet.name);
    setBirthday(new Date(pet.birthday));
    setBreed(pet.breed);
    setNewImage(null);
    setShowDatePicker(false);
  }, [pet]);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthday;
    setBirthday(currentDate);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
  
    if (!result.canceled) {
      try {
        const manipResult = await manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 384, height: 384 } }],
          { compress: 0.8, format: SaveFormat.JPEG }
        );
        setNewImage(manipResult.uri);
      } catch (error) {
        console.error('Error manipulating image:', error);
        Alert.alert('Error', 'Failed to process the image');
      }
    }
  };

  const handleSave = async () => {
    if (!pet.id) {
      Alert.alert('Error', 'Pet data is missing');
      return;
    }

    try {
      const petData = {
        id: pet.id,
        name,
        breed,
        birthday: birthday.toISOString(),
        newImage: newImage,
        image: image, // Include the original image for comparison
      };
  
      const response = await updatePetApi(petData);
      
      if (response && response.pet) {
        dispatch(updatePet(response.pet));
        
        // Refresh pet details
        await dispatch(fetchPetDetails(pet.id));
        
        Alert.alert('Success', 'Pet updated successfully');
        onClose();
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error updating pet:', error);
      Alert.alert('Error', `Failed to update pet: ${error.message}`);
    }
  };

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const displayImage = newImage || image;


  return (
    <RNModal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
        activeOpacity={1}
        onPress={handleClose}
      >
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <TouchableWithoutFeedback>
            <View className="bg-[#1D1D1D] rounded-t-3xl p-6 pb-10 mt-auto">
              <Text className="text-white text-2xl font-bold mb-2">🐈 Edit Pet Info</Text>
              <Text className="text-white text-lg mb-6">{`Update ${pet.name}'s profile`}</Text>

              {displayImage ? (
                <>
                  <TouchableOpacity className="border border-[#FFFC9F] rounded-2xl mb-4" onPress={pickImage}>
                    <Image source={{ uri: displayImage }} className="w-full h-60 rounded-2xl" />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity className="text-white p-4 rounded-2xl mb-4 focus:border bg-[#272727] focus:border-[#FFFC9F] items-center" onPress={pickImage}>
                  <Text className="text-white">+ Add Pet Picture</Text>
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
              </View>

              <View className="flex flex-row">
                <TouchableOpacity
                  className="bg-[#FFFC9F] p-4 rounded-2xl flex-grow mr-2"
                  onPress={handleSave}
                >
                  <Text className="text-black text-center font-bold">Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="border border-[#FFFC9F] p-4 rounded-2xl"
                  onPress={handleClose}
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