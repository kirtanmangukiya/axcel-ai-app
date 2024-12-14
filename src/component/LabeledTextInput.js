import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Assuming you're using Material Icons
import {colors} from '../constants/GlobalStyles';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const LabeledTextInput = ({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(!secureTextEntry); // Initialize to true if not secureTextEntry

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, error ? styles.errorInput : null]}
          value={value}
          placeholderTextColor={colors.mainText}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword && secureTextEntry} // Toggle secureTextEntry
          {...props}
          // color={Colors.mainText}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeIconContainer}>
            <Icon
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={20}
              color="#5A9BD1"
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    backgroundColor:"white"
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.mainText,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 45,
    borderColor: colors.mainText,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    fontSize: 16,
    color: colors.mainText, // Use colors.mainText here instead of Colors.mainText
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
    padding: 5,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});
export default LabeledTextInput;
