// src/navigators/AuthNavigator.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignUpScreen2 from '../screens/SignUpScreen2';
import ForgotScreen from '../screens/ForgotScreen';
import SignUpScreen from '../screens/SignUpScreen';
import OpeningScreen from '../screens/OpeningScreen';
import VerifyScreen from '../screens/VerifyScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="OpeningScreen" component={OpeningScreen} />
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="SignUpScreen2" component={SignUpScreen2} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="ForgotScreen" component={ForgotScreen} />
      <Stack.Screen name="VerifyScreen" component={VerifyScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
