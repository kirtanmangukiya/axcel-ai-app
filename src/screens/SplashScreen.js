import React, {useContext, useEffect} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SettingsContext} from '../../App';
import LogoComponent from '../component/LogoComponent';

const {width, height} = Dimensions.get('window');

const SplashScreen = ({navigation}) => {
  const settings = useContext(SettingsContext);

  useEffect(() => {
    const checkLoginStatus = async () => {
      if (!navigation) {
        return;
      }

      // Simulate loading for 2 seconds (you can adjust or remove this delay)
      await new Promise(resolve => setTimeout(resolve, 2000));

      try {
        // Retrieve the user token from AsyncStorage
        const storedToken = await AsyncStorage.getItem('userToken');
        const userToken = storedToken ? JSON.parse(storedToken) : null;

        // Retrieve 'logged_in_first' from AsyncStorage
        const loggedInFirst = await AsyncStorage.getItem('logged_in_first');

        console.log('11111111111111111111', userToken);
        console.log(
          'logged_in_first:122222222222222222222222222',
          loggedInFirst,
        );

        if (userToken && userToken.status === true) {
          const userData = userToken.data;

          // Check if 'logged_in_first' is set to 1
          if (loggedInFirst === '1') {
            navigation?.replace('DrawerNavigator'); // Navigate to the main screen if logged_in_first is 1
            console.log('----------- loggedInFirst');
          } else {
            // Navigate based on whether the user is an admin
            if (userData.is_admin === 1) {
              navigation?.replace('DrawerNavigator'); // Navigate to admin screen
              console.log('1111111111111111111 userData.is_admin === 1');
            } else {
              // Check if it's the user's first login
              if (userToken.is_first_login === 1) {
                navigation?.replace('AuthFirstNavigator'); // Navigate to first login flow
                console.log('22222222222222222 userToken.is_first_login === 1');
              } else {
                navigation?.replace('DrawerNavigator'); // Navigate to regular user screen
                console.log('3333333333333 default DrawerNavigator');
              }
            }
          }
        } else {
          navigation?.replace('AuthNavigator'); // If no token or invalid token, go to Auth screen
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        navigation?.replace('AuthNavigator'); // Navigate to Auth screen on error
      }
    };

    checkLoginStatus();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LogoComponent />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'grey',
  },
  logo: {
    width: width * 0.35, // Adjust the width as per your design
    height: height * 0.12, // Adjust the height as per your design
    resizeMode: 'contain', // Keeps aspect ratio of the image
  },
});

export default SplashScreen;