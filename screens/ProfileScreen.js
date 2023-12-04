import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { UserType } from '../UserContext'

const ProfileScreen = () => {
  const [user, setUser] = useState("")
  const { userId, setUserId } = useContext(UserType)

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
  console.log("profile :", user)
  return (
    <View style={{ marginTop: 50, textAlign: "center" }}>
      <Text>profilescreen</Text>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})