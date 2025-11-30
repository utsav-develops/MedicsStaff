import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Button,
  FlatList
} from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';
import { useCustomTheme } from  '../config/useCustomTheme';

const Goals = ({ navigation }) => {
  const [goals, setGoals] = useState([]);
  const [archivedGoals, setArchivedGoals] = useState([]); // State to hold archived goals
  const [newGoal, setNewGoal] = useState('');
  // Dummy patient data
  const patientName = 'Julie Freeman';

  // This function would be used to fetch archived goals
  const fetchArchivedGoals = () => {
    // Fetch and set archived goals here
    // setArchivedGoals(fetchedArchivedGoals);
  };

   const { t } = useLocalization();
       const { isDarkMode, toggleTheme, colors } = useCustomTheme();


  const handleAddGoal = () => {
    if (goals.length < 7) {
      const newGoalWithTime = { text: newGoal, timeAdded: Date.now() };
      setGoals(currentGoals => [...currentGoals, newGoalWithTime]);
      setNewGoal('');
      // Here, you would also send the new goal to your backend
    } else {
      alert('Maximum of 7 goals can be set.');
    }
  };

  // Check if the edit button should be enabled based on the time passed
  const canEditGoal = (timeAdded) => {
    return (Date.now() - timeAdded) < 8 * 60 * 60 * 1000; // 8 hours in milliseconds
  };

  // You might want to have an edit function to update the text of a goal
  const editGoal = (index) => {
    console.log(`Edit goal at index ${index}`);
    // Implement editing logic
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
      backgroundColor: colors.theme,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: colors.theme_bg
    },
    patientName: {
      fontSize: 18,
      fontWeight: 'bold',
      flex: 1,
      textAlign: 'center',
      color:'white',
    },
    input: {
      borderColor: '#ccc',
      borderWidth: 1,
      padding: 10,
      borderRadius: 5,
      marginHorizontal: 16,
      marginBottom: 15,
      color: colors.theme_fg_two
    },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      marginVertical: 10,
    },
    archivedGoalText: {
      fontSize: 16,
      color: '#a9a9a9',
      marginHorizontal: 16,
      marginBottom: 10,
    },
    scrollView: {
      flex: 1,
    },
    goalsList: {
      marginTop: 20,
      marginBottom: 20,
    },
    goalItem: {
      backgroundColor: colors.dark,
      padding: 10,
      borderRadius: 5,
      marginHorizontal: 16,
      marginBottom: 10,
    },
    goalText: {
      fontSize: 16,
      padding: 10,
      color: colors.theme_fg_two
    },
  });


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
                        <Icon type={Icons.MaterialIcons} name="arrow-back" color='white' style={{ fontSize: 30 }} />
                    </TouchableOpacity>
        <Text style={styles.patientName}>{patientName}'s Goals</Text>
         <TouchableOpacity onPress={handleClose}>
                  <Icon type={Icons.Ionicons} name="close-outline" style={{
                                    fontSize: 34,
                                    color: 'white'
                                }} />
                </TouchableOpacity>
      </View>

      <View style={{margin: 10}} />
      
      <TextInput
        style={styles.input}
        placeholder="Enter a new goal"
        value={newGoal}
        placeholderTextColor= {colors.text_grey}
        onChangeText={setNewGoal}
        onSubmitEditing={handleAddGoal}
      />
      <TouchableOpacity style={{width:'90%',alignSelf:'center'}}>
      <Button
        title="Add Goal"
        color={colors.medics_blue}
        onPress={handleAddGoal}
        disabled={goals.length >= 7 || newGoal.trim() === ''}
      />
      </TouchableOpacity>

 <ScrollView style={styles.scrollView}>
        <View style={styles.goalsList}>
          {goals.map((goal, index) => (
            <View key={index} style={styles.goalItem}>
              <Text style={styles.goalText}>{goal.text}</Text>
              {canEditGoal(goal.timeAdded) && (
              <TouchableOpacity style={{width:'100%',alignSelf:'center'}}>
                <Button title="Edit" onPress={() => editGoal(index)} color={colors.medics_blue} />
                </TouchableOpacity>
              )}
            </View>
          ))}
                </View>
        <View style={styles.divider} />
        <FlatList
          data={archivedGoals}
          keyExtractor={(item, index) => 'archived-' + index}
          onEndReached={fetchArchivedGoals}
          onEndReachedThreshold={0.5}
          renderItem={({ item, index }) => (
            <Text style={styles.archivedGoalText}>{item}</Text>
          )}
        />
      </ScrollView>
    </View>
  );
};



export default Goals;
