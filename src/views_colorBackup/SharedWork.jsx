import React, { useState, useEffect, useRef } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  FlatList,
  Linking,
  Platform
} from "react-native";
import { useNavigation, useRoute, CommonActions } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { screenHeight, screenWidth, normal, bold, regular, get_ongoing_work_details_shared, api_url, change_work_status, GOOGLE_KEY, btn_loader, LATITUDE_DELTA, LONGITUDE_DELTA, work_cancel, loader, f_xs, f_m, f_s, shared_work_accept, shared_work_reject, f_l } from '../config/Constants';
import BottomSheet from 'react-native-simple-bottom-sheet';
import Icon, { Icons } from '../components/Icons';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import LottieView from 'lottie-react-native';
import { Badge } from '@rneui/themed';
import axios from 'axios';
import Dialog, { DialogTitle, SlideAnimation, DialogContent, DialogFooter, DialogButton } from 'react-native-popup-dialog';
import { connect } from 'react-redux';
import DialogInput from 'react-native-dialog-input';
import DropdownAlert from 'react-native-dropdownalert';
import DropShadow from "react-native-drop-shadow";
import database from '@react-native-firebase/database';

const SharedWork = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  let dropDownAlertRef = useRef();
  const [work_id, setWorkId] = useState(route.params.work_id);
  const [from, setFrom] = useState(route.params.from);
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);
  const [cancel_loading, setCancelLoading] = useState(false);
  const [on_load, setOnLoad] = useState(0);
  const [cancellation_reason, setCancellationReasons] = useState([]);
  const [dialog_visible, setDialogVisible] = useState(false);
  const [otp_dialog_visible, setOtpDialogVisible] = useState(false);
  const [pickup_statuses, setPickupStatuses] = useState([1, 2]);
  const [drop_statuses, setDropStatuses] = useState([3, 4]);
  const [cancellation_statuses, setCancellationStatuses] = useState([6, 7]);
  const map_ref = useRef();
  const [region, setRegion] = useState({
    latitude: props.initial_lat,
    longitude: props.initial_lng,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [work_dialog_popup, setWorkDialogPopup] = useState(false);
  const [new_workplace_name, setNewWorkplaceName] = useState('');
  const [new_pickup_address, setNewPickupAddress] = useState('');
  const [new_booking_id, setNewBookingId] = useState(0);

  const go_back = () => {
    if (from == 'home') {
      navigation.navigate('Dashboard')
    } else {
      navigation.goBack();
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async() => {
      call_get_ongoing_work_details_shared();
  });
    
    const onValueChange = database().ref(`shared/${global.id}`)
      .on('value', snapshot => {
        if (snapshot.val().booking_id) {
          setWorkDialogPopup(true);
          setNewWorkplaceName(snapshot.val().workplace_name);
          setNewPickupAddress(snapshot.val().pickup_address);
          setNewBookingId(snapshot.val().booking_id);
        }
      });
    return (
      unsubscribe,
      onValueChange
    );
  }, []);

  const call_get_ongoing_work_details_shared = async () => {
    if (props.change_location.latitude && props.change_location.longitude) {
      setLoading(true);
      await axios({
        method: 'post',
        url: api_url + get_ongoing_work_details_shared,
        data: { staff_id: global.id, lat: props.change_location.latitude != undefined ? props.change_location.latitude : props.initial_lat, lng: props.change_location.longitude != undefined ? props.change_location.longitude : props.initial_lng }
      })
      .then(async response => {
        setLoading(false);
        if (response.data.result.work.status == 4) {
          navigation.navigate('Bill', { work_id: work_id, from: 'shared_work' });
        }else if (cancellation_statuses.includes(parseInt(response.data.result.work.status)) && from == 'home') {
          navigate_home();
        }
        setData(response.data.result);
        setWorkId(response.data.result.work.id);
        setCancellationReasons(response.data.result.cancellation_reasons);
        setOnLoad(1);
      })
      .catch(error => {
        setLoading(false);
      });
    } else {
      go_back();
    }

  }

  const check_otp = () => {
    if (data.work.new_status.id == 3) {
      setOtpDialogVisible(true);
    } else {
      onRegionChange();
    }
  }

  const onRegionChange = async () => {
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + props.change_location.latitude + ',' + props.change_location.longitude + '&key=' + GOOGLE_KEY)
      .then((response) => response.json())
      .then(async (responseJson) => {
        if (responseJson.results[2].formatted_address != undefined) {
          setRegion({
            latitude: props.change_location.latitude,
            longitude: props.change_location.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          })
          call_change_work_status(responseJson.results[2].formatted_address);
        }
      })
  }

  const call_change_work_status = async (address) => {
    setLoading(true);
    await axios({
      method: 'post',
      url: api_url + change_work_status,
      data: { work_id: work_id, status: data.work.new_status.id, address: address, lat: props.change_location.latitude, lng: props.change_location.longitude }
    })
      .then(async response => {
        call_get_ongoing_work_details_shared();
      })
      .catch(error => {
        setLoading(false);
      });
  }

  const showDialog = () => {
    setDialogVisible(true);
  }

  const call_work_cancel = async (reason_id, type) => {
    setDialogVisible(false)
    setCancelLoading(true);
    await axios({
      method: 'post',
      url: api_url + work_cancel,
      data: { work_id: work_id, status: 7, reason_id: reason_id, cancelled_by: type }
    })
      .then(async response => {
        setCancelLoading(false)
        console.log('success')
      })
      .catch(error => {
        //alert(error)
        setCancelLoading(false);
      });
  }

  const navigate_home = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Home" }],
      })
    );
  }

  const call_dialog_visible = () => {
    setDialogVisible(false)
  }

  const verify_otp = async (val) => {
    if (val == data.work.otp) {
      setOtpDialogVisible(false);
      await onRegionChange();
    } else {
      await dropDownAlertRef.alertWithType('error', 'Validation error', 'Enter valid otp.');
      closeOtpDialog();
    }
  }

  const closeOtpDialog = () => {
    setOtpDialogVisible(false)
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

  const redirection = () => {
    if (pickup_statuses.includes(parseInt(data.work.status))) {
      var lat = data.work.pickup_lat;
      var lng = data.work.pickup_lng;
    } else {
      var lat = data.work.drop_lat;
      var lng = data.work.drop_lng;
    }

    if (lat != 0 && lng != 0) {
      var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
      var url = scheme + `${lat},${lng}`;
      if (Platform.OS === 'android') {
        Linking.openURL("google.navigation:q=" + lat + " , " + lng + "&mode=d");
      } else {
        Linking.openURL('https://www.google.com/maps/dir/?api=1&destination=' + lat + ',' + lng + '&travelmode=driving');
      }
    }
  }

  const call_workplace = (phone_number) => {
    Linking.openURL(`tel:${phone_number}`)
  }

  const call_chat = (data) => {
    navigation.navigate("Chat", { data: data, work_id: work_id })
  }

  call_work_accept = async () => {
    setLoading(true)
    await axios({
      method: 'post',
      url: api_url + shared_work_accept,
      data: { work_id: new_booking_id, staff_id: global.id }
    })
      .then(async response => {
        setLoading(false)
        if (response.data.status == 1) {
          setWorkDialogPopup(false);
          setNewBookingId(0);
          setNewWorkplaceName('');
          setNewPickupAddress('');
          call_get_ongoing_work_details_shared();
        } else {
          dropDownAlertRef.alertWithType('error', 'Work cancelled', 'Sorry workplace cancelled');
          await go_back();
        }
      })
      .catch(error => {
        console.log(error)
        setLoading(false)
        dropDownAlertRef.alertWithType('error', 'Validation error', 'Sorry something went wrong');
      });
  }

  call_work_reject = async () => {
    setLoading(true)
    await axios({
      method: 'post',
      url: api_url + shared_work_reject,
      data: { work_id: new_booking_id, staff_id: global.id, from: 2 }
    })
      .then(async response => {
        setLoading(false)
        if (response.data.status == 1) {
          setWorkDialogPopup(false);
          setNewBookingId(0);
          setNewWorkplaceName('');
          setNewPickupAddress('');
          call_get_ongoing_work_details_shared();
        }
      })
      .catch(error => {
        setLoading(false)
        dropDownAlertRef.alertWithType('error', 'Validation error', 'Sorry something went wrong');
      });
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
    <View style={styles.container}>

      <MapView
        provider={PROVIDER_GOOGLE}
        ref={map_ref}
        style={styles.map}
        region={region}
      >
      </MapView>
      {on_load == 1 &&
        <View>
          {from == 'works' &&
            <View style={{ flexDirection: 'row' }}>
              <DropShadow
                style={{
                  width: '50%',
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: 25,
                }}
              >
                <TouchableOpacity activeOpacity={0} onPress={go_back.bind(this)} style={{ width: 40, height: 40, backgroundColor: colors.theme_bg_three, borderRadius: 25, alignItems: 'center', justifyContent: 'center', top: 20, left: 20 }}>
                  <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.icon_active_color} style={{ fontSize: 22 }} />
                </TouchableOpacity>
              </DropShadow>
            </View>
          }
        </View>
      }
      <BottomSheet sliderMinHeight={190} sliderMaxHeight={screenHeight - 200} isOpen>
        {(onScrollEndDrag) => (
          <ScrollView onScrollEndDrag={onScrollEndDrag}>
            <View style={{ padding: 10 }}>
              {on_load == 1 ?
                <View>
                  <View style={{ borderBottomWidth: 0.5, borderColor: colors.grey }}>
                    <View style={{ width: '100%', marginBottom: 10 }}>
                      <View style={{ marginBottom:10 }}>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: f_l, fontWeight: 'bold' }}>{data.work.workplace_name} - #{data.work.workplace_id}</Text>
                      </View>
                      {pickup_statuses.includes(parseInt(data.work.status)) &&
                        <TouchableOpacity onPress={redirection.bind(this)} activeOpacity={1} style={{ width: '100%', backgroundColor: colors.theme_bg_three }}>
                          <View style={{ flexDirection: 'row', width: '100%', height: 50 }}>
                            <View style={{ width: '10%', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 4 }}>
                              <Badge status="success" />
                            </View>
                            <View style={{ width: '80%', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                              <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontWeight: 'regular' }}>Pickup Address</Text>
                              <View style={{ margin: 2 }} />
                              <Text numberOfLines={2} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: f_xs, fontWeight: 'regular' }}>{data.work.pickup_address}</Text>
                            </View>
                            <View style={{ width: '10%', alignItems: 'flex-end', justifyContent: 'center', paddingTop: 4 }}>
                              <Icon type={Icons.MaterialCommunityIcons} name="navigation-variant" color={colors.theme_fg_two} style={{ fontSize: 25 }} />
                            </View>
                          </View>
                        </TouchableOpacity>
                      }
                      {drop_statuses.includes(parseInt(data.work.status)) && data.work.work_type != 2 &&
                        <TouchableOpacity onPress={redirection.bind(this)} activeOpacity={1} style={{ width: '100%', backgroundColor: colors.theme_bg_three }}>
                          <View style={{ flexDirection: 'row', width: '100%', height: 50 }}>
                            <View style={{ width: '10%', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 4 }}>
                              <Badge status="error" />
                            </View>
                            <View style={{ width: '80%', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                              <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontWeight: 'regular' }}>Drop Address</Text>
                              <View style={{ margin: 2 }} />
                              <Text numberOfLines={2} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: f_xs, fontWeight: 'regular' }}>{data.work.drop_address}</Text>
                            </View>
                            <View style={{ width: '10%', alignItems: 'flex-end', justifyContent: 'center', paddingTop: 4 }}>
                              <Icon type={Icons.MaterialCommunityIcons} name="navigation-variant" color={colors.theme_fg_two} style={{ fontSize: 25 }} />
                            </View>
                          </View>
                        </TouchableOpacity>
                      }
                      {drop_statuses.includes(parseInt(data.work.status)) && data.work.work_type == 2 &&
                        <TouchableOpacity activeOpacity={1} style={{ width: '100%', backgroundColor: colors.theme_bg_three }}>
                          <View style={{ flexDirection: 'row', marginBottom: 20, marginLeft: 10, marginRight: 10 }}>
                            <View style={{ width: '10%' }}>
                              <Icon type={Icons.MaterialIcons} name="schedule" color={colors.icon_inactive_color} style={{ fontSize: 22 }} />
                            </View>
                            <View style={{ width: '90%' }}>
                              <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: f_m, fontWeight: 'bold' }}>{data.work.package_details.hours} hrs {data.work.package_details.kilometers} km package</Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      }
                    </View>
                  </View>
                  {data.work.status <= 2 &&
                    <View style={{ borderBottomWidth: 0.5, borderTopWidth: 0.5, borderColor: colors.grey }}>
                      <View style={{ flexDirection: 'row', width: '100%', marginTop: 10, marginBottom: 10 }}>
                        <TouchableOpacity onPress={call_chat.bind(this, data.workplace)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon type={Icons.MaterialIcons} name="chat" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                        </TouchableOpacity>
                        <View style={{ width: '5%' }} />
                        <TouchableOpacity onPress={call_workplace.bind(this, data.work.workplace.phone_number)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon type={Icons.MaterialIcons} name="call" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                        </TouchableOpacity>
                        <View style={{ width: '10%' }} />
                        {cancel_loading == false ?
                          <TouchableOpacity onPress={showDialog.bind(this)} activeOpacity={1} style={{
                            width: '55%', backgroundColor:
                              colors.error_background, borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Text style={{ color: colors.theme_fg_two, fontSize: f_m, color: colors.error, fontWeight: 'bold' }}>
                              Cancel
                            </Text>
                          </TouchableOpacity>
                          :
                          <View style={{ height: 50, width: '90%', alignSelf: 'center' }}>
                            <LottieView source={loader} autoPlay loop />
                          </View>
                        }
                      </View>
                    </View>
                  }
                  <View style={{ borderColor: colors.grey }}>
                    <View style={{ flexDirection: 'row', width: '100%', marginTop: 10, marginBottom: 20 }}>
                      <View style={{ width: '33%', alignItems: 'center', justifyContent: 'center' }}>
                        <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontWeight: 'regular' }}>Distance</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                          <Icon type={Icons.MaterialIcons} name="map" color={colors.theme_fg_two} style={{ fontSize: 22 }} />
                          <View style={{ margin: 2 }} />
                          <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_xs, fontWeight: 'normal' }}>{data.work.distance} km</Text>
                        </View>
                      </View>
                      <View style={{ width: '33%', alignItems: 'center', justifyContent: 'center' }}>
                        <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontWeight: 'regular' }}>Work Type</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                          <Icon type={Icons.MaterialIcons} name="commute" color={colors.theme_fg_two} style={{ fontSize: 22 }} />
                          <View style={{ margin: 2 }} />
                          <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_xs, fontWeight: 'normal' }}>{data.work.work_type_name}</Text>
                        </View>
                      </View>
                      <View style={{ width: '33%', alignItems: 'center', justifyContent: 'center' }}>
                        <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontWeight: 'regular' }}>Estimated Rate</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                          <Icon type={Icons.MaterialIcons} name="local-atm" color={colors.theme_fg_two} style={{ fontSize: 22 }} />
                          <View style={{ margin: 2 }} />
                          <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_xs, fontWeight: 'normal' }}>{global.currency}{data.work.total}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <DialogInput
                    isDialogVisible={otp_dialog_visible}
                    title={"Enter your OTP"}
                    message={"Collect your OTP from your workplace"}
                    textInputProps={{ keyboardType: "phone-pad" }}
                    submitInput={(inputText) => { verify_otp(inputText) }}
                    closeDialog={() => { closeOtpDialog(false) }}
                    submitText="Submit"
                    cancelText="Cancel"
                    modelStyle={{ fontWeight: 'regular', fontSize: 14, textColor: colors.theme_fg }}>
                  </DialogInput>
                  {data.work.status < 5 &&
                    <View>
                      {loading == false ?
                        <View>
                          {global.lang == 'en' ?
                            <TouchableOpacity onPress={check_otp.bind(this)} activeOpacity={1} style={{ width: '100%', backgroundColor: colors.btn_color, borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                              <Text style={{ color: colors.theme_fg_two, fontSize: f_m, color: colors.theme_fg_three, fontWeight: 'bold' }}>{data.work.new_status.status_name}</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={check_otp.bind(this)} activeOpacity={1} style={{ width: '100%', backgroundColor: colors.btn_color, borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                              <Text style={{ color: colors.theme_fg_two, fontSize: f_m, color: colors.theme_fg_three, fontWeight: 'bold' }}>{data.work.new_status.status_name_ar}</Text>
                            </TouchableOpacity>
                          }
                        </View>
                        :
                        <View style={{ height: 50, width: '90%', alignSelf: 'center' }}>
                          <LottieView source={btn_loader} autoPlay loop />
                        </View>
                      }
                    </View>
                  }
                  <Dialog
                    visible={dialog_visible}
                    width={'90%'}
                    animationDuration={100}
                    dialogTitle={<DialogTitle title="Reason to cancel your Booking." />}
                    dialogAnimation={new SlideAnimation({
                      slideFrom: 'bottom',
                    })}
                    footer={
                      <DialogFooter>
                        <DialogButton
                          text="Close"
                          textStyle={{ fontSize: f_m, color: colors.theme_fg_two, fontWeight: 'regular' }}
                          onPress={call_dialog_visible.bind(this)}
                        />
                      </DialogFooter>
                    }
                    onTouchOutside={() => {
                      call_dialog_visible()
                    }}
                  >
                    <DialogContent>
                      <FlatList
                        data={cancellation_reason}
                        renderItem={({ item, index }) => (
                          <TouchableOpacity onPress={call_work_cancel.bind(this, item.id, item.type)} activeOpacity={1} >
                            <View style={{ padding: 10 }}>
                              <Text style={{ fontWeight: 'regular', fontSize: f_xs, color: colors.theme_fg_two }}>{item.reason}</Text>
                            </View>
                          </TouchableOpacity>
                        )}
                        keyExtractor={item => item.id}
                      />
                    </DialogContent>
                  </Dialog>
                  {/*accept shared work popup*/}
                  <Dialog
                    visible={work_dialog_popup}
                    width="90%"
                    animationDuration={100}
                    dialogTitle={<DialogTitle title="Your New Booking" />}
                    dialogAnimation={new SlideAnimation({
                      slideFrom: 'bottom',
                    })}
                    footer={
                      <DialogFooter>
                        <DialogButton
                          text="Accept"
                          textStyle={{ fontSize: 16, color: colors.theme_fg_two }}
                          onPress={call_work_accept}
                        />
                        <DialogButton
                          text="Reject"
                          textStyle={{ fontSize: 16, color: colors.theme_fg_two }}
                          onPress={call_work_reject}
                        />
                      </DialogFooter>
                    }
                    onTouchOutside={() => {
                      setWorkDialogPopup(false);
                    }}
                  >
                    <DialogContent>
                      <View>
                        <View style={{ padding: 10 }}>
                          <Text style={{ fontWeight: 'regular', fontSize: 18, color: colors.theme_fg_two }}>{new_workplace_name}</Text>
                        </View>
                        <View style={{ padding: 10 }}>
                          <Text style={{ fontWeight: 'regular', fontSize: 14, color: colors.theme_fg_two }}>{new_pickup_address}</Text>
                        </View>
                      </View>
                    </DialogContent>
                  </Dialog>
                </View>
                :
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                  <Text style={{ color: colors.theme_fg_two, fontSize: f_s, fontWeight: 'regular' }}>Loading...</Text>
                </View>
              }
            </View>
          </ScrollView>
        )}
      </BottomSheet>

    </View>
    {drop_down_alert()}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: screenHeight,
    width: screenWidth,
    backgroundColor: colors.lite_bg
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

function mapStateToProps(state) {
  return {
    change_location: state.change_location.change_location,
    initial_lat: state.booking.initial_lat,
    initial_lng: state.booking.initial_lng,
    initial_region: state.booking.initial_region,
  };
}

export default connect(mapStateToProps, null)(SharedWork);