import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import HomeScreen from './screens/HomeScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons';
import ThreadScreen from './screens/ThreadScreen'
import ActivityScreen from './screens/ActivityScreen'
import ProfileScreen from './screens/ProfileScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthContext } from './AuthContext'
import { MaterialCommunityIcons } from '@expo/vector-icons';

const StackNavigator = () => {

  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const { isUserLoggedIn, checkLoginStatus } = useContext(AuthContext)

  useEffect(() => {
    checkLoginStatus()
  })

  function BottomTabs() {
    return (
      <Tab.Navigator initialRouteName='Home'>
        <Tab.Screen name="Home" component={HomeScreen} options={{
          tabBarLabel: "Accueil", tabBarLabelStyle: { color: "black" }, headerShown: false, tabBarIcon: ({ focused }) => focused ?
            (<Ionicons name="home" size={24} color="black" />) : (<Ionicons name="home" size={24} color="gray" />)
        }} />
        {isUserLoggedIn && (
          <Tab.Screen name="Threads" component={ThreadScreen} options={{
            tabBarLabel: "Missions", tabBarLabelStyle: { color: "black" }, headerShown: false, tabBarIcon: ({ focused }) => focused ?
              (<Ionicons name="md-create-outline" size={24} color="black" />) : (<Ionicons name="md-create-outline" size={24} color="gray" />)
          }} />
        )}
        <Tab.Screen name="Activity" component={ActivityScreen} options={{
          tabBarLabel: "Activités", tabBarLabelStyle: { color: "black" }, headerShown: false, tabBarIcon: ({ focused }) => focused ?
            (<Ionicons name="calendar" size={24} color="black" />) : (<Ionicons name="calendar-outline" size={24} color="gray" />)
        }} />
        <Tab.Screen name="Adcdtivity" component={ActivityScreen} options={{
          tabBarLabel: "Contacts", tabBarLabelStyle: { color: "black" }, headerShown: false, tabBarIcon: ({ focused }) => focused ?
            (<MaterialCommunityIcons name="contacts" size={24} color="black" />) : (<MaterialCommunityIcons name="contacts-outline" size={24} color="gray" />)
        }} />
        <Tab.Screen name="Acdtivity" component={ActivityScreen} options={{
          tabBarLabel: "Chat", tabBarLabelStyle: { color: "black" }, headerShown: false, tabBarIcon: ({ focused }) => focused ?
            (<Ionicons name="chatbox-ellipses" size={24} color="black" />) : (<Ionicons name="chatbox-ellipses-outline" size={24} color="gray" />)
        }} />
        <Tab.Screen name={isUserLoggedIn ? "Profile" : "Login"} component={isUserLoggedIn ? ProfileScreen : LoginScreen} options={{
          tabBarLabel: isUserLoggedIn ? "Compte" : "Connexion", tabBarLabelStyle: { color: "black" }, headerShown: false, tabBarIcon: ({ focused }) => focused ?
            (<Ionicons name="person-circle-outline" size={24} color="black" />) : (<Ionicons name="person-circle-outline" size={24} color="gray" />)
        }} />
        <Tab.Screen name="Register" component={RegisterScreen} options={{ tabBarButton: () => null }} />
      </Tab.Navigator>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Main'>
        <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator

const styles = StyleSheet.create({})