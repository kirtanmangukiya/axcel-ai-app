import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Linking, // Import for opening URLs
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LabeledTextInput from '../component/LabeledTextInput';
import GlobalButton from '../component/GlobalButton';
import TopBar from '../component/TopBar';
import {apiCall} from '../apiServices';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false); // State to track T&C agreement

  const validatePassword = password => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&#]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignUp = async () => {
    if (!validatePassword(password)) {
      Alert.alert(
        'Error',
        'Password must be at least 8 characters long and include both letters and numbers.',
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (!isAgreed) {
      Alert.alert('Error', 'You must agree to the Terms and Conditions.');
      return;
    }

    try {
      setLoading(true);
      const data = await apiCall('/register', 'POST', {
        email,
        password,
        password_confirmation: confirmPassword,
      });

      if (data.message.includes('Please verify your email')) {
        setShowModal(true);
      } else {
        Alert.alert('Success', 'Registration successful!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('WelcomeScreen'),
          },
        ]);
      }
    } catch (error) {
      if (error.message.includes('422')) {
        Alert.alert(
          'Error',
          'This email already exists. Please log in or use another email.',
        );
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
      console.log(error);
    } finally {
      setConfirmPassword('');
      setPassword('');
      setEmail('');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TopBar />

      <View style={{marginVertical: '5%'}}>
        <Text style={styles.title}>Sign up</Text>
      </View>

      <LabeledTextInput
        label="Email"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <LabeledTextInput
        label="Create a password"
        placeholder="Create a password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <LabeledTextInput
        label="Confirm password"
        placeholder="Confirm password"
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* T&C agreement */}
      <View style={styles.tncContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setIsAgreed(!isAgreed)}>
          <View style={isAgreed ? styles.checkedBox : styles.uncheckedBox} />
        </TouchableOpacity>
        <Text style={styles.tncText}>
          I agree to the{' '}
          <Text
            style={styles.tncLink}
            onPress={() => Linking.openURL('https://aitutor.schoolmgmtsys.com/terms.html')}>
            Terms and Conditions
          </Text>
        </Text>
      </View>

      <GlobalButton
        title="Sign up"
        loading={loading}
        onPress={handleSignUp}
        backgroundColor="#4da6ff"
        textColor="#ffffff"
        disabled={!isAgreed || loading} // Disable button if T&C is not agreed to
      />

      <View style={{marginTop: '30%'}}>
        <Text style={styles.footerText}>
          Already have an account?
          <Text
            style={styles.footerLink}
            onPress={() => navigation.navigate('WelcomeScreen')}>
            Log in
          </Text>
        </Text>
      </View>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Verify Your Email</Text>
            <Text style={styles.modalMessage}>
              Please check your email to verify your account.
            </Text>

            <GlobalButton
              title="OK"
              onPress={() => setShowModal(false)}
              backgroundColor="#4da6ff"
              textColor="#ffffff"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5A9BD1',
    marginBottom: 20,
  },
  footerText: {
    textAlign: 'center',
    color: '#7a7a7a',
    marginTop: 20,
  },
  footerLink: {
    color: '#5A9BD1',
    fontWeight: 'bold',
  },
  tncContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  checkbox: {
    marginRight: 10,
  },
  uncheckedBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#7a7a7a',
  },
  checkedBox: {
    width: 20,
    height: 20,
    backgroundColor: '#5A9BD1',
  },
  tncText: {
    color: '#7a7a7a',
  },
  tncLink: {
    color: '#5A9BD1',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: 'black',
  },
});

export default SignUpScreen;
