import React, { useState, useEffect, useRef } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    TextInput,
    StatusBar
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { normal, bold, regular, month_names, f_xl, f_xs, f_m } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import { updateDateOfBirth } from '../actions/RegisterActions';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';

const CreateDateOfBirth = (props) => {
    const navigation = useNavigation();
    const [date_of_birth, setDateOfBirth] = useState('');
    const [dob_label, setDobLable] = useState('Click and select the date');
    const [is_date_picker_visible, setDatePickerVisibility] = useState(false);
    let dropDownAlertRef = useRef();
    const inputRef = useRef();
    const { t } = useLocalization();
    const go_back = () => {
        navigation.goBack();
    }

    useEffect(() => {

    }, []);


    const check_valid = () => {
        if (date_of_birth) {
            navigate();
        } else {
            dropDownAlertRef.alertWithType('error',  t('validationError'), t('selectDOB'));
        }
    }

    const navigate = async () => {
        props.updateDateOfBirth(date_of_birth);
        navigation.navigate('CreateReferralCode');
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

    const show_date_picker = () => {
        setDatePickerVisibility(true);
    };

    const hide_date_picker = () => {
        setDatePickerVisibility(false);
    };

    const handle_confirm = (date) => {
        console.warn("A date has been picked: ", date);
        hide_date_picker();
        set_default_date(new Date(date), 1);
    };

    const set_default_date = async (currentdate) => {
        let datetime =
            (await (currentdate.getDate() < 10 ? "0" : "")) +
            currentdate.getDate() +
            "-" +
            (currentdate.getMonth() + 1 < 10 ? "0" : "") +
            (currentdate.getMonth() + 1) +
            "-" +
            currentdate.getFullYear();
        let label =
            (await (currentdate.getDate() < 10 ? "0" : "")) +
            currentdate.getDate() +
            " " +
            month_names[currentdate.getMonth()] +
            ", " + currentdate.getFullYear();
        setDobLable(label);
        setDateOfBirth(datetime);
    };

    const date_picker = () => {
        return (
            <DateTimePickerModal
                isVisible={is_date_picker_visible}
                mode="date"
                date={new Date()}
                maximumDate={new Date(Date.now() + 10 * 60 * 1000)}
                is24Hour={false}
                onConfirm={handle_confirm}
                onCancel={hide_date_picker}
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
                    <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                </TouchableOpacity>
            </View>
            <View style={{ margin: 20 }} />
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_xl, fontWeight: 'bold' }}>{t('enterDOB')}</Text>
                <View style={{ margin: 5 }} />
                <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontWeight: 'normal' }}>{t('needEnterDOB')}</Text>
                <View style={{ margin: 20 }} />
                <View style={{ width: '80%' }}>
                        <TouchableOpacity activeOpacity={1} onPress={show_date_picker.bind(this)}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '25%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
                                <Icon type={Icons.MaterialIcons} name="event" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                            </View>
                            <View style={{ width: '75%', alignItems: 'flex-start', paddingLeft: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg, }}>
                            <TextInput
                                ref={inputRef}
                                secureTextEntry={false}
                                placeholder={t('registrationNumber')}
                                value={dob_label}
                                editable={false}
                                placeholderTextColor={colors.grey}
                                style={styles.textinput}
                                onChangeText={TextInputValue =>
                                setDateOfBirth(TextInputValue)}
                            />
                            </View>
                            </View>
                        </TouchableOpacity>
                    <View style={{ margin: 30 }} />
                    <TouchableOpacity onPress={check_valid.bind(this)} activeOpacity={1} style={{ width: '100%', backgroundColor: colors.btn_color, borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: colors.theme_fg_two, fontSize: f_m, color: colors.theme_fg_three, fontWeight: 'bold' }}>{t('next')}</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </SafeAreaView>
        {drop_down_alert()}
        {date_picker()}
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
        width: '100%',
    },
});

const mapDispatchToProps = (dispatch) => ({
    updateDateOfBirth: (data) => dispatch(updateDateOfBirth(data)),
});

export default connect(null, mapDispatchToProps)(CreateDateOfBirth);