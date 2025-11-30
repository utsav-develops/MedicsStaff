//Fixed
import React, { useState, useEffect, useRef } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  SafeAreaProvider,
  ScrollView,
  StatusBar,
  TextInput
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { bold, regular, api_url, get_kyc, btn_loader, update_kyc, f_xl, f_xs, f_m } from '../config/Constants';
import axios from 'axios';
import DropdownAlert from 'react-native-dropdownalert';
import LottieView from 'lottie-react-native';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';

const KycVerification = (props) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [on_load, setOnLoad] = useState(0);
  const [aadhar_number, setAadharNumber] = useState('');
  const [account_number, setAccountNumber] = useState('');
  const [bank_name, setBankName] = useState('');
  const [sort_code, setsortCode] = useState('');
  const [pan_number, setPanNumber] = useState('');
  const { t } = useLocalization();

  let dropDownAlertRef = useRef();

  const go_back = () => {
    navigation.goBack();
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      call_get_kyc();
    });

    return (
      unsubscribe
    );
  }, []);

  const call_get_kyc = () => {
    setLoading(true);
    axios({
      method: 'post',
      url: api_url + get_kyc,
      data: { staff_id: global.id }
    })
      .then(async response => {
        setLoading(false);
        if (response.data.status == 1) {
          setAadharNumber(response.data.result.aadhar_number);
          setAccountNumber(response.data.result.bank_account_number);
          setBankName(response.data.result.bank_name);
          setsortCode(response.data.result.sort_code);
//           setPanNumber(response.data.result.pan_number);
        }
        setOnLoad(1);
      })
      .catch(error => {
        setLoading(false);
        dropDownAlertRef.alertWithType('error',  t('validationError'), t('smthgWentWrong'));
      });
  }

  const check_validation = () => {
    if (bank_name == "" || account_number == "" || sort_code == "" || aadhar_number == "") {
      dropDownAlertRef.alertWithType('error',  t('validationError'), t('enterRequiredField'));
    } else {
      call_update_kyc();
    }
  }

  const call_update_kyc = () => {
    setLoading(true);
    axios({
      method: 'post',
      url: api_url + update_kyc,
      data: { staff_id: global.id, bank_name: bank_name, bank_account_number: account_number, sort_code: sort_code, aadhar_number: aadhar_number, pan_number: 0 }
    })
      .then(async response => {
        setLoading(false);
        dropDownAlertRef.alertWithType('success', t('successfullyUpdated'), t('bankNameUpdated'));
        go_back();
      })
      .catch(error => {
      console.error(error);
        setLoading(false);
        alert('Sorry something went wrong')
      });
  }

  const navigate = (route) => {
    navigation.navigate(route);
  }

  const drop_down_alert = () => {
    return (
      <DropdownAlert
        ref={(ref) => {
          if (ref) {
            dropDownAlertRef = ref;
          }
        }}
      />
    )
  }

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
          <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: f_xl, fontWeight: 'bold' }}>{t('updateBankDetails')}</Text>
        </View>
      </View>
      <ScrollView>
        {on_load == 1 &&
          <View>
            <ScrollView>
              <View style={{ alignItems: 'center' }}>
                <View style={{ margin: 10 }} />
                <View style={{ width: '90%' }}>
                  <View style={{ marginBottom: 20 }}>
                    <Text style={{ color: colors.text_grey, fontSize: f_xs, fontWeight: 'bold' }}>{t('bankName')}</Text>
                    <View style={{ margin: 5 }} />
                    <TouchableOpacity activeOpacity={1}  style={{ flexDirection: 'row' }}>
                      <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
                        <Icon type={Icons.FontAwesome} name="bank" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                      </View>
                      <View style={{ width: '85%', alignItems: 'flex-start', paddingLeft: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg }}>
                        <TextInput
                          value={bank_name}
                          placeholderTextColor={colors.grey}
                          style={styles.textinput}
                          onChangeText={TextInputValue =>
                            setBankName(TextInputValue)}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{ marginBottom: 20 }}>
                    <Text style={{ color: colors.text_grey, fontSize: f_xs, fontWeight: 'bold' }}>{t('AccNum')}</Text>
                    <View style={{ margin: 5 }} />
                    <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row' }}>
                      <View style={{ widths: '15%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
                        <Icon type={Icons.Octicons} name="number" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                      </View>
                      <View style={{ width: '85%', alignItems: 'flex-start', paddingLeft: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg }}>
                        <TextInput
                          value={account_number}
                          placeholderTextColor={colors.grey}
                          style={styles.textinput}
                          onChangeText={TextInputValue =>
                            setAccountNumber(TextInputValue)}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{ marginBottom: 20 }}>
                    <Text style={{ color: colors.text_grey, fontSize: f_xs, fontWeight: 'bold' }}>{t('sortCode')}</Text>
                    <View style={{ margin: 5 }} />
                    <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row' }}>
                      <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
                        <Icon type={Icons.MaterialCommunityIcons} name="unicode" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                      </View>
                      <View style={{ width: '85%', alignItems: 'flex-start', paddingLeft: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg }}>
                        <TextInput
                          value={sort_code}
                          placeholderTextColor={colors.grey}
                          style={styles.textinput}
                          onChangeText={TextInputValue =>
                            setsortCode(TextInputValue)}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{ marginBottom: 20 }}>
                    <Text style={{ color: colors.text_grey, fontSize: f_xs, fontWeight: 'bold' }}>{t('idProof')}</Text>
                    <View style={{ margin: 5 }} />
                    <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row' }}>
                      <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
                        <Icon type={Icons.Octicons} name="number" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                      </View>
                      <View style={{ width: '85%', alignItems: 'flex-start', paddingLeft: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg }}>
                        <TextInput
                          value={aadhar_number}
                          placeholderTextColor={colors.grey}
                          style={styles.textinput}
                          onChangeText={TextInputValue =>
                            setAadharNumber(TextInputValue)}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
{/*                   <View style={{ marginBottom: 20 }}> */}
{/*                     <Text style={{ color: colors.text_grey, fontSize: f_xs, fontWeight: 'bold' }}>PAN Number</Text> */}
{/*                     <View style={{ margin: 5 }} /> */}
{/*                     <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row' }}> */}
{/*                       <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}> */}
{/*                         <Icon type={Icons.MaterialCommunityIcons} name="unicode" color={colors.theme_fg_two} style={{ fontSize: 30 }} /> */}
{/*                       </View> */}
{/*                       <View style={{ width: '85%', alignItems: 'flex-start', paddingLeft: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg }}> */}
{/*                         <TextInput */}
{/*                           value={pan_number} */}
{/*                           placeholderTextColor={colors.grey} */}
{/*                           style={styles.textinput} */}
{/*                           onChangeText={TextInputValue => */}
{/*                             setPanNumber(TextInputValue)} */}
{/*                         /> */}
{/*                       </View> */}
{/*                     </TouchableOpacity> */}
{/*                   </View> */}
                </View>
              </View>
            </ScrollView>
          </View>
        }
        <View style={{ margin: 40 }} />
      </ScrollView>
      {loading == false ?
        <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 100, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity onPress={check_validation.bind(this)} activeOpacity={1} style={{ width: '90%', backgroundColor: colors.btn_color, borderRadius: 10, height: 50, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.theme_fg_two, fontSize: f_m, color: colors.theme_fg_three, fontWeight: 'bold' }}>{t('submit')}</Text>
          </TouchableOpacity>
        </View>
        :
        <View style={{ height: 50, width: '90%', alignSelf: 'center' }}>
          <LottieView source={btn_loader} autoPlay loop />
        </View>
      }

    </SafeAreaView>
    {drop_down_alert()}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: colors.theme_bg,
    flexDirection: 'row',
    alignItems: 'center'
},
  textinput: {
    fontSize: f_m,
    color: colors.grey,
    fontWeight: 'regular',
    height: 60,
    backgroundColor: colors.text_container_bg,
    width: '100%',

  },
});

export default KycVerification;