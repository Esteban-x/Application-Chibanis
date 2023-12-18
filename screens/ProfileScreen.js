import { StyleSheet, Text, View, Pressable, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { UserType } from '../UserContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from '../AuthContext'

const ProfileScreen = (route) => {
  const navigation = useNavigation()
  const [user, setUser] = useState("")
  const { userId, setUserId, setUserRole, } = useContext(UserType)
  const { checkLoginStatus } = useContext(AuthContext)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return
      try {
        const response = await axios.get(`http://10.0.2.2:3000/profile/${userId}`)
        const { user } = response.data
        setUser(user)
      } catch (err) {
        console.error(err)
      }
    }
    fetchProfile()
  }, [userId])

  const handleLogout = () => {
    clearAuthToken()
  }

  const clearAuthToken = async () => {
    await AsyncStorage.removeItem("authToken")
    console.log("le token a été supprimé")
    setUser("")
    setUserId("")
    setUserRole("")
    checkLoginStatus()
    navigation.navigate("Main", { screen: "Login" })
  }
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image style={styles.avatar} source={{ uri: "http://cdn-icons-png.flaticon.com/128/149/149071.png" }} />
        <Text style={styles.profileName}>{user?.firstname} {user?.name}</Text>
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.infoTitle}>Infos du compte</Text>
        <Text style={styles.infoItem}>Nom : {user?.name}</Text>
        <Text style={styles.infoItem}>Prénom: {user?.firstname}</Text>
        <Text style={styles.infoItem}>Email : {user?.email}</Text>
        <Text style={styles.infoItem}>Téléphone: {user?.phone}</Text>
        <Text style={styles.infoItem}>Addresse : {user?.address}</Text>
        <Text style={styles.infoItem}>Ville : {user?.city}</Text>
        <Text style={styles.infoItem}>Age :  {user?.age}</Text>
        <Text style={styles.infoItem}>Date de naissance :  {user?.birthday}</Text>
        <Text style={styles.infoItem}>Mot de passe :  {user?.password}</Text>
        <Text style={styles.infoItem}>Inscrit le : {user?.joinDate} </Text>
        <Text style={styles.infoItem}>Role : {user?.role === "User" ? ("Adhérent") : ('Administrateur')} </Text>
      </View>
      <View style={styles.profileActions}>
        <Pressable onPress={() => navigation.navigate("Main", { screen: "EditProfile", params: { user: user } })} style={styles.actionButton}>
          <Text style={styles.actionText}>Modifier mon profil</Text>
        </Pressable>
        <Pressable onPress={handleLogout} style={styles.actionButton}>
          <Text style={styles.actionText}>Déconnexion</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
    marginTop: "10%",
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  profileActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderColor: '#D0D0D0',
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  actionText: {
    fontSize: 16,
  },
})