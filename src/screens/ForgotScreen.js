import React, {useState} from 'react';
import {Dimensions, StyleSheet, Text, View, Alert} from 'react-native';
import TopBar from '../component/TopBar';
import LabeledTextInput from '../component/LabeledTextInput';
import GlobalButton from '../component/GlobalButton';
import {apiCall} from '../apiServices';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const ForgotScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // State to track loading
  const navigation = useNavigation();
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    const endpoint = 'https://aitutor.schoolmgmtsys.com/api/forgot-password'; // Replace with your API endpoint

    try {
      setLoading(true);

      // Use fetch to call the API
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email}), // Pass the email in the request body
      });

      const data = await response.json(); // Parse the response as JSON

      if (response.ok) {
        console.log('Forgot password response:', JSON.stringify(data, null, 2));
        Alert.alert(
          'Success',
          'A password reset link has been sent to your email.',
        );
        navigation.navigate('WelcomeScreen');
      } else {
        console.error('Forgot password error:', data);
        Alert.alert('Error', data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      Alert.alert('Error', 'email already exists');
    } finally {
      setLoading(false); // Stop loading indicator
      setEmail(''); // Clear the email field
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#ffffff'}}>
      <View style={{marginLeft: '5%'}}>
        <TopBar />
      </View>
      <View style={{marginVertical: '5%', marginLeft: '5%', marginTop: '15%'}}>
        <Text style={styles.title}>Forgot password?</Text>
      </View>

      <Text style={styles.description}>
        Don’t worry! It happens. Please enter the email associated with your
        account.
      </Text>

      <View style={{marginHorizontal: '4%'}}>
        <LabeledTextInput
          label="Email Address"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={{marginLeft: '3%', marginTop: '3%'}}>
        <View
          style={{
            width: '96%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <GlobalButton
            title="Send Email"
            onPress={handleForgotPassword}
            loading={loading}
          />
        </View>
      </View>
    </View>
  );
};

export default ForgotScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5A9BD1',
    marginBottom: 20,
  },
  description: {
    fontSize: width * 0.045,
    color: '#7a7a7a',
    marginLeft: '5%',
    marginBottom: height * 0.05,
    lineHeight: width * 0.06,
  },
});
