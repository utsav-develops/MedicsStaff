import React, { useState, useEffect, useRef } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    FlatList,
    StatusBar
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { bold, regular, speciality_type_list, api_url, f_xl, f_m } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import { updateSpecialityType, updateSpecialityTypeLbl } from '../actions/SpecialityDetailActions';
import { CheckBox } from '@rneui/themed';
import axios from 'axios';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';
import { useCustomTheme } from  '../config/useCustomTheme';


const CreateSpecialityType = (props) => {
    const navigation = useNavigation();
    const [speciality_type, setSpecialityType] = useState(0);
    const [speciality_type_lbl, setSpecialityTypeLbl] = useState(0);
    const [loading, setLoading] = useState(false);
    const [speciality_categories, setSpecialityCategories] = useState([]);
    let dropDownAlertRef = useRef();
    const { t } = useLocalization();

    const go_back = () => {
        navigation.goBack();
    }
  const { isDarkMode, toggleTheme, colors } = useCustomTheme();

    useEffect(() => {
        call_speciality_type_list();
    }, []);

    const call_speciality_type_list = async () => {
        setLoading(true);
        await axios({
            method: 'post',
            url: api_url + speciality_type_list,
            data: { lang: global.lang }
        })
            .then(async response => {
                setLoading(false);
                setSpecialityCategories(response.data.result);
            })
            .catch(error => {
                setLoading(false);
                dropDownAlertRef.alertWithType('error', t('error'), t('smthgWentWrong'));
            });
    }

    const check_valid = () => {
        if (speciality_type) {
            navigate();
        } else {
            dropDownAlertRef.alertWithType('error', t('validationError'), t('selectSpecialityType'));
        }
    }

    const navigate = async () => {
        props.updateSpecialityType(speciality_type);
        props.updateSpecialityTypeLbl(speciality_type_lbl);
        go_back();
    }

    const update_speciality_type = (id, name) => {
        setSpecialityType(id);
        setSpecialityTypeLbl(name);
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
            <View style={{ margin: 20 }} />
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_xl, fontWeight: 'bold' }}>{t('selectRegistrationType')}</Text>
                <View style={{ margin: 20 }} />
                <View style={{ width: '80%' }}>
                    <FlatList
                        data={speciality_categories}
                        renderItem={({ item, index }) => (
                            <CheckBox
                                checked={speciality_type === item.id}
                                onPress={() => update_speciality_type(item.id, item.speciality_type)}
                                title={item.speciality_type}
                                checkedColor={colors.btn_color}
                                checkedIcon="dot-circle-o"
                                uncheckedIcon="circle-o"
                            />
                        )}
                        keyExtractor={item => item.id}
                    />
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
    updateSpecialityType: (data) => dispatch(updateSpecialityType(data)),
    updateSpecialityTypeLbl: (data) => dispatch(updateSpecialityTypeLbl(data)),
});

export default connect(null, mapDispatchToProps)(CreateSpecialityType);