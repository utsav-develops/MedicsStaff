import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Ensure FontAwesome icons are installed

const CarePlans = ({ navigation }) => {
  const [carePlans, setCarePlans] = useState([]);
  const patientName = "Jim S"; // Example patient name

  useEffect(() => {
    fetchCarePlans();
  }, []);

  const fetchCarePlans = async () => {
    try {
      const response = await fetch('https://your-api-url.com/care-plans');
      const data = await response.json();
      setCarePlans(data);
    } catch (error) {
      console.error('Failed to fetch care plans', error);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleClose = () => {
    navigation.dismiss();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrow-left" size={24} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{patientName}'s Care Plan</Text>
        <TouchableOpacity onPress={handleClose}>
          <Icon name="times" size={24} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        {carePlans.map((plan, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.item}
            onPress={() => navigation.navigate('CarePlanDetail', { planId: plan.id })}
          >
            <Icon name={plan.icon} size={24} color="#000" style={styles.itemIcon} />
            <Text style={styles.title}>{plan.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  icon: {
    color: '#000',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemIcon: {
    marginRight: 10,
  },
  title: {
    fontWeight: 'bold',
  },
});

export default CarePlans;
