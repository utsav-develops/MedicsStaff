import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Ensure FontAwesome icons are installed

const Charts = ({ navigation }) => {
  const [chartData, setChartData] = useState([]);
  const patientName = "John Doe"; // Example patient name

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const response = await fetch('https://your-api-url.com/charts');
      const data = await response.json();
      setChartData(data);
    } catch (error) {
      console.error('Failed to fetch chart data', error);
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
        <Text style={styles.headerTitle}>{patientName}'s Charts</Text>
        <TouchableOpacity onPress={handleClose}>
          <Icon name="times" size={24} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        {chartData.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.item}
            onPress={() => navigation.navigate('DetailScreen', { data: item })}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.detail}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
    color: '#000', // Adjust the icon color
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontWeight: 'bold',
  },
});

export default Charts;
