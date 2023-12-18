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
    const fetchLoggedInUserId = async () => {
      const token = await AsyncStorage.getItem("authToken")
      const base64Url = token.split('.')[1]
      const base64String = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const decodedToken = JSON.parse(base64.decode(base64String))
      const userId = decodedToken.userId
      setUserId(userId)
    }
    const fetchLoggedInUser = async () => {
      await axios.get(`http://10.0.2.2:3000/profile/${userId}`)
        .then((res) => {
          const { user } = res.data
          setUser(user)
          console.log(user)
          setUserRole(user.role)
          console.log(userRole)
        }).catch((err) => {
          console.log("erreur lors de la récupération de l'utilisateur :", err)
        })
    }
    if (isUserLoggedIn) {
      fetchLoggedInUserId().then(() => {
        fetchLoggedInUser()
      })
    }
  }, [])

  return (
    <View>

    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})