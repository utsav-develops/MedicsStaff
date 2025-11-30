// GoLiveButton.jsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import * as colors from '../assets/css/Colors';
import { useCustomTheme } from  '../config/useCustomTheme';

const GoLiveButton = ({ onPress, isLive }) => {
  const { isDarkMode, toggleTheme, colors } = useCustomTheme();

const styles = StyleSheet.create({
  liveButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    // other styles ...
  },
  live: {
    backgroundColor: colors.success, // color when online
  },
  offline: {
    backgroundColor: colors.error, // color when offline
  },
  liveButtonText: {
    color: '#fff',
    // other text styles ...
  },
  // ... add any additional styles
});
  return (
    <TouchableOpacity style={[styles.liveButton, isLive ? styles.live : styles.offline]} onPress={onPress}>
      <Text style={styles.liveButtonText}>{isLive ? 'Go Offline' : 'Go Live'}</Text>
    </TouchableOpacity>
  );
};



export default GoLiveButton;
