import React, {useState} from 'react';
import {View, Text, Alert} from 'react-native';
import CustomTopBar from '../component/CustomTopBar';
import GlobalTextInput from '../component/LabeledTextInput';
import LabeledTextInput from '../component/LabeledTextInput';
import GlobalButton from '../component/GlobalButton';

const TestOneScreen = ({navigation}) => {
  const handleSearch = () => {
    Alert.alert('Test One', 'Search button pressed!');
  };
  const [username, setUsername] = useState('');

  const handleRefresh = () => {
    Alert.alert('Test One', 'Refresh button pressed!');
  };

  const [password, setPassword] = useState('');

  return (
    <View style={{flex: 1}}>
      <LabeledTextInput label="Email Address" placeholder="Enter your email" />
      <View style={{flex: 1,  alignItems: 'center'}}>
        <GlobalButton />
      </View>
    </View>
  );
};

export default TestOneScreen;
