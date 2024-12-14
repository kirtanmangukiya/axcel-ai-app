// CustomFlag.js
import React from 'react';
import { Flag as OriginalFlag } from 'react-native-country-picker-modal';

// Define a custom Flag component with default parameters
const CustomFlag = ({ countryCode = 'US', style = {} }) => {
  return <OriginalFlag countryCode={countryCode} style={style} />;
};

export default CustomFlag;
