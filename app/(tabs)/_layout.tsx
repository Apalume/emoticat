import React from 'react';
import { Tabs } from 'expo-router';
import HomeIcon from '@assets/iconsSVGJS/HomeIcon';
import CameraIcon from '@assets/iconsSVGJS/CameraIcon';
import ProfileIcon from '@assets/iconsSVGJS/ProfileIcon';
import SettingsIcon from '@assets/iconsSVGJS/SettingsIcon';

export default function TabLayout() {


  return (
        <Tabs
            initialRouteName="dashboard/index"
            screenOptions={({ route }) => ({
                tabBarStyle: { 
                    paddingTop: 8, 
                    borderRadius: 24,
                    backgroundColor: '#1D1D1D',
                },
                headerShown: false,
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    padding: 12,
                    marginHorizontal: 24,
                    borderRadius: 50,
                    width: 'auto',
                },
                tabBarActiveBackgroundColor: '#FBF79C',
            })}
        >
            <Tabs.Screen
                name="dashboard/index"
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <HomeIcon width={size} height={size} fill={focused ? `#FBF79C`: `#1D1D1D` } stroke={focused ? '#000000' : '#FFFFFF'} />
                    ),
                }}
            />
            <Tabs.Screen
                name="camera"
                options={{
                tabBarIcon: ({ focused, color, size }) => (
                    <CameraIcon width={size} height={size} fill={focused ? `#FBF79C`: `#1D1D1D` } stroke={focused ? '#000000' : '#FFFFFF'} />
                ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <ProfileIcon width={size} height={size} fill={focused ? `#FBF79C`: `#1D1D1D` } stroke={focused ? '#000000' : '#FFFFFF'} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                tabBarIcon: ({ focused, color, size }) => (
                    <SettingsIcon width={size} height={size} fill={focused ? `#FBF79C`: `#1D1D1D` } stroke={focused ? '#000000' : '#FFFFFF'} />
                ),
                }}
            />
        </Tabs>
  );
}