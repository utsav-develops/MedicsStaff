import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  StatusBar
} from "react-native";
import { useNavigation, useRoute, CommonActions } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { screenHeight, screenWidth, bold, api_url, add_rating, btn_loader, img_url, regular, f_l, f_xs, f_xl, f_s, f_m } from '../config/Constants';
import DropShadow from "react-native-drop-shadow";
import Icon, { Icons } from '../components/Icons';
import { AirbnbRating as RT } from 'react-native-ratings';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import { ScrollView } from "react-native-gesture-handler";
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';
import { useCustomTheme } from  '../config/useCustomTheme';

const Rating = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [data, setData] = useState(route.params.data);
  const [count, setCount] = useState(5);
  const [star_count, setStarCount] = useState(5);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useLocalization();
  const { isDarkMode, toggleTheme, colors } = useCustomTheme();

  const onStarRatingPress = (rating) => {
    setCount(rating)
  }

  const call_add_rating = () => {
    setLoading(true);
    axios({
      method: 'post',
      url: api_url + add_rating,
      data: { work_id: data.id, ratings: count, comments: comments }
    })
      .then(async response => {
        setLoading(false);
        navigate_home();
      })
      .catch(error => {
        setLoading(false);
        alert('Sorry something went wrong')
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
const styles = StyleSheet.create({
  container: {
    height: screenHeight,
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lite_bg
  },
  textinput: {
    fontSize: f_m,
    color: colors.grey,
    fontWeight: 'regular',
    textAlignVertical: 'top',
    backgroundColor: colors.text_container_bg,
    width: '100%'
  },
  header: {
    height: 60,
    backgroundColor: colors.lite_bg,
    flexDirection: 'row',
    alignItems: 'center'
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
    <ScrollView>

      <View style={styles.container}>
        <View style={{ margin: 40 }} />
        <DropShadow
          style={{
            width: '90%',
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.3,
            shadowRadius: 5,
          }}
        >
          <View activeOpacity={1} style={{ width: '100%', backgroundColor: colors.theme_bg_three, borderRadius: 10, height: '90%', alignItems: 'center' }}>
            <View style={{ marginTop: 70, alignItems: 'center' }}>
              <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_l, fontWeight: 'bold' }}>{data.workplace.first_name}</Text>
              {data.workplace.overall_ratings == 0 ?
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                  <Icon type={Icons.MaterialIcons} name="star" color={colors.warning} style={{ fontSize: 18 }} />
                  <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontWeight: 'regular' }}>{t('New')}</Text>
                </View>
                :
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                  <Icon type={Icons.MaterialIcons} name="star" color={colors.warning} style={{ fontSize: 18 }} />
                  <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontWeight: 'regular' }}>{data.workplace.overall_ratings}</Text>
                </View>
              }
            </View>
            <View style={{ margin: 15 }} />
            <View style={{ alignItems: 'center', justifyContent: 'center', margin: 20 }}>
              <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_xl, fontWeight: 'bold' }}>{t('howWasYourWork')}</Text>
              <View style={{ margin: 5 }} />
              <Text style={{ color: colors.text_grey, fontSize: f_s, fontWeight: 'regular' }}>{t('feedbackandrating')}</Text>
            </View>
            <RT
              count={star_count}
              reviews={[t("Terrible"), t("Bad"), t("OK"), t("Good"), t("Wow")]}
              defaultRating={5}
              size={30}
              onFinishRating={onStarRatingPress}
            />
            <View style={{ margin: 15 }} />
            <View style={{ width: '80%', alignItems: 'flex-start', paddingLeft: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg }}>
              <TextInput
                secureTextEntry={true}
                placeholder={t('comment')}
                placeholderTextColor={colors.grey}
                style={styles.textinput}
                multiline={true}
                numberOfLines={4}
                onChangeText={TextInputValue =>
                  setComments(TextInputValue)}
              />
            </View>
            <View style={{ margin: 20 }} />
            {loading == false ?
              <TouchableOpacity onPress={call_add_rating.bind(this)} activeOpacity={1} style={{ width: '80%', backgroundColor: colors.btn_color, borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: colors.theme_fg_two, fontSize: f_m, color: colors.theme_fg_three, fontWeight: 'bold' }}>{t('submit')}</Text>
              </TouchableOpacity>
              :
              <View style={{ height: 50, width: '90%', alignSelf: 'center' }}>
                <LottieView source={btn_loader} autoPlay loop />
              </View>
            }
          </View>
        </DropShadow>

        <View style={{ height: 80, width: 80, position: 'absolute', top: 40 }}>
          <Image source={{ uri: img_url + data.workplace.profile_picture }} style={{ height: undefined, width: undefined, flex: 1 }} />
        </View>
        <TouchableOpacity activeOpacity={1} onPress={navigate_home.bind(this)} style={{ height: 80, width: 80, position: 'absolute', top: 20, right: -30 }}>
          <Icon type={Icons.MaterialCommunityIcons} name="close-circle-outline" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
        </TouchableOpacity>
      </View>
    </ScrollView>
    </>
  );
};



export default Rating;