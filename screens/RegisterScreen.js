import { StyleSheet, Text, View, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons'
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { Octicons } from '@expo/vector-icons';
import axios from 'axios'

const RegisterScreen = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [avatar, setAvatar] = useState(null)
  const [age, setAge] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("")
  const navigation = useNavigation()

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setAvatar(result.uri)
    }
  }



  const handleRegister = (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas")
      return
    }

    setRole("User")

    const user = {
      name: name,
      email: email,
      password: password,
      avatar: avatar,
      age: age,
      role: role,
    }

    axios.post('http://10.0.2.2:3000/register', user)
      .then((response) => {
        console.log(response)
        Alert.alert("Inscription validée", `Un email de confirmation  a été envoyé à : " ${email} "`)
        setName("")
        setEmail("")
        setPassword("")
        setAvatar(null)
        navigation.navigate("Login")
      }).catch((err) => {
        console.log("erreur lors de l'inscription", err)
        Alert.alert("Erreur lors de l'inscription", err.toString())
      })
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", alignItems: "center", }}>
      <View>
        <Image style={{ width: 150, height: 100, resizeMode: "contain" }}
          source={{ uri: "https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png" }}
        />
      </View>
      <KeyboardAvoidingView>
        <View style={{ alignItems: "center", justifyContent: "center", }}>
          <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 25 }}>Inscrivez-vous</Text>
        </View>
        <View style={{ marginTop: 40 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, borderColor: "#D0D0D0", borderWidth: 1, paddingVertical: 5, borderRadius: 5 }}>
            <Ionicons name="person" size={24} style={{ paddingLeft: 5 }} color="black" />
            <TextInput value={name} onChangeText={setName} style={{ paddingHorizontal: 10, width: 300, fontSize: name ? 16 : 16 }} placeholder="entrez un Nom d'utilisateur" />
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, borderColor: "#D0D0D0", borderWidth: 1, paddingVertical: 5, borderRadius: 5 }}>
            <Octicons name="number" size={24} color="black" style={{ paddingLeft: 5 }} />
            <TextInput
              keyboardType='numeric'
              onChangeText={(text) => {
                setAge(text.replace(/[^0-9]/g, ''))
              }}
              value={age}
              placeholder='entrez votre Age'
              style={{ paddingHorizontal: 10, width: 300, fontSize: name ? 16 : 16 }}
            />
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, borderColor: "#D0D0D0", borderWidth: 1, paddingVertical: 5, borderRadius: 5 }}>
            <FontAwesome name="picture-o" size={24} color="black" style={{ paddingLeft: 5 }} />
            <Pressable onPress={pickImage}>
              <Text style={{ paddingHorizontal: 10, width: 300, fontSize: avatar ? 16 : 16, color: "gray" }}>choisissez une Image</Text>
            </Pressable>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
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
        <View style={{ marginTop: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, borderColor: "#D0D0D0", borderWidth: 1, paddingVertical: 5, borderRadius: 5 }}>
            <MaterialCommunityIcons name="form-textbox-password" style={{ paddingLeft: 5 }} size={24} color="black" />
            <TextInput value={confirmPassword} onChangeText={setConfirmPassword} style={{ paddingHorizontal: 10, width: 300, fontSize: password ? 16 : 16 }} placeholder="confirmez le Mot de passe" />
          </View>
        </View>
        <View style={{ marginTop: -10 }} />
        <Pressable onPress={handleRegister} style={{ width: 200, backgroundColor: "black", padding: 15, marginTop: 40, marginLeft: "auto", marginRight: "auto", borderRadius: 6 }}>
          <Text style={{ color: "white", textAlign: "center", fontWeight: "bold", fontSize: 16 }}>S'inscrire</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Main", { screen: "Login" })} style={{ marginTop: 10 }}>
          <Text style={{ textAlign: "center", fontSize: 16 }}>Vous avez déja un compte ? Se connecter</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({})