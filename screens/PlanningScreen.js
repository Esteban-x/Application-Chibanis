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
    <View>
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
        <View key={index}>
          <Text>Date: {selectedDate}</Text>
          <Text>Activité: {activity.title}</Text>
          <Text>Contenu: {activity.content}</Text>
          <Text>Participants: {activity.participants.map(participant => participant.firstname).join(', ')}</Text>
        </View>
      ))}
    </View>
  );
};

export default PlanningScreen;

const styles = StyleSheet.create({

})
