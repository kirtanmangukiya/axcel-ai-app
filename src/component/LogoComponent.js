import React, {useContext} from 'react';
import {Image, StyleSheet, Dimensions, View} from 'react-native';
import {SettingsContext} from '../../App';

const LogoComponent = ({containerStyle, logoStyle}) => {
  const {width, height} = Dimensions.get('window');
  const settings = useContext(SettingsContext);

  if (!settings || !settings.logo) {
    return null; // Handle case where settings or logo is not available
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <Image
        source={{
          uri: `https://aitutor.schoolmgmtsys.com/storage/${settings.logo}`,
        }}
        style={[styles.logo(width, height), logoStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Default container styles
    alignItems: 'center',
    justifyContent: 'center',
    // flex: 1,
  },
  logo: (width, height) => ({
    width: width * 0.34,
    height: height * 0.11,
    resizeMode: 'contain',
  }),
});

export default LogoComponent;
