import React, { useState, useEffect, useRef } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    Modal,
    SafeAreaView,
    TouchableWithoutFeedback,
    ScrollView,
    Image,
    StatusBar,
    FlatList
} from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { normal, bold, my_bookings, api_url, img_url, loader, no_data_loader, hiring_accept_reject,booking_hiring_confirm, cancel, f_s, f_xs,f_l, f_tiny, f_xl } from '../config/Constants';
import DropShadow from "react-native-drop-shadow";
import { Badge } from '@rneui/themed';
import axios from 'axios';
import Moment from 'moment';
import LottieView from 'lottie-react-native';
import DropdownAlert from 'react-native-dropdownalert';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import Work from '../views/Work.jsx';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';
import { useCustomTheme } from  '../config/useCustomTheme';


const Bookings = (props) => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState(5);
    let dropDownAlertRef = useRef();
    const viewableItems = useSharedValue([]);
    const [cancellation_statuses, setCancellationStatuses] = useState([6, 7]);
    const [modalVisible, setModalVisible] = useState(false);
    console.log(new Date());
    const { t } = useLocalization();
    const go_back = () => {
        navigation.goBack();
    }
   const { isDarkMode, toggleTheme, colors } = useCustomTheme();


    useEffect(() => {
        call_my_bookings(filter);
    }, []);

    const openModal = () => {
        setModalVisible(true);
      };

      const closeModal = () => {
        setModalVisible(false);
      };

      const declineRequest = (id) => {
          setModalVisible(false);
        };

      const call_accept_reject = async (id, status) => {
      console.log(id + " ", + status);
        await axios({
              method: 'post',
              url: api_url + hiring_accept_reject,
              data: { booking_id: id, status: status }
            })
              .then(async response => {
              if(status == 2){
                  dropDownAlertRef.alertWithType('success', t('bookingAccepted'), t('successfullyAcceptedBooking'));
                  call_my_bookings(5);
              }
              else if(status == 7){
                   dropDownAlertRef.alertWithType('error', t('bookingRejected'), t('successfullyRejectedBooking'));
                   call_my_bookings(5);
              }

              })
              .catch(error => {
                 console.error(error);
                 alert('Sorry something went wrong');
              });
        setModalVisible(false);
      };

      const start_work = async (id) => {
          await axios({
                method: 'post',
                url: api_url + booking_hiring_confirm,
                data: { id:id }
              })
                .then(async response => {
                    navigation.navigate('Work', { work_id: response.data.result, from: 'works' });
                })
                .catch(error => {
                   console.error(error);
                   alert('Sorry something went wrong');
                });
        };




    function removeLastTwoDigits(timeString) {
            try {
                return timeString.substring(0, timeString.length - 3);
                } catch (error) {
                        return "unknown";
                    }
            }

    const findDateDifference = (dateString) => {
      const currentDate = new Date();
      const givenDate = new Date(dateString);

      // Calculate the difference in milliseconds
      const differenceMs = givenDate - currentDate;

      // Convert milliseconds to days
      const differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));

      return differenceDays;
    };

    const getHourDifference = (startTime, endTime) => {
            const start = new Date("2000-01-01 " + startTime); // Date object for start time
            const end = new Date("2000-01-01 " + endTime);     // Date object for end time

            // Calculate difference in milliseconds
            let difference = end - start;

            // Convert milliseconds to hours
            let hours = difference / (1000 * 60 * 60);

            return hours;
        };

    const change_filter = (id) => {
        setFilter(id);
        call_my_bookings(id);
    }

    const call_my_bookings = (fl) => {
        setLoading(true);
        axios({
            method: 'post',
            url: api_url + my_bookings,
            data: { staff_id: global.id, lang: global.lang, filter: fl }
        })
            .then(async response => {
                setTimeout(function () {
                    setLoading(false);
                    setData(response.data.result);
                }, 1000)
            })
            .catch(error => {
                setLoading(false);
                alert('Sorry something went wrong')
            });
    }

    const navigate = (work_id, status_name) => {
        if (filter == 1) {
            navigation.navigate('Work', { work_id: work_id, from: 'works' })
        } else if (filter == 2) {
            navigation.navigate('Bill', { work_id: work_id, from: 'works' })
        } else if (filter == 3) {
            dropDownAlertRef.alertWithType('error', 'Error', 'This work is' + ' ' + status_name);
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

    const MyModal = ({ visible, onClose, id }) => {
      return (
        <Modal
          animationType="fade"
          transparent={true}
          visible={visible}
          onRequestClose={onClose}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{t('wantToDecline')}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, { backgroundColor: 'orange' }]} onPress={() => { closeModal()  }}>
                  <Text style={styles.buttonText}>{t('cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={() => { call_accept_reject(id, 7) }}>
                  <Text style={styles.buttonText}>{t('decline')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      );
    };

    const navigate_home = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "Home" }],
            })
        );
    }

    type ListItemProps = {
        viewableItems: Animated.SharedValue<ViewToken[]>;
        item: {
            id: number;
        };
    };

    const ListItem: React.FC<ListItemProps> = React.memo(
        ({ item, viewableItems }) => {
            const rStyle = useAnimatedStyle(() => {
                const isVisible = Boolean(
                    viewableItems.value
                        .filter((item) => item.isViewable)
                        .find((viewableItem) => viewableItem.item.id === item.id)
                );
                return {
                    opacity: withTiming(isVisible ? 1 : 0),
                    transform: [
                        {
                            scale: withTiming(isVisible ? 1 : 0.6),
                        },
                    ],
                };
            }, []);



            return (
                <Animated.View style={[
                    {
                        width: '100%',
                    },
                    rStyle,
                ]}>

                    <TouchableOpacity activeOpacity={1} onPress={navigate.bind(this, item.id, item.status_name)} style={{ alignItems: 'center', borderRadius: 10, padding: 10 }}>
                        <DropShadow
                            style={{
                                width: '95%',
                                marginBottom: 5,
                                marginTop: 5,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 0,
                                },
                                shadowOpacity: 0.1,
                                shadowRadius: 5,
                            }}
                        >
                            <View style={{ flexDirection: 'row', flex: 1, backgroundColor: colors.theme_bg_three, padding: 15, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                                <View style={{ width: '17%', alignItems: 'flex-start', justifyContent: 'center' }}>
                                    <View style={{ width: 50, height: 50 }} >
                                        <Image style={{ height: undefined, width: undefined, flex: 1, borderRadius: 10 }} source={{ uri: img_url + item.profile_picture }} />
                                    </View>
                                </View>
                                <View style={{ width: '33%', alignItems: 'flex-start', justifyContent: 'center' }}>
                                    <Text style={{ color: colors.theme_fg_two, fontSize: f_s, fontWeight: 'bold' }}>{item.workplace_name}</Text>
                                    <View style={{ margin: 2 }} />
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon type={Icons.MaterialIcons} name="star" color={colors.warning} style={{ fontSize: 20 }} />
                                        <View style={{ margin: 1 }} />
                                        <Text style={{ color: colors.theme_bg_two, fontSize: f_s, fontWeight: 'bold' }}>{item.workplace_rating}</Text>
                                    </View>
                                </View>
                                <View style={{ width: '25%', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: colors.text_grey, fontSize: f_xs, fontWeight: 'normal' }}>{t('rate')}</Text>
                                    <View style={{ margin: 3 }} />
                                    <Text style={{ fontSize: f_s, fontWeight: 'bold', color: colors.theme_fg_two }}>{global.currency}{item.total}</Text>
                                </View>
                                {filter === 5 ?
                                    <View style={{position:'absolute', top:0, right:0, backgroundColor:'red', borderBottomLeftRadius:8, borderTopRightRadius:10,}}>
                                        <TouchableOpacity onPress={openModal}>
                                            <Icon type={Icons.Entypo} name="cross" color={'black'} style={{ fontSize: 27}} />
                                        </TouchableOpacity>
                                        <MyModal visible={modalVisible} onClose={closeModal} id={item.id} />
                                    </View>
                                    :null
                                }
                                <View style={{ width: '25%', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: colors.text_grey, fontSize: f_xs, fontWeight: 'normal' }}>{t('hours')}</Text>
                                    <View style={{ margin: 3 }} />
                                    {filter === 5 ? (
                                            <Text style={{ color: colors.theme_fg_two, fontSize: f_s, fontWeight: 'bold' }}>{getHourDifference(item.pickup_time, item.drop_time)}/{t('day')}</Text>
                                        ) : (
                                            <Text style={{ color: colors.theme_fg_two, fontSize: f_s, fontWeight: 'bold' }}>{item.id}/{t('day')}</Text>
                                        )}
                                </View>
                            </View>
                            <View style={{ bottomBorderWidth: 0.5, borderColor: colors.grey, height: 1 }} />

                            <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: colors.theme_bg_three, padding: 15, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, flexDirection:'row' }}>
                            <View style={{flexDirection:'column'}}>
                                <View style={{ width: '100%', alignItems: 'flex-start', justifyContent: 'center' }}>


                                    {filter===5 ?(
                                        <View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Badge status="success" />
                                                <View style={{ margin: 5 }} />
                                                <Text style={{ fontSize: f_tiny, fontWeight: 'normal', color: colors.text_grey }}>{Moment(item.pickup_date).format("DD-MMM-YYYY")} </Text>
                                            </View>
                                            <View style={{ margin: 5 }} />
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Badge status="error" />
                                                <View style={{ margin: 5 }} />
                                                <Text style={{ fontSize: f_tiny, fontWeight: 'normal', color: colors.text_grey }}>{Moment(item.drop_date).format("DD-MMM-YYYY")} </Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <View style={{ margin: 10 }} />
                                                <Text style={{ fontSize: 12, fontWeight: 'normal', color: colors.text_grey }}>({item.drop_location})</Text>
                                            </View>
                                        </View>
                                    ):(
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Badge status="success" />
                                            <View style={{ margin: 5 }} />
                                            <Text style={{ fontSize: f_tiny, fontWeight: 'normal', color: colors.text_grey }}>{Moment(item.pickup_date).format("DD-MMM-YYYY")}</Text>
                                        </View>
                                    )}


                                </View>
                                <View style={{ margin: 5 }} />
                                <View style={{  marginTop: 10, flexDirection: 'row', width: '100%' }}>
                                    <View style={{  flexDirection:'row', justifyContent: 'center', alignItems:'center' }}>
                                        <View>
                                            <Badge status="primary" />
                                        </View>
                                        <View style={{ margin: 5 }} />
                                        <View>
                                        {filter ===5 ?
                                        <View>
                                            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: f_xs, fontWeight: 'normal' }}>{(item.pickup_location)?.split(', ').shift()}</Text>
                                            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: f_xs, fontWeight: 'normal' }}>{(item.pickup_location)?.split(', ')[1] + ', ' + (item.pickup_location)?.split(', ')[2]}</Text>
                                        </View>
                                        :
                                        <View>
                                            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: f_xs, fontWeight: 'normal' }}>{(item.pickup_address)?.split(', ').shift()}</Text>
                                            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: f_xs, fontWeight: 'normal' }}>{(item.pickup_address)?.split(', ')[1] + ', ' + (item.pickup_address)?.split(', ')[2]}</Text>
                                        </View>
                                        }
                                        </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ alignItems:'center'}}>
                                    {filter ===5?(
                                    <View style={{ flexDirection: 'column', alignItems: 'center',  }}>
                                      <View>
                                        <View>
                                          <Text style={{ fontSize: f_l, fontWeight: 'bold', color: colors.theme_fg_two }}>{removeLastTwoDigits(item.pickup_time)}</Text>
                                        </View>
                                        <Icon type={Icons.Entypo} name="dots-three-vertical" color={'black'} style={{ fontSize: 15 }} />
                                        <View>
                                          <Text style={{ fontSize: f_l, fontWeight: 'bold', color: colors.theme_fg_two }}>{removeLastTwoDigits(item.drop_time)}</Text>
                                        </View>
                                      </View>
                                      <View >
                                      <View style={{ margin: 10 }} />

                                      {item.status === 1 ? (
                                        <View style={{ backgroundColor: colors.medics_blue, padding: 5, borderRadius: 5, alignItems: 'center', alignSelf: 'center' }}>
                                          <TouchableOpacity onPress={() => { call_accept_reject(item.id, 2) }}>
                                            <Text style={{ fontSize: f_s, fontWeight: 'bold', color: 'white' }}>{t('accept')}</Text>
                                          </TouchableOpacity>
                                        </View>
                                      ) : (
                                        item.status === 2 && findDateDifference(item.pickup_date) !== -1 ? (
                                          <View style={{ backgroundColor: colors.icon_inactive_color, padding: 5, borderRadius: 5, alignItems: 'center', alignSelf: 'center' }}>
                                            <TouchableOpacity onPress={() => { dropDownAlertRef.alertWithType('info', 'Already Accepted', 'Please wait till ' + removeLastTwoDigits(item.pickup_time) + " of " + item.pickup_date) }}>
                                              <Text style={{ fontSize: f_s, fontWeight: 'bold', color: 'white' }}>Start</Text>
                                            </TouchableOpacity>
                                          </View>
                                        ) : (
                                          item.status === 2 && findDateDifference(item.pickup_date) === -1 ? (
                                            <View style={{ backgroundColor: colors.success, padding: 5, borderRadius: 5, alignItems: 'center', alignSelf: 'center' }}>
                                              <TouchableOpacity onPress={() => { start_work(item.id)}}>
                                                <Text style={{ fontSize: f_s, fontWeight: 'bold', color: 'white' }}>Start</Text>
                                              </TouchableOpacity>
                                            </View>
                                          ) : null
                                        )
                                      )}




                                      </View>
                                    </View>


                                ):(
                                    <Text style={{ fontSize: f_l, fontWeight: 'bold', color: colors.theme_fg_two, alignSelf: 'flex-end' }}>{Moment(item.pickup_date).format("hh:mm a")}</Text>

                                )}
                                </View>

                            </View>

                        </DropShadow>
                        {cancellation_statuses.includes(parseInt(item.status)) &&
                            <View style={{ position: "absolute", top: 0, right: 0, left: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ width: 100, height: 100 }} >
                                    <Image style={{ height: undefined, width: undefined, flex: 1, borderRadius: 10 }} source={cancel} />
                                </View>
                            </View>
                        }
                    </TouchableOpacity>

                </Animated.View>
            );
        }
    );

    const onViewableItemsChanged = ({ viewableItems: vItems }) => {
        viewableItems.value = vItems;
    };

    const viewabilityConfigCallbackPairs = useRef([{ onViewableItemsChanged }]);
 const styles = StyleSheet.create({
            modalContainer: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              },
              modalContent: {
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 10,
                alignItems: 'center',
              },
              modalText: {
                fontSize: 18,
                marginBottom: 20,
              },
              buttonContainer: {
                flexDirection: 'row',
              },
              button: {
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 5,
                marginHorizontal: 5,
              },
              buttonText: {
                color: 'white',
                fontSize: 16,
              },
                header: {
                    height: 60,
                    backgroundColor: colors.theme_bg,
                    flexDirection: 'row',
                    alignItems: 'center'
                },
                segment_active_bg: {
                    minWidth: 120, // Static width
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 15,
                    backgroundColor: colors.medics_blue,
                    borderRadius: 10,
                },

                segment_inactive_bg: {
                    minWidth: 120, // Static width
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 15,
                    backgroundColor: colors.theme_bg_three,
                    borderRadius: 10
                },
                shadow:{
                           width: '100%',
                           shadowColor: "#000",
                           shadowOffset: {
                               width: 0,
                               height: 0,
                           },
                           shadowOpacity: 0.1,
                           shadowRadius: 5,
                           borderRadius:10,
                           overflow: 'hidden',

                                               },
                    segment_active_fg: { color: colors.theme_fg_two, fontSize: 16, fontWeight: 'bold', color: colors.theme_fg_three,

                    },

                    segment_inactive_fg: { color: colors.theme_fg_two, fontSize: 16, fontWeight: 'normal', color: colors.theme_fg_two }
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
                    <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize: 30 }} />
                </TouchableOpacity>
                <View activeOpacity={1} style={{ width: '85%', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: f_xl, fontWeight: 'bold' }}>{t('bookings')}</Text>
                </View>
            </View>

                <DropShadow style={styles.shadow} >

                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ flexDirection: 'row', paddingTop:20,paddingBottom:10  }}
                >
                            <View style={{margin:5}}/>
                        <TouchableOpacity onPress={change_filter.bind(this, 5)} style={[filter == 5 ? styles.segment_active_bg : styles.segment_inactive_bg,]}>
                                <Text style={[filter == 5 ? styles.segment_active_fg : styles.segment_inactive_fg]}>{t('upcoming')}</Text>
                            </TouchableOpacity>
                            <View style={{margin:5}}/>
                            <TouchableOpacity onPress={change_filter.bind(this, 1)} style={[filter == 1 ? styles.segment_active_bg : styles.segment_inactive_bg]}>
                                <Text style={[filter == 1 ? styles.segment_active_fg : styles.segment_inactive_fg]}>{t('ongoing')}</Text>
                            </TouchableOpacity>
                            <View style={{margin:5}}/>
                            <TouchableOpacity onPress={change_filter.bind(this, 2)} style={[filter == 2 ? styles.segment_active_bg : styles.segment_inactive_bg]}>
                                <Text style={[filter == 2 ? styles.segment_active_fg : styles.segment_inactive_fg]}>{t('completed')}</Text>
                            </TouchableOpacity>
                            <View style={{margin:5}}/>
                            <TouchableOpacity onPress={change_filter.bind(this, 3)} style={[filter == 3 ? styles.segment_active_bg : styles.segment_inactive_bg]}>
                                <Text style={[filter == 3 ? styles.segment_active_fg : styles.segment_inactive_fg]}>{t('cancelled')}</Text>
                            </TouchableOpacity>
                            <View style={{margin:5}}/>
                            </ScrollView>
                    </DropShadow>

                <ScrollView showsVerticalScrollIndicator={false}>
                {loading == true ?
                    <View style={{ height: 100, width: 100, alignSelf: 'center', }}>
                        <LottieView source={loader} autoPlay loop />
                    </View>
                    :
                    <View>
                        {data.length > 0 ?
                            <FlatList
                                data={data}
                                contentContainerStyle={{ paddingTop: 10 }}
                                viewabilityConfigCallbackPairs={
                                    viewabilityConfigCallbackPairs.current
                                }
                                renderItem={({ item }) => {
                                    return <ListItem item={item} viewableItems={viewableItems} />;
                                }}
                            />
                            :
                            <View style={{ height: 300, width: 300, alignSelf: 'center', marginTop: '30%' }}>
                                <LottieView source={no_data_loader} autoPlay loop />
                            </View>
                        }
                    </View>
                }

            <View style={{ margin:0}}/>
            </ScrollView>


        </SafeAreaView>
        {drop_down_alert()}
        </>
    );
};


export default Bookings;