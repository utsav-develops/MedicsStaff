import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Switch,
  FlatList,
  PermissionsAndroid,
  Platform,
  StatusBar,
  TouchableOpacity,
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { normal, bold, regular, screenHeight, screenWidth, dashboard, api_url, change_online_status, LATITUDE_DELTA, check_policies,
  LONGITUDE_DELTA, f_s, f_tiny, f_xs, get_heatmap_coordinates} from '../config/Constants';
import FusedLocation from 'react-native-fused-location';
import Geolocation from '@react-native-community/geolocation';
import database from '@react-native-firebase/database';
import axios from 'axios';
import MapView, { PROVIDER_GOOGLE, Heatmap } from 'react-native-maps';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { changeLocation } from '../actions/ChangeLocationActions';
import { initialLat, initialLng, initialRegion } from '../actions/BookingActions';
import { Animated } from 'react-native';
import { Dimensions } from 'react-native';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';
import PrivacyPolicies from "./PrivacyPolicies";
import { useCustomTheme } from  '../config/useCustomTheme';


const Dashboard = (props) => {
  const navigation = useNavigation();
  const map_ref = useRef();
  const { t } = useLocalization();
  const [loading, setLoading] = useState(false);
  const [switch_value, setSwitchValue] = useState(global.live_status == 1 ? true : false);
  const [language, setLanguage] = useState(global.lang);
  const [heat_map_coordinates, setHeatMapCoordinates] = useState([]);
  const [today_bookings, setTodayBookings] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [today_earnings, setTodayEarnings] = useState(0);
  const [speciality_type, setSpecialityType] = useState(0);
  const [sync_status, setSyncStatus] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [map_region, setMapRegion] = useState(undefined);

  const { isDarkMode, toggleTheme, colors } = useCustomTheme();


  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  useEffect(() => {

    const callGetHeatmapCoordinates = () => {
    };

    const interval = setInterval(callGetHeatmapCoordinates, 5000);
    const bookingSyncTimeout = setTimeout(booking_sync, 3000);

    const unsubscribeFocusListener = navigation.addListener("focus", async () => {
      await call_dashboard();
    });

    if (switch_value) {

    }

    if (Platform.OS === "android") {
      requestCameraPermission();
    } else {
      getInitialLocation();
    }

    // Cleanup function
    return () => {
      clearInterval(interval);
      clearTimeout(bookingSyncTimeout);
      unsubscribeFocusListener();
    };

  }, [switch_value]);



  const call_get_heatmap_coordinates = async() =>{
    await axios({
      method: 'post',
      url: api_url + get_heat_map,
      data:{ zone:global.zone }
    })
    .then(async response => {
      this.setState({ heat_map_coordinates:response.data.result })
    })
    .catch(error => {
      console.log(error)
    });
  }

  const showAlert = () =>
  Alert.alert(
    'Notice',
    'Please accept our Contract Terms',
      [
        {
          text: 'Contract Terms',
          onPress: () => navigation.navigate('PrivacyPolicies'),
          style: 'cancel',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    {
      cancelable: true,
      onDismiss: () =>
        Alert.alert(
          'This alert was dismissed by tapping outside of the alert dialog.',
        ),
    },
  );


  const toggleSwitch =  async (value) => {
    let policyStatus = await check_policy();
    if(policyStatus == 1){
        }
        else{
//           showAlert();
        }


      if(value){
        setSwitchValue(value);
        call_change_online_status(1);
      }else{
        setSwitchValue(value);
        call_change_online_status(0);
      }

  }


  const saveData = async (status) =>{
    try {
      await AsyncStorage.setItem('online_status', status.toString());
    } catch (e) {

    }
  }

  const call_dashboard = async () => {
    setLoading(true);
    await axios({
      method: 'post',
      url: api_url + dashboard,
      data:{ id: global.id }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.result.speciality_type != 0 && speciality_type == 0){
        get_location(response.data.result.speciality_type,response.data.result.sync_status);
        setSpecialityType(response.data.result.speciality_type)
      }
      setTodayBookings(response.data.result.today_bookings);
      setTodayEarnings(response.data.result.today_earnings);
      setSyncStatus(response.data.result.sync_status);
      setWallet(response.data.result.wallet);
      check_booking(response.data.result.booking_id,response.data.result.work_type);
    })
    .catch(error => {
      setLoading(false);
    });
  }

  const check_policy = () => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: api_url + check_policies,
        data: { staff_id : global.id}
      })
      .then(response => {
        setLoading(false);
        resolve(parseFloat(response.data.status));
      })
      .catch(error => {
        setLoading(false);
        reject(error);
      });
    });
  }

  const check_booking = (booking_id,work_type) => {
    if(booking_id != 0 && work_type != 5){
      navigation.navigate('Work', {work_id:booking_id, from:'home'})
    }else if(booking_id != 0 && work_type == 5){
      setTimeout(function(){
        navigation.navigate('SharedWork', {work_id:booking_id, from:'home'})
      }, 2000)
    }
  }

  const call_change_online_status = async (status) => {
    setLoading(true);
    await axios({
      method: 'post',
      url: api_url + change_online_status,
      data:{ id: global.id, online_status : status }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 2){
        setSwitchValue(false);
        global.live_status == 0;
        saveData(0);
        speciality_details();
      }else if(response.data.status == 3){
        setSwitchValue(false);
        global.live_status == 0;
        saveData(0);
        speciality_documents();
      }if (response.data.status == 1 && status == 1 && sync_status == 1) {
        let policyStatus = await check_policy();
         if(policyStatus == 1){
            global.live_status == 1;
            saveData(1);
            setSwitchValue(true);
        }
        else{
            setSwitchValue(false);
            global.live_status == 0;
            saveData(0);
            showAlert();
        }

      } else {
        global.live_status == 0;
        saveData(0);
        setSwitchValue(false);
      }
    })
    .catch(error => {
      console.error(error);
      setLoading(false);
    });
  }

  speciality_details = () => {
    navigation.navigate('SpecialityDetails');
  }

  speciality_documents = () => {
    navigation.navigate('SpecialityDocument');
  }

  const get_background_location_permission = async() => {
    const bg_granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,{
            'title': app_name + ' App Access your location for tracking in background',
            'message': 'Access your location for tracking in background',
             buttonPositive: "OK"
        }
    )
  }


  const requestCameraPermission = async() =>{
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
                'title': app_name + ' App Access your location for tracking in background',
                'message': 'Access your location for tracking in background'
            }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            await get_background_location_permission();
            await getInitialLocation();
        }
    }catch(err) {
        alert(strings.sorry_cannot_fetch_your_location);
    }
  }

  const getInitialLocation = async() => {
    Geolocation.getCurrentPosition( async(position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      setMapRegion({
        latitude:       await position.coords.latitude,
        longitude:      await position.coords.longitude,
        latitudeDelta:  LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      });
      await props.initialRegion(map_region);
      await props.initialLat(position.coords.latitude);
      await props.initialLng(position.coords.longitude);
    }, error => getInitialLocation() ,
    {enableHighAccuracy: true, timeout: 10000 });
  }

  const get_location = async(vt,sy) =>{
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          title: {app_name}+ 'access your location in background for get nearest work requests',
          message: {app_name}+' needs to access your location in background for get nearest works, show live location to workplaces that will be always in use'
          }
      );
      if(granted && vt != 0) {
        FusedLocation.setLocationPriority(FusedLocation.Constants.HIGH_ACCURACY);

        // Get location once.
        const location = await FusedLocation.getFusedLocation();
        setLatitude(location.latitude);
        setLongitude(location.longitude);

        // Set options.
        FusedLocation.setLocationPriority(FusedLocation.Constants.BALANCED);
        FusedLocation.setLocationInterval(5000);
        FusedLocation.setFastestLocationInterval(5000);
        FusedLocation.setSmallestDisplacement(10);

        // Keep getting updated location.
        FusedLocation.startLocationUpdates();

        // Place listeners.
        const subscription = FusedLocation.on('fusedLocation', async location => {
          props.changeLocation(location);
            let bearing = 0;
            if(!isNaN(location.bearing)){
                bearing = location.bearing;
            }
            if(location){
              if(sy == 1){
                database().ref(`staffs/${vt}/${global.id}/geo`).update({
                  lat: location.latitude,
                  lng: location.longitude,
                  bearing : bearing
                });
              }
            }
        });
      }else if(Platform.OS === "android"){
        requestCameraPermission();
      }else{
        getInitialLocation();
      }
  }
  booking_sync = () =>{
    if(sync_status == 1){
      database().ref(`staffs/${speciality_type}/${global.id}`).on('value', snapshot => {
          if(snapshot.val().booking.booking_status == 1 && snapshot.val().online_status == 1){
            navigation.navigate('BookingRequest',{ work_id : snapshot.val().booking.booking_id });
          }
      });
    }
  }


  const navigate_document_verify = async() =>{
    if(sync_status == 2){
      speciality_details();
    }else{
      speciality_documents();
    }
  }


  navigate_rental = () =>{
    navigation.navigate('MyRentalBookings');
  }
  navigate_wallet = () =>{
    navigation.navigate('Wallet');
  }

  call_work_settings = () => {
    navigation.navigate('WorkSettings')
  }

 const toggleDrawer = () => {
    setShowDrawer(!showDrawer);
  };

