import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import { screenHeight, screenWidth, bold, regular, api_url, get_about, logo, f_25, f_m, f_l, f_s, f_xl } from '../config/Constants';
import axios from 'axios';
import * as colors from '../assets/css/Colors';
import { useNavigation } from "@react-navigation/native";
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';
import { useCustomTheme } from  '../config/useCustomTheme';


const RiskAssessments = () => {
  const navigation = useNavigation();
  const [selectedRisks, setSelectedRisks] = useState([]); 
  const [isDataSaved, setIsDataSaved] = useState(false);

const { t } = useLocalization();
const { isDarkMode, toggleTheme, colors } = useCustomTheme();


  const handleSaveData = () => {
    // Logic to save the data
    // After data is saved:
    setIsDataSaved(true);
  };

  const handleNextStep = () => {
    // Logic to go to the next step
  };

  const risks = [
    t('AggressiveBehaviour'),
    t('ElopementWandering'),
    t('SelfHarm'),
    t('NonComplianceTreatment'),
    t('MentalHealthInstability'),
    t('SubstanceMisuse'),
    t('NutritionEatingDisorders'),
    t('FallRisk'),
    t('SocialIsolation'),
    t('ExploitationAbuse'),
    t('Choking'),
    t('MedicationRelatedRisks'),
    t('MedicalEquipment'),
    t('InfectionRisk'),
    t('DisruptiveBehavior'),
    t('CommunicationDifficulties'),
    t('EnvironmentalHazards'),
  ];
  

  const toggleRisk = (risk) => {
    setSelectedRisks((currentSelectedRisks) => {
      if (currentSelectedRisks.includes(risk)) {
        // If the risk is already selected, remove it from the array
        return currentSelectedRisks.filter((selectedRisk) => selectedRisk !== risk);
      } else {
        // If the risk is not selected, add it to the array
        return [...currentSelectedRisks, risk];
      }
    });
  };

  const goBack = () => {
    navigation.goBack();
  };
  
  const closeScreen = () => {
    navigation.dismiss(); // Or however you handle closing screens in your app
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      height: 60,
      backgroundColor: colors.theme_bg,
      flexDirection: 'row',
      alignItems: 'center'
    },
    headerIcon: {
    color: 'white',

      // Add styles if needed
    },
    headerTitle: {
      color: colors.theme_fg_three,
      fontSize: f_xl,
      fontWeight: 'bold'

    },
    scrollView: {
      padding: 10,
      paddingBottom: 100,
    },
    label: {
      marginBottom: 5,
      fontSize: 16,
      fontWeight: 'bold',
      color:colors.theme_fg_two,
    },
    riskItem: {
      padding: 15,
      borderWidth: 1,
      borderColor: colors.theme_bg_three,
      backgroundColor: colors.theme_bg_three,
      borderRadius: 10,
      marginTop: 5,
      marginBottom: 2,
      },
    selectedRiskItem: {
      backgroundColor: colors.medics_blue,
      borderColor: colors.medics_blue,
    },
    riskText: {
      fontSize: 16,
      color: colors.theme_fg_two,
    },
    flexContainer: {
      flex: 1,
      backgroundColor: colors.theme,
    },
    container: {
      // Remove flex: 1 if present, ScrollView should be allowed to size with content
      paddingHorizontal: 10,
      // Add padding or margin at the bottom to prevent content from being hidden behind the buttons
    },
    footer: {
      padding: 10,
    },
    rightButtonContainer: {
      // This will contain the Save or Next button and keep it to the right
      alignItems: 'flex-end',
    },
    button: {
      backgroundColor: '#007bff',
      paddingHorizontal: 20, // Horizontal padding for wider touch area
      paddingVertical: 10,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center', // Center the text inside the button
      // No marginBottom needed anymore
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  

  return (
    <View style={styles.flexContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
            <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize: 30 }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Jim S</Text>
{/*         <TouchableOpacity onPress={closeScreen}> */}
{/*           <Icon name="times" size={24} style={styles.headerIcon} /> */}
{/*         </TouchableOpacity> */}
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.label}>{t('WhatisRisk')}</Text>
        {risks.map((risk, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.riskItem,
              selectedRisks.includes(risk) && styles.selectedRiskItem,
            ]}
            onPress={() => toggleRisk(risk)}
          >
            <Text style={styles.riskText}>{risk}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.footer}>
        {isDataSaved ? (
          <TouchableOpacity style={styles.button} onPress={handleNextStep}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSaveData}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
  
};



export default RiskAssessments;
