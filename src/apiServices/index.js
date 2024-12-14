// apiService.js

import {Image} from 'react-native';
import {BASE_URL} from '../constants/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const apiCall = async (endpoint, method = 'POST', body = null) => {
  console.log('Hello', body);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      throw new Error(`${response}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

export const updateProfile = async (data, token) => {
  console.log('Sending data: ', data, token);
  const dateStr = '07/09/2024';

  // Split the date string into parts
  const [month, day, year] = dateStr.split('/');

  // Format the date as YYYY-MM-DD
  const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(
    2,
    '0',
  )}`;

  console.log('000000000000000000', formattedDate); // Outputs: 2024-09-07

  const payload = {
    first_name: data.firstName,
    last_name: data.lastName,
    birth_year: data.birth_year,
    country: data?.country,
    image: data?.profileImage,
  };

  try {
    const response = await fetch(`${BASE_URL}/profile-update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    await AsyncStorage.setItem('userProfile', JSON.stringify(result));

    console.log('Profile updated and saved:', result);
    return result;
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
};

// export const updateProfile = async (data, token) => {
//   console.log('Data being sent:', data, token);

//   const formData = new FormData();

//   // Adding form data fields
//   formData.append('first_name', 'DILAWAR1');
//   formData.append('last_name',  'BHATTI1');
//   formData.append('birth_year',  '1947q');
//   formData.append('country',  'PALIS1');

//   // Adding the image only if it exists
//   if (data.profileImage) {
//     formData.append('image', {
//       uri: data.profileImage,
//       type: 'image/jpeg', // Make sure this type matches the actual image type
//       name: 'profileImage.jpg', // You can customize this name based on the actual file
//     });
//   }

//   try {
//     const response = await fetch(`${BASE_URL}/profile-update`, {
//       method: 'PUT',
//       headers: {
//         Authorization: `Bearer ${token}`, // Add Bearer token for authentication
//         // Do not set Content-Type here, fetch automatically handles it with FormData
//       },
//       body: formData,
//     });

//     // Checking if the response is successful
//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
//     }

//     // Trying to parse the response as JSON
//     const result = await response.json();
//     console.log('Profile updated successfully:', result);
//     return result;
//   } catch (error) {
//     console.error('Profile update error:', error);
//     throw error;
//   }
// };
// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Modal,
//   ActivityIndicator,
//   Alert,
//   ImageBackground,
//   Image,
// } from 'react-native';
// import {Picker} from '@react-native-picker/picker';
// import {colors} from '../constants/GlobalStyles';
// import LabeledTextInput from '../component/LabeledTextInput';
// import GlobalButton from '../component/GlobalButton';
// import TopBar from '../component/TopBar';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import {updateProfile} from '../apiServices';
// import {getUpdateProfile, getUserToken} from '../constants/constants';
// import Toast from 'react-native-toast-message';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import ImageCropPicker from 'react-native-image-crop-picker';
// import RNFS from 'react-native-fs';

// const countries = [
//   {code: 'MY', name: 'Malaysia'},
//   {code: 'AF', name: 'Afghanistan'},
//   {code: 'AL', name: 'Albania'},
//   {code: 'DZ', name: 'Algeria'},
//   {code: 'AS', name: 'American Samoa'},
//   {code: 'AD', name: 'Andorra'},
//   {code: 'AO', name: 'Angola'},
// ];

// const SignUpScreen2 = ({navigation}) => {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [birthDate, setBirthDate] = useState('');
//   const [selectedCountry, setSelectedCountry] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [emailShow, setEmailShow] = useState('');
//   const [showLoginData, setShowLoginData] = useState([]);
//   const [showUpdatedData, setshowUpdatedData] = useState([]);
//   const [base64Data, setBase64Data] = useState('');
//   const Base_url_showImgage = 'https://aitutor.schoolmgmtsys.com/storage/';
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     const fetchEmail = async () => {
//       const userTokenData = await getUserToken();

//       if (userTokenData?.data?.email) {
//         setEmailShow(userTokenData.data.email);
//         setShowLoginData(userTokenData.data);
//       } else {
//         setEmailShow('No email found');
//       }
//     };

//     const fetchUpdatedProfile = async () => {
//       const userTokenData = await getUpdateProfile();

//       if (userTokenData) {
//         setshowUpdatedData(userTokenData);

//         // Set firstName state
//         setFirstName(
//           userTokenData?.user?.first_name
//             ? userTokenData?.user?.first_name
//             : showLoginData.first_name
//             ? showLoginData.first_name
//             : '',
//         );

//         // Set lastName state
//         setLastName(
//           userTokenData?.user?.last_name
//             ? userTokenData?.user?.last_name
//             : showLoginData.last_name
//             ? showLoginData.last_name
//             : '',
//         );

//         // Set birthDate state (year)
//         setBirthDate(
//           userTokenData?.user?.birthdate
//             ? userTokenData?.user?.birthdate
//             : showLoginData.brithdate
//             ? showLoginData.brithdate
//             : '',
//         );

//         // Set country state
//         setSelectedCountry(
//           userTokenData?.user?.country
//             ? userTokenData?.user?.country
//             : showLoginData.country
//             ? showLoginData.country
//             : '',
//         );

//         // Set profile image state
//         setSelectedImage(
//           userTokenData?.user?.image
//             ? {uri: `${Base_url_showImgage}${userTokenData?.user?.image}`}
//             : showLoginData?.image
//             ? {uri: `${Base_url_showImgage}${showLoginData?.image}`}
//             : null,
//         );
//       } else {
//         console.log('No updated profile data found');
//       }
//     };

//     fetchEmail();
//     fetchUpdatedProfile();
//   }, []);

//   const openImagePicker = () => {
//     ImageCropPicker.openPicker({
//       width: 300,
//       height: 400,
//       cropping: true,
//     })
//       .then(image => {
//         setSelectedImage({uri: image.path});
//         RNFS.readFile(image.path, 'base64')
//           .then(result => {
//             setBase64Data(result);
//             console.log('Base64 String:', result);
//           })
//           .catch(error => {
//             console.error('Error reading file:', error);
//           });
//       })
//       .catch(error => {
//         console.log('ImagePicker Error: ', error);
//       });
//   };

//   const validateInputs = () => {
//     let hasError = false;
//     const newErrors = {
//       firstName: '',
//       lastName: '',
//       birthDate: '',
//       country: '',
//     };

//     if (
//       !firstName &&
//       (!showLoginData.first_name || !showUpdatedData.first_name)
//     ) {
//       newErrors.firstName = 'Please fill the first name';
//       hasError = true;
//     }

//     if (!lastName && (!showLoginData.last_name || !showUpdatedData.last_name)) {
//       newErrors.lastName = 'Please fill the last name';
//       hasError = true;
//     }

//     if (
//       !birthDate &&
//       (!showLoginData.birthdate || !showUpdatedData.birthdate)
//     ) {
//       newErrors.birthDate = 'Please fill the date of birth';
//       hasError = true;
//     }

//     if (
//       !selectedCountry &&
//       (!showLoginData.country || !showUpdatedData.country)
//     ) {
//       newErrors.country = 'Please select a country';
//       hasError = true;
//     }

//     setErrors(newErrors);
//     return !hasError;
//   };

//   const handleSave = async () => {
//     if (!validateInputs()) return; // Prevent save if validation fails

//     setLoading(true);

//     const userTokenData = await getUserToken();
//     const authToken = userTokenData.token;

//     const body = {
//       firstName:
//         firstName ||
//         showUpdatedData?.user?.first_name ||
//         showLoginData?.first_name ||
//         '',
//       lastName:
//         lastName ||
//         showUpdatedData?.user?.last_name ||
//         showLoginData?.last_name ||
//         '',
//       year:
//         birthDate ||
//         showUpdatedData?.user?.birthdate ||
//         showLoginData?.birthdate ||
//         '',
//       country:
//         selectedCountry ||
//         showUpdatedData?.user?.country ||
//         showLoginData?.country ||
//         '',
//       profileImage:
//         base64Data ||
//         showUpdatedData?.user?.image ||
//         showLoginData?.image ||
//         null,
//     };

//     const filteredBody = Object.keys(body).reduce((acc, key) => {
//       if (body[key]) {
//         acc[key] = body[key];
//       }
//       return acc;
//     }, {});

//     try {
//       const response = await updateProfile(filteredBody, authToken);
//       console.log('Response:', response);

//       Toast.show({
//         type: 'success',
//         position: 'top',
//         text1: 'Success',
//         text2: 'Your profile has been updated successfully',
//         visibilityTime: 4000,
//       });

//       navigation.navigate('HomeScreen');
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       Alert.alert('Error', 'Failed to update profile. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePressLogout = async () => {
//     await AsyncStorage.removeItem('userToken');
//     navigation.navigate('LoginScreen');
//   };

//   const handleDateChange = (event, selectedDate) => {
//     if (event.type === 'set') {
//       const currentDate = selectedDate || new Date();
//       const formattedDate = currentDate.toISOString().split('T')[0];
//       setBirthDate(formattedDate);
//     }
//     setShowDatePicker(false);
//   };

//   return (
//     <View style={{flex: 1, backgroundColor: '#F8F8F8'}}>
//       <TopBar title="Sign Up" />

//       <ScrollView
//         contentContainerStyle={{flexGrow: 1}}
//         style={{paddingHorizontal: 20, paddingTop: 20}}>
//         <View style={styles.EmailView}>
//           <TouchableOpacity onPress={openImagePicker}>
//             <ImageBackground
//               source={selectedImage || require('../assets/profile.png')}
//               style={{
//                 height: 100,
//                 width: 100,
//                 backgroundColor: !selectedImage ? 'white' : 'transparent', // Background only when no selectedImage
//                 borderRadius: 50, // Circle shape
//                 borderColor: colors.mainText,
//                 borderWidth: 2,
//                 overflow: 'hidden', // Contain the image within the circle
//                 justifyContent: 'flex-end',
//                 alignItems: 'flex-end',
//               }}>
//               <View
//                 style={{
//                   flex: 1,
//                   justifyContent: 'flex-end',
//                   alignItems: 'flex-end',
//                 }}>
//                 <Image
//                   source={require('../assets/camera.png')}
//                   style={{
//                     width: 20,
//                     height: 20,
//                     marginBottom: 5,
//                     marginRight: 5,
//                   }}
//                 />
//               </View>
//             </ImageBackground>
//           </TouchableOpacity>

//           <Text
//             style={{
//               color: '#1E1E1E',
//               fontWeight: '700',
//               fontSize: 16,
//               marginVertical: '10%',
//             }}>
//             {emailShow}
//           </Text>
//         </View>

//         <View style={styles.form}>
//           <LabeledTextInput
//             label="First Name"
//             value={firstName}
//             onChangeText={setFirstName}
//             error={errors.firstName}
//           />

//           <LabeledTextInput
//             label="Last Name"
//             value={lastName}
//             onChangeText={setLastName}
//             error={errors.lastName}
//           />

//           <LabeledTextInput
//             label="Birth Date"
//             value={birthDate}
//             onFocus={() => setShowDatePicker(true)}
//             error={errors.birthDate}
//           />

//           <View style={{}}>
//             <Text style={{fontSize: 16, color: '#333', marginBottom: 10}}>
//               Country
//             </Text>
//             <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={selectedCountry}
//                 onValueChange={itemValue => setSelectedCountry(itemValue)}
//                 style={styles.picker}>
//                 {/* Always show the selected country or default option */}
//                 {!selectedCountry && (
//                   <Picker.Item
//                     label={
//                       showUpdatedData?.user?.country ||
//                       showLoginData?.country ||
//                       'Select Country'
//                     }
//                     value=""
//                   />
//                 )}

//                 {/* List countries, skipping the one that matches the selected value */}
//                 {countries
//                   .filter(
//                     country =>
//                       country.name !==
//                       (showUpdatedData?.user?.country ||
//                         showLoginData?.country ||
//                         ''),
//                   )
//                   .map(country => (
//                     <Picker.Item
//                       key={country.code}
//                       label={country.name}
//                       value={country.name}
//                     />
//                   ))}
//               </Picker>
//             </View>
//             {errors.country ? (
//               <Text style={styles.errorText}>{errors.country}</Text>
//             ) : null}
//           </View>
//           {/* {errors.country ? (
//             <Text style={styles.errorText}>{errors.country}</Text>
//           ) : null} */}
//         </View>

//         <GlobalButton
//           title="Save"
//           onPress={handleSave}
//           loading={loading}
//           buttonStyle={styles.saveButton}
//         />

//         <TouchableOpacity
//           onPress={handlePressLogout}
//           style={{
//             marginVertical: 20,
//             alignSelf: 'center',
//             marginBottom: '15%',
//           }}>
//           <Text style={{fontSize: 14, color: '#FF0000'}}>Log out</Text>
//         </TouchableOpacity>
//       </ScrollView>

//       {showDatePicker && (
//         <DateTimePicker
//           value={new Date()}
//           mode="date"
//           display="default"
//           onChange={handleDateChange}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   EmailView: {
//     alignItems: 'center',
//     marginTop: '10%',
//   },
//   dateButton: {
//     padding: 10,
//     paddingVertical: 14,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     justifyContent: 'center',
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     width: '100%',
//     marginBottom: 20,
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 12,
//     marginTop: 5,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     width: '80%',
//     alignItems: 'center',
//   },
//   modalText: {
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   modalButton: {
//     backgroundColor: colors.mainText,
//     padding: 10,
//     borderRadius: 5,
//   },
//   modalButtonText: {
//     color: 'white',
//     fontSize: 16,
//   },
// });

// export default SignUpScreen2;
