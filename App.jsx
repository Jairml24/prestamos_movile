import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LendingList from "./src/views/LendingList"
import DetailCard from "./src/views/LendingDetail"
import LendingRegister from "./src/views/LendingRegister"

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
        <Tab.Screen name="Prestamos" component={LendingListStack} />
        <Tab.Screen name="+Agregar prestamos" component={LendingRegister} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function LendingListStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen name="LendingList" component={LendingList} />
      <Stack.Screen name="DetailCard" component={DetailCard} />
    </Stack.Navigator>
  );
}