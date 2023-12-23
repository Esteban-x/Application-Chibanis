import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Image, Button } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { UserContext, UserType } from '../UserContext'
import { AuthContext } from '../AuthContext'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'
import { Header } from '@react-navigation/elements';
import axios from 'axios'
import * as Font from 'expo-font';

const ActivityScreen = ({ navigation, route }) => {
  const { userId, userRole } = useContext(UserType)
  const [activities, setActivities] = useState([])
  const [activityId, setActivityId] = useState("")
  const { isUserLoggedIn, checkLoginStatus } = useContext(AuthContext)
  const navigations = useNavigation()
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    checkLoginStatus()
    axios.get("http://10.0.2.2:3000/get-activities")
      .then((res) => {
        setActivities(res.data)
      }).catch((err) => {
        console.log("erreur lors de la recuperation des activités", err)
      })
    navigation.setOptions({
      headerTitle: () => (
        <Text>Activités</Text>
      ),
      headerTitleAlign: 'center',
    })
    const loadFonts = async () => {
      await Font.loadAsync({
        'Mulish-ExtraBold': require('../assets/fonts/Mulish-ExtraBold.ttf'),
        'Mulish': require('../assets/fonts/Mulish-Regular.ttf'),
        'Mulish-Bold': require('../assets/fonts/Mulish-Bold.ttf'),
        'Ostrich': require('../assets/fonts/OstrichSans-Heavy.otf'),
        'Neucha': require('../assets/fonts/Neucha-Regular.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  })

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

  const handleDeleteActivity = (activityId) => {
    console.log("suppression en cours...")
    Alert.alert(
      "Supprimer l'activité",
      "Êtes-vous sûr de vouloir supprimer l'activité ? Cette action est irréversible.",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`http://10.0.2.2:3000/delete/activity/${activityId}`)
              console.log("Activité supprimé avec succès");
            } catch (err) {
              console.log("Erreur lors de la demande de suppression", err);
            }
          }
        }
      ]
    )
  }

  if (!fontsLoaded) {
    return
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Header
          title=""
          headerTitle={() => (
            userRole === "Admin" && (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                  title="Planning"
                  onPress={() => navigations.navigate("Main", { screen: "Planning" })}
                  style={{
                    alignSelf: 'center', flexDirection: "row", backgroundColor: "white", padding: 5, borderRadius: 6, borderWidth: 0.5,
                    borderColor: "#9D9C9C",
                  }}
                >
                  <Ionicons name="calendar-outline" size={24} color="black" />
                  <Text style={{ margin: 4, color: "black" }}>Consulter le planning</Text>
                </TouchableOpacity>
              </View>
            )
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
                  backgroundColor: '#677A63',
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
                  backgroundColor: '#DF5C40',
                  borderRadius: 5,

                  width: "30%",
                }}
                  onPress={() => {
                    handleDeleteActivity(activity._id)
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
          navigations.navigate("Main", { screen: "AddActivity" })
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
    textAlign: "center",
  },
  content: {
    marginTop: 10,
    textAlign: "center",
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
    backgroundColor: 'white',
    borderRadius: 50,
    zIndex: 1,
    borderWidth: 0.5,
    borderColor: "#9D9C9C",
  },
  addButtonText: {
    color: 'black',
    fontSize: 18,
  },
  participateButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#1A9BD8",
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