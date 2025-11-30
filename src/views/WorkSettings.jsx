import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  isEnabled,
  Switch
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { f_25, bold, img_url, api_url, change_staff_settings, get_staff_settings, loader, payment_methods, app_name, wallet, f_xs, f_s, f_m, f_xl, f_30, regular } from '../config/Constants';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';
import { useCustomTheme } from  '../config/useCustomTheme';

const WorkSettings = (props) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [shared_status, setSharedStatus] = useState(false);
   const { t } = useLocalization();
  const { isDarkMode, toggleTheme, colors } = useCustomTheme();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      call_get_staff_settings();
  });

  return (
      unsubscribe
  );
  }, []);

  const go_back = () => {
    navigation.goBack();
  }

  call_get_staff_settings = async () => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + get_staff_settings,
      data: {staff_id: global.id}
    })
    .then(async response => {
      setLoading(false);
      if( response.data.data.shared_booking_status == 1){
        setSharedStatus(true);
      }if(response.data.data.shared_booking_status == 0){
        setSharedStatus(false);
      }
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong');
    });
  }

  shared_toggleSwitch = (value) => {
    if(value){
      setSharedStatus(value)
      call_change_staff_settings(1);
    }else{
      setSharedStatus(value)
      call_change_staff_settings(0);
    }  
  }

  const call_change_staff_settings = (status) => {
    setLoading(true);
    axios({
        method: 'post',
        url: api_url + change_staff_settings,
        data: { id: global.id, shared_booking_status: status}
    })
    .then(async response => {
      setLoading(false);
      if(response.data.data == 0){
        setSharedStatus(false)
        call_get_staff_settings();
      }else if(response.data.data == 1){
        setSharedStatus(true)
        call_get_staff_settings();
      }
    })
    .catch(error => {
        setLoading(false);
        alert('Sorry something went wrong')
    });
  }
  const styles = StyleSheet.create({
    header: {
      height: 60,
      backgroundColor: colors.theme_bg,
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
    <SafeAreaView style={{ backgroundColor: colors.lite_bg, flex: 1 }}>

      <View style={[styles.header]}>
        <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
          <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize: 30 }} />
        </TouchableOpacity>
        <View activeOpacity={1} style={{ width: '85%', alignItems: 'flex-start', justifyContent: 'center' }}>
          <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: f_xl, fontWeight: 'bold' }}>{t('workSetting')}</Text>
        </View>
      </View>
      <View style={{ backgroundColor: colors.theme_bg_three, padding: 10, margin: 10, borderRadius: 10, borderWidth:1, borderColor: colors.theme_bg }}>
        <View style={{ flexDirection:'row', width:'100%', padding:10}}>
          <View style={{width:'70%'}}>
              <Text style={{ fontWeight: 'bold', fontSize:18, color:colors.theme_fg_two}}>{t('enableSharedBookingStatus')}</Text>
          </View>
          <View style={{width:'30%'}}>
            <Switch
                trackColor={{ false: "#C0C0C0", true: "#fcdb00" }}
                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={shared_toggleSwitch}
                value={shared_status}
            /> 
          </View>
      </View>
      {loading == true &&
        <View style={{ height: 50, width: '90%', alignSelf: 'center' }}>
          <LottieView source={loader} autoPlay loop />
        </View>
      }
    </View>
    </SafeAreaView>
    </>
  );
};



export default WorkSettings;