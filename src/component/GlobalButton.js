import React from 'react';
import {StyleSheet, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {colors} from '../constants/GlobalStyles';

const GlobalButton = ({
  onPress,
  title,
  backgroundColor,
  textColor,
  style,
  textStyle,
  loading, // Add a loading prop
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.mainView,
        {backgroundColor: backgroundColor || colors.mainText},
        style,
      ]}
      onPress={onPress}
      disabled={loading} // Disable button when loading
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.white} />
      ) : (
        <Text style={[styles.btn, {color: textColor || colors.white}, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default GlobalButton;

const styles = StyleSheet.create({
  mainView: {
    height: 50,
    width: '100%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    fontSize: 16,
    fontWeight: '600',
  },
});
