import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    ScrollView,
    Image,
    StatusBar
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { bold, api_url, get_profile, img_url, f_xl, get_specialities,get_staff_rating, work_request_details, booking_completion_details, speciality_type_list, work_details, get_documents } from '../config/Constants';
import axios from 'axios';
import { connect } from 'react-redux';

const StaffIdCard = (props) => {
    const navigation = useNavigation();
    const [on_load, setOnLoad] = useState(0);
    const [data, setData] = useState("");
    const [data_s, setData_s] = useState("");
    const [staffRating, setStaffRating] = useState(null);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [data_speciality_type, set_data_speciality_type] = useState("");
    const [work_details, set_work_details] = useState("");
    const [staff_rating, set_staff_rating] = useState("");
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [specialityImage, setSpecialityImage] = useState(null);



    useEffect(() => {
      const unsubscribe = navigation.addListener("focus", async () => {
        await checkDataInStorage(); // Fetch data from storage or API
        // The following calls can be conditional or adjusted according to the app's logic
        call_get_speciality();
        call_get_fetchBookingDetails();
        get_speciality_type_list();
        call_get_work_details();
        call_get_staff_rating();
        call_get_documents();
      });

        return unsubscribe;
    }, []);

    const checkDataInStorage = async () => {
      const storedData = await AsyncStorage.getItem('staffData');
      if (storedData !== null) {
        // Data already fetched, use it from the storage
        const parsedData = JSON.parse(storedData);
        setData(parsedData);
        setOnLoad(1); // You probably want to set this to indicate the data is ready to be displayed
      } else {
        // Data not available in storage, fetch it from the API
        await call_get_profile();
      }
    };



    const get_speciality_type_list = async () => {
      try {
        const response = await axios.post(api_url + speciality_type_list, {
          lang: global.lang
        });
        set_data_speciality_type(response.data.result);

      } catch (error) {
        console.error('Error fetching speciality type:', error);
    }
    };

    const call_get_speciality = async () => {
          try {
            const response = await axios.post(api_url + get_specialities, {
              staff_id: global.id,
              lang: global.lang,
            });
            setData_s(response.data);
          } catch (error) {
            console.error('Error fetching speciality data:', error);
        }
        };


        const call_get_documents = async () => {
          try {
            const response = await axios.post(api_url + get_documents, {
              staff_id: global.id,
              lang: global.lang,
            });
            const specialityData = response.data.result.documents.find(doc => doc.document_name === 'speciality_image');
            if (specialityData && specialityData.path) {
              setSpecialityImage(img_url + specialityData.path);
            }
          } catch (error) {
            console.error('Error fetching speciality image:', error);
            // Set some state to indicate that an error occurred
          }
        };

    const call_get_work_details = async () => {
          try {
            const response = await axios.post(api_url + work_request_details, {
              work_request_id: global.id
            });
            set_work_details(response.data.result);

          } catch (error) {
            console.error('Error fetching work details:', error);
        }
        };

    const call_get_staff_rating = async () => {
              try {
                const response = await axios.post(api_url + get_staff_rating, {
                  staff_id: global.id
                });
                set_staff_rating(response.data.result);

              } catch (error) {
                console.error('Error fetching work details:', error);
            }
            };


            const call_get_profile = async () => {
              try {
                const response = await axios({
                  method: 'post',
                  url: api_url + get_profile,
                  data: { staff_id: global.id, lang: global.lang }
                });

                // Save the data in the component's state
                setData(response.data.result);

                // Save the fetched data to AsyncStorage for later use in the app session
                await AsyncStorage.setItem('staffData', JSON.stringify(response.data.result));

                setOnLoad(1); // Indicate that data fetching is complete
              } catch (error) {
                alert('Sorry something went wrong');
              }
            };


      const call_get_fetchBookingDetails = () => {
        axios({
            method: 'post',
            url: api_url + booking_completion_details,
            data: { booking_id:1 }
        })
        .then(async response => {
            setBookingDetails(response.data.result);
            setOnLoad(1);
        })
        .catch(error => {
            alert('Sorry something went wrong');
        });
    };


    const formatDate = (dateString) => {
      const options = { month: 'long',  year: 'numeric' };
      return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
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
  <SafeAreaView style={styles.fullScreen}>
        <ScrollView>

      <View style={styles.fullScreen}>
          <View style={styles.closeButtonContainer}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                  <Icon type={Icons.MaterialIcons} name="close" size={50} color={colors.theme_fg_two} />
              </TouchableOpacity>
          </View>
          {on_load === 1 && (
              <View style={styles.contentContainer}>
                  {/* Profile Image */}
                  <View style={styles.profileImageContainer}>
        {specialityImage ? (
          <Image
            style={styles.profileImage}
            source={{ uri: specialityImage }}
          />
        ) : (
          <Text style={styles.errorText}>Speciality image not available</Text>
        )}
      </View>
                  {/* Name and Job Title */}
                  <Text style={styles.profileName}>{data.first_name} {data.last_name}</Text>
                  <Text
                style={styles.jobTitle}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.5} // Optional: The minimum scale that the font can be reduced to accommodate the text
                >
  {data_speciality_type[data_s.result?.speciality_type - 1]?.speciality_type}
</Text>
                  <Text style={styles.title}>With LOCUPY Since {formatDate(data.created_at)}</Text>

                  {/* Moved "With LOCUPY Since" down here */}


                  {/* Ratings Container */}
                  <View style={styles.ratingsContainer}>
                    <View style={styles.ratingBlock}>
                      <Text style={styles.ratingValue}>{staff_rating?.ratings_count}</Text>
                      <Text style={styles.ratingLabel}>Loved</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.ratingBlock}>
                      <Text style={styles.ratingValue}>99</Text>
                      <Text style={styles.ratingLabel}>Hired</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.ratingBlock}>
                      <Text style={styles.ratingValue}>{staff_rating?.average_rating} %</Text>
                      <Text style={styles.ratingLabel}>Satisfied</Text>
                    </View>
                  </View>

                   {/* GDC Number */}
                   <View style={styles.horizontalSeparator} />
                  <View style={styles.spacedContainer}>
                    <Text style={styles.boldText}>GDC:</Text>
                    <Text style={styles.boldText}>{data.licence_number}</Text>
                  </View>
                  <View style={styles.horizontalSeparator} />

  {/* Moved Work Details and Booking Status here */}
  <View style={styles.spacedContainer}>
  <Text style={styles.jobTitle}>{work_details?.first_name} </Text>
  <Text style={styles.boldText}>{bookingDetails?.status_name}</Text>
</View>


              </View>
          )}
      </View>
      </ScrollView>

  </SafeAreaView>
  </>
);

};

