import React, { useState, useRef } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    TextInput,
    View,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar
} from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { connect } from 'react-redux';
import axios from 'axios';
import { bold, regular, api_url, speciality_update, btn_loader, f_xl, f_xs, f_m, register_icon,vaccine_icon,insurance_icon, speciality_icon, expiry_icon } from '../config/Constants';
import DropdownAlert from 'react-native-dropdownalert';
import LottieView from 'lottie-react-native';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';
import { useCustomTheme } from  '../config/useCustomTheme';


const SpecialityDetails = (props) => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [is_enabled, setEnabled] = useState(true);
    let dropDownAlertRef = useRef();
    const { t } = useLocalization();
    const go_back = () => {
        navigation.goBack();
    }
    const { isDarkMode, toggleTheme, colors } = useCustomTheme();

    const navigate = (route) => {
        navigation.navigate(route);
    }

    const call_speciality_update = async () => {
        setLoading(true);
        await axios({
            method: 'post',
            url: api_url + speciality_update,
            data: {
                staff_id: global.id, speciality_type: props.speciality_type, brand: 0,
                color: 0, speciality_name: 0, speciality_number: props.speciality_number
            }
        })
            .then(async response => {
                setLoading(false);
                navigate_doc();
            })
            .catch(error => {
                setLoading(false);
                console.error(error);
                dropDownAlertRef.alertWithType('error', t('validationError'), t('smthgWentWrong'));
            });
    }

    const navigate_doc = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "SpecialityDocument" }],
            })
        );
    }

    const check_validate = async () => {
        if (props.speciality_type == "" || props.speciality_number == "") {
            dropDownAlertRef.alertWithType('error', t('validationError'), t('enterRequiredField'));
        } else {
            call_speciality_update();
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
            fontSize: f_m,
            color: colors.grey,
            fontWeight: 'regular',
            height: 60,
            backgroundColor: colors.text_container_bg,
            width: '100%'
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
                    <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                </TouchableOpacity>
            </View>
            <ScrollView>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: colors.theme_fg_two, fontSize: f_xl, fontWeight: 'bold' }}>{t('addRegulatoryDetails')}</Text>
                    <View style={{ margin: 10 }} />
                    <View style={{ width: '90%' }}>



                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ color: colors.text_grey, fontSize: f_xs, fontWeight: 'bold' }}>{t('registrationType')}</Text>
                            <View style={{ margin: 5 }} />
                            <TouchableOpacity activeOpacity={1} onPress={navigate.bind(this, 'CreateSpecialityType')} style={{ flexDirection: 'row' }}>
                                <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
                                    <Image style={{ height: 32, width: 32, }} source={speciality_icon} />
                                </View>
                                <View pointerEvents='none' style={{ width: '85%', alignItems: 'flex-start', paddingLeft: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg }}>
                                    <TextInput
                                        editable={false}
                                        value={props.speciality_type_lbl}
                                        placeholderTextColor={colors.grey}
                                        style={styles.textinput}
                                        placeholder={t('registrationType')}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>




                       {/* <View style={{ marginBottom: 20 }}>
                            <Text style={{ color: colors.text_grey, fontSize: f_xs, fontWeight: 'bold' }}>{t('dbsExpiry')}</Text>
                            <View style={{ margin: 5 }} />
                            <TouchableOpacity activeOpacity={1} onPress={navigate.bind(this, 'CreateSpecialityExpiryDate')} style={{ flexDirection: 'row' }}>
                                <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
                                    <Image style={{ height: 32, width: 32, }} source={expiry_icon} />
                                </View>
                                <View style={{ width: '85%', alignItems: 'flex-start', paddingLeft: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg }}>
                                    <TextInput
                                        editable={false}
                                        value={props.speciality_name}
                                        placeholderTextColor={colors.grey}
                                        style={styles.textinput}
                                        placeholder={t('dbsCertificateExpiry')}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ color: colors.text_grey, fontSize: f_xs, fontWeight: 'bold' }}>{t('indemnityExpiry')}</Text>
                            <View style={{ margin: 5 }} />
                            <TouchableOpacity activeOpacity={1} onPress={navigate.bind(this, 'CreateSpecialityIndemnity')} style={{ flexDirection: 'row' }}>
                                <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
                                    <Image style={{ height: 32, width: 32, }} source={insurance_icon} />
                                </View>
                                <View style={{ width: '85%', alignItems: 'flex-start', paddingLeft: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg }}>
                                    <TextInput
                                        editable={false}
                                        value={props.speciality_brand}
                                        placeholderTextColor={colors.grey}
                                        style={styles.textinput}
                                        placeholder={t('indemnityExpiry')}
                                    />
                                </View>
                            </TouchableOpacity>
    </View> */}
                                          

                        <View style={{ marginBottom: 20 }}>
                    <Text style={{ color: colors.text_grey, fontSize: f_xs, fontWeight: 'bold' }}>{t('idProofNum')}</Text>
                    <View style={{ margin: 5 }} />
                    <TouchableOpacity activeOpacity={1} onPress={navigate.bind(this, 'CreateSpecialityNumber')} style={{ flexDirection: 'row' }}>
                        <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
                            <Image style={{ height: 32, width: 32, }} source={insurance_icon} />
                        </View>
                        <View pointerEvents='none' style={{ width: '85%', alignItems: 'flex-start', paddingLeft: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg }}>
                            <TextInput
                                editable={false}
                                value={props.speciality_number}
                                placeholderTextColor={colors.grey}
                                style={styles.textinput}
                                placeholder={t('idProofNum')}
                            />
                        </View>
                    </TouchableOpacity>
                </View>


                       
                    </View>
                </View>
            </ScrollView>
            {loading == false ?
                <TouchableOpacity activeOpacity={1} onPress={check_validate.bind(this)} style={{ width: '90%', position: 'absolute', bottom: 20, marginLeft: '5%', backgroundColor: colors.btn_color, borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: colors.theme_fg_two, fontSize: f_m, color: colors.theme_fg_three, fontWeight: 'bold' }}>{t('done')}</Text>
                </TouchableOpacity>
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


function mapStateToProps(state) {
    return {
        speciality_name: state.speciality.speciality_name,
        speciality_brand: state.speciality.speciality_brand,
        speciality_color: state.speciality.speciality_color,
         speciality_type: state.speciality.speciality_type,
         speciality_number: state.speciality.speciality_number,
        speciality_type_lbl: state.speciality.speciality_type_lbl,
    };
}

export default connect(mapStateToProps, null)(SpecialityDetails);