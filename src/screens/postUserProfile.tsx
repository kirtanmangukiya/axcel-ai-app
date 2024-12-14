import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {postUserProfile} from '../component/constants';

const UserProfileScreen = () => {
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await postUserProfile();
      } catch (error) {
        console.error('Error in UserProfileScreen:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <View>
      <Text>User Profile Screen</Text>
    </View>
  );
};

export default UserProfileScreen;
