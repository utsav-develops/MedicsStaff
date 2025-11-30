import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';
import { useCustomTheme } from  '../config/useCustomTheme';


const MedicationTime = ({ time, status, actionRequired }) => {
  let statusStyle = styles.timeStatus;
  let actionTextStyle = styles.actionText;
  let statusIcon = 'check-circle';
  let statusColor = 'green';

  if (status === 'Completed') {
    statusStyle = styles.completedStatus;
    statusIcon = 'check-circle';
    statusColor = '#34c759'; // iOS green color
  } else if (status === 'Due') {
    statusStyle = styles.dueStatus;
    statusIcon = 'exclamation-circle';
    statusColor = '#ff3b30'; // iOS red color
    actionTextStyle = styles.dueActionText;
  } else if (status === 'Next') {
    statusStyle = styles.nextStatus;
    statusIcon = 'hourglass-half';
    statusColor = '#007aff'; // iOS blue color
  }



  return (
    <View style={styles.timeContainer}>
      <Icon name={statusIcon} size={16} color={statusColor} />
      <Text style={styles.time}>{time}</Text>
      <Text style={statusStyle}>{status}</Text>
      {actionRequired && (
        <TouchableOpacity style={styles.signButton}>
          <Text style={actionTextStyle}>Sign eMAR Chart</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const eMAR = ({ navigation }) => {
  const [medications, setMedications] = useState([
    // ... your medications state ...
  ]);

     const { t } = useLocalization();
     const { isDarkMode, toggleTheme, colors } = useCustomTheme();

  const [activeTab, setActiveTab] = useState('scheduled');

  const patient = {
    name: 'Julie Freeman',
    imageUri: 'path-to-image', // Replace with actual image URI
    dnacpr: true,
  };

  const toggleDetails = (id) => {
    setMedications(medications.map((med) => {
      if (med.id === id) {
        return { ...med, detailsVisible: !med.detailsVisible };
      }
      return med;
    }));
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleClose = () => {
    navigation.dismiss();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.dark,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
      backgroundColor: colors.theme_bg,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white'
    },
    patientInfo: {
      alignItems: 'center',
      padding: 10,
      backgroundColor: colors.dark,
    },
    patientImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    patientName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.theme_fg_two
    },
    dnacprBadge: {
      backgroundColor: 'red',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 15,
    },
    dnacprText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    tabs: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 10,
    },
    tab: {
      paddingVertical: 10,
    },
    activeTab: {
      borderBottomColor: colors.theme_fg_two,
      borderBottomWidth: 2,
    },
    tabText: {
      fontSize: 16,
      color: colors.theme_fg_two,
    },
    scrollView: {
      backgroundColor: colors.lite_bg,
    },
    medicationItem: {
      backgroundColor: '#fff',
      margin: 8,
      padding: 16,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 3,
    },
    medicationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',

    },
    medicationName: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    dosage: {
      fontSize: 16,
      paddingTop: 8,
    },
    timeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingVertical: 4,
    },
    time: {
      fontSize: 16,
      fontWeight: '600',
      marginRight: 8,
    },
    timeIcon: {
      marginRight: 8,
    },
    timeStatus: {
      fontSize: 16,
      marginRight: 8,
    },
    completedStatus: {
      color: '#34c759',
    },
    dueStatus: {
      color: '#ff3b30',
    },
    nextStatus: {
      color: '#007aff',
    },
    signButton: {
      backgroundColor: '#007aff',
      padding: 6,
      borderRadius: 4,
    },
    actionText: {
      fontSize: 14,
      color: 'blue',
      fontWeight: 'bold',
    },
    dueActionText: {
      fontSize: 14,
      color: '#fff',
    },
    chevronIcon: {
      color: 'grey',
    },
    medicationDetails: {
      borderTopWidth: 1,
      borderColor: '#e6e6e6',
    },
  });


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
                            <Icon type={Icons.MaterialIcons} name="arrow-back" color='white' style={{ fontSize: 30 }} />
                        </TouchableOpacity>
        <Text style={styles.headerTitle}>eMAR</Text>
        <TouchableOpacity onPress={handleClose}>
          <Icon type={Icons.Ionicons} name="close-outline" style={{
                            fontSize: 34,
                            color: 'white'
                        }} />
        </TouchableOpacity>
      </View>

      <View style={styles.patientInfo}>
        <Image source={{ uri: patient.imageUri }} style={styles.patientImage} />
        <Text style={styles.patientName}>{patient.name}</Text>
        {patient.dnacpr && (
          <View style={styles.dnacprBadge}>
            <Text style={styles.dnacprText}>DNACPR</Text>
          </View>
        )}
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'scheduled' ? styles.activeTab : {}]}
          onPress={() => setActiveTab('scheduled')}
        >
          <Text style={styles.tabText}>Scheduled</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'notScheduled' ? styles.activeTab : {}]}
          onPress={() => setActiveTab('notScheduled')}
        >
          <Text style={styles.tabText}>Not Scheduled</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {medications.map((medication) => (
          <View key={medication.id} style={styles.medicationItem}>

<TouchableOpacity onPress={() => toggleDetails(medication.id)}>
  <View style={styles.medicationHeader}>
    <Text style={styles.medicationName}>{medication.medicationName}</Text>
    <Icon
      name={medication.detailsVisible ? 'chevron-up' : 'chevron-down'}
      size={16}
      color="#000"
      style={styles.chevronIcon}
    />
  </View>
              </TouchableOpacity>
            
            {medication.detailsVisible && (
              <View style={styles.medicationDetails}>
                <Text style={styles.medicationInfo}>Name: {medication.personName}</Text>
                <Text style={styles.medicationInfo}>DOB: {new Date(medication.dob).toLocaleDateString()}</Text>
                <Text style={styles.medicationInfo}>Medication: {medication.medicationName}</Text>
                <Text style={styles.medicationInfo}>Formulation: {medication.formulation}</Text>
                <Text style={styles.medicationInfo}>Strength: {medication.strength}</Text>
                <Text style={styles.medicationInfo}>Frequency: {medication.frequency}</Text>
                <Text style={styles.medicationInfo}>Route: {medication.route}</Text>
                <Text style={styles.medicationInfo}>GP Name: {medication.gpName}</Text>
                <Text style={styles.medicationInfo}>GP Practice: {medication.gpPractice}</Text>
                <Text style={styles.medicationInfo}>Stop Date: {medication.stopDate}</Text>
                <Text style={styles.medicationInfo}>Review Date: {medication.reviewDate}</Text>
                {medication.additionalInstructions && (
                  <Text style={styles.medicationInfo}>Instructions: {medication.additionalInstructions}</Text>
                )}
                {medication.times.map((time) => (
                  <MedicationTime
                    key={time.id}
                    time={time.time}
                    status={time.status}
                    actionRequired={time.actionRequired}
                  />
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};


export default eMAR;