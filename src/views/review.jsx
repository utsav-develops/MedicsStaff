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

const Review = (props) => {
  const navigation = useNavigation();
  const route = useRoute();

  return (

};

export default Review;