import { StyleSheet, Text, View, Pressable, Image, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { UserType } from '../UserContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from '../AuthContext'
import { Ionicons } from '@expo/vector-icons';


const ProfileScreen = (route) => {
  const navigation = useNavigation()
  const [user, setUser] = useState("")
  const { userId, setUserId, setUserRole, } = useContext(UserType)
  const { checkLoginStatus, isUserLoggedIn } = useContext(AuthContext)

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text>Mon compte</Text>
      ),
      headerTitleAlign: 'center',
    })
    checkLoginStatus()
    const fetchProfile = async () => {
      if (!userId || !isUserLoggedIn) return
      try {
        const response = await axios.get(`http://10.0.2.2:3000/profile/${userId}`)
        const { user } = response.data
        setUser(user)
      } catch (err) {
        console.error("erreur get profile", err)
      }
    }
    if (isUserLoggedIn) { fetchProfile() }
  }, [user])

  const handleLogout = () => {
    clearAuthToken()
    checkLoginStatus()
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
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <Image style={styles.avatar} source={{ uri: "http://cdn-icons-png.flaticon.com/128/149/149071.png" }} />
          <Text style={styles.profileName}>{user?.firstname} {user?.name}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.infoItem}><Text style={{ fontWeight: 'bold' }}>Nom :</Text> {user?.name}</Text>
          <Text style={styles.infoItem}><Text style={{ fontWeight: 'bold' }}>Prénom:</Text> {user?.firstname}</Text>
          <Text style={styles.infoItem}><Text style={{ fontWeight: 'bold' }}>Email :</Text> {user?.email}</Text>
          <Text style={styles.infoItem}><Text style={{ fontWeight: 'bold' }}>Téléphone:</Text> {user?.phone}</Text>
          <Text style={styles.infoItem}><Text style={{ fontWeight: 'bold' }}>Addresse :</Text> {user?.address}</Text>
          <Text style={styles.infoItem}><Text style={{ fontWeight: 'bold' }}>Ville :</Text> {user?.city}</Text>
          <Text style={styles.infoItem}><Text style={{ fontWeight: 'bold' }}>Age :</Text> {user?.age}</Text>
          <Text style={styles.infoItem}><Text style={{ fontWeight: 'bold' }}>Date de naissance :</Text> {user?.birthday}</Text>
          <Text style={styles.infoItem}><Text style={{ fontWeight: 'bold' }}>Mot de passe :</Text> {user?.password}</Text>
          <Text style={styles.infoItem}><Text style={{ fontWeight: 'bold' }}>Inscrit le :</Text> {user?.joinDate}</Text>
          <Text style={styles.infoItem}><Text style={{ fontWeight: 'bold' }}>Role :</Text> {user?.role === "User" ? ("Adhérent") : ('Administrateur')}</Text>
        </View>

        <View style={styles.profileActions}>
          <Pressable onPress={() => navigation.navigate("Main", { screen: "EditProfile", params: { user: user } })} style={styles.modifyButton}>
            <Text style={styles.actionText}>Modifier mon profil</Text>
          </Pressable>
          <Pressable onPress={handleLogout} style={styles.deleteButton}>
            <Text style={styles.actionText}>Déconnexion</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F3F3F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    color: 'black',
  },
  profileInfo: {
    marginBottom: 20,
  },
  infoItem: {
    fontSize: 16,
    color: '#9D9C9C',
    color: "black"
  },
  profileActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modifyButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#1A9BD8',
    width: '45%',
    justifyContent: "center",
  },
  deleteButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#DF5C40',
    width: '45%',
    justifyContent: "center",
  },
  actionText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
});