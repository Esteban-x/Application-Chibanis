import { StyleSheet, Text, View, Pressable, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { UserType } from '../UserContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from '../AuthContext'

const ProfileScreen = () => {
  const navigation = useNavigation()
  const [user, setUser] = useState("")
  const { userId, setUserId } = useContext(UserType)
  const { IsUserLoggedIn, checkLoginStatus } = useContext(AuthContext)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://10.0.2.2:3000/profile/${userId}`)
        const { user } = response.data
        setUser(user)
      } catch (err) {
        console.error(err)
      }
    }
    fetchProfile()
  })

  const handleEdit = (user) => {

  }

  const handleLogout = () => {
    clearAuthToken()
  }

  const clearAuthToken = async () => {
    await AsyncStorage.removeItem("authToken")
    console.log("le token a été supprimé")
    checkLoginStatus()
    navigation.navigate("Main", { screen: "Home" })
  }
  return (
    <View style={{ flexDirection: "column", justifyContent: "center", alignText: "center", alignItems: "center", gap: 20, marginTop: 55, padding: 15 }}>
      <View>
        <Image style={{ width: 60, height: 60, borderRadius: 30, resizeMode: "contain" }} source={{ uri: "http://cdn-icons-png.flaticon.com/128/149/149071.png" }} />
      </View>
      <View style={{ textAlign: "center" }}>
        <Text style={{ textAlign: "center", fontWeight: 400, fontSize: 15 }}>Nom d'utilisateur : {user?.name}</Text>
        <Text style={{ textAlign: "center", fontWeight: 400, fontSize: 15 }}>Email: {user?.email}</Text>
        <Text style={{ textAlign: "center", fontWeight: 400, fontSize: 15 }}>Inscrit le : {user?.joinDate} </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Pressable onPress={handleEdit} style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 10, borderColor: "#D0D0D0", borderWidth: 1, borderRadius: 5 }}>
          <Text>Modifier mon profil</Text>
        </Pressable>
        <Pressable onPress={handleLogout} style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 10, borderColor: "#D0D0D0", borderWidth: 1, borderRadius: 5 }}>
          <Text>Déconnexion</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})