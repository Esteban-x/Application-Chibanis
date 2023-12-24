import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import HomeScreen from './screens/HomeScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons';
import MissionScreen from './screens/MissionScreen'
import ActivityScreen from './screens/ActivityScreen'
import ProfileScreen from './screens/ProfileScreen'
import ContactScreen from './screens/ContactScreen'
import ChatScreen from './screens/ChatScreen'
import { AuthContext } from './AuthContext'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import AddActivityScreen from './screens/AddActivityScreen'
import PlanningScreen from './screens/PlanningScreen'
import UsersScreen from './screens/UsersScreen'
import EditProfileScreen from './screens/EditProfileScreen'
import EditActivityScreen from './screens/EditActivityScreen'

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
          tabBarLabel: "Accueil", tabBarLabelStyle: { color: "black" }, headerShown: true, tabBarIcon: ({ focused }) => focused ?
            (<Ionicons name="home" size={24} color="black" />) : (<Ionicons name="home" size={24} color="gray" />)
        }} />
        <Tab.Screen name="Missions" component={MissionScreen} options={{
          tabBarLabel: "Missions", tabBarLabelStyle: { color: "black" }, headerShown: false, tabBarIcon: ({ focused }) => focused ?
            (<Ionicons name="md-create-outline" size={24} color="black" />) : (<Ionicons name="md-create-outline" size={24} color="gray" />)
        }} />
        <Tab.Screen name="Activity" component={ActivityScreen} options={{
          tabBarLabel: "Activités", tabBarLabelStyle: { color: "black" }, headerShown: true, tabBarIcon: ({ focused }) => focused ?
            (<Ionicons name="calendar" size={24} color="#DF5C40" />) : (<Ionicons name="calendar-outline" size={24} color="gray" />)
        }} />
        <Tab.Screen name="Contact" component={ContactScreen} options={{
          tabBarLabel: "Contacts", tabBarLabelStyle: { color: "black" }, headerShown: false, tabBarIcon: ({ focused }) => focused ?
            (<MaterialCommunityIcons name="contacts" size={24} color="black" />) : (<MaterialCommunityIcons name="contacts-outline" size={24} color="gray" />)
        }} />
        {isUserLoggedIn && (
          <Tab.Screen name="Chat" component={UsersScreen} options={{
            tabBarLabel: "Chat", tabBarLabelStyle: { color: "black" }, headerShown: true, tabBarIcon: ({ focused }) => focused ?
              (<Ionicons name="chatbox-ellipses" size={24} color="black" />) : (<Ionicons name="chatbox-ellipses-outline" size={24} color="gray" />)
          }} />
        )}
        {isUserLoggedIn && (
          <Tab.Screen name="AddActivity" component={AddActivityScreen} options={{ tabBarButton: () => null }} />
        )}
        {isUserLoggedIn && (
          <Tab.Screen name="Planning" component={PlanningScreen} options={{ tabBarButton: () => null }} />
        )}
        {isUserLoggedIn && (
          <Tab.Screen name="Message" component={ChatScreen} options={{ tabBarButton: () => null }} />
        )}
        <Tab.Screen name={isUserLoggedIn ? "Profile" : "Login"} component={isUserLoggedIn ? ProfileScreen : LoginScreen} options={{
          tabBarLabel: isUserLoggedIn ? "Compte" : "Connexion", tabBarLabelStyle: { color: "black" }, headerShown: true, tabBarIcon: ({ focused }) => focused ?
            (<Ionicons name="person-circle-outline" size={24} color="black" />) : (<Ionicons name="person-circle-outline" size={24} color="gray" />)
        }} />
        {isUserLoggedIn && (
          <Tab.Screen name="EditProfile" component={EditProfileScreen} options={{ tabBarButton: () => null, tabBarStyle: { display: "none" } }} />
        )}
        {isUserLoggedIn && (
          <Tab.Screen name="EditActivity" component={EditActivityScreen} options={{ tabBarButton: () => null, tabBarStyle: { display: "none" } }} />
        )}
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