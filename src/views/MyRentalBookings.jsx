import React from "react";
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  StatusBar
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { screenHeight, screenWidth, normal, f_s  } from '../config/Constants';
import { useCustomTheme } from  '../config/useCustomTheme';


const MyRentalBookings = (props) => {
  const navigation = useNavigation();
  const { isDarkMode, toggleTheme, colors } = useCustomTheme();

  const go_back = () => {
    navigation.goBack();
  }
  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      height: screenHeight,
      width: screenWidth,
      backgroundColor: colors.lite_bg
    },
    header: {
      height: 60,
      backgroundColor: colors.lite_bg,
      flexDirection: 'row',
      alignItems: 'center'
    },
  });

  return (
  <>
      <View
      style={{
        backgroundColor: colors.theme_bg,
        height: Platform.OS === 'ios' ? 50 : null,
      }}>
      <StatusBar
        backgroundColor={colors.theme_bg}
      />
    </View>
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={colors.theme_bg}
      />
      <View style={[styles.header]}>
    
      </View>
      <ScrollView>
      <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_s, fontWeight: 'normal' }}>In Process...</Text>
      </ScrollView>
    </SafeAreaView>
    </>
  );
};



export default MyRentalBookings;
