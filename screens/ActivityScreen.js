import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { UserContext, UserType } from '../UserContext'
import { AuthContext } from '../AuthContext'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'

const ActivityScreen = () => {
  const { userId, setUserId } = useContext(UserType)
  const [activities, setActivities] = useState([])
  const { isUserLoggedIn, checkLoginStatus } = useContext(AuthContext)
  const navigation = useNavigation()

  useEffect(() => {
    checkLoginStatus()
    axios.get("http://10.0.0.2:3000/get-activities")
      .then((res) => {
        setActivities(res.data)
      }).catch((err) => {
        console.log("erreur lors de la recuperation des activités", err)
      })
  }, [])

  const handleParticipate = (activity) => {
    if (activity.participants.includes(userId)) {
      axios.put(`http://10.0.2.2:3000/activity/${activity._id}/${userId}/leave`)
        .then((res) => {

        }).catch((err) => {
          console.log("erreur lors de l'annulation", err)
        })
    }
    else {
      axios.put(`http://10.0.2.2:3000/activity/${activity._id}/${userId}/participate`)
        .then((res) => {

        }).catch((err) => {
          console.log("erreur lors de la participation", err)
        })
    }
  }

  return (
    <View style={styles.container}>
      <View>
        {activities.map((activity, index) => (
          <View key={index} style={styles.activityCard}>
            <Text style={styles.title}> {activity.title}</Text>
            <Text style={styles.content}>{activity.content}</Text>
            <Image source={{ uri: activity.image }} style={styles.image} />
            {isUserLoggedIn && (
              <TouchableOpacity onPress={() => handleParticipate(activity)}>
                <Text>
                  {activity.participants.includes(userId) ? "Ne plus participer" : "Participer"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

      </View>
      {isUserLoggedIn && (
        <TouchableOpacity style={styles.addButton} onPress={() =>
          navigation.navigate("Main", { screen: "AddActivity" })
        }>
          <Text style={styles.addButtonText}>Ajouter une activité</Text>
        </TouchableOpacity>
      )}
    </View >
  )
}

export default ActivityScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  activityCard: {
    margin: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginTop: 10,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 50,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  }
})