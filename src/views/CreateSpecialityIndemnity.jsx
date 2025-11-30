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
import { normal, bold, regular, f_xl, f_xs, f_m, insurance_icon } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import { updateSpecialityBrand } from '../actions/SpecialityDetailActions';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';
import { useCustomTheme } from  '../config/useCustomTheme';


const CreateSpecialityIndemnity = (props) => {
    const navigation = useNavigation();
    const [speciality_brand, setSpecialityBrand] = useState('');
    let dropDownAlertRef = useRef();
    const inputRef = useRef();
    const { t } = useLocalization();
    const go_back = () => {
        navigation.goBack();
    }
   const { isDarkMode, toggleTheme, colors } = useCustomTheme();

  


    const check_valid = () => {
        if (speciality_brand) {
            navigate();
        } else {
            dropDownAlertRef.alertWithType('error', t('validationError'), t('enterSpecialityBrand'));
        }
    }


    const [date, setDate] = useState(new Date()); // State to hold the selected date
    const [showDatePicker, setShowDatePicker] = useState(false); // State to control the visibility of the date picker

const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);

    const day = ('0' + currentDate.getDate()).slice(-2); // Add leading 0 if needed
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Add leading 0 if needed, months are 0-indexed
    const year = currentDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`; // Formats date to 'dd/mm/yyyy'

    setSpecialityBrand(formattedDate);
};

const showDatepicker = () => {
    setShowDatePicker(true);


};
    const navigate = async () => {
        Keyboard.dismiss()
        props.updateSpecialityBrand(speciality_brand);
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
    const styles = StyleSheet.create({
        header: {
            height: 60,
            backgroundColor: colors.lite_bg,
            flexDirection: 'row',
            alignItems: 'center'
        },
        datePickerButton: {
            // Your styles for the button
        },
        datePickerText: {
            // Your styles for the text
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
            <View style={{ margin: 20 }} />
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_xl, fontWeight: 'bold' }}>{t('indemnityExpiry')}</Text>
                <View style={{ margin: 5 }} />
                <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontWeight: 'normal' }}>{t('pleaseSelectInsuranceExpiry')}</Text>
                <View style={{ margin: 20 }} />
                <View style={{ width: '80%' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: '25%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
                            <Image style={{ height: 32, width: 32, }} source={insurance_icon} />
                        </View>
                        <View style={{ width: '75%', alignItems: 'flex-start', paddingLeft: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg }}>
                        <TouchableOpacity onPress={showDatepicker} style={styles.datePickerButton}>
                            <Text style={styles.datePickerText}>{date.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                            />
                        )}

                        </View>
                    </View>
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



const mapDispatchToProps = (dispatch) => ({
    updateSpecialityBrand: (data) => dispatch(updateSpecialityBrand(data)),
});

export default connect(null, mapDispatchToProps)(CreateSpecialityIndemnity);