import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomePage from './screens/HomePage';
import CarListScreen from './screens/CarListScreen';
import RentalsScreen from './screens/RentalsScreen';
import SettingsScreen from './screens/SettingsScreen';
import CarDetailsScreen from './screens/CarDetailsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#06a566',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 0, elevation: 8 },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Cars') iconName = 'car-outline';
          else if (route.name === 'Rentals') iconName = 'clipboard-outline';
          else if (route.name === 'Settings') iconName = 'settings-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Cars" component={CarListScreen} />
      <Tab.Screen name="Rentals" component={RentalsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="CarDetails" component={CarDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
