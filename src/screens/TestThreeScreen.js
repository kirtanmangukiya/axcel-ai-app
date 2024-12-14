import React from 'react';
import { View, Text, Alert } from 'react-native';
import CustomTopBar from '../component/CustomTopBar';


const TestThreeScreen = ({ navigation }) => {
  const handleSearch = () => {
    Alert.alert('Test Three', 'Search button pressed!');
  };

  const handleRefresh = () => {
    Alert.alert('Test Three', 'Refresh button pressed!');
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomTopBar
        navigation={navigation}
        title="Test Three"
        onSearchPress={handleSearch}
        onRefreshPress={handleRefresh}
      />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Test Three Screen Content</Text>
      </View>
    </View>
  );
};

export default TestThreeScreen;