// Updated styles
const styles = StyleSheet.create({
fullScreen: {
  flex: 1,
  backgroundColor: 'white',
},
closeButtonContainer: {
  alignSelf: 'flex-end',
  padding: 25,
  position: 'absolute',
  top: 0,
  right: 0,
},
contentContainer: {
  flex: 1,
  justifyContent: 'flex-start', // Align content to the top
  alignItems: 'center',
  paddingTop: StatusBar.currentHeight || 0,

},
profileImageContainer: {
  height: '45%',
  width: '67%',
  borderRadius: 150,
  borderWidth: 3,
  borderColor: 'white',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  backgroundColor: 'white',
  position: 'absolute',
  top: 80,


},
profileImage: {
  height: '100%',
  width: '100%',
  resizeMode: 'cover',
},
profileName: {
  fontWeight: 'bold',
  fontSize: 35,
  color: colors.theme_fg_two,
  marginTop: 330,
},

jobTitle: {
  fontSize: 20,
  color: 'black',
  textAlign: 'center',
  marginBottom: 0,
  marginTop: -5,
  maxWidth: '90%',
},
title: {
  fontSize: 18,
  color: 'black',
  textAlign: 'center',
  marginBottom: 10,
  marginTop: 8,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '95%',

},

spacedContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '95%',
  paddingHorizontal: 10,
  marginTop: 0,
},
boldText: {
  fontWeight: 'bold',
  fontSize: 22,
  marginRight: 4,
  color: colors.theme_fg_two,
  marginTop: 0,
},

ratingsContainer: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  width: '100%',
  marginTop: 0,
},
ratingBlock: {
  alignItems: 'center',
},
ratingValue: {
  fontWeight: 'bold',
  fontSize: 30,
  color: colors.theme_fg_two,
},
ratingLabel: {
  fontSize: 16,
  color: 'grey',
},
separator: {
  height: '50%',
  width: 3,
  backgroundColor: 'black',
  opacity: 0.2,
},
horizontalSeparator: {
  borderBottomColor: 'black',
  borderBottomWidth: 3,
  alignSelf: 'stretch',
  marginVertical: 10, 
  opacity: 0.1,
  
},

});

const mapStateToProps = (state) => ({
    speciality_number: state.speciality.speciality_number, // ensure 'yourReducer' is the correct reducer where the speciality_number is stored
});

export default connect(mapStateToProps)(StaffIdCard);