const [isContainerVisible, setContainerVisibility] = useState(true);

const toggleContainerVisibility = () => {
    setContainerVisibility(!isContainerVisible);
  };


const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  topLeftContainer: {
    position: 'absolute',
    top: Platform.OS === "ios" ? 55 : 25,
    left: 10,
    opacity: 0.9,
    backgroundColor: colors.theme_bg_three,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRightContainer: {
    position: 'absolute',
    top: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    right: 10,
    opacity: 0.7,
    backgroundColor: '#FFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

bottomContainer: {
    position:'absolute',
    width: '100%',
    opacity: 0.9,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    bottom:0,
    },

notificationContainer: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
    paddingBottom: 5,
    },

  statusText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  currencyContainer: {
    backgroundColor: colors.theme_bg_three,
    width: '85%',
    borderRadius: 20,
    opacity: 0.8,
    position: 'absolute',
    paddingTop:0,
    top: '15%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  currencyText: {
    color: 'green',
    fontSize: 50,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  smallBlackBar: {
    backgroundColor: 'black',
    height: 5,
    borderRadius: 5,
    width: '50%',
  },
});




  return (
    <View style={styles.container}>

    {/* MapView should be declared first as the base layer */}


          <MapView
            ref={map_ref}
            style={styles.map}
            region={map_region}
            showsUserLocation={true}
            showsMyLocationButton={false}
            customMapStyle= {colors.mapCustomStyle}
          >
         </MapView>


 {/* ======================= Booking Status ======================= */}


 {isContainerVisible && (
  <View style={styles.currencyContainer}>
    <TouchableOpacity onPress={toggleContainerVisibility}>
      <Icon type={Icons.Ionicons} name="eye" color={colors.theme_fg_two} style={{fontSize: 30, left:0, top:10,  }} />
    </TouchableOpacity>
    <View style={{ alignItems: 'center' }}>
      <Text style={styles.currencyText}>{global.currency} {today_earnings}</Text>
      <View style={styles.smallBlackBar} />
      <Text style={{ fontSize: 30, fontWeight: 'bold', color: colors.theme_fg_two }}>{t('today')}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Bookings')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.medics_blue, fontSize: 30, fontWeight: 'bold' }}>{today_bookings} </Text>
        <Text style={{ color: 'black', fontSize: 25, fontWeight: 'bold', color: colors.theme_fg_two}}>
          {today_bookings === 1 ? t('booking') : t('bookings')} - {t('View_All')}
        </Text>
    </TouchableOpacity>
    </View>
  </View>
)}

{!isContainerVisible &&(
        <View style={{width:40,height:40, backgroundColor: colors.medics_grey, borderTopLeftRadius:15,borderBottomLeftRadius:15, justifyContent:'center',alignItems:'center',position:'absolute', right:0, top:80,}}>
        <TouchableOpacity onPress={toggleContainerVisibility}>
          <Icon type={Icons.Ionicons} name="eye-off" color={'black'} style={{fontSize: 40, }} />
        </TouchableOpacity>
        </View>
      )}

      <StatusBar
        backgroundColor={colors.theme_bg}
      />



       {/* ========================= Menu ========================= */}
       <View style={styles.topLeftContainer}>


        <TouchableOpacity onPress={() => navigation.navigate('More')}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon type={Icons.Ionicons} name="menu" style={{ fontSize: 40, color: colors.theme_fg_two }} />
              </View>
        </TouchableOpacity>
      </View>
  {/* ======================= ID Card =======================*/}

      <View style={styles.topRightContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('PatientProfile')}>
          <FontAwesome name="id-card" style={styles.idIcon} />
        </TouchableOpacity>
      </View>




 {/* ======================= Online Offline Button in Bottom Container ======================= */}


 <View style={styles.bottomContainer}>

   {/*   <View style={styles.notificationContainer}>
        <Text style={{color: 'black',fontSize: 24,fontWeight: 'bold',alignItems: 'center',}}>{t('joinTeamNotification')}</Text>
    </View>*/}



 <View style={{ padding:5, backgroundColor: switch_value ? colors.warning : colors.medics_blue, flexDirection:'row',  width:'100%', paddingBottom:20, paddingTop:0,}}>
        <View style={{ width:'20%', alignItems:'flex-start', justifyContent:'center'}}/>
        <View style={{ width:'60%', alignItems:'center', justifyContent:'center'}}>
          {switch_value == true &&
                <Text style={[styles.statusText, { color: '#FFFFFF' }]}>{t('online')}</Text>
              }
          {switch_value != true &&
            <Text style={[styles.statusText, { color: '#FFFFFF' }]}>{t('offline')}</Text>
          }
        </View>
        <View style={{ width:'10%', alignItems:'flex-end', justifyContent:'center'}}>
          <Switch
            trackColor={{ false: colors.white, true: colors.white }}
            thumbColor={switch_value ? colors.white : colors.white }
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={switch_value}
          />
        </View>
      </View>

 </View>

</View>

);
};






const mapDispatchToProps = (dispatch) => ({
  changeLocation: (data) => dispatch(changeLocation(data)),
  initialLat: (data) => dispatch(initialLat(data)),
  initialLng: (data) => dispatch(initialLng(data)),
  initialRegion: (data) => dispatch(initialRegion(data))
});



export default connect(null, mapDispatchToProps)(Dashboard);
