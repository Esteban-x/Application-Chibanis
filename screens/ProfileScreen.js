import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { UserType } from '../UserContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import base64 from 'react-native-base64'

const ProfileScreen = () => {
  const [user, setUser] = useState("")
  const { userId, setUserId } = useContext(UserType)

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      const token = await AsyncStorage.getItem("authToken")
      const base64Url = token.split('.')[1]
      const base64String = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const decodedToken = JSON.parse(base64.decode(base64String))
      const userId = decodedToken.userId
      setUserId(userId)
    }
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://10.0.2.2:3000/profile/${userId}`)
        const { user } = response.data
        setUser(user)
      } catch (err) {
        console.error(err)
      }
    }
    fetchLoggedInUser()
    fetchProfile()
  }, [])
  return (
    <View>
      <Text>ProfileScreen</Text>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})