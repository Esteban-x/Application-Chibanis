import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Image, Button } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { UserContext, UserType } from '../UserContext'
import { AuthContext } from '../AuthContext'
import { useNavigation } from '@react-navigation/native'
import { Header } from '@react-navigation/elements';
import axios from 'axios'

const ActivityScreen = ({ navigation, route }) => {
  const { userId, userRole } = useContext(UserType)
  const [activities, setActivities] = useState([])
  const [activityId, setActivityId] = useState("")
  const { isUserLoggedIn, checkLoginStatus } = useContext(AuthContext)
  const navigations = useNavigation()

  useEffect(() => {
    checkLoginStatus()
    axios.get("http://10.0.2.2:3000/get-activities")
      .then((res) => {
        setActivities(res.data)
      }).catch((err) => {
        console.log("erreur lors de la recuperation des activités", err)
      })
  }, [activities])

  const handleParticipate = (activity) => {
    if (activity.participants.map(participant => participant._id).includes(userId)) {
      axios.put(`http://10.0.2.2:3000/activity/${activity._id}/${userId}/leave`)
        .then((res) => {
          setActivities(prevActivities => prevActivities.map(act =>
            act._id === activity._id ? res.data : act
          ))
          console.log("Utilisateur retiré de l'activité : ", res.data.participants)
        }).catch((err) => {
          console.log("erreur lors de l'annulation", err)
        })
    }
    else {
      axios.put(`http://10.0.2.2:3000/activity/${activity._id}/${userId}/participate`)
        .then((res) => {
          console.log("Utilisateur qui participe: ", res.data.participants)
        }).catch((err) => {
          console.log("erreur lors de la participation", err)
        })
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Header
          title="Activités"
          headerRight={() => (
            userRole === "Admin" && (<Button
              title="Planning"
              onPress={() => navigations.navigate("Main", { screen: "Planning" })}
            />)
          )}
        />
        <View>
          {Array.isArray(activities) && activities.map((activity, index) => (
            <View key={index} style={styles.activityCard}>
              <Text style={styles.title}> {activity.title}</Text>
              <Text style={styles.content}>{activity.content}</Text>
              <Text style={styles.content}> {activity.image}</Text>
              <Text style={styles.content}> Date : {activity.date}</Text>
              {isUserLoggedIn && activity && (
                <TouchableOpacity style={styles.participateButton} onPress={() => handleParticipate(activity)}>
                  <Text style={styles.participateButtonText}>
                    {activity.participants && activity.participants.map(participant => participant._id).includes(userId) ? "Ne plus participer" : "Participer"}
                  </Text>
                </TouchableOpacity>
              )}
              {userRole === "Admin" && (
                <TouchableOpacity style={{
                  marginTop: 10,
                  padding: 10,
                  backgroundColor: 'green',
                  borderRadius: 5,

                  width: "30%",
                }}
                  onPress={() => {
                    navigation.navigate("Main", { screen: "EditActivity", params: { activityId: activity._id } })
                  }}>
                  <Text style={{ color: "white", textAlign: "center", }}>Modifier</Text>
                </TouchableOpacity>
              )}
              {userRole === "Admin" && (
                <TouchableOpacity style={{
                  marginTop: 10,
                  padding: 10,
                  backgroundColor: 'red',
                  borderRadius: 5,

                  width: "30%",
                }}
                >
                  <Text style={{ color: "white", textAlign: "center", }}>Supprimer</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

        </View>
      </ScrollView >
      {userRole === "Admin" && (
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
    zIndex: 1,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
  },
  participateButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    color: "white",
    width: "30%",
  },
  participateButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },

})