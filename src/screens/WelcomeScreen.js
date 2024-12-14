// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   Dimensions,
//   StyleSheet,
//   Alert,
//   ToastAndroid, // Import Toast for Android (You can also use any other toast library for iOS compatibility)
// } from 'react-native';
// import {useNavigation} from '@react-navigation/native';
// import LabeledTextInput from '../component/LabeledTextInput';
// import GlobalButton from '../component/GlobalButton';
// import TopBar from '../component/TopBar';
// import {apiCall} from '../apiServices';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const {width, height} = Dimensions.get('window');

// const WelcomeScreen = () => {
//   const navigation = useNavigation();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false); // State to track loading
//   const [resendLoading, setResendLoading] = useState(false); // State to track resend loading

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert('Error', 'Please enter both email and password.');
//       return;
//     }

//     setLoading(true); // Start loading indicator

//     const endpoint = '/login';
//     const body = {email, password};

//     try {
//       const response = await apiCall(endpoint, 'POST', body);
//       console.log('Login successful:', response);

//       if (
//         response?.status === false &&
//         response?.message == 'Please verify your email before logging in.'
//       ) {
//         console.log('Please first verify');
//         Alert.alert('Notice', response.message);
//       } else if (response?.status === false) {
//         console.log('Please first verify');
//         Alert.alert('Notice', 'Invalid credentials');
//       } else {
//         // console.log('Login successfully', response);
//         await AsyncStorage.setItem('userToken', JSON.stringify(response));
//         // Handle successful login
//         navigation.navigate('SplashScreen');
//       }
//     } catch (error) {
//       console.error('Login failed:', error);
//       Alert.alert(
//         'Login Failed',
//         'Invalid email or password. Please try again.',
//       );
//     } finally {
//       setLoading(false); // Stop loading indicator
//     }
//   };

//   const handleResendVerification = async () => {
//     if (!email) {
//       Alert.alert('Error', 'Please enter your email to resend verification.');
//       return;
//     }

//     setResendLoading(true); // Start loading indicator for resend

//     const endpoint = '/email/resend-verification';
//     const body = {email};

//     try {
//       const response = await apiCall(endpoint, 'POST', body);
//       console.log('Resend verification successful:', response);

//       if (response?.status === true) {
//         ToastAndroid.show(
//           'Verification email resent successfully.',
//           ToastAndroid.SHORT,
//         );
//       } else {
//         Alert.alert(
//           'Error',
//           'Failed to resend verification email. Please try again.',
//         );
//       }
//     } catch (error) {
//       console.error('Resend verification failed:', error);
//       Alert.alert('Error', 'Something went wrong. Please try again.');
//     } finally {
//       setResendLoading(false); // Stop loading indicator for resend
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.topBar}>
//         <TopBar />
//       </View>

//       <View style={styles.content}>
//         <View style={{marginVertical: '3%'}}>
//           <Image
//             style={{width: 80, height: 45}}
//             source={require('../assets/axcel_logo.png')}
//           />
//         </View>
//         <Text style={styles.loginText}>Login</Text>
//         <Text style={styles.welcomeText}>Hi, Welcome! 👋</Text>
//         <Text style={styles.welcomeText2}>AI TUTOR</Text>

//         <LabeledTextInput
//           label="Email address"
//           placeholder="Your email"
//           value={email}
//           onChangeText={setEmail}
//         />
//         <LabeledTextInput
//           label="Password"
//           placeholder="Password"
//           secureTextEntry={true}
//           value={password}
//           onChangeText={setPassword}
//         />

//         <View style={styles.row}>
//           <View style={styles.rememberMe}>
//             <Text>✔</Text>
//             <Text> Remember me</Text>
//           </View>
//           <TouchableOpacity onPress={() => navigation.navigate('ForgotScreen')}>
//             <Text style={styles.forgotPassword}>Forgot password?</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={{width: '100%', alignItems: 'center'}}>
//           <GlobalButton title="Login" onPress={handleLogin} loading={loading} />
//         </View>

//         {/* Resend Verification Button */}
//         <View style={{marginTop: '5%'}}>
//           <Text style={styles.signUpText}>
//             Resend Email Verification link?
//             <TouchableOpacity onPress={() => handleResendVerification()}>
//               <Text style={styles.signUpLink}>Resend</Text>
//             </TouchableOpacity>
//           </Text>
//         </View>

