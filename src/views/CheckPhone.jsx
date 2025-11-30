import React, { useState, useRef } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    StatusBar
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { normal, bold, regular, check_phone,btn_loader, api_url, f_l, f_xs, f_m } from '../config/Constants';
import PhoneInput from "react-native-phone-number-input";
import DropdownAlert from 'react-native-dropdownalert';
import axios from 'axios';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';
import LottieView from 'lottie-react-native';
import { useCustomTheme } from  '../config/useCustomTheme';




const CheckPhone = (props) => {
    const navigation = useNavigation();
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [formattedValue, setFormattedValue] = useState("");
    const phoneInput = useRef();
    let dropDownAlertRef = useRef();
    const { t } = useLocalization();
    const check_valid = () => {
        if (phoneInput.current?.isValidNumber(value)) {
            call_check_phone();

        } else {
            dropDownAlertRef.alertWithType('error', t('validationError'), t('enterValidPhn'));
        }
    }
      const { isDarkMode, toggleTheme, colors } = useCustomTheme();


    const call_check_phone = async () => {
        setLoading(true);
        await axios({
            method: 'post',
            url: api_url + check_phone,
            data: { phone_with_code: formattedValue }
        })
            .then(async response => {
                setLoading(false);
                navigate(response.data.result);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
                dropDownAlertRef.alertWithType('error', t('error'), t('smthgWentWrong'));
            });
    }

    const navigate = async (data) => {
        if (data.is_available == 1) {
            navigation.navigate('Password', { phone_number: formattedValue });
        } else {
            navigation.navigate('OTP', { otp: data.otp, phone_with_code: formattedValue, country_code: "+" + phoneInput.current?.getCallingCode(), phone_number: value, id: 0, from: "register" });
        }
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

    const styles = StyleSheet.create({
        header: {
            height: 60,
            backgroundColor: colors.lite_bg,
            flexDirection: 'row',
            alignItems: 'center'
        },
        textinput: {
            fontSize: f_l,
            color: colors.grey,
            fontWeight: 'regular',
            height: 60,
            backgroundColor: '#FAF9F6'
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

            <View style={[styles.header]} />
            <View style={{ margin: 20 }} />
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_l, fontWeight: 'bold' }}>{t('enterPhonenum')}</Text>
                <View style={{ margin: 5 }} />
                <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontWeight: 'normal' }}>{t('needEnter')}</Text>
                <View style={{ margin: 20 }} />
                <View style={{ width:120, height:100, position:'absolute', zIndex:10, left:0}}/>
                <View style={{ width: '80%' }}>
                    <PhoneInput
                        ref={phoneInput}
                        defaultValue={value}
                        defaultCode={"NP"}
                        onChangeText={(text) => {
                            setValue(text);
                        }}

                        codeTextStyle={{ placeholderTextColor: colors.theme_bg_two }}
                        onChangeFormattedText={(text) => {
                            setFormattedValue(text);
                        }}
                        withDarkTheme
                        autoFocus
                    />
                    <View style={{ margin: 30 }} />
                    {loading == false ?
                        <TouchableOpacity onPress={check_valid.bind(this)} activeOpacity={1} style={{ width: '100%', backgroundColor: colors.btn_color, borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: colors.theme_fg_two, fontSize: f_m, color: colors.theme_fg_three, fontWeight: 'bold' }}>{t('logIn')}</Text>
                        </TouchableOpacity>
                    :
                    <View style={{ height: 50, width: '90%', alignSelf: 'center' }}>
                        <LottieView source={btn_loader} autoPlay loop />
                    </View>
                    }
                </View>

            </View>

        </SafeAreaView>
        {drop_down_alert()}
        </>
    );
};



export default CheckPhone;