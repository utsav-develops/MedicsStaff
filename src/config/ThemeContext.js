import React, { createContext, useState, useContext } from 'react';
import { lightTheme, darkTheme } from '../assets/css/Colors';

export const ThemeContext = createContext({
  colors: lightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const colors = isDarkMode ? lightTheme : darkTheme;


  const toggleTheme = () => {
    setIsDarkMode(previousState => !previousState);
  };

  return (
    <ThemeContext.Provider value={{ colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
