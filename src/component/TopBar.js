import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import {colors} from '../constants/GlobalStyles';
import {useNavigation} from '@react-navigation/native';
import LogoComponent from './LogoComponent';
const {width, height} = Dimensions.get('window');

const TopBar = ({title, onBackPress, is_first_login = 0}) => {
  const navigation = useNavigation();
  console.log(is_first_login);

  return (
    <View style={styles.topBar}>
      {is_first_login !== 1 && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Image
            source={require('../assets/Back2.png')} // Update this path to where your image is located
            style={styles.backImage}
          />
        </TouchableOpacity>
      )}

      {title ? (
        <Text style={styles.title}>{title}</Text> // Display text if title is passed
      ) : (
        <View style={styles.parentContainer}>
          <LogoComponent
            containerStyle={styles.customContainer}
            logoStyle={styles.customLogo}
          />
        </View>
      )}

      <View style={{width: 24}} />
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  backButton: {
    // Optional: Add padding or styling as needed
    marginLeft: '4%',
  },
  backImage: {
    width: 34,
    height: 34,
  },
  title: {
    fontSize: 20,
    color: colors.mainText,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  image: {
    width: 100, // Adjust the size of the image
    height: 50,
    resizeMode: 'contain', // Make sure the image is scaled correctly
    flex: 1, // Ensure the image takes up the center space
  },
  parentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customContainer: {
    // Custom container style for LogoComponent
    // padding: 10,
  },
  customLogo: {
    // Custom logo style for LogoComponent
    width: width * 0.3,
    height: height * 0.4,
    borderRadius: 10,
    marginTop: '29%',
  },
});

export default TopBar;
