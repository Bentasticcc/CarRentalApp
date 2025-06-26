import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CarListScreen from './screens/CarListScreen';
import CarDetailsScreen from './screens/CarDetailsScreen';

const Stack = createStackNavigator();

export default function CarsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CarList" component={CarListScreen} />
      <Stack.Screen name="CarDetails" component={CarDetailsScreen} />
    </Stack.Navigator>
  );
}