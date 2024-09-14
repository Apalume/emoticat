import React from 'react';
import { Stack } from 'expo-router';
import { Welcome } from '@/src/templates/Welcome';

const Home = () => (
  <>
    <Stack.Screen
      options={{
        headerShown: false,
      }}
    />
    <Welcome />
  </>
);

export default Home;