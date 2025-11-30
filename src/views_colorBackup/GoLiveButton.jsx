// GoLiveButton.jsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import * as colors from '../assets/css/Colors';

const GoLiveButton = ({ onPress, isLive }) => {
  return (
    <TouchableOpacity style={[styles.liveButton, isLive ? styles.live : styles.offline]} onPress={onPress}>
      <Text style={styles.liveButtonText}>{isLive ? 'Go Offline' : 'Go Live'}</Text>
    </TouchableOpacity>
  );
};

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

export default GoLiveButton;
