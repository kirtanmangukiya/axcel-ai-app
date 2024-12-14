// src/screens/VerifyScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRoute } from '@react-navigation/native';

const VerifyScreen = () => {
  const route = useRoute();
  const { token } = route.params || {};

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Verification Token: {token}
      </Text>
      <Button title="Go Back" onPress={() => console.log('Go back action')} />
    </View>
  );
};

export default VerifyScreen;
