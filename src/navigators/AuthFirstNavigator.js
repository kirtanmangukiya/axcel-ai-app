// src/navigators/AuthFirstNavigator.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import SignUpScreen2 from '../screens/SignUpScreen2';
import HomeScreen from '../screens/HomeScreen';
import DrawerNavigatore from './DrawerNavigatore';

const Stack = createStackNavigator();

const AuthFirstNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="SignUpScreen2" component={SignUpScreen2} />
      <Stack.Screen name="DrawerNavigatore" component={DrawerNavigatore} />
    </Stack.Navigator>
  );
};

export default AuthFirstNavigator;
