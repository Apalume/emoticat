import React, { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, ScrollView, SafeAreaView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAppDispatch } from '@/src/store/hooks';
import { login, register } from '@/src/api/catApi';

import { setUser } from '@/src/store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GoogleIcon from '@assets/icons/google.svg';
import AppleIcon from '@assets/icons/apple.svg';
import CatFace from '@assets/icons/cat-face.svg';
import ViewIcon from '@assets/icons/view.svg';

const index = () => {
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const isEmailValid = email.trim().length > 0;

  const handleLogin = async () => {
    try {
      const { token, username } = await login(email, password);
      await AsyncStorage.setItem('userToken', token);
      dispatch(setUser({ username, token }));
      router.replace('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Error', error.message || 'An unknown error occurred');
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    try {
      const result = await register(email, email, password);
      if (result && result.token) {
        await AsyncStorage.setItem('userToken', result.token);
        dispatch(setUser({ username: result.username || email, token: result.token }));
        router.replace('/dashboard');
      } else {
        throw new Error('Registration failed: No token received');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
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
                        isEmailFocused ? 'border-[#FBF79C] border-2' : 'border-transparent border-2'
                      }`}
                      placeholder="Enter your email address"
                      placeholderTextColor="#8D8D8D"
                      onFocus={() => setIsEmailFocused(true)}
                      onBlur={() => setIsEmailFocused(false)}
                      onChangeText={setEmail}
                      value={email}
                    />
                    <View className="relative">
                      <TextInput 
                        className={`bg-[#383838] text-white p-4 rounded-2xl mb-4 ${
                          isPasswordFocused ? 'border-[#FBF79C] border-2' : 'border-transparent border-2'
                        }`}
                        placeholder="Enter your password"
                        placeholderTextColor="#8D8D8D"
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry={!showPassword}
                      />
                      <TouchableOpacity 
                        className="absolute right-4 top-4"
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <ViewIcon width={24} height={24} />
                      </TouchableOpacity>
                    </View>
                    {isRegistering && (
                      <View className="relative">
                        <TextInput 
                          className={`bg-[#383838] text-white p-4 rounded-2xl mb-4 ${
                            isPasswordFocused ? 'border-[#FBF79C] border-2' : 'border-transparent border-2'
                          }`}
                          placeholder="Confirm your password"
                          placeholderTextColor="#8D8D8D"
                          onFocus={() => setIsPasswordFocused(true)}
                          onBlur={() => setIsPasswordFocused(false)}
                          onChangeText={setConfirmPassword}
                          value={confirmPassword}
                          secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity 
                          className="absolute right-4 top-4"
                          onPress={() => setShowPassword(!showPassword)}
                        >
                          <ViewIcon width={24} height={24} />
                        </TouchableOpacity>
                      </View>
                    )}
                    {isEmailValid ? (
                      <TouchableOpacity 
                        className="bg-[#FBF79C] p-4 rounded-2xl mb-4" 
                        onPress={isRegistering ? handleRegister : handleLogin}
                      >
                        <Text className="text-black text-center">
                          {isRegistering ? 'Register' : 'Continue with Email'}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View className="bg-[#1C1C1C] p-4 rounded-2xl mb-4">
                        <Text className="text-[#8D8D8D] text-center">Enter a valid email & pass</Text>
                      </View>
                    )}
                    <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
                      <Text className="text-[#FBF79C] text-center">
                        {isRegistering ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
                      </Text>
                    </TouchableOpacity>
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