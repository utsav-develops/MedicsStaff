import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios'; // make sure to install axios or use fetch

const MainCategories = ({ navigation }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://your-backend.com/api/categories');
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Handle error or set error state
      }
    };

    fetchCategories();
  }, []);

  const renderCategoryItem = ({ item }) => (
    <View style={styles.categoryItemWrapper}>
      <TouchableOpacity style={[styles.categoryItem, { backgroundColor: item.color }]}>
        {item.icon ? (
          <Image source={{ uri: item.icon }} style={styles.categoryIcon} />
        ) : (
          <Icon name="play-circle" size={40} color="#fff" /> // default icon
        )}
        <Text style={styles.categoryLabel}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patient Name Label</Text>
        <TouchableOpacity onPress={() => navigation.dismiss()}>
          <Icon name="times" size={24} style={styles.closeIcon} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContentContainer}
      />
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
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#e1e1e1',
    },
    backIcon: {
      // Style for back icon
    },
    closeIcon: {
      // Style for close icon
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      // Style for the header title
    },
    listContentContainer: {
      paddingHorizontal: 10,
    },
    row: {
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    categoryItemWrapper: {
      flex: 1,
      alignItems: 'center',
    },
    categoryItem: {
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 5,
    },
    categoryLabel: {
      fontSize: 16,
      textAlign: 'center',
    },
    // Additional styles here
  });

export default MainCategories;