//         <View style={{marginTop: '5%'}}>
//           <Text style={styles.signUpText}>
//             Don’t have an account?
//             <TouchableOpacity
//               onPress={() => navigation.navigate('SignUpScreen')}>
//               <Text style={styles.signUpLink}>Sign up</Text>
//             </TouchableOpacity>
//           </Text>
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//     paddingHorizontal: width * 0.06,
//   },
//   topBar: {
//     marginTop: height * 0.02,
//   },
//   content: {
//     marginTop: height * 0.05,
//   },
//   loginText: {
//     fontSize: width * 0.065,
//     fontWeight: 'bold',
//     color: '#5A9BD1',
//   },
//   welcomeText: {
//     fontSize: width * 0.06,
//     fontWeight: 'bold',
//     color: '#5A9BD1',
//     marginTop: height * 0.012,
//   },
//   welcomeText2: {
//     fontSize: width * 0.05,
//     marginBottom: '4%',
//     fontWeight: 'bold',
//     color: '#5A9BD1',
//     marginTop: height * 0.012,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginVertical: height * 0.015,
//   },
//   rememberMe: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   forgotPassword: {
//     color: '#5A9BD1',
//     fontSize: width * 0.04,
//   },
//   signUpText: {
//     textAlign: 'center',
//     color: '#7a7a7a',
//     // marginBottom: '10%',
//     fontSize: width * 0.045,
//   },
//   signUpLink: {
//     color: '#5A9BD1',
//     fontWeight: 'bold',
//     fontSize: width * 0.04,
//   },
// });

// export default WelcomeScreen;
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Alert,
  ToastAndroid,
  useColorScheme,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LabeledTextInput from '../component/LabeledTextInput';
import GlobalButton from '../component/GlobalButton';
import TopBar from '../component/TopBar';
import {apiCall} from '../apiServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {SettingsContext} from '../../App';

