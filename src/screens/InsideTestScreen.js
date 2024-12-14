import React from 'react';
import { View, Text, Alert } from 'react-native';
import CustomTopBar from '../component/CustomTopBar';


const InsideTestScreen = ({ navigation }) => {
  const handleSearch = () => {
    Alert.alert('Inside Test', 'Search button pressed!');
  };

  const handleRefresh = () => {
    Alert.alert('Inside Test', 'Refresh button pressed!');
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomTopBar
        navigation={navigation}
        title="Inside Test"
        onSearchPress={handleSearch}
        onRefreshPress={handleRefresh}
      />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Inside Test Screen Content</Text>
      </View>
    </View>
  );
};

export default InsideTestScreen;
