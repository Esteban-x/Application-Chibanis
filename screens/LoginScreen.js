import { StyleSheet, Text, View, SafeAreaView, Alert, Image, KeyboardAvoidingView, TextInput, Pressable } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../AuthContext';

const LoginScreen = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigation = useNavigation()
  const { isUserLoggedIn, checkLoginStatus } = useContext(AuthContext)

  useEffect(() => {

    checkLoginStatus()

  })

  const handleLogin = (e) => {
    e.preventDefault()
    const user = {
      email: email,
      password: password
    }
    console.log(email, password)
    axios.post('http://10.0.2.2:3000/login', user)
      .then((response) => {
        console.log(response)
        const token = response.data.token
        AsyncStorage.setItem("authToken", token)
        navigation.navigate('Main', { screen: 'Home' })
      }).catch((err) => {
        console.log("erreur lors de la connexion", err)
        Alert.alert("Erreur lors de la connexion", err.toString())
      })
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}>
      <View style={{ marginTop: 50 }}>
        <Image style={{ width: 150, height: 100, resizeMode: "contain" }}
          source={{ uri: "https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png" }}
        />
      </View>
      <KeyboardAvoidingView>
        <View style={{ alignItems: "center", justifyContent: "center", }}>
          <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 25 }}>Connectez-vous</Text>
        </View>
        <View style={{ marginTop: 40 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, borderColor: "#D0D0D0", borderWidth: 1, paddingVertical: 5, borderRadius: 5 }}>
            <MaterialIcons name="email" size={24} color="black" style={{ paddingLeft: 5 }} />
            <TextInput value={email} onChangeText={setEmail} style={{ paddingHorizontal: 10, width: 300, fontSize: email ? 16 : 16 }} placeholder="entrez votre Email" />
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, borderColor: "#D0D0D0", borderWidth: 1, paddingVertical: 5, borderRadius: 5 }}>
            <MaterialCommunityIcons name="form-textbox-password" style={{ paddingLeft: 5 }} size={24} color="black" />
            <TextInput value={password} onChangeText={setPassword} style={{ paddingHorizontal: 10, width: 300, fontSize: password ? 16 : 16 }} placeholder="entrez votre Mot de passe" />
          </View>
        </View>
        <View style={{ flexDirection: "row", paddingHorizontal: 20, alignItems: "center", justifyContent: "space-between", marginTop: 20 }}>
          <Text style={{ fontWeight: "500" }}>Rester connecter</Text>
          <Text style={{ fontWeight: "500", color: "#007FFF" }}>Mot de passe oublié</Text>
        </View>
        <View style={{ marginTop: -25 }} />
        <Pressable onPress={handleLogin} style={{ width: 200, backgroundColor: "black", padding: 15, marginTop: 40, marginLeft: "auto", marginRight: "auto", borderRadius: 6 }}>
          <Text style={{ color: "white", textAlign: "center", fontWeight: "bold", fontSize: 16 }}>Connexion</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Register")} style={{ marginTop: 10 }}>
          <Text style={{ textAlign: "center", fontSize: 16 }}>Vous n'avez pas de compte ? S'inscrire</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})