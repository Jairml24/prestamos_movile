import React from "react"
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Image} from 'react-native'

import LendingList from "./src/views/LendingList"
import DetailCard from "./src/views/LendingDetail"
import LendingGeneral from "./src/views/LendingGeneral"
import LendingRegister from "./src/views/LendingRegister"


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      gestureEnabled: false,
      tabBarLabelStyle: { fontSize: 14, marginBottom: 10 },
      tabBarStyle: { paddingBottom: 1, height: 60 },
      tabBarIcon: ({ color, size }) => {
        let iconSource;
    
        if (route.name === 'Prestamos') {
          iconSource = require('./src/assets/prestamos.png');
        } else if (route.name === 'Agregar prestamo') {
          iconSource = require('./src/assets/registro.png');
        } else {
          iconSource = require('./src/assets/general.png');
        }
    
        return <Image source={iconSource} style={{ width: 25, resizeMode: 'contain'  }} />;
      },
    })}
  >
        <Tab.Screen name="Prestamos" component={LendingListStack} />
        <Tab.Screen name="Agregar prestamo" component={LendingRegister} />
        <Tab.Screen name="General" component={LendingGeneral} />
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

