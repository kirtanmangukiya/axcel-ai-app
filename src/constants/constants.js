import AsyncStorage from '@react-native-async-storage/async-storage';
export const BASE_URL = 'https://aitutor.schoolmgmtsys.com/api';
export const getUserToken = async () => {
  try {
    const storedToken = await AsyncStorage.getItem('userToken');
    return storedToken ? JSON.parse(storedToken) : null;
  } catch (error) {
    console.error('Error retrieving user token from AsyncStorage:', error);
    return null;
  }
};
export const getUpdateProfile = async () => {
  try {
    const storedUpdatedData = await AsyncStorage.getItem('userProfile');
    return storedUpdatedData ? JSON.parse(storedUpdatedData) : null;
  } catch (error) {
    console.error('Error retrieving user token from AsyncStorage:', error);
    return null;
  }
};
