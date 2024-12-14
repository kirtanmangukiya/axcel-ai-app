// import React from 'react';
// import {
//   View,
//   Text,
//   Image,
//   Dimensions,
//   StyleSheet,
//   BackHandler,
// } from 'react-native';
// import GlobalButton from '../component/GlobalButton'; // Import your GlobalButton component
// import {colors} from '../constants/GlobalStyles';
// import {useFocusEffect, useNavigation} from '@react-navigation/native';

// const {width, height} = Dimensions.get('window');

// const OpeningScreen = () => {
//   const navigation = useNavigation();

//   useFocusEffect(
//     React.useCallback(() => {
//       const handleBackPress = () => {
//         BackHandler.exitApp();
//         return true; // Prevent default back button behavior
//       };

//       // Add event listener for back button
//       BackHandler.addEventListener('hardwareBackPress', handleBackPress);

//       // Clean up the event listener on component unmount or when screen loses focus
//       return () => {
//         BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
//       };
//     }, []), // Empty dependency array ensures this effect runs only on mount/unmount
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.logoContainer}>
//         <Image
//           source={require('../assets/axcel_logo.png')} // Replace with your logo file path
//           style={styles.logo}
//         />
//       </View>

//       <View style={styles.contentContainer}>
//         <Text style={styles.title}>Explore the app</Text>

//         <Text style={styles.description}>
//           This text is a placeholder, representing the foundation of modern
//           education tools. It has been the standard reference for learning
//           resources since the beginning of intelligent tutoring systems.
//         </Text>
//       </View>

//       <View style={styles.footer}>
//         <View style={{marginBottom: height * 0.02}}>
//           <GlobalButton
//             title="Sign In"
//             onPress={() => {
//               navigation.navigate('WelcomeScreen');
//             }}
//             backgroundColor={colors.mainText} // pass the background color as a prop
//             textColor={colors.white} // pass the text color as a prop
//           />
//         </View>

//         <GlobalButton
//           title="Create account"
//           onPress={() => {
//             navigation.navigate('SignUpScreen');
//           }}
//           backgroundColor={colors.white} // change to your desired color
//           textColor={colors.mainText} // change to your desired color
//           style={styles.createAccountButton} // custom button styles
//           textStyle={styles.createAccountText} // custom text styles
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//     paddingHorizontal: width * 0.05,
//   },
//   logoContainer: {
//     marginTop: height * 0.15, // Adjust according to screen size
//     alignItems: 'center', // Center the logo horizontally
//   },
//   logo: {
//     width: width * 0.35, // Responsive size
//     height: height * 0.12, // Responsive size
//     resizeMode: 'contain',
//   },
//   contentContainer: {
//     flex: 1, // Allows the content to take available space
//     justifyContent: 'center', // Vertically center the content
//     alignItems: 'center', // Horizontally center the content
//   },
//   title: {
//     fontSize: width * 0.07, // Responsive font size
//     fontWeight: 'bold',
//     color: '#5A9BD1',
//     textAlign: 'center',
//     marginBottom: height * 0.02,
//   },
//   description: {
//     fontSize: width * 0.045, // Responsive font size
//     color: '#7a7a7a',
//     textAlign: 'center',
//     marginVertical: height * 0.03, // Responsive spacing
//     lineHeight: width * 0.06, // Line height for better readability
//     paddingHorizontal: width * 0.05, // Responsive padding
//   },
//   footer: {
//     paddingBottom: height * 0.05, // Adjust for footer height
//     justifyContent: 'flex-end', // Push the buttons to the bottom of the screen
//     // alignItems: 'center',
//   },
//   createAccountButton: {
//     backgroundColor: '#ffffff',
//     borderColor: '#5A9BD1',
//     borderWidth: 1,
//   },
//   createAccountText: {
//     color: '#5A9BD1',
//   },
// });

// export default OpeningScreen;
import React, {useContext} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  BackHandler,
} from 'react-native';
import GlobalButton from '../component/GlobalButton'; // Import your GlobalButton component
import {colors} from '../constants/GlobalStyles';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {SettingsContext} from '../../App';
// import {SettingsContext} from '../../App'; // Import the SettingsContext

const {width, height} = Dimensions.get('window');

const OpeningScreen = () => {
  const navigation = useNavigation();
  const settings = useContext(SettingsContext); // Access the settings data

  console.log('chekc the login ', settings);

  useFocusEffect(
    React.useCallback(() => {
      const handleBackPress = () => {
        BackHandler.exitApp();
        return true; // Prevent default back button behavior
      };
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, []), // Empty dependency array ensures this effect runs only on mount/unmount
  );

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={{
            uri: `https://aitutor.schoolmgmtsys.com/storage/${settings.logo}`,
          }}
          style={styles.logo}
        />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          {settings.name}
          {/* Example usage of API data */}
        </Text>

        <Text style={styles.description}>
          {settings
            ? settings.bio
            : 'This text is a placeholder, representing the foundation of modern education tools.'}
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={{marginBottom: height * 0.02}}>
          <GlobalButton
            title="Sign In"
            onPress={() => {
              navigation.navigate('WelcomeScreen');
            }}
            backgroundColor={colors.mainText} // pass the background color as a prop
            textColor={colors.white} // pass the text color as a prop
          />
        </View>

        <GlobalButton
          title="Create account"
          onPress={() => {
            navigation.navigate('SignUpScreen');
          }}
          backgroundColor={colors.white} // change to your desired color
          textColor={colors.mainText} // change to your desired color
          style={styles.createAccountButton} // custom button styles
          textStyle={styles.createAccountText} // custom text styles
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: width * 0.05,
  },
  logoContainer: {
    marginTop: height * 0.3, // Adjust according to screen size
    alignItems: 'center', // Center the logo horizontally
  },
  logo: {
    width: width * 0.35, // Responsive size
    height: height * 0.12, // Responsive size
    resizeMode: 'contain',
  },
  contentContainer: {
    flex: 1, // Allows the content to take available space
    justifyContent: 'center', // Vertically center the content
    alignItems: 'center', // Horizontally center the content
  },
  title: {
    fontSize: width * 0.07, // Responsive font size
    fontWeight: 'bold',
    color: '#5A9BD1',
    textAlign: 'center',
    // marginBottom: height * 0.02,
  },
  description: {
    fontSize: width * 0.045, // Responsive font size
    color: '#7a7a7a',
    textAlign: 'center',
    // marginVertical: height * 0.03, // Responsive spacing
    lineHeight: width * 0.06, // Line height for better readability
    paddingHorizontal: width * 0.05, // Responsive padding
  },
  footer: {
    paddingBottom: height * 0.05, // Adjust for footer height
    justifyContent: 'flex-end', // Push the buttons to the bottom of the screen
    // alignItems: 'center',
  },
  createAccountButton: {
    backgroundColor: '#ffffff',
    borderColor: '#5A9BD1',
    borderWidth: 1,
  },
  createAccountText: {
    color: '#5A9BD1',
  },
});

export default OpeningScreen;
