// src/navigators/AppNavigator.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import SignUpScreen2 from '../screens/SignUpScreen2';
import EditProfile from '../screens/EditProfile';
import CreateNewBot from '../screens/CreateNewBot';
import ChatHistoryScreen from '../screens/ChatHistoryScreen';
import HistoryDataShowScreen from '../screens/HistoryDataShowScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="SignUpScreen2" component={SignUpScreen2} />
      <Stack.Screen name="ChatHistoryScreen" component={ChatHistoryScreen} />
      <Stack.Screen
        name="HistoryDataShowScreen"
        component={HistoryDataShowScreen}
      />

      {/* <Stack.Screen name="CreateNewBot" component={CreateNewBot} />
      <Stack.Screen name="EditProfile" component={EditProfile} /> */}
      {/* Add other screens that belong to the main app here */}
    </Stack.Navigator>
  );
};

export default AppNavigator;
