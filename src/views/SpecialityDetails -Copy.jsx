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

const SpecialityDetails = (props) => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [is_enabled, setEnabled] = useState(true);
    let dropDownAlertRef = useRef();

    const go_back = () => {
        navigation.goBack();
    }

    const navigate = (route) => {
        navigation.navigate(route);
    }

    const call_speciality_update = async () => {
        setLoading(true);
        await axios({
            method: 'post',
            url: api_url + speciality_update,
            data: {
                staff_id: global.id, speciality_type: props.speciality_type, brand: props.speciality_brand,
                color: props.speciality_color, speciality_name: props.speciality_name, speciality_number: props.speciality_number
            }
        })
            .then(async response => {
                setLoading(false);
                navigate_doc();
            })
            .catch(error => {
                setLoading(false);
                dropDownAlertRef.alertWithType('error', 'Validation error', 'Sorry something went wrong');
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
        if (props.speciality_brand == "" || props.speciality_color == "" ||
            props.speciality_name == "" ||
            props.speciality_type == "" || props.speciality_number == "") {
            dropDownAlertRef.alertWithType('error', 'Validation error', 'Please enter all the required fields');
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

    return (
        <SafeAreaView style={{ backgroundColor: colors.lite_bg, flex: 1 }}>
            <StatusBar
                backgroundColor={colors.theme_bg}
            />
            <View style={[styles.header]}>
                <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                </TouchableOpacity>
            </View>
            <ScrollView>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: colors.theme_fg_two, fontSize: f_xl, fontWeight: 'bold' }}>Add Your Regulatory Details</Text>
                    <View style={{ margin: 10 }} />
                    <View style={{ width: '90%' }}>


                    <View style={{ marginBottom: 20 }}>
                            <Text style={{ color: colors.text_grey, fontSize: f_xs, fontWeight: 'bold' }}>Registration Number</Text>
                            <View style={{ margin: 5 }} />
                            <TouchableOpacity activeOpacity={1} onPress={navigate.bind(this, 'CreateSpecialityNumber')} style={{ flexDirection: 'row' }}>
                                <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
                                    <Image style={{ height: 32, width: 32, }} source={register_icon} />
                                </View>
                                <View pointerEvents='none' style={{ width: '85%', alignItems: 'flex-start', paddingLeft: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg }}>
                                    <TextInput
                                        editable={false}
                                        value={props.speciality_number}
                                        placeholderTextColor={colors.grey}
                                        style={styles.textinput}
                                        placeholder="Registration Number"
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>



                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ color: colors.text_grey, fontSize: f_xs, fontWeight: 'bold' }}>Speciality Type</Text>
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
                                        placeholder="Speciality Type"
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>




                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ color: colors.text_grey, fontSize: f_xs, fontWeight: 'bold' }}>DBS Expiry Date</Text>
                            <View style={{ margin: 5 }} />
                            <TouchableOpacity activeOpacity={1} onPress={navigate.bind(this, 'CreateSpecialityExpiryDate')} style={{ flexDirection: 'row' }}>
                                <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
                                    <Image style={{ height: 32, width: 32, }} source={expiry_icon} />
                                </View>
                                <View pointerEvents='none' style={{ width: '85%', alignItems: 'flex-start', paddingLeft: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg }}>
                                    <TextInput
                                        editable={false}
                                        value={props.speciality_name}
                                        placeholderTextColor={colors.grey}
                                        style={styles.textinput}
                                        placeholder="DBS Certificate Expiry Date"
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ color: colors.text_grey, fontSize: f_xs, fontWeight: 'bold' }}>Indemnity Insurance Expiry Date</Text>
                            <View style={{ margin: 5 }} />
                            <TouchableOpacity activeOpacity={1} onPress={navigate.bind(this, 'CreateSpecialityIndemnity')} style={{ flexDirection: 'row' }}>
                                <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
                                    <Image style={{ height: 32, width: 32, }} source={insurance_icon} />
                                </View>
                                <View pointerEvents='none' style={{ width: '85%', alignItems: 'flex-start', paddingLeft: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg }}>
                                    <TextInput
                                        editable={false}
                                        value={props.speciality_brand}
                                        placeholderTextColor={colors.grey}
                                        style={styles.textinput}
                                        placeholder="Indemnity Insurance Expiry Date"
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ color: colors.text_grey, fontSize: f_xs, fontWeight: 'bold' }}>Vaccine Certificate</Text>
                            <View style={{ margin: 5 }} />
                            <TouchableOpacity activeOpacity={1} onPress={navigate.bind(this, 'CreateSpecialityVaccineCertificate')} style={{ flexDirection: 'row' }}>
                                <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
                                    <Image style={{ height: 32, width: 32, }} source={vaccine_icon} />
                                </View>
                                <View pointerEvents='none' style={{ width: '85%', alignItems: 'flex-start', paddingLeft: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg }}>
                                    <TextInput
                                        editable={false}
                                        value={props.speciality_color}
                                        placeholderTextColor={colors.grey}
                                        style={styles.textinput}
                                        placeholder="Vaccination Evidence"
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                      
                       
                    </View>
                </View>
            </ScrollView>
            {loading == false ?
                <TouchableOpacity activeOpacity={1} onPress={check_validate.bind(this)} style={{ width: '90%', position: 'absolute', bottom: 20, marginLeft: '5%', backgroundColor: colors.btn_color, borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: colors.theme_fg_two, fontSize: f_m, color: colors.theme_fg_three, fontWeight: 'bold' }}>Done</Text>
                </TouchableOpacity>
            :
                <View style={{ height: 50, width: '90%', alignSelf: 'center' }}>
                    <LottieView source={btn_loader} autoPlay loop />
                </View>
            }
            {drop_down_alert()}
        </SafeAreaView>
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

function mapStateToProps(state) {
    return {
        speciality_name: state.speciality.speciality_name,
        speciality_brand: state.speciality.speciality_brand,
        speciality_color: state.speciality.speciality_color,
        speciality_number: state.speciality.speciality_number,
        speciality_type: state.speciality.speciality_type,
        speciality_type_lbl: state.speciality.speciality_type_lbl,
    };
}

export default connect(mapStateToProps, null)(SpecialityDetails);