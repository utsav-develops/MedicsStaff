import React, { useState, useEffect, useRef } from "react";
import {
    Modal,
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    ScrollView,
    Image,
    StatusBar,
    FlatList,
    Platform
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { normal, bold, img_url, api_url, add_wallet, no_data_loader, income_icon, expense_icon, payment_methods, app_name, wallet, f_xs, f_s, f_m, f_xl, f_30, regular } from '../config/Constants';
import DropShadow from "react-native-drop-shadow";
import RazorpayCheckout from 'react-native-razorpay';
import RBSheet from "react-native-raw-bottom-sheet";
import DialogInput from 'react-native-dialog-input';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import Moment from 'moment';
import DropdownAlert from 'react-native-dropdownalert';
import { Share } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';
import { useCustomTheme } from  '../config/useCustomTheme';
import nurse_refer from '../assets/img/nurse_refer.png';


const ReferralDetails = () => {
    const navigation = useNavigation();
    let dropDownAlertRef = useRef();
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(0);
    const [payment_methods_list, setPaymentMethodsList] = useState([]);
    const wallet_ref = useRef(null);
    const [data, setData] = useState([]);
    const [all, setAll] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [receives, setReceives] = useState([]);
    const [isDialogVisible, setDialogVisible] = useState(false);
    const [wallet_amount, setWalletAmount] = useState(0);
    const [filter, setFilter] = useState(1);
    const [flutterwave_id, setFlutterwaveId] = useState(0);
    const [isQRCodeVisible, setQRCodeVisible] = useState(false);
    const { t } = useLocalization();
    const { isDarkMode, toggleTheme, colors } = useCustomTheme();

    const go_back = () => {
        navigation.goBack();
    }

    const [referralMessage, setReferralMessage] = useState("");
    const [referralCode, setReferralCode] = useState("");

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            call_wallet();
            call_staff_referral_message();
        });

        return unsubscribe;
    }, []);

    const filterReferralReceives = () => {
            return receives.filter(item => item.message.includes("Referral Bonus"));
    }

    const call_staff_referral_message = () => {
        setLoading(true);
        axios({
            method: 'post',
            url: api_url + 'staff/get_referral_message', // replace with your endpoint
            data: { staff_id: global.id, lang: 'en' }
        })
            .then(response => {
                setLoading(false);
                setReferralMessage(response.data.result.referral_message);
                setReferralCode(response.data.code);
            })
            .catch(error => {
                setLoading(false);
                alert('Sorry something went wrong');
            });
    }

    const call_wallet = () => {
        setLoading(true);
        axios({
            method: 'post',
            url: api_url + wallet,
            data: { id: global.id }
        })
            .then(async response => {
                setLoading(false);
                setWalletAmount(response.data.result.wallet);
                setAll(response.data.result.all);
                setExpenses(response.data.result.expenses);
                setReceives(response.data.result.receives);
                console.log(response.data.result.receives);
                setFilter(1);
                setData(response.data.result.all);
            })
            .catch(error => {
                setLoading(false);
                alert('Sorry something went wrong');
            });
    }

    const close_dialogbox = () => {
        setDialogVisible(false);
    }

    const shareReferralCode = async () => {
        try {
            const result = await Share.share({
                message: `Start Locum with [App Name] and use my referral code ${referralCode} to get [referral_amount] into your wallet. Download the app here: [App Download Link]`,
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const drop_down_alert = () => {
        return (
            <DropdownAlert
                ref={(ref) => {
                    if (ref) {
                        dropDownAlertRef = ref;
                    }
                }}
            />
        );
    }


    const show_list = ({ item }) => (
    <>
        <View style={{ flexDirection: 'row', width: '100%', padding: 10, marginTop: 5}}>
            <View style={{ width: '20%', alignItems: 'flex-start', justifyContent: 'center' }}>
                <View style={{ height: 50, width: 50 }}>
                    <Image source={income_icon} style={{ flex: 1, height: undefined, width: undefined }} />
                </View>
            </View>
            <View style={{ width: '50%', alignItems: 'flex-start', justifyContent: 'center' }}>
                <Text style={{ color: colors.text_grey, fontSize: f_xs, fontWeight: 'normal' }}>{Moment(item.created_at).format("DD-MMM-YYYY")}</Text>
                <View style={{ margin: 2 }} />
                <Text style={{ color: colors.theme_fg_two, fontSize: f_s, fontWeight: 'normal' }}>{item.message}</Text>
            </View>
            <View style={{ width: '30%', alignItems: 'flex-end', justifyContent: 'center' }}>
                <Text style={{ color: colors.success, fontSize: f_m, fontWeight: 'normal' }}>+ {global.currency}{item.amount}</Text>
            </View>
        </View>
        <View style={{width:'70%',backgroundColor: colors.medics_grey, height: 1, alignSelf: 'center', marginTop: 5}} />
        </>
    );


    const toggleQRCodeModal = () => {
        setQRCodeVisible(prev => !prev);
    };

    const styles = StyleSheet.create({
        safeAreaView: {
            backgroundColor: colors.lite_bg,
            flex: 1
        },
        header: {
            height: 60,
            backgroundColor: colors.theme_bg,
            flexDirection: 'row',
            alignItems: 'center'
        },
        backButton: {
            width: '15%',
            alignItems: 'center',
            justifyContent: 'center'
        },
        backIcon: {
            fontSize: 30,
            color: colors.theme_fg_three
        },
        headerTitle: {
            width: '85%',
            color: colors.theme_fg_three,
            fontSize: f_xl,
            fontWeight: 'bold'
        },
        scrollView: {
            flex: 1
        },
        container: {
            padding: 20
        },
        referralSection: {
            borderRadius: 0,
            marginBottom: 0,
            shadowColor: "#000",
            shadowRadius: 20,
        },
        referralHeading: {
            fontSize: 22,
            fontWeight: 'bold',
            color: colors.text_grey,
            marginBottom: 5,
            textAlign: "center"
        },
        referralText: {
            fontSize: 16,
            color: colors.medics_grey,
            marginBottom: 15,
            padding: 10,
        },
        referralCodeContainer: {
            backgroundColor: colors.dark,
            borderRadius: 0,
            padding: 5,
            width: '100%',
            marginBottom: 15,
            justifyContent: 'center',
            alignItems: 'center',
        },
        referralCodeLabel: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text_grey,
            marginBottom: 5,
            textAlign: "center"
        },
        referralCodeLabel1: {
            fontSize: 18,
            fontWeight: 'normal',
            color: colors.medics_grey,
            marginBottom: 5,
        },
        referralCode: {
            fontSize: 26,
            fontWeight: 'bold',
            color: colors.medics_grey,
            textAlign: "center"
        },
        referralCodeRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        referralCodeColumn: {
            flexDirection: 'column',
        },
        qrCodeButton: {
            marginLeft: 10
        },
        qrCodeIcon: {
            fontSize: 80,
            color: colors.medics_blue,
        },
        shareButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.button,
            borderRadius: 5,
            padding: 10,
            justifyContent: 'center'
        },
        shareButtonText: {
            color: colors.medics_blue,
            fontWeight: 'bold',
            fontSize: 20,
            marginRight: 10,
            justifyContent: 'center'
        },
        shareIcon: {
            color: colors.medics_blue,
            fontSize: 20
        },
        listItem: {
            flexDirection: 'row',
            width: '100%',
            marginTop: 10,
            marginBottom: 10
        },
        dateText: {
            width: '20%',
            color: colors.text_grey,
            fontSize: f_xs,
            fontWeight: 'normal'
        },
        messageText: {
            width: '50%',
            color: colors.theme_fg_two,
            fontSize: f_s,
            fontWeight: 'normal'
        },
        amountText: {
            width: '30%',
            textAlign: 'right',
            color: colors.success,
            fontSize: f_m,
            fontWeight: 'normal'
        },
        noDataView: {
            height: 300,
            width: 300,
            alignSelf: 'center'
        },
        modalView: {
            position: 'absolute',
            top: 115,
            alignSelf: 'center',
            backgroundColor: "white",
            borderRadius: 20,
            padding: 35,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
        },
        closeModalButton: {
            backgroundColor: colors.medics_blue,
            padding: 10,
            borderRadius: 15,
        },
        closeModalButtonText: {
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: f_xl,
        },
        segment_active_bg: {
            padding: 5,
            width: 100,
            backgroundColor: colors.theme_bg,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10
        },
        segment_active_fg: {
            color: colors.theme_fg_three,
            fontSize: 14,
            fontWeight: 'normal'
        },
        segment_inactive_bg: {
            padding: 5,
            width: 100,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10
        },
        segment_inactive_fg: {
            color: colors.text_grey,
            fontSize: 14,
            fontWeight: 'normal'
        },
        overlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }
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

            <SafeAreaView style={{ backgroundColor: colors.dark, flex: 1 }}>
                <View style={[styles.header]}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => navigation.goBack()}
                        style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize: 30 }} />
                    </TouchableOpacity>
                    <View activeOpacity={1} style={{ width: '85%', alignItems: 'flex-start', justifyContent: 'center' }}>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: f_xl, fontWeight: 'bold' }}>{t('referralDetails')}</Text>
                    </View>
                </View>

                <View style={{ flex: 1 }}>
                    <View>
                        <View style={styles.referralSection}>
                            <View style={{ width: '100%', alignItems: 'center' }}>
                                <View style={{ height: 200, width: '100%' }}>
                                 <Image source={nurse_refer} style={{ flex: 1, height: undefined, width: undefined }} />
                                  </View>
{/*                                 <Text style={styles.referralText}> {referralMessage}</Text> */}
                            </View>
                            <View style={{margin: 5}} />
                            <View style={styles.referralCodeContainer}>
{/*                                 <Text style={styles.referralCodeLabel}>{t('yourReferralCode')}</Text> */}


                                    <View style={styles.referralCodeRow}>
                                    <TouchableOpacity onPress={toggleQRCodeModal} style={styles.qrCodeButton}>
                                        <Icon type={Icons.MaterialIcons} name="qr-code" style={styles.qrCodeIcon} />
                                    </TouchableOpacity>
                                    <View style={styles.referralCodeColumn}>
                                     <Text style={styles.referralCode}>{referralCode}</Text>
                                     <TouchableOpacity onPress={shareReferralCode} style={styles.shareButton}>
                                         <Text style={styles.shareButtonText}> {t('shareCode')}</Text>
                                         <Icon type={Icons.MaterialIcons} name="share" style={styles.shareIcon} />
                                     </TouchableOpacity>
                                </View>
                                </View>
                            </View>
                        </View>
                    </View>

 <SafeAreaView style={{ alignItems:'center' }}>
      <View style={{ padding: 20, borderWidth:1, borderColor: '#b4c8ff', width:'90%', borderRadius: 20,  backgroundColor: '#D9E3FF'}}>
        <FlatList
          data={[
            { key: 'Invite your colleauges to join Medics' },
            { key: 'Click QR to scan or Share referral code' },
            { key: 'Both you and your colleauges will get a topup of Rs.' + referralMessage },
          ]}
           renderItem={({ item }) => {
                     return (

                       <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, width:'95%' }}>
                         <View style={{ width: 9, height: 9, borderRadius: 9, backgroundColor: colors.medics_blue}} />
                         <Text style={{ fontSize: 16, margin: 'auto', marginLeft:10 }}>{item.key}</Text>
                       </View>
                     );
                   }}
                   keyExtractor={(item) => item.key}
                 />
               </View>
             </SafeAreaView>

