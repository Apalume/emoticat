import React, { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, ScrollView, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';
import { useAppDispatch } from '@/src/store/hooks';

import GoogleIcon from '@assets/icons/google.svg';
import AppleIcon from '@assets/icons/apple.svg';
import CatFace from '@assets/icons/cat-face.svg';

const index = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [email, setEmail] = useState('');
  const dispatch = useAppDispatch();
  const isEmailValid = email.trim().length > 0;

  const handleLogin = () => {
    dispatch(login('user@example.com'));
    // Navigate to dashboard or perform other actions
  };

  return (
    <SafeAreaView className="flex-1 bg-[#060606]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1">
            <ScrollView 
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              <View className="flex-1 justify-center items-center p-4">
                <View className="flex-row items-center gap-2 mb-8">
                  <View className={`bg-[#FFFC9F] py-6 px-2 rounded-2xl`}>
                    <CatFace width={66} height={30} />
                  </View>
                  <Text className="text-white text-3xl font-bold">EmotiCat</Text>
                </View>

                <View className="w-full max-w-sm">
                  <TouchableOpacity className="bg-[#383838] flex-row items-center justify-center p-4 rounded-2xl mb-4">
                    <GoogleIcon width={24} height={24} />
                    <Text className="text-white ml-2">Continue with Google</Text>
                  </TouchableOpacity>

                  <TouchableOpacity className="bg-[#383838] flex-row items-center justify-center p-4 rounded-2xl mb-4">
                    <AppleIcon width={24} height={24} />
                    <Text className="text-white ml-2">Continue with Apple</Text>
                  </TouchableOpacity>

                  <Text className="text-white text-center my-4">OR</Text>

                  <View>
                    <TextInput 
                      className={`bg-[#383838] text-white p-4 rounded-2xl mb-4 ${
                        isFocused ? 'border-[#FBF79C] border-2' : 'border-transparent border-2'
                      }`}
                      placeholder="Enter your email address"
                      placeholderTextColor="#8D8D8D"
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      onChangeText={setEmail}
                      value={email}
                    />

                    {isEmailValid ? (
                      <Link href='/dashboard' asChild replace>
                        <TouchableOpacity className="bg-[#FBF79C] p-4 rounded-2xl">
                          <Text className="text-black text-center">Continue with Email</Text>
                        </TouchableOpacity>
                      </Link>
                    ) : (
                      <View className="bg-[#1C1C1C] p-4 rounded-2xl">
                        <Text className="text-[#8D8D8D] text-center">Continue with Email</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </ScrollView>
            
            <View className="p-4 pb-6">
              <Text className="text-[#8D8D8D] text-center text-xs">
                By using EmotiCat, you are agreeing to comply with our Privacy, Terms, and Usage Policies
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


export default index;