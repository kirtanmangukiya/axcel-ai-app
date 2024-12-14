import {StyleSheet} from 'react-native';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import CreateNewBot from '../screens/CreateNewBot';
import EditProfile from '../screens/EditProfile';
import DrawerContent from './DrawerContent';
import SignUpScreen2 from '../screens/SignUpScreen2';
import ChatHistoryScreen from '../screens/ChatHistoryScreen';
import HistoryDataShowScreen from '../screens/HistoryDataShowScreen';
import AuthFirstNavigator from './AuthFirstNavigator';

const DrawerNavigatore = () => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Drawer.Screen name="HomeScreen" component={HomeScreen} />
      <Drawer.Screen name="CreateNewBot" component={CreateNewBot} />
      <Drawer.Screen name="SignUpScreen2" component={SignUpScreen2} />
      <Drawer.Screen name="EditProfile" component={EditProfile} />
      <Drawer.Screen name="ChatHistoryScreen" component={ChatHistoryScreen} />
      <Drawer.Screen name="AuthFirstNavigator" component={AuthFirstNavigator} />
      <Drawer.Screen
        name="HistoryDataShowScreen"
        component={HistoryDataShowScreen}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigatore;

const styles = StyleSheet.create({});
