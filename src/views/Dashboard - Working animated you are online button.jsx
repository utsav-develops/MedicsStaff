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
  TouchableOpacity
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { normal, bold, regular, screenHeight, screenWidth, dashboard, api_url, change_online_status, LATITUDE_DELTA, 
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
import DropShadow from "react-native-drop-shadow";
import { createDrawerNavigator,DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { menus } from '../config/Constants'; // Import your menus array
import { Animated, PanResponder } from 'react-native';
import { Dimensions } from 'react-native';
import { color } from "react-native-reanimated";

const Dashboard = (props) => {
  const navigation = useNavigation();
  const map_ref = useRef();
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
  const translateY = useRef(new Animated.Value(0)).current; // 0 when visible
  const screenHeight = Dimensions.get('window').height;

  const slideUp = () => {
    Animated.timing(translateY, {
      toValue: 0, // Slide up to the initial position
      duration: 300,
      useNativeDriver: true
    }).start();
  };
  
  const slideDown = () => {
    Animated.timing(translateY, {
      toValue: screenHeight, // Slide down off the screen
      duration: 300,
      useNativeDriver: true
    }).start();
  };
  

 

  useEffect(() => {
    const interval = setInterval(() => {
      //call_get_heatmap_coordinates();
    }, 5000);
    setTimeout(function(){booking_sync()}, 3000)
    const unsubscribe = navigation.addListener("focus", async() => {
      await call_dashboard();
    });
    if(Platform.OS === "android"){
      requestCameraPermission();
    }else{
      getInitialLocation();
    }
    return(
      interval,
      unsubscribe
    );
  }, []);

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

  const toggleSwitch = () => {
    setSwitchValue(!switch_value);
    call_change_online_status(!switch_value ? 1 : 0);
    
    if (!switch_value) {
      slideDown();
    } else {
      slideUp();
    }
  };
  
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy < 0) { // Detect upward swipe
          slideUp();
        }
      }
    })
  ).current;
  

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
        global.live_status == 1;
        saveData(1);
        setSwitchValue(true);
      } else {
        global.live_status == 0;
        saveData(0);
        setSwitchValue(false);
      }
    })
    .catch(error => {
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


  return (
    <View style={styles.container} {...panResponder.panHandlers}>

       {/* New container for the drawer menu icon */}
       <View style={styles.topLeftContainer}>

        <TouchableOpacity onPress={() => navigation.navigate('More')}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon type={Icons.Ionicons} name="menu" style={{ fontSize: 40, color: colors.theme_bg_two }} />

              </View>
        </TouchableOpacity>
      </View>

    <MapView
            provider={PROVIDER_GOOGLE}
            ref={map_ref}
            style={styles.map}
            region={map_region}
            showsUserLocation={true}
            showsMyLocationButton={false}
          >
         </MapView>


     {isContainerVisible &&(
     <View style={styles.currencyContainer}>

            <TouchableOpacity onPress={toggleContainerVisibility}>
             <Icon type={Icons.Ionicons} name="eye" color={'black'} style={{ position:'absolute',fontSize: 30, left:0, top:10 }} />
            </TouchableOpacity>
             <View style={{alignItems:'center'}}>
                <Text style={styles.currencyText}>{global.currency}{today_earnings}</Text>
                <View style={styles.smallBlackBar} />
                <Text style={{alignItems:'center', fontSize:25, fontWeight:'bold',}}>Today</Text>
                <Text style={{alignItems:'center', fontSize:25, fontWeight:'bold',top:7}}>you have {today_bookings} booking</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Bookings')}>
                    <Text style={{color:'black', alignItems:'center', fontSize:20, fontWeight:'bold',top:15}}>View All Bookings</Text>
                </TouchableOpacity>
            </View>
     </View>
     )}

     {!isContainerVisible &&(
             <View style={{width:40,height:40, backgroundColor: colors.medics_grey, borderTopLeftRadius:15,borderBottomLeftRadius:15, justifyContent:'center',alignItems:'center',position:'absolute', right:0, top:80,}}>
             <TouchableOpacity onPress={toggleContainerVisibility}>
               <Icon type={Icons.Ionicons} name="eye-off" color={'black'} style={{fontSize: 30, }} />
             </TouchableOpacity>
             </View>
           )}

      <StatusBar
        backgroundColor={colors.theme_bg}
      />





{/*       <View style={{ padding:15, backgroundColor:colors.theme_bg, height:200, position:'absolute',top:90, width:'90%', marginLeft:'5%', borderRadius:20}}> */}
{/*         <DropShadow */}
{/*             style={{ */}
{/*                 width: '100%', */}
{/*                 marginBottom: 5, */}
{/*                 marginTop: 5, */}
{/*                 shadowColor: "#000", */}
{/*                 shadowOffset: { */}
{/*                     width: 0, */}
{/*                     height: 0, */}
{/*                 }, */}
{/*                 shadowOpacity: 0.1, */}
{/*                 shadowRadius: 5, */}
{/*             }} */}
{/*         > */}
{/*           <View style={{ flexDirection:'row', width:'100%'}}> */}

{/*             <View style={{ width:'50%', alignItems:'center', justifyContent:'center'}}> */}
{/*               <Icon type={Icons.Ionicons} name="bookmark" style={{ fontSize:30, color:colors.theme_fg_three }} /> */}
{/*               <View style={{ margin:5 }} /> */}
{/*               <Text style={{ color:colors.theme_fg_three, fontSize:f_s, fontWeight: 'bold' }}>{today_bookings}</Text> */}
{/*             </View> */}
{/*             <View style={{ width:'50%', alignItems:'center', justifyContent:'center'}}> */}
{/*               <Icon type={Icons.FontAwesome} name="gbp" style={{ fontSize:30, color:colors.theme_fg_three }} /> */}
{/*               <View style={{ margin:5 }} /> */}
{/*               <Text style={{ color:colors.theme_fg_three, fontSize:f_s, fontWeight: 'bold' }}>{global.currency}{today_earnings}</Text> */}
{/*             </View> */}
{/*           </View> */}

{/*           <View style={{ margin:5 }} /> */}
{/*           <View style={{ flexDirection:'row', width:'100%'}}> */}
{/*             <View style={{ width:'50%', alignItems:'center', justifyContent:'center'}}> */}
{/*               <Text style={{ color:colors.theme_fg_three, fontSize:f_tiny, fontWeight: 'normal' }}>Today's Schedule</Text> */}
{/*             </View> */}
{/*             <View style={{ width:'50%', alignItems:'center', justifyContent:'center'}}> */}
{/*               <Text style={{ color:colors.theme_fg_three, fontSize:f_tiny, fontWeight: 'normal' }}>Today's Earning</Text> */}
{/*             </View> */}
{/*           </View> */}
{/*         </DropShadow> */}
{/*       </View> */}

{/*       <View style={{ position:'absolute', top:90, width:'100%' }}> */}
{/*         {wallet == 0 && */}
{/*         <TouchableOpacity activeOpacity={1} onPress={navigate_wallet.bind(this)} style={{ flexDirection:'row', backgroundColor:colors.error_background, borderRadius:10, alignItems:'center', justifyContent:'center', padding:10, width:'90%', marginLeft:'5%'}}> */}
{/*           <Icon type={Icons.Ionicons} name="wallet" style={{ fontSize:20, color:colors.error }} /> */}
{/*           <View style={{ margin:5 }} /> */}
{/*           <Text style={{ fontWeight: 'regular', fontSize:f_xs, color:colors.error}}>Your wallet balance is low please recharge immediately</Text> */}
{/*         </TouchableOpacity> */}
{/*         } */}
{/*       </View> */}



<View style={styles.bottomContainer}>
      <Animated.View
        style={[
          styles.fab,
          {
            transform: [{ translateY: translateY }], // Apply the animated value to translateY
            backgroundColor: switch_value ? colors.medics_grey : colors.theme_bg, // Change the color based on switch_value
          },
        ]}
      >
        <TouchableOpacity onPress={toggleSwitch}>
          <View style={{ alignItems: 'center' }}>
            {switch_value ? (
              <>
                <Text style={[styles.fabText, { color: colors.success }]}>ONLINE</Text>
                <Text style={{ fontSize: 16, color: '#FFFFFF' }}>Tap to go offline</Text>
              </>
            ) : (
              <>
                <Text style={[styles.fabText, { color: '#FFFFFF' }]}>GO</Text>
                <Text style={[styles.fabText, { color: '#FFFFFF' }]}>LIVE</Text>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Inner container should be outside of the Animated.View */}
      <View style={styles.innerContainer}>
    {/* Horizontal line to indicate sliding action */}
    <View style={styles.horizontalLine} />

    {/* This view contains the text */}
    <View style={styles.statusTextContainer}>
      {switch_value ? (
        <Text style={{ color: colors.success, fontSize: 20, fontWeight: 'bold' }}>You are online</Text>
      ) : (
        <Text style={{ color: colors.theme_fg_two, fontSize: 20, fontWeight: 'bold' }}>Can't reach you</Text>
      )}
    </View>
  </View>
    </View>

    {/* ... other bottom components ... */}
  </View>
);
};


const styles = StyleSheet.create({
container: {
    ...StyleSheet.absoluteFillObject,
  },

  topLeftContainer: {
    position: 'absolute',
    top: 25,  // Adjust as per the status bar height and your preference
    left: 10,
    zIndex: 1, // Make sure it's above other elements
    opacity: 0.7,
    backgroundColor: '#FFF', // or any color you prefer
    width: 50,  // Width of the circle
    height: 50, // Height of the circle
    borderRadius: 25, // Half of either width or height to make it a perfect circle
    justifyContent: 'center', // To align the child (icon) in the center vertically
    alignItems: 'center', // To align the child (icon) in the center horizontally
},



  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomContainer: {

    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',

  },
  innerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', // Changed to 'center' to vertically center contents
    backgroundColor: colors.medics_nurse_blue,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    position: 'absolute',
    top: screenHeight * 0.17,
    left: 0,
    right: 0,
    paddingTop: 5, // Smaller padding at the top
    paddingBottom: 5, // Smaller padding at the bottom
    height: 40, // Reduced fixed height
  },
  horizontalLine: {
    height: 4,
    backgroundColor: '#000',
    width: '15%',
    alignSelf: 'center',
    marginTop: 5, // Ensure there's a small gap above the line
    marginBottom: 5, // Space between the line and the text
  },
  statusTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -5, // Optional: adjust if needed to bring text up closer to the line
  },
  
 fabContainer: {
      position: 'absolute',
      bottom: 70,
      width: '100%',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
  },
  fab: {
      width: 160,
      height: 160,
      borderRadius: 80,
      bottom : 50,
      justifyContent: 'center',
      backgroundColor: "#015BBB",
      ...Platform.select({
          android: {
              elevation: 4,
          },
          ios: {
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              shadowOffset: {
                  width: 0,
                  height: 4,
              },
              shadowOpacity: 1,
              shadowRadius: 2,
          },
      }),
  },
  fabText: {
      color: 'white',
      fontSize: 40,
      fontWeight: 'bold',
      lineHeight: 45,
  },


  currencyContainer: {
      backgroundColor: 'white',
      width: '85%',
      height: '30%',
      borderRadius: 20,
      opacity: 0.8,
      padding: 5,
      position: 'absolute',
      top: '12%',
      alignSelf:'center',
      paddingHorizontal: 20,

    },

    currencyText: {
      color: 'green',
      fontSize: 50,
      fontWeight: 'bold',
      alignItems:'center',

    },
    smallBlackBar: {
      backgroundColor: 'black',
      height: 5,
      borderRadius: 5,
      width: '50%',
    },
});





// ... mapDispatchToProps and export default ...


const mapDispatchToProps = (dispatch) => ({
  changeLocation: (data) => dispatch(changeLocation(data)),
  initialLat: (data) => dispatch(initialLat(data)),
  initialLng: (data) => dispatch(initialLng(data)),
  initialRegion: (data) => dispatch(initialRegion(data))
});



export default connect(null, mapDispatchToProps)(Dashboard);