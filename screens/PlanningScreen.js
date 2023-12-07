import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Agenda } from 'react-native-calendars';
import axios from 'axios';

const PlanningScreen = () => {
  const [activities, setActivities] = useState({});

  useEffect(() => {
    axios.get("http://10.0.2.2:3000/get-activities")
      .then((res) => {
        const activitiesByDate = res.data.reduce((acc, activity) => {
          const date = activity.date.split('T')[0]; // Assurez-vous que la date est au format 'yyyy-mm-dd'
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(activity);
          return acc;
        }, {});
        setActivities(activitiesByDate);
      }).catch((err) => {
        console.log("erreur lors de la recuperation des activités", err)
      })
  });

  return (
    <Agenda
      items={activities}
      renderItem={(item) => (
        <View>
          <Text>{item.title}</Text>
          <Text>Participants : {item.participants.join(', ')}</Text>
        </View>
      )}
    />
  );
};

export default PlanningScreen;
