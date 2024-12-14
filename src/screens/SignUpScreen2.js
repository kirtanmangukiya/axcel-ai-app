import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
  ImageBackground,
  Image,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {colors} from '../constants/GlobalStyles';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library

import LabeledTextInput from '../component/LabeledTextInput';
import GlobalButton from '../component/GlobalButton';
import TopBar from '../component/TopBar';
import DateTimePicker from '@react-native-community/datetimepicker';
import {updateProfile} from '../apiServices';
import {getUpdateProfile, getUserToken} from '../constants/constants';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageCropPicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';
import {useNavigation} from '@react-navigation/native';
import LabeledDisplay from '../component/LabeledDisplay';

const countries = [
  {code: 'MY', name: 'Malaysia'},
  {code: 'AF', name: 'Afghanistan'},
  {code: 'AL', name: 'Albania'},
  {code: 'DZ', name: 'Algeria'},
  {code: 'AS', name: 'American Samoa'},
  {code: 'AD', name: 'Andorra'},
  {code: 'AO', name: 'Angola'},
  {code: 'AI', name: 'Anguilla'},
  {code: 'AQ', name: 'Antarctica'},
  {code: 'AG', name: 'Antigua and Barbuda'},
  {code: 'AR', name: 'Argentina'},
  {code: 'AM', name: 'Armenia'},
  {code: 'AW', name: 'Aruba'},
  {code: 'AU', name: 'Australia'},
  {code: 'AT', name: 'Austria'},
  {code: 'AZ', name: 'Azerbaijan'},
  {code: 'BS', name: 'Bahamas'},
  {code: 'BH', name: 'Bahrain'},
  {code: 'BD', name: 'Bangladesh'},
  {code: 'BB', name: 'Barbados'},
  {code: 'BY', name: 'Belarus'},
  {code: 'BE', name: 'Belgium'},
  {code: 'BZ', name: 'Belize'},
  {code: 'BJ', name: 'Benin'},
  {code: 'BM', name: 'Bermuda'},
  {code: 'BT', name: 'Bhutan'},
  {code: 'BO', name: 'Bolivia'},
  {code: 'BQ', name: 'Bonaire, Sint Eustatius and Saba'},
  {code: 'BA', name: 'Bosnia and Herzegovina'},
  {code: 'BW', name: 'Botswana'},
  {code: 'BV', name: 'Bouvet Island'},
  {code: 'BR', name: 'Brazil'},
  {code: 'IO', name: 'British Indian Ocean Territory'},
  {code: 'BN', name: 'Brunei Darussalam'},
  {code: 'BG', name: 'Bulgaria'},
  {code: 'BF', name: 'Burkina Faso'},
  {code: 'BI', name: 'Burundi'},
  {code: 'CV', name: 'Cabo Verde'},
  {code: 'KH', name: 'Cambodia'},
  {code: 'CM', name: 'Cameroon'},
  {code: 'CA', name: 'Canada'},
  {code: 'KY', name: 'Cayman Islands'},
  {code: 'CF', name: 'Central African Republic'},
  {code: 'TD', name: 'Chad'},
  {code: 'CL', name: 'Chile'},
  {code: 'CN', name: 'China'},
  {code: 'CX', name: 'Christmas Island'},
  {code: 'CC', name: 'Cocos (Keeling) Islands'},
  {code: 'CO', name: 'Colombia'},
  {code: 'KM', name: 'Comoros'},
  {code: 'CD', name: 'Congo, Democratic Republic of the'},
  {code: 'CG', name: 'Congo'},
  {code: 'CK', name: 'Cook Islands'},
  {code: 'CR', name: 'Costa Rica'},
  {code: 'HR', name: 'Croatia'},
  {code: 'CU', name: 'Cuba'},
  {code: 'CW', name: 'Curaçao'},
  {code: 'CY', name: 'Cyprus'},
  {code: 'CZ', name: 'Czech Republic'},
  {code: 'DK', name: 'Denmark'},
  {code: 'DJ', name: 'Djibouti'},
  {code: 'DM', name: 'Dominica'},
  {code: 'DO', name: 'Dominican Republic'},
  {code: 'EC', name: 'Ecuador'},
  {code: 'EG', name: 'Egypt'},
  {code: 'SV', name: 'El Salvador'},
  {code: 'GQ', name: 'Equatorial Guinea'},
  {code: 'ER', name: 'Eritrea'},
  {code: 'EE', name: 'Estonia'},
  {code: 'SZ', name: 'Eswatini'},
  {code: 'ET', name: 'Ethiopia'},
  {code: 'FK', name: 'Falkland Islands (Malvinas)'},
  {code: 'FO', name: 'Faroe Islands'},
  {code: 'FJ', name: 'Fiji'},
  {code: 'FI', name: 'Finland'},
  {code: 'FR', name: 'France'},
  {code: 'GF', name: 'French Guiana'},
  {code: 'PF', name: 'French Polynesia'},
  {code: 'TF', name: 'French Southern Territories'},
  {code: 'GA', name: 'Gabon'},
  {code: 'GM', name: 'Gambia'},
  {code: 'GE', name: 'Georgia'},
  {code: 'DE', name: 'Germany'},
  {code: 'GH', name: 'Ghana'},
  {code: 'GI', name: 'Gibraltar'},
  {code: 'GR', name: 'Greece'},
  {code: 'GL', name: 'Greenland'},
  {code: 'GD', name: 'Grenada'},
  {code: 'GP', name: 'Guadeloupe'},
  {code: 'GU', name: 'Guam'},
  {code: 'GT', name: 'Guatemala'},
  {code: 'GG', name: 'Guernsey'},
  {code: 'GN', name: 'Guinea'},
  {code: 'GW', name: 'Guinea-Bissau'},
  {code: 'GY', name: 'Guyana'},
  {code: 'HT', name: 'Haiti'},
  {code: 'HM', name: 'Heard Island and McDonald Islands'},
  {code: 'VA', name: 'Holy See'},
  {code: 'HN', name: 'Honduras'},
  {code: 'HK', name: 'Hong Kong'},
  {code: 'HU', name: 'Hungary'},
  {code: 'IS', name: 'Iceland'},
  {code: 'IN', name: 'India'},
  {code: 'ID', name: 'Indonesia'},
  {code: 'IR', name: 'Iran'},
  {code: 'IQ', name: 'Iraq'},
  {code: 'IE', name: 'Ireland'},
  {code: 'IM', name: 'Isle of Man'},
  {code: 'IL', name: 'Israel'},
  {code: 'IT', name: 'Italy'},
  {code: 'JM', name: 'Jamaica'},
  {code: 'JP', name: 'Japan'},
  {code: 'JE', name: 'Jersey'},
  {code: 'JO', name: 'Jordan'},
  {code: 'KZ', name: 'Kazakhstan'},
  {code: 'KE', name: 'Kenya'},
  {code: 'KI', name: 'Kiribati'},
  {code: 'KP', name: "Korea, Democratic People's Republic of"},
  {code: 'KR', name: 'Korea, Republic of'},
  {code: 'KW', name: 'Kuwait'},
  {code: 'KG', name: 'Kyrgyzstan'},
  {code: 'LA', name: "Lao People's Democratic Republic"},
  {code: 'LV', name: 'Latvia'},
  {code: 'LB', name: 'Lebanon'},
  {code: 'LS', name: 'Lesotho'},
  {code: 'LR', name: 'Liberia'},
  {code: 'LY', name: 'Libya'},
  {code: 'LI', name: 'Liechtenstein'},
  {code: 'LT', name: 'Lithuania'},
  {code: 'LU', name: 'Luxembourg'},
  {code: 'MO', name: 'Macao'},
  {code: 'MG', name: 'Madagascar'},
  {code: 'MW', name: 'Malawi'},
  {code: 'ML', name: 'Mali'},
  {code: 'MT', name: 'Malta'},
  {code: 'MH', name: 'Marshall Islands'},
  {code: 'MQ', name: 'Martinique'},
  {code: 'MR', name: 'Mauritania'},
  {code: 'MU', name: 'Mauritius'},
  {code: 'YT', name: 'Mayotte'},
  {code: 'MX', name: 'Mexico'},
  {code: 'FM', name: 'Micronesia, Federated States of'},
  {code: 'MD', name: 'Moldova'},
  {code: 'MC', name: 'Monaco'},
  {code: 'MN', name: 'Mongolia'},
  {code: 'ME', name: 'Montenegro'},
  {code: 'MS', name: 'Montserrat'},
  {code: 'MA', name: 'Morocco'},
  {code: 'MZ', name: 'Mozambique'},
  {code: 'MM', name: 'Myanmar'},
  {code: 'NA', name: 'Namibia'},
  {code: 'NR', name: 'Nauru'},
  {code: 'NP', name: 'Nepal'},
  {code: 'NL', name: 'Netherlands'},
  {code: 'NC', name: 'New Caledonia'},
  {code: 'NZ', name: 'New Zealand'},
  {code: 'NI', name: 'Nicaragua'},
  {code: 'NE', name: 'Niger'},
  {code: 'NG', name: 'Nigeria'},
  {code: 'NU', name: 'Niue'},
  {code: 'NF', name: 'Norfolk Island'},
  {code: 'MP', name: 'Northern Mariana Islands'},
  {code: 'NO', name: 'Norway'},
  {code: 'OM', name: 'Oman'},
  {code: 'PK', name: 'Pakistan'},
  {code: 'PW', name: 'Palau'},
  {code: 'PS', name: 'Palestine, State of'},
  {code: 'PA', name: 'Panama'},
  {code: 'PG', name: 'Papua New Guinea'},
  {code: 'PY', name: 'Paraguay'},
  {code: 'PE', name: 'Peru'},
  {code: 'PH', name: 'Philippines'},
  {code: 'PN', name: 'Pitcairn'},
  {code: 'PL', name: 'Poland'},
  {code: 'PT', name: 'Portugal'},
  {code: 'PR', name: 'Puerto Rico'},
  {code: 'QA', name: 'Qatar'},
  {code: 'RE', name: 'Réunion'},
  {code: 'RO', name: 'Romania'},
  {code: 'RU', name: 'Russian Federation'},
  {code: 'RW', name: 'Rwanda'},
  {code: 'BL', name: 'Saint Barthélemy'},
  {code: 'SH', name: 'Saint Helena, Ascension and Tristan da Cunha'},
  {code: 'KN', name: 'Saint Kitts and Nevis'},
  {code: 'LC', name: 'Saint Lucia'},
  {code: 'MF', name: 'Saint Martin (French part)'},
  {code: 'SX', name: 'Saint Martin (Dutch part)'},
  {code: 'SG', name: 'Singapore'},
  {code: 'SK', name: 'Slovakia'},
  {code: 'SI', name: 'Slovenia'},
  {code: 'SB', name: 'Solomon Islands'},
  {code: 'SO', name: 'Somalia'},
  {code: 'ZA', name: 'South Africa'},
  {code: 'GS', name: 'South Georgia and the South Sandwich Islands'},
  {code: 'SS', name: 'South Sudan'},
  {code: 'ES', name: 'Spain'},
  {code: 'LK', name: 'Sri Lanka'},
  {code: 'SD', name: 'Sudan'},
  {code: 'SR', name: 'Suriname'},
  {code: 'SJ', name: 'Svalbard and Jan Mayen'},
  {code: 'SE', name: 'Sweden'},
  {code: 'CH', name: 'Switzerland'},
  {code: 'SY', name: 'Syrian Arab Republic'},
  {code: 'TW', name: 'Taiwan, Province of China'},
  {code: 'TJ', name: 'Tajikistan'},
  {code: 'TZ', name: 'Tanzania, United Republic of'},
  {code: 'TH', name: 'Thailand'},
  {code: 'TL', name: 'Timor-Leste'},
  {code: 'TG', name: 'Togo'},
  {code: 'TK', name: 'Tokelau'},
  {code: 'TO', name: 'Tonga'},
  {code: 'TT', name: 'Trinidad and Tobago'},
  {code: 'TN', name: 'Tunisia'},
  {code: 'TR', name: 'Turkey'},
  {code: 'TM', name: 'Turkmenistan'},
  {code: 'TC', name: 'Turks and Caicos Islands'},
  {code: 'TV', name: 'Tuvalu'},
  {code: 'UG', name: 'Uganda'},
  {code: 'UA', name: 'Ukraine'},
  {code: 'AE', name: 'United Arab Emirates'},
  {code: 'GB', name: 'United Kingdom'},
  {code: 'US', name: 'United States of America'},
  {code: 'UM', name: 'United States Minor Outlying Islands'},
  {code: 'UY', name: 'Uruguay'},
  {code: 'UZ', name: 'Uzbekistan'},
  {code: 'VU', name: 'Vanuatu'},
  {code: 'VE', name: 'Venezuela'},
  {code: 'VN', name: 'Viet Nam'},
  {code: 'VG', name: 'Virgin Islands, British'},
  {code: 'VI', name: 'Virgin Islands, U.S.'},
  {code: 'WF', name: 'Wallis and Futuna'},
  {code: 'EH', name: 'Western Sahara'},
  {code: 'YE', name: 'Yemen'},
  {code: 'ZM', name: 'Zambia'},
  {code: 'ZW', name: 'Zimbabwe'},
];

