import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../constants/GlobalStyles'; // Assuming you have colors defined in GlobalStyles

const LabeledDisplay = ({ label, value, error, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity onPress={onPress} style={[styles.inputContainer, error && styles.errorInput]}>
        <Text style={styles.input}>
          {value ? value : 'Select a date'}
        </Text>
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.mainText, // Text color for the label
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    borderColor: colors.mainText, // Border color
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  input: {
    fontSize: 16,
    color: colors.mainText, // Text color for the input
  },
  errorInput: {
    borderColor: 'red', // Red border in case of error
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default LabeledDisplay;
