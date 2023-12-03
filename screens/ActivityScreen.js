import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserType } from '../UserContext'
import { jwtDecode } from 'jwt-decode'
import base64 from 'react-native-base64'
import axios from 'axios'

const ActivityScreen = () => {
  const [selectedButton, setSelectedButton] = useState("Personnes")
  const [content, setContent] = useState("Personnes Content")
  const [users, setUsers] = useState([])
  const { userId, setUserId } = useContext(UserType)
  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName)
  }
  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken")
      const base64Url = token.split('.')[1]
      const base64String = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const decodedToken = JSON.parse(base64.decode(base64String))
      const userId = decodedToken.userId
      setUserId(userId)

      axios.get(`http://10.0.2.2:3000/user/${userId}`).
        then((response) => {
          setUsers(response.data)
        }).catch((err) => {
          Alert.alert(err, "Erreur lors de la récupération des utilisateurs").toString()
        })
    }

    fetchUsers()
    
    console.log(users)

  }, [])
  return (
    <ScrollView style={{ marginTop: 50 }}>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          Activités
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 12 }}>
          <TouchableOpacity onPress={() => handleButtonClick("Personnes")} style={[{ flex: 1, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "white", borderColor: "#D0D0D0", borderRadius: 6, borderWidth: 0.7 }, selectedButton === "Personnes" ? { backgroundColor: "black" } : null]}>
            <Text style={[{ textAlign: "center", fontWeight: "bold" }, selectedButton === "Personnes" ? { color: "white" } : { color: "black" }]}>
              Personnes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleButtonClick("Toutes")} style={[{ flex: 1, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "white", borderColor: "#D0D0D0", borderRadius: 6, borderWidth: 0.7 }, selectedButton === "Toutes" ? { backgroundColor: "black" } : null]}>
            <Text style={[{ textAlign: "center", fontWeight: "bold" }, selectedButton === "Toutes" ? { color: "white" } : { color: "black" }]}>
              Toutes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleButtonClick("Demandes")} style={[{ flex: 1, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "white", borderColor: "#D0D0D0", borderRadius: 6, borderWidth: 0.7 }, selectedButton === "Demandes" ? { backgroundColor: "black" } : null]}>
            <Text style={[{ textAlign: "center", fontWeight: "bold" }, selectedButton === "Demandes" ? { color: "white" } : { color: "black" }]}>
              Demandes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

export default ActivityScreen

const styles = StyleSheet.create({})