<View style={{margin: 5}} />

 <View style={{ flex: 1 }}>
            <View style={{ padding: 10 }}>
                <Text style={styles.referralCodeLabel1}>{t('referralreceived')}</Text>
                <View style={{ height: 2, width: '100%', backgroundColor: colors.text_grey }} />
                <View style={{ margin: 2 }} />
            </View>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{  paddingHorizontal: 10, borderTopColor: colors.text_grey, borderRadius: 10 }}>
                {receives.length > 0 ? (
                    <FlatList
                        data={filterReferralReceives()}
                        renderItem={show_list}
                        keyExtractor={item => item.id.toString()}
                    />
                ) : (
                    <View style={{ height: 300, width: 300, alignSelf: 'center' }}>
                        <LottieView source={no_data_loader} autoPlay loop />
                    </View>
                )}
            </ScrollView>
        </View>


                </View>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isQRCodeVisible}
                    onRequestClose={() => setQRCodeVisible(false)}
                >
                    <StatusBar hidden={true} />
                    <View style={styles.overlay}></View>
                    <View style={styles.modalView}>
                        <QRCode value={referralCode} size={250} />
                        <View style={{ marginTop: 20 }} />
                        <TouchableOpacity onPress={toggleQRCodeModal} style={styles.closeModalButton}>
                            <Text style={styles.closeModalButtonText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </SafeAreaView>
        </>
    );
};

export default ReferralDetails;
