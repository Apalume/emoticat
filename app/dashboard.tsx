import React from 'react';
import { View, Text } from 'react-native';
import { useAppSelector } from '@/src/store/hooks';

const Dashboard = () => {
  const user = useAppSelector((state: any) => state.auth.user);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to the Dashboard, {user}!</Text>
    </View>
  );
};

export default Dashboard;