import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CommonActions } from '@react-navigation/native';
import TestTwoContent from './TestTwoContent';
import InsideTestScreen from './InsideTestScreen';

const Stack = createStackNavigator();

const TestTwoScreen = ({ navigation }) => {
  React.useEffect(() => {
    // Listen for navigation events to reset the stack
    const unsubscribe = navigation.addListener('focus', () => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'TestTwoContent' }],
        })
      );
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TestTwoContent"
        component={TestTwoContent}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="InsideTest"
        component={InsideTestScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default TestTwoScreen;
