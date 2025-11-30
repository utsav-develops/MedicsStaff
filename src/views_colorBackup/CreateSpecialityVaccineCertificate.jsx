import React, { useState, useEffect, useRef } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    Image,
    SafeAreaView,
    TextInput,
    Keyboard,
    StatusBar
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { normal, bold, regular, f_xl, f_xs, f_m, vaccine_icon } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import { updateSpecialityColor } from '../actions/SpecialityDetailActions';
import { RNCamera } from 'react-native-camera';
import { CheckBox } from '@rneui/themed';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';

const CreateSpecialityVaccineCertificate = (props) => {
  const [isYesChecked, setYesChecked] = useState(false);
  const [isNoChecked, setNoChecked] = useState(false);
  const cameraRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const { t } = useLocalization();

   const takePicture = async () => {
       if (cameraRef.current) {
         try {
           const options = { quality: 0.5, base64: true };
           const data = await cameraRef.current.takePictureAsync(options);
           setCapturedImage(data.uri);
         } catch (error) {
           console.error('Error taking picture:', error);
         }
       }
     };

    const navigation = useNavigation();
    const [speciality_certificate, setSpecialityCertificate] = useState('');
    let dropDownAlertRef = useRef();
    const inputRef = useRef();

    const go_back = () => {
        navigation.goBack();
    }

//     useEffect(() => {
//         setTimeout(() => inputRef.current.focus(), 100)
//     }, []);


    const check_valid = () => {
        if (speciality_certificate) {
            navigate();
        } else {
            dropDownAlertRef.alertWithType('error', t('validationError'), t('fillUpCheckbox'));
        }
    }

    const navigate = async () => {
        Keyboard.dismiss()
        props.updateSpecialityColor(speciality_certificate);
        go_back();
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
     const handleYesPress = () => {
            setYesChecked(true);
            setNoChecked(false);
            setSpecialityCertificate("Yes");

          };
        const handleNoPress = () => {
          setYesChecked(false);
          setNoChecked(true);
          setSpecialityCertificate("No");
          // Add any additional logic if needed for "No"
        };

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
            <View style={{ margin: 20 }} />
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_xl, fontWeight: 'bold' }}>{t('vaccineEvidence')}</Text>
                <View style={{ margin: 5 }} />
                <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontWeight: 'normal' }}>{t('pleaseProvideVaccineEvidence')}</Text>
                <View style={{ margin: 20 }} />
                <View style={{ width: '80%' }}>
{/*                     <View style={{ flexDirection: 'row' }}> */}
{/*                         <View style={{ width: '25%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}> */}
{/*                             <Image style={{ height: 32, width: 32, }} source={vaccine_icon} /> */}
{/*                         </View> */}
                        <View style={{ width: '75%', alignItems: 'flex-start', paddingLeft: 10, backgroundColor: colors.text_container_bg }}>
                        {/* To Replace Camera Code starts here*/}
                        <CheckBox
                                title="Yes"
                                checked={isYesChecked}
                                onPress={handleYesPress}
                                checkedIcon="dot-circle-o"
                                uncheckedIcon="circle-o"

                              />
                              <CheckBox
                                title="No"
                                checked={isNoChecked}
                                onPress={handleNoPress}
                                checkedIcon="dot-circle-o"
                                uncheckedIcon="circle-o"
                              />
{/*                             <TextInput */}
{/*                                 ref={inputRef} */}
{/*                                 secureTextEntry={false} */}
{/*                                 placeholder="Vaccine Evidence" */}
{/*                                 placeholderTextColor={colors.grey} */}
{/*                                 style={styles.textinput} */}
{/*                                 onChangeText={TextInputValue => */}
{/*                                     setSpecialityCertificate(TextInputValue)} */}

{/*                             /> */}

                            {/* To Replace Camera Code ends here*/}
                        </View>
{/*                     </View> */}
                    <View style={{ margin: 30 }} />
                    <TouchableOpacity onPress={check_valid.bind(this)} activeOpacity={1} style={{ width: '100%', backgroundColor: colors.btn_color, borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: colors.theme_fg_two, fontSize: f_m, color: colors.theme_fg_three, fontWeight: 'bold' }}>{t('done')}</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </SafeAreaView>
        {drop_down_alert()}
        </>
    );
};

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

const mapDispatchToProps = (dispatch) => ({
    updateSpecialityColor: (data) => dispatch(updateSpecialityColor(data)),
});

export default connect(null, mapDispatchToProps)(CreateSpecialityVaccineCertificate);