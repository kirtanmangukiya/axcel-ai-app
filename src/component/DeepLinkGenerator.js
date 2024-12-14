// src/utils/DeepLinkGenerator.js

import {Linking} from 'react-native';

// Simulate deep linking
export const triggerDeepLink = (path, params = {}) => {
  const baseUrl = 'myapp://'; // Use your custom scheme

  let url = `${baseUrl}${path}`;
  const queryString = new URLSearchParams(params).toString();

  if (queryString) {
    url += `?${queryString}`;
  }

  // Simulate deep link being opened
  Linking.openURL(url);
};
