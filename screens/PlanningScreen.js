import React, { useEffect, useState, useContext, } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../AuthContext';

const PlanningScreen = ({ navigation }) => {
  const [activities, setActivities] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const { checkLoginStatus } = useContext(AuthContext)

  useEffect(() => {
    checkLoginStatus()
    navigation.setOptions({
      headerTitle: () => (
        <Text>Planning</Text>
      ),
      headerTitleAlign: 'center',
      headerLeft: () => (
        <TouchableOpacity style={{ marginLeft: 13, marginTop: 5 }} onPress={() => navigation.navigate("Main", { screen: "Activity" })}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      )
    })
    axios.get("http://10.0.2.2:3000/get-activities")
      .then((res) => {
        const activitiesByDate = res.data.reduce((acc, activity) => {
          const date = activity.date.split('T')[0]
          if (!acc[date]) {
            acc[date] = { dots: [{ key: date, color: 'blue', selectedDotColor: 'white' }], selected: true, activityList: [] };
          }
          acc[date].activityList.push(activity);
          return acc;
        }, {});
        setActivities(activitiesByDate);
      }).catch((err) => {
        console.log("erreur lors de la recuperation des activités", err)
      })
  }, [activities]);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };


  return (
    <View style={styles.container}>
      <View style={{ marginTop: 10 }}>
        <Calendar
          markedDates={activities}
          markingType={'multi-dot'}
          onDayPress={handleDayPress}
          renderDay={(day) => {
            const date = day.dateString;
            const dayActivities = activities[date]?.activityList;
            return (
              <View>
                <Text>{day.day}</Text>
                {dayActivities && dayActivities.map((activity, index) => (
                  <TouchableOpacity key={index} onPress={() => alert(`Participants: ${activity.participants.join(', ')}`)}>
                    <Text>{activity.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            );
          }}
        />
        {selectedDate && activities[selectedDate]?.activityList.map((activity, index) => (
          <View key={index} style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityDate}>{selectedDate}</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityLabel}>Participants:</Text>
              <Text style={styles.activityParticipants}>{activity.participants.map(participant => participant.firstname).join(', ')}</Text>
            </View>
          </View>

        ))}
      </View>
    </View>
  )
}

export default PlanningScreen
const styles = StyleSheet.create({
  activityCard: {
    borderRadius: 10,
    padding: 20,
    marginTop: 10,
    backgroundColor: 'white',
    elevation: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  activityTitle: {
    fontSize: 25,
    fontWeight: 'medium',
    color: 'black',
  },
  activityDate: {
    fontSize: 16,
    color: '#9D9C9C',
    marginTop: 10,
  },
  activityContent: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  activityLabel: {
    fontSize: 17,
    fontWeight: 'light',
    color: 'black',
    paddingVertical: 15,
  },
  activityParticipants: {
    fontSize: 16,
    marginLeft: 10,
    color: '#9D9C9C',
  },
});

