import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { useEffect, useContext, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { UserType } from '../UserContext'
import base64 from 'react-native-base64'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { AuthContext } from '../AuthContext'

const HomeScreen = () => {
  const { userId, setUserId, userRole, setUserRole } = useContext(UserType)
  const { isUserLoggedIn, checkLoginStatus } = useContext(AuthContext)
  const [user, setUser] = useState("")
  useEffect(() => {

    checkLoginStatus()

    const fetchLoggedInUser = async () => {
      if (!isUserLoggedIn) return
      const token = await AsyncStorage.getItem("authToken")
      if (!token) return
      const base64Url = token.split('.')[1]
      const base64String = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const decodedToken = JSON.parse(base64.decode(base64String))
      const userId = decodedToken.userId
      setUserId(userId)

      await axios.get(`http://10.0.2.2:3000/profile/${userId}`)
        .then((res) => {
          const { user } = res.data
          setUser(user)
          setUserRole(user.role)
          console.log(user)
        }).catch((err) => {
          console.log("erreur lors de la récupération de l'utilisateur :", err)
        })
    }

    if (isUserLoggedIn) {
      fetchLoggedInUser()
    }
  }, [userId])

  return (
    <View>

    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({

})