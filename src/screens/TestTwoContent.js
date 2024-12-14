import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import CustomTopBar from '../component/CustomTopBar';


const TestTwoContent = ({ navigation }) => {
  const handleSearch = () => {
    Alert.alert('Test Two', 'Search button pressed!');
  };

  const handleRefresh = () => {
    Alert.alert('Test Two', 'Refresh button pressed!');
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomTopBar
        navigation={navigation}
        title="Test Two"
        onSearchPress={handleSearch}
        onRefreshPress={handleRefresh}
      />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Test Two Screen Content</Text>
        <Button
          title="Go to Inside Test Screen"
          onPress={() => navigation.navigate('InsideTest')}
        />
      </View>
    </View>
  );
};

export default TestTwoContent;
