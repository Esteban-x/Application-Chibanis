import { StyleSheet, Text, View, SafeAreaView, Alert, Image, KeyboardAvoidingView, TextInput, Pressable } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../AuthContext';
import { UserType } from '../UserContext';
import * as Font from 'expo-font';


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigations = useNavigation()
  const { userId, setUserId, setUserRole, userRole } = useContext(UserType)
  const [user, setUser] = useState("")
  const { isUserLoggedIn, checkLoginStatus } = useContext(AuthContext)
  const [fontsLoaded, setFontsLoaded] = useState(false);


  useEffect(() => {

    navigation.setOptions({
      headerTitle: () => (
        <Text></Text>
      ),
      headerTitleAlign: 'center',
    })

    const loadFonts = async () => {
      await Font.loadAsync({
        'Mulish-ExtraBold': require('../assets/fonts/Mulish-ExtraBold.ttf'),
        'Mulish': require('../assets/fonts/Mulish-Regular.ttf'),
        'Mulish-Bold': require('../assets/fonts/Mulish-Bold.ttf'),
        'Ostrich': require('../assets/fonts/OstrichSans-Heavy.otf'),
        'Neucha': require('../assets/fonts/Neucha-Regular.ttf'),
      });
      setFontsLoaded(true);
    }

    loadFonts();

    checkLoginStatus()
  })

  const handleLogin = () => {
    const user = {
      email: email,
      password: password
    }
    console.log(email, password)
    axios.post('http://10.0.2.2:3000/login', user)
      .then((response) => {
        const token = response.data.token
        AsyncStorage.setItem("authToken", token)
        checkLoginStatus()
        const userData = response.data.user
        setUser(userData)
        setUserId(userData.id)
        setUserRole(userData.role)
        navigations.replace('Main', { screen: 'Home' })
      }).catch((err) => {
        console.log("erreur lors de la connexion", err)
        Alert.alert("Erreur lors de la connexion", "Vos identifiants sont invalides")
      })
  }

  if (!fontsLoaded) {
    return
  }

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "white", alignItems: "center" }}>
      <View style={{ marginTop: 50 }}>
        <Image style={{ width: 150, height: 100, resizeMode: "contain" }}
          source={require("../assets/img/logo.png")}
        />
      </View>
      <KeyboardAvoidingView style={{ marginTop: 5 }}>
        <View style={{ alignItems: "center", justifyContent: "center", }}>
          <Text style={{ fontSize: 32, marginTop: 25, fontFamily: "Ostrich" }}>Connectez-vous</Text>
        </View>
        <View style={{ marginTop: 35 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, borderColor: "#D0D0D0", borderWidth: 1, paddingVertical: 5, borderRadius: 5 }}>
            <MaterialIcons name="email" size={24} color="black" style={{ paddingLeft: 5 }} />
            <TextInput value={email} onChangeText={setEmail} style={{ paddingHorizontal: 10, width: 300, fontSize: email ? 16 : 16 }} placeholder="entrez votre Email" />
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, borderColor: "#D0D0D0", borderWidth: 1, paddingVertical: 5, borderRadius: 5 }}>
            <MaterialCommunityIcons name="form-textbox-password" style={{ paddingLeft: 5 }} size={24} color="black" />
            <TextInput value={password} secureTextEntry onChangeText={setPassword} style={{ paddingHorizontal: 10, width: 300, fontSize: password ? 16 : 16, }} placeholder="entrez votre Mot de passe" />
          </View>
        </View>
        <View style={{ marginTop: -19 }} />
        <Pressable
          onPress={handleLogin}
          style={({ pressed }) => ({
            width: 200,
            backgroundColor: pressed ? '#1A9BD8' : 'black',
            padding: 15,
            marginTop: 40,
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 6
          })}
        >
          <Text style={{ color: "white", textAlign: "center", fontSize: 17, fontFamily: "Mulish-Bold" }}>Connexion</Text>
        </Pressable>
        <Pressable onPress={() => navigations.navigate("Main", { screen: "Register" })} style={{ marginTop: 13 }}>
          <Text style={{ textAlign: "center", fontSize: 16, fontFamily: "Mulish-Bold" }}>Vous n'avez pas de compte ?  <Text style={{ color: "#1A9BD8" }}>S'inscrire</Text> </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView >
  )
}

export default LoginScreen

const styles = StyleSheet.create({})