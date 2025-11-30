import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  CheckBox
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const SelectGoals = ({ navigation, route }) => {
  // Assume goals are passed from the Goals screen or fetched from your backend
  const [goals, setGoals] = useState(route.params?.goals || []);
  const [selectedGoals, setSelectedGoals] = useState({});

  const handleSelectGoal = (id) => {
    setSelectedGoals(prevSelectedGoals => ({
      ...prevSelectedGoals,
      [id]: !prevSelectedGoals[id]
    }));
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Goals</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {goals.map((goal, index) => (
          <View key={index} style={styles.goalItem}>
            <CheckBox
              value={!!selectedGoals[index]}
              onValueChange={() => handleSelectGoal(index)}
            />
            <Text style={styles.goalText}>{goal}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  scrollView: {
    marginHorizontal: 16,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  goalText: {
    fontSize: 16,
    marginLeft: 8,
  },
});

export default SelectGoals;
