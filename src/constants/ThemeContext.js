import React, {createContext, useState, useEffect} from 'react';
import {Appearance, useColorScheme} from 'react-native';

// Create a context for the theme
export const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(colorScheme);

  // Update theme based on system preference
  useEffect(() => {
    setTheme(colorScheme);
  }, [colorScheme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};
const lightTheme = {
  backgroundColor: '#FFFFFF',
  textColor: '#000000',
};

const darkTheme = {
  backgroundColor: '#000000',
  textColor: '#FFFFFF',
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};
