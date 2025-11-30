import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import * as colors from '../assets/css/Colors';
import { bold, location_enable } from '../config/Constants';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from '@react-native-community/geolocation';
import { useCustomTheme } from  '../config/useCustomTheme';

const LocationEnable = () => {

  const navigation = useNavigation();
  console.log(Geolocation.getCurrentPosition());
  const enable_gps = () =>{
    Geolocation.getCurrentPosition( async(position) => {
      navigation.navigate('Splash');
    }, error => alert('Please try again once') , console.log(Geolocation.getCurrentPosition()),
    {enableHighAccuracy: true, timeout: 10000 });
  }
    const { isDarkMode, toggleTheme, colors } = useCustomTheme();
const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  button: {
    paddingVertical: 15, // This increases the padding to make the button taller
    paddingHorizontal: 10, // Keep the horizontal padding to maintain the design
    borderRadius: 10,
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.theme_bg,
    minHeight: 48, // Ensuring the button is at least 48dp tall
  },
  buttonText: {
    color: colors.medics_blue,
    fontWeight: 'bold',
    fontSize: 20, // Increase the font size for better legibility
  },
});

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ height:'100%',width: '100%', justifyContent:'center'}}>
        <View style={{ height:250 }}>
          <LottieView source={location_enable} autoPlay loop />
        </View>
        <View style={{ margin:10}} />
        <View style={{alignItems: 'center', justifyContent:'center', margin: 10}}>
          <Text style={{fontWeight: 'bold', fontSize:18, color:colors.green,}}>Please allow {global.app_name} to enable your GPS for accurate pickup.</Text>
        </View>
        <View style={{ margin:20}} /> 
        <TouchableOpacity onPress={enable_gps.bind(this)} style={styles.button}>
        <Text style={styles.buttonText}>Enable GPS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}



export default LocationEnable;
