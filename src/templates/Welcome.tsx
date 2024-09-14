import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, StyleSheet } from 'react-native';
import GoogleIcon from '@assets/icons/google.svg';

const Welcome = () => (
  <View style={styles.container} className={`flex-1 justify-center items-center`}>
    <View className={`p-4 flex flex-row items-center gap-2`}>
        <Image 
          source={require('@assets/icons/cat-face.png')} 
          style={styles.image}
        />  
        <Text style={styles.title}>EmotiCat</Text>
    </View>
    <View className={`flex items-center justify-center`}>
      <View>
        <View className={`bg-[#383838] flex flex-row gap-2 items-center w-full justify-center p-4`} style={styles.button}>
        <GoogleIcon width={24} height={24} />
        <Text style={styles.text}>Continue with Google</Text>
        </View>
      </View>
      
      <Text style={styles.text}>OR</Text>
    </View>
    <StatusBar style="auto" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#060606',
    color: '#FFF',
  },
  title: {
    color: '#FFF',
    fontSize: 32,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 35,
  },
  image: {
    width: 66,
    height: 62,
  },
  icon: {
    width: 24,
    height: 24,
  },
  text: {
    color: '#FFF',
  },
  button: {
    borderRadius: 32,
  }
});

export { Welcome };