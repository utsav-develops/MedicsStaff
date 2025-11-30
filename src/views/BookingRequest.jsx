import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, StatusBar } from 'react-native';
import { bold, regular, api_url, work_request_details, img_url, accept, reject, loader, f_l, f_xl, f_s, f_xs } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { connect } from 'react-redux';
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from 'axios';
import LottieView from 'lottie-react-native';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';
import { useCustomTheme } from  '../config/useCustomTheme';

var Sound = require('react-native-sound');

Sound.setCategory('Playback');

var whoosh = new Sound('uber.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
  // loaded successfully
  console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());

});

const BookingRequest = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [work_id, setWorkId] = useState(route.params.work_id);
  const [data, setData] = useState('');
  const { t } = useLocalization();
  const { isDarkMode, toggleTheme, colors } = useCustomTheme();

  useEffect(() => {
    call_work_request_details();
    whoosh.play();
    whoosh.setNumberOfLoops(-1);
    const _unblur = navigation.addListener('blur', async () => {
      whoosh.stop();
    });
    return _unblur;
  }, []);

  const call_work_request_details = async () => {
    await axios({
      method: 'post',
      url: api_url + work_request_details,
      data: { work_request_id: work_id }
    })
      .then(async response => {
        setData(response.data.result);
      })
      .catch(error => {
        
      });
  }

  const call_accept = async () => {
    setLoading(true);
    await axios({
      method: 'post',
      url: api_url + accept,
      data: { work_id: work_id, staff_id: global.id }
    })
      .then(async response => {
        setLoading(false);
        whoosh.stop();
        navigate();
      })
      .catch(error => {
        setLoading(false);
      });
  }

  const call_reject = async () => {
    setLoading(true);
    await axios({
      method: 'post',
      url: api_url + reject,
      data: { work_id: work_id, staff_id: global.id, from: 1 }
    })
      .then(async response => {
        setLoading(false);
        whoosh.stop();
        navigate();
      })
      .catch(error => {
        setLoading(false);
      });
  }

  const navigate = () => {
    navigation.goBack();
  }
  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.theme_bg_three,
      height: '86%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
    },
    header: {
      backgroundColor: colors.theme_bg,
      alignItems: 'center',
      justifyContent: 'center',
      height: '7%'
    },
    footer: {
      backgroundColor: colors.theme_bg,
      alignItems: 'center',
      justifyContent: 'center',
      height: '7%'
    },

    button: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 5,
        borderWidth: 1,
        width:'50%',
        borderColor: 'transparent', // Make border transparent initially
      },
      acceptButton: {
        backgroundColor: 'green',
      },
      declineButton: {
        backgroundColor: 'red',
      },
      buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
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
    <View>
      {loading == false ?
        <View>
          <View style={styles.header} >
            <Text style={{ color: colors.theme_fg_three, fontWeight: 'bold', fontSize: f_l }}>{t('hiNewbooking')}</Text>
          </View>
          <View style={styles.container}>
{/*             <Text style={{ fontSize: f_xl, color: colors.theme_fg, fontWeight: 'bold' }}>Pickup Location</Text> */}
{/*             <View style={{ margin: 5 }} /> */}
            <Text style={{ fontSize: f_s, color: colors.theme_fg_two, fontWeight: 'regular' }}>{data.pickup_address}</Text>
             <View style={{ margin: 10 }} />
             <TouchableOpacity
                           style={[styles.button, styles.declineButton]}
                           onPress={call_reject.bind(this)}>
                           <Text style={styles.buttonText}>{t('decline')}</Text>
                         </TouchableOpacity>
            <View style={{ margin: 10 }} />
            <CountdownCircleTimer
              isPlaying={1}
              duration={30}
              colors={[colors.medics_blue]}
              onComplete={() => {
                call_reject();
              }}
            >
              {() => <Image source={{ uri: img_url + data.static_map }} style={{ height: 160, width: 160, borderRadius: 80 }} />}
            </CountdownCircleTimer>

            <View style={{ margin: 10 }} />
            <TouchableOpacity
                      style={[styles.button, styles.acceptButton]}
                      activeOpacity={1}
                      onPress={call_accept.bind(this)}>
                      <Text style={styles.buttonText}>{t('accept')}</Text>
                    </TouchableOpacity>

            <View style={{ margin: 5 }} />
            <View style={{ borderColor: colors.theme_fg_two, borderWidth: 0.5, width: '80%' }} />
            <View style={{ margin: 10 }} />
            <Text style={{ fontSize: f_xl, color: colors.theme_fg_two, fontWeight: 'bold' }}>{data.work_type_name}</Text>
            <Text style={{ fontSize: f_xl, color: colors.theme_fg_two, fontWeight: 'bold' }}>{global.currency}{data.total}</Text>
            <Text style={{ fontSize: f_xs, color: colors.theme_fg_two, fontWeight: 'bold' }} >{t('estimatedRate')}</Text>
          </View>
          <View style={styles.footer} >
            <Text style={{ color: colors.theme_fg_three, fontWeight: 'bold', fontSize: f_xl }}>{data.first_name}</Text>
          </View>
        </View>
        :
        <View style={{ height: '100%', width: '100%', alignSelf: 'center', justifyContent:'center' }}>
          <LottieView source={loader} autoPlay loop />
        </View>
      }
    </View>
    </>
  );
};

export default connect(null, null)(BookingRequest);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.theme_bg_three,
    height: '86%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  header: {
    backgroundColor: colors.theme_bg,
    alignItems: 'center',
    justifyContent: 'center',
    height: '7%'
  },
  footer: {
    backgroundColor: colors.theme_bg,
    alignItems: 'center',
    justifyContent: 'center',
    height: '7%'
  },

  button: {
      paddingVertical: 20,
      paddingHorizontal: 20,
      borderRadius: 5,
      borderWidth: 1,
      width:'50%',
      borderColor: 'transparent', // Make border transparent initially
    },
    acceptButton: {
      backgroundColor: 'green',
    },
    declineButton: {
      backgroundColor: 'red',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
});
