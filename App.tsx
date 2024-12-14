import React, {useEffect, useState, createContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer'; // Import DrawerNavigator
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {ThemeProvider} from './src/constants/ThemeContext';
import SplashScreen from './src/screens/SplashScreen';
import AuthNavigator from './src/navigators/authNavigator';
import AppNavigator from './src/navigators/AppNavigator';
import DrawerContent from './src/navigators/DrawerContent';
import DrawerNavigatore from './src/navigators/DrawerNavigatore';
import AuthFirstNavigator from './src/navigators/AuthFirstNavigator';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator(); // Create Drawer Navigator

// Create a context for global settings
export const SettingsContext = createContext(null);

const App = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch settings from API or AsyncStorage
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Check if settings exist in AsyncStorage
        const cachedSettings = await AsyncStorage.getItem('settings');
        if (cachedSettings) {
          setSettings(JSON.parse(cachedSettings));
          setLoading(false); // Stop loading since we got cached data
        }

        // Fetch new settings from the API if not found in cache
        const response = await fetch(
          'https://aitutor.schoolmgmtsys.com/api/settings',
        );
        const data = await response.json();

        // Compare new data with cached data to decide if we need to update
        if (cachedSettings !== JSON.stringify(data)) {
          // Cache the new settings in AsyncStorage
          await AsyncStorage.setItem('settings', JSON.stringify(data));
          setSettings(data); // Update state with the new settings
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false); // Set loading to false once the API call is complete
      }
    };

    fetchSettings();
  }, []);

  // If loading, show the splash screen
  if (loading) {
    return <SplashScreen />;
  }

  return (
    <ThemeProvider>
      {/* Provide settings data globally using Context */}
      <SettingsContext.Provider value={settings}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            {/* SplashScreen and AuthNavigator remain part of the stack */}
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
            <Stack.Screen name="AppNavigator" component={AppNavigator} />
            <Stack.Screen
              name="AuthFirstNavigator"
              component={AuthFirstNavigator}
            />
            {/* DrawerNavigator is placed here to enable the drawer */}
            <Stack.Screen name="DrawerNavigator" component={DrawerNavigatore} />
          </Stack.Navigator>
          <Toast />
        </NavigationContainer>
      </SettingsContext.Provider>
    </ThemeProvider>
  );
};

export default App;
// import React, {useState, useEffect} from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import AdminNavigator from './src/navigator/AdminNavigator';
// import UserNavigator from './src/navigator/UserNavigator';
// import SplashScreen from './src/screens/SplashScreen';
// import AuthNavigator from './src/navigator/AuthNavigator';

// const Stack = createStackNavigator();

// const App = () => {
//   const [isLoading, setIsLoading] = useState(true); // Control SplashScreen loading
//   const [userRole, setUserRole] = useState(null); // 'admin', 'user', or 'auth'

//   // useEffect(() => {
//   //   const checkUser = async () => {
//   //     try {
//   //       const userData = await AsyncStorage.getItem('userData');

//   //       if (userData) {
//   //         const {email} = JSON.parse(userData);

//   //         if (email === 'admin@admin.com') {
//   //           setUserRole('admin'); // Admin user
//   //         } else {
//   //           setUserRole('user'); // Regular user
//   //         }
//   //       } else {
//   //         setUserRole('auth'); // No user data, show authentication flow
//   //       }
//   //     } catch (error) {
//   //       console.error('Error fetching user data:', error);
//   //       setUserRole('auth'); // Default to auth if there's an error
//   //     }
//   //     setIsLoading(false); // Stop splash screen once the user check is done
//   //   };

//   //   checkUser();
//   // }, []);

//   // if (isLoading) {
//   //   return <SplashScreen />; // Show splash screen while checking user data
//   // }

//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{headerShown: false}}>
//         {/* Conditional navigation based on user role */}
//         <Stack.Screen name="SplashScreen" component={SplashScreen} />
//         <Stack.Screen name="AuthNavigator" component={AuthNavigator} />

//         <Stack.Screen name="AdminNavigator" component={AdminNavigator} />

//         <Stack.Screen name="UserNavigator" component={UserNavigator} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;
