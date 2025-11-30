import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { api_url, } from '../config/Constants';
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';
import { useCustomTheme } from  '../config/useCustomTheme';
import DropShadow from "react-native-drop-shadow";

const PatientProfile = () => {
    const navigation = useNavigation();
    const [workdata, setworkdata] = useState("");
    const { t } = useLocalization();
    const { isDarkMode, toggleTheme, colors } = useCustomTheme();
      useEffect(() => {
        call_work_profile();
    }, []);
    const MenuItem = ({ title, iconName, navigatePage }) => (
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate(navigatePage)}>
        <Icon name={iconName} size={32} color="black" />
        <Text style={styles.menuItemText} >{title}</Text>
{/*         <Icon name="angle-right" size={20} color="black" /> */}
      </TouchableOpacity>
    );

    const TodoItem = ({ title, subtitle, time, urgent }) => (
      <View style={styles.todoItem}>
        <Icon name="heart" size={22} color="#DD2509" />
        <View style={styles.todoContent}>
          <Text style={styles.todoTitle}>{title}</Text>
          <Text style={styles.todoSubtitle}>{subtitle}</Text>
        </View>
        <View style={styles.todoTimeContainer}>
          <Text style={styles.todoTime}>{time}</Text>
          {urgent && <Icon name="exclamation-circle" size={20} color="#DD2509" />}
        </View>
      </View>
    );
    const call_work_profile = async () => {
          try {
            const response = await axios.post(api_url + "workplace/get_profile", {
              workplace_id: 1,
              lang: global.lang,
            });
            setworkdata(response.data.result);
          } catch (error) {
            console.error(error);
        }
        };

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.theme,
    },
    headerContainer: {
      marginHorizontal: 10,
      marginTop: 10,
      marginBottom: 'auto',
      borderRadius: 15,
      alignItems: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      justifyContent: 'flex-start',
      backgroundColor: colors.dark,
    },
    profileSection: {
      flexDirection: 'row',
      padding: 10,
      alignItems: 'center',
    },
    profilePic: {
      height: 110,
      width: 110,
      borderRadius: 60,
    },
    profileTextContainer: {
      marginLeft: 20,
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.theme_bg_two,
    },
    headerBadgeText: {
      color: colors.text_grey,
    },
    headerSubText: {
      fontSize: 14,
      color: colors.text_grey,
    },
    badgeContainer: {
      flexDirection: 'row',
      marginTop: 10,
    },
    badgeText: {
      marginRight: 10,
      color: 'white',
      backgroundColor: 'red', // Assuming a red background for the badge
      borderRadius: 15,
      paddingVertical: 2,
      paddingHorizontal: 10,
      overflow: 'hidden',
    },
    informationSection: {
      backgroundColor: colors.theme, // Adjust the color to match your screenshot
      marginTop: 10, // Add space between this section and the "Notes" section
      flexDirection:'row',alignItems:'center', maxWidth:'100%', flexWrap:'wrap'
    },
    menuItem: {
      height: 110,
      width: 110,
      flexDirection: 'column',
      alignItems: 'center',
      padding: 10,
      justifyContent: 'center', // Center items vertically
      alignItems: 'center', // Center items horizontally
      borderColor: '#d0d0d0', // Make the border color slightly darker to stand out on the new background
      borderRadius: 15,
      margin: 10,
      backgroundColor: colors.online_text,
    },
    menuItemText: {
      fontSize: 14,
      textAlign: 'center',
      flexWrap: 'wrap',
      flexDirection: 'row',
      width:'100%',
    },
    section: {
      marginTop: 15,
      backgroundColor: colors.dark, // or any color that matches your design
      paddingVertical: 15,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontWeight: 'bold',
      fontSize: 20,
      marginBottom: 15,
      color: colors.theme_bg_two,
    },

  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  todoContent: {
    flex: 1,
    paddingHorizontal: 15
  },
  todoTitle: {
    fontSize: 20,
    color: colors.text_grey,
    fontWeight: 'bold',
  },
  todoSubtitle: {
    fontSize: 18,
    color: 'grey',
  },
  todoTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todoTime: {
    fontSize: 18,
    color: colors.medics_grey,
    marginRight: 5,
  },
  moreTodosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  moreTodosText: {
    fontSize: 20,
    color: colors.medics_green,
    fontWeight: 'bold',
    paddingLeft:15,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  notesContent: {
    flex: 1,
    marginLeft: 10,
  },
  notesText: {
    fontSize: 18,
    color: colors.text_grey,
    fontWeight: 'bold',
  },
  notesSubText: {
    fontSize: 16,
    color: 'grey',
  },
    // ... additional styles for other sections ...

});

  return (
    <ScrollView style={styles.container}>
    <DropShadow
     style={{
         width: '100%',
         marginBottom: 5,
         marginTop: 5,
         shadowColor: colors.shadow_color,
         shadowOffset: {
             width: 1,
             height: 1,
         },
         shadowOpacity: 0.4,
         shadowRadius: 5,
     }}
     >
      <View style={styles.headerContainer}>
      <View style={styles.profileSection}>
          <Image style={styles.profilePic} source={{ uri: workdata.profile_picture }} />
          <View style={styles.profileTextContainer}>
            <Text style={styles.headerText}>{workdata.first_name} {workdata.last_name}</Text>
        <Text style={styles.headerSubText}>Birthday: 03/02/73</Text>
        <Text style={styles.headerSubText}>Location: Room 1</Text>
        <View style={styles.headerBadgeContainer}>
          <Text style={styles.headerBadgeText}>DoLS</Text>
          <Text style={styles.headerBadgeText}>ALLERGIES</Text>
        </View>
        </View>
        </View>
        </View>
        </DropShadow>

<DropShadow
     style={{
         width: '100%',
         marginBottom: 5,
         marginTop: 5,
         shadowColor: colors.shadow_color,
         shadowOffset: {
             width: 1,
             height: 1,
         },
         shadowOpacity: 0.3,
         shadowRadius: 5,
     }}
     >
      <View style={{flexDirection:'row',alignItems:'center', maxWidth:'100%', flexWrap:'wrap'}}>
      <MenuItem title="Logs" iconName="file-text-o" navigatePage="MainCategories" />
      <MenuItem title="Body Maps" iconName="male" navigatePage="BodyMaps"/>
      <MenuItem title="eMAR" iconName="pills" navigatePage="eMAR"/>
      <MenuItem title="Charts" iconName="bar-chart-o" navigatePage="Charts"/>
      <MenuItem title="Documents" iconName="folder-o" navigatePage="Documents"/>
      <MenuItem title="Care Plan" iconName="heart-o" navigatePage="CarePlans"/>
      <MenuItem title="Risk Assessments" iconName="exclamation-triangle" navigatePage="RiskAssessments"/>
      <MenuItem title="Goals" iconName="bullseye" navigatePage="Goals"/>
      </View>
      </DropShadow>

 {/* Next To-Do Section */}
 <View style={styles.section}>
        <Text style={styles.sectionTitle}>Next To-Do</Text>
        <TodoItem title="Jim Smith" subtitle="Getting Washed" time="09:30" urgent={true} />
        <TouchableOpacity style={styles.moreTodosContainer}>
        <View style={{flexDirection: 'row'}}>
          <Icon name="calendar" size={22} color="#009633" />
          <Text style={styles.moreTodosText}>8 more To-Do's</Text>
          </View>
          <Icon name="angle-right" size={22} color='#009633' />
        </TouchableOpacity>
      </View>

      {/* Notes Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes</Text>
        <View style={styles.notesContainer}>
          <Icon name="sticky-note" size={20} color="grey" />
          <View style={styles.notesContent}>
            <Text style={styles.notesText}>Nothing to see here</Text>
            <Text style={styles.notesSubText}>Please fill out the 'Notes' within the Service Users profile</Text>
          </View>
        </View>
      </View>

<DropShadow
     style={{
         width: '100%',
         marginBottom: 5,
         marginTop: 5,
         shadowColor: colors.shadow_color,
         shadowOffset: {
             width: 1,
             height: 1,
         },
         shadowOpacity: 0.3,
         shadowRadius: 5,
     }}
     >
    {/* Section for "About me", "Personal Information", etc. */}
    <View style={styles.informationSection}>
        <MenuItem title="About me" iconName="info-circle" navigatePage="Aboutme"/>
        <MenuItem title="Personal Information" iconName="id-card-o" navigatePage="MainCategories"/>
        <MenuItem title="Assigned Needs" iconName="tasks" navigatePage="Assigned_Needs"/>
        <MenuItem title="Care Related Information" iconName="stethoscope" navigatePage="Care_Related_Information"/>
        <MenuItem title="Important People" iconName="users" navigatePage="Important_People"/>
      </View>
      </DropShadow>
    </ScrollView>
  );
};


export default PatientProfile;