const {width, height} = Dimensions.get('window');

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState(''); // State to store response message
  const colorScheme = useColorScheme();
  const settings = useContext(SettingsContext);
  console.log('555555555555555', loginMessage);

  // Initialize Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({});
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    const endpoint = '/login';

    const body = {
      email: email,
      password: password,
      login_type: 'app', // Adding login_type to the request body
    };

    try {
      const response = await apiCall(endpoint, 'POST', body);
      console.log(response.message);

      if (response?.status === false) {
        setLoginMessage(response?.message || 'Invalid credentials'); // Set the message for display
        Alert.alert('Error', response?.message || 'Invalid credentials');
      } else {
        // Store the user token in AsyncStorage
        await AsyncStorage.setItem('userToken', JSON.stringify(response));

        // Navigate to the SplashScreen after successful login
        navigation.navigate('SplashScreen');
      }
    } catch (error) {
      setLoginMessage('Invalid email or password.');
      Alert.alert('Login Failed', 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Sign out any previous Google session
      await GoogleSignin.signOut();

      // Check if Google Play Services are available
      await GoogleSignin.hasPlayServices();

      // Sign in with Google
      const userInfo = await GoogleSignin.signIn();
      const email = userInfo?.data?.user?.email;

      if (!email) {
        Alert.alert('Error', 'Unable to retrieve email from Google login.');
        return;
      }

      console.log('Google login successful:', email);

      const body = {
        email: email,
        login_type: 'google',
      };

      const endpoint = 'https://aitutor.schoolmgmtsys.com/api/login'; // Replace with your actual API URL

      try {
        console.log('Calling API with body:', body);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body), // Send the body as JSON
        });

        const responseData = await response.json(); // Parse the response as JSON
        console.log('API Response:', responseData);

        if (responseData?.status === false) {
          console.log('Login failed. Response message:', responseData?.message);

          setLoginMessage(
            responseData?.message || 'Invalid Google login credentials.',
          );

          Alert.alert(
            'Error',
            responseData?.message || 'Invalid Google login credentials.',
          );
        } else {
          console.log('Login successful. Storing token:', responseData);

          // Store user token in AsyncStorage
          await AsyncStorage.setItem('userToken', JSON.stringify(responseData));

          console.log('Navigating to SplashScreen');
          navigation.navigate('SplashScreen');
        }
      } catch (error) {
        // Log the error for debugging purposes
        console.error('Error during API call:', error.message);
        Alert.alert('Error', `Login failed: ${error.message}`);
      }
    } catch (error) {
      setLoginMessage('Google login failed. Please try again.');
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Cancelled', 'Google login was cancelled.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('In Progress', 'Google login is already in progress.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Google Play Services are not available.');
      } else {
        console.error('Google login error:', error);
        Alert.alert('Error', 'Google login failed. Please try again.');
      }
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email to resend verification.');
      return;
    }

    setResendLoading(true);
    const baseUrl = 'https://aitutor.schoolmgmtsys.com/api'; // Replace with your actual API domain
    const endpoint = '/email/resend-verification';
    const url = `${baseUrl}${endpoint}`;
    const body = JSON.stringify({email});

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      const data = await response.json();
      console.log('Response:', data);

      if (data.status === true) {
        ToastAndroid.show(data.message, ToastAndroid.SHORT);
      } else {
        Alert.alert(
          'Error',
          data.message || 'Failed to resend verification email.',
        );
        console.log(error);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}>
      <View style={styles.topBar}>
        <TopBar />
      </View>

      <View style={styles.content}>
        <Text style={styles.loginText}>Login</Text>
        <Text style={styles.welcomeText}>Hi, Welcome! 👋</Text>

        <Text style={styles.welcomeText2}>{settings?.name}</Text>

        <LabeledTextInput
          label="Email address"
          placeholder="Your email"
          value={email}
          onChangeText={setEmail}
        />
        <LabeledTextInput
          label="Password"
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotScreen')}>
            <Text style={styles.forgotPassword}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <GlobalButton title="Login" onPress={handleLogin} loading={loading} />

        {/* Conditionally render the resend verification section if message is available */}

        <View style={styles.orContainer}>
          <Text style={styles.orText}>
            Or with 
          </Text>
        </View>

        <View style={styles.googleButtonContainer}>
          <TouchableOpacity
            onPress={handleGoogleLogin}
            style={styles.googleButton}>
            <Image
              source={require('../assets/google_icon.png')}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Login with Google</Text>
          </TouchableOpacity>
        </View>
        {loginMessage.includes('verify your email') && (
          <View style={styles.resendContainer}>
            <Text style={styles.signUpText}>
              Resend Email Verification link ?
              <TouchableOpacity onPress={handleResendVerification}>
                <Text style={styles.signUpLink}> Resend</Text>
              </TouchableOpacity>
            </Text>
          </View>
        )}

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>
            Don’t have an account ?
            <TouchableOpacity
              onPress={() => navigation.navigate('SignUpScreen')}>
              <Text style={styles.signUpLink}> Sign up</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Allows ScrollView to scroll when content overflows
    justifyContent: 'center',
    paddingHorizontal: width * 0.06,
    backgroundColor: '#ffffff',
  },
  topBar: {
    marginTop: height * 0.02,
  },
  content: {
    marginTop: height * 0.05,
  },
  loginText: {
    fontSize: width * 0.065,
    fontWeight: 'bold',
    color: '#5A9BD1',
  },
  welcomeText: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#5A9BD1',
    marginTop: height * 0.012,
  },
  welcomeText2: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#5A9BD1',
    marginTop: height * 0.012,
    marginBottom: height * 0.012,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: '5%',
  },
  forgotPasswordContainer: {
    width: '100%',
    marginBottom: '4%',
    alignItems: 'flex-end',
  },
  forgotPassword: {
    color: '#5A9BD1',
    fontSize: width * 0.04,
  },
  googleButtonText: {
    color: '#ffffff',
    fontSize: width * 0.045,
  },
  orContainer: {
    width: '100%',
    marginVertical: height * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orText: {
    color: '#5A9BD1',
    fontSize: width * 0.038,
  },
  signUpContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.03,

    marginBottom: '5%',
  },
  signUpText: {
    color: '#5A9BD1',
    fontSize: width * 0.04,
  },
  signUpLink: {
    color: '#4285F4',

    fontWeight: 'bold',
  },
  resendContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  googleButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  resendContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  signUpLink: {
    color: '#4285F4',
    fontWeight: 'bold',
    marginTop: height * 0.01, // Added top margin for spacing
  },
});

export default WelcomeScreen;