const SignUpScreen2 = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [emailShow, setEmailShow] = useState('');
  const [showLoginData, setShowLoginData] = useState([]);
  const [showUpdatedData, setshowUpdatedData] = useState([]);
  const [base64Data, setBase64Data] = useState('');
  const Base_url_showImgage = 'https://aitutor.schoolmgmtsys.com/storage/';
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();
  console.log('[[[[[[[[[[[[[', showUpdatedData);
  console.log(showLoginData);
  const [token, setToken] = useState(null);
  const [isFirstLogin, setIsFirstLogin] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        // Fetch token from AsyncStorage
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
          // Parse the JSON token
          const parsedToken = JSON.parse(storedToken);

          // Log the parsed token to see its structure
          console.log('Parsed Token:', parsedToken);

          // Extract is_first_login from the parsed token and set it in state
          const isFirstLoginValue = parsedToken.is_first_login ? 1 : 0;
          setIsFirstLogin(isFirstLoginValue);

          // Optionally, set the full token if you need it
          setToken(storedToken);
        }
      } catch (error) {
        console.log('Error fetching or parsing token: ', error);
      }
    };

    fetchToken();
  }, []);

  console.log(token);

  // useEffect(() => {
  //   const fetchProfileData = async () => {
  //     try {
  //       // Fetch user token data first
  //       const userTokenData = await getUserToken();
  //       let loginData = {};

  //       if (userTokenData?.data?.email) {
  //         setEmailShow(userTokenData.data.email);
  //         setShowLoginData(userTokenData.data); // This sets showLoginData correctly
  //         loginData = userTokenData.data; // Store the data temporarily for later use
  //       } else {
  //         setEmailShow('No email found');
  //       }

  //       // Fetch updated profile data
  //       const updatedProfileData = await getUpdateProfile();
  //       console.log(updatedProfileData);

  //       // Combine both login data and updated profile data
  //       const combinedData = {
  //         first_name:
  //           updatedProfileData?.user?.first_name || loginData.first_name,
  //         last_name: updatedProfileData?.user?.last_name || loginData.last_name,
  //         birth_year:
  //           updatedProfileData?.user?.birth_year || loginData.birth_year,
  //         country: updatedProfileData?.user?.country || loginData.country,
  //         image: updatedProfileData?.user?.image || loginData.image,
  //       };

  //       // Now, set states based on combined data
  //       setFirstName(combinedData.first_name);
  //       setLastName(combinedData.last_name || '');
  //       setBirthYear(combinedData.birth_year || '');
  //       setSelectedCountry(combinedData.country || '');
  //       setSelectedImage(
  //         combinedData.image
  //           ? {uri: `${Base_url_showImgage}${combinedData.image}`}
  //           : null,
  //       );
  //     } catch (error) {
  //       console.error('Error fetching profile data:', error);
  //     }
  //   };

  //   // Fetch data on component mount
  //   fetchProfileData();
  // }, []);
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userTokenData = await getUserToken();
        let loginData = {};
        if (userTokenData?.data?.email) {
          setEmailShow(userTokenData.data.email);
          setShowLoginData(userTokenData.data);
          loginData = userTokenData.data;
        } else {
          setEmailShow('No email found');
        }

        const updatedProfileData = await getUpdateProfile();
        console.log('Updated profile data:', updatedProfileData);

        const combinedData = {
          first_name:
            updatedProfileData?.user?.first_name || loginData.first_name,
          last_name: updatedProfileData?.user?.last_name || loginData.last_name,
          birth_year:
            updatedProfileData?.user?.birth_year || loginData.birth_year,
          country: updatedProfileData?.user?.country || loginData.country,
          image: updatedProfileData?.user?.image || loginData.image,
        };

        console.log('Combined data:', combinedData);

        setFirstName(combinedData.first_name);
        setLastName(combinedData.last_name || '');
        setBirthYear(combinedData.birth_year || '');
        setSelectedCountry(combinedData.country || '');
        setSelectedImage(
          combinedData.image
            ? {uri: `${Base_url_showImgage}${combinedData.image}`}
            : null,
        );
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  const openImagePicker = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        setSelectedImage({uri: image.path});
        RNFS.readFile(image.path, 'base64')
          .then(result => {
            setBase64Data(result);
            console.log('Base64 String:', result);
          })
          .catch(error => {
            console.error('Error reading file:', error);
          });
      })
      .catch(error => {
        console.log('ImagePicker Error: ', error);
      });
  };

  const validateInputs = () => {
    let hasError = false;
    const newErrors = {
      firstName: '',
      lastName: '',
      birthYear: '',
      country: '',
    };

    if (
      !firstName &&
      (!showLoginData.first_name || !showUpdatedData.first_name)
    ) {
      newErrors.firstName = 'Please fill the first name*';
      hasError = true;
    }

    if (!lastName && (!showLoginData.last_name || !showUpdatedData.last_name)) {
      newErrors.lastName = 'Please fill the last name*';
      hasError = true;
    }

    if (
      !birthYear && // Changed to birthYear
      (!showLoginData.birth_year || !showUpdatedData.birth_year) // Changed to birth_year
    ) {
      newErrors.birthYear = 'Please fill the birth year*'; // Changed to birthYear
      hasError = true;
    }
    if (
      !selectedCountry &&
      (!showLoginData.country || !showUpdatedData.country)
    ) {
      newErrors.country = 'Please select a country*';
      hasError = true;
    }

    setErrors(newErrors);
    return !hasError;
  };

  const checkUpdateVlue = async () => {
    const updatedProfileData = await getUpdateProfile();
    console.log(updatedProfileData);
  };
  const handleSave = async () => {
    if (!validateInputs()) return; // Prevent save if validation fails

    setLoading(true);

    const userTokenData = await getUserToken();
    const authToken = userTokenData.token;

    // Debugging: Log values before creating the body
    console.log('Debug - Inputs:', {
      firstName,
      lastName,
      birthYear, // Check the value of birthYear here
      selectedCountry,
      base64Data,
      showUpdatedData,
      showLoginData,
    });

    const body = {
      firstName:
        firstName ||
        showUpdatedData?.user?.first_name ||
        showLoginData?.first_name ||
        '',
      lastName:
        lastName ||
        showUpdatedData?.user?.last_name ||
        showLoginData?.last_name ||
        '',
      birth_year:
        birthYear || // Changed to birthYear
        showUpdatedData?.user?.birth_year || // Changed to birth_year
        showLoginData?.birth_year || // Changed to birth_year
        '',
      // birth_year: '2000',
      country:
        selectedCountry ||
        showUpdatedData?.user?.country ||
        showLoginData?.country ||
        '',
      profileImage: base64Data,
    };

    // Debugging: Log the body before filtering
    console.log('Debug - Body Before Filtering:', body);

    const filteredBody = Object.keys(body).reduce((acc, key) => {
      if (body[key]) {
        acc[key] = body[key];
      }
      return acc;
    }, {});

    // Debugging: Log the filtered body
    console.log('Debug - Filtered Body:', filteredBody);

    try {
      const response = await updateProfile(filteredBody, authToken);
      console.log('Response:', response);

      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Success',
        text2: 'Your profile has been updated successfully',
        visibilityTime: 4000,
      });
      await AsyncStorage.setItem('logged_in_first', '1');
      navigation.navigate('DrawerNavigatore');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePressLogout = async () => {
    try {
      // Remove user data and token from AsyncStorage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userProfile');
      await AsyncStorage.removeItem('logged_in_first'); // Remove 'logged_in_first' value

      // Navigate to SplashScreen after logout
      navigation.navigate('SplashScreen');
    } catch (error) {
      console.error('Error removing data from AsyncStorage:', error);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 20}}>
        <View>
          <TopBar title="Complete Profile" is_first_login={isFirstLogin} />
        </View>
        <View style={styles.EmailView}>
          <TouchableOpacity onPress={openImagePicker}>
            <ImageBackground
              source={selectedImage || require('../assets/prfofileImage.jpeg')}
              style={{
                height: 100,
                width: 100,
                backgroundColor: !selectedImage ? 'white' : 'transparent',
                borderRadius: 50,
                borderColor: colors.mainText,
                borderWidth: 2,
                overflow: 'hidden', // Ensure the icon stays inside the circular image
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {/* View to position the pencil icon in the bottom right inside the image */}
              <View
                style={{
                  position: 'absolute',
                  bottom: 5, // Ensure the icon is slightly away from the bottom edge
                  right: 5, // Ensure the icon is slightly away from the right edge
                  backgroundColor: 'white',
                  borderRadius: 50, // Make the background of the pencil icon circular
                  padding: 5,
                  zIndex: 10, // Ensure the pencil icon is on top of the image
                  elevation: 5, // Adds elevation (for Android) to bring it forward
                }}>
                <Icon name="edit" size={15} color={colors.mainText} />
                {/* Pencil icon */}
              </View>
            </ImageBackground>
          </TouchableOpacity>

          <Text
            style={{
              color: colors.mainText,
              fontWeight: '700',
              fontSize: 16,
              marginVertical: '10%',
            }}>
            {emailShow}
          </Text>
        </View>

        <View style={styles.form}>
          <LabeledTextInput
            label="First Name"
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            error={errors.firstName}
          />

          <LabeledTextInput
            label="Last Name"
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            error={errors.lastName}
          />

          <LabeledTextInput
            label="Birth Year" // Changed label to "Birth Year"
            placeholder="YYYY"
            value={birthYear} // Changed to birthYear
            onChangeText={text => setBirthYear(text)} // Changed to birthYear
            error={errors.birthYear} // Changed to birthYear
            keyboardType="numeric" // Ensures only number input
          />

          <View style={{}}>
            <Text
              style={{
                fontSize: 16,
                color: colors.mainText,
                marginBottom: 10,
                fontWeight: 'bold',
              }}>
              Country
            </Text>

            <View style={[styles.pickerContainer]}>
              <Picker
                selectedValue={selectedCountry}
                onValueChange={itemValue => setSelectedCountry(itemValue)}
                style={[styles.picker]} // Apply text color to Picker
                itemStyle={{color: colors.mainText}} // Apply text color to the Picker items (important for iOS)
              >
                {!selectedCountry ? (
                  <Picker.Item
                    label={
                      showUpdatedData?.user?.country ||
                      showLoginData?.country ||
                      'Select Country'
                    }
                    value=""
                    style={{color: colors.mainText}} // Apply color to the placeholder
                  />
                ) : (
                  <Picker.Item
                    label={selectedCountry}
                    value={selectedCountry}
                    style={{color: colors.mainText}} // Apply color to selected item
                  />
                )}

                {countries
                  .filter(
                    country =>
                      country.name !==
                      (selectedCountry ||
                        showUpdatedData?.user?.country ||
                        showLoginData?.country ||
                        ''),
                  )
                  .map(country => (
                    <Picker.Item
                      key={country.code}
                      label={country.name}
                      value={country.name}
                      style={{color: colors.mainText}} // Apply color to list items
                    />
                  ))}
              </Picker>
            </View>
            {errors.country ? (
              <Text style={styles.errorText}>{errors.country}</Text>
            ) : null}
          </View>
        </View>

        <GlobalButton
          title="Save"
          onPress={handleSave}
          loading={loading}
          buttonStyle={styles.saveButton}
        />
        <View style={{marginTop: '5%', marginBottom: '15%'}}>
          <GlobalButton
            title="Logout"
            onPress={handlePressLogout}
            // loading={loading}
            buttonStyle={styles.saveButton}
          />
          {/* <TouchableOpacity onPress={() => checkUpdateVlue()}>
              <Text>Hoooooooooooooooo</Text>
            </TouchableOpacity> */}
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  EmailView: {
    alignItems: 'center',
    marginTop: '10%',
  },
  dateButton: {
    padding: 10,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    justifyContent: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '100%',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: colors.mainText,
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    justifyContent: 'center',
    height: 45,
    marginBottom: '5%',
    borderColor: colors.mainText, // Explicitly set border color
    backgroundColor: 'transparent', // Remove any default background color if necessary
  },
  picker: {
    color: colors.mainText, // Text color for Picker
    borderWidth: 0, // Ensure no border comes from Picker's internal styling
  },
});

export default SignUpScreen2;
