import { StyleSheet, Text, View, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Pressable, Alert, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons'
import { FontAwesome } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { FontAwesome5 } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { Octicons } from '@expo/vector-icons'
import axios from 'axios'

const RegisterScreen = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [avatar, setAvatar] = useState(null)
  const [age, setAge] = useState(0)
  const [firstname, setFirstname] = useState("")
  const [birthday, setBirthday] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [role, setRole] = useState("")
  const [phone, setPhone] = useState("")
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

  const handleDateChange = (text) => {
    let formattedText = text.replace(/[^0-9]/g, '')
    if (formattedText.length > 2 && formattedText.length < 5) {
      formattedText = formattedText.replace(/^(\d{2})/, '$1/')
    } else if (formattedText.length >= 5) {
      formattedText = formattedText.replace(/^(\d{2})(\d{2})/, '$1/$2/')
    }
    setBirthday(formattedText)
  }

  const calculateAge = (birthday) => {

    const [day, month, year] = birthday.split('/')
    const birthDate = new Date(`${year}-${month}-${day}`)

    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const handleRegister = () => {

    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas")
      return
    }

    const age = calculateAge(birthday);

    setAge(age);

    const user = {
      name: name,
      firstname: firstname,
      email: email,
      password: password,
      avatar: avatar,
      birthday: birthday,
      age: age,
      address: address,
      phone: phone,
      role: "User",
      city: city,
    }

    console.log(user)

    axios.post('http://10.0.2.2:3000/register', user)
      .then((response) => {
        console.log(response)
        Alert.alert("Inscription validée", `Un email de confirmation  a été envoyé à : " ${email} "`)
        setName("")
        setFirstname("")
        setEmail("")
        setPassword("")
        setAddress("")
        setBirthday("")
        setAge(0)
        setAvatar("")
        setPhone("")
        setRole("")
        setCity("")
        navigation.navigate("Login")
      }).catch((err) => {
        console.log("erreur lors de l'inscription", err)
        Alert.alert("Erreur lors de l'inscription", err.toString())
      })
  }

  return (
    <ScrollView >
      <SafeAreaView style={{ paddingVertical: 20, flex: 1, backgroundColor: "white", alignItems: "center", }}>
        <KeyboardAvoidingView>
          <View style={{ alignItems: "center", justifyContent: "center", }}>
            <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 25 }}>Inscrivez-vous</Text>
          </View>
          <View style={{ marginTop: 40 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, borderColor: "#D0D0D0", borderWidth: 1, paddingVertical: 5, borderRadius: 5 }}>
              <Ionicons name="person" size={24} style={{ paddingLeft: 5 }} color="black" />
              <TextInput value={name} onChangeText={setName} style={{ paddingHorizontal: 10, width: 300, fontSize: name ? 16 : 16 }} placeholder="saisissez votre nom" />
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, borderColor: "#D0D0D0", borderWidth: 1, paddingVertical: 5, borderRadius: 5 }}>
              <Ionicons name="person-outline" size={24} color="black" style={{ paddingLeft: 5 }} />
              <TextInput value={firstname} onChangeText={setFirstname} style={{ paddingHorizontal: 10, width: 300, fontSize: firstname ? 16 : 16 }} placeholder="saisissez votre prénom" />
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, borderColor: "#D0D0D0", borderWidth: 1, paddingVertical: 5, borderRadius: 5 }}>
              <MaterialIcons name="email" size={24} color="black" style={{ paddingLeft: 5 }} />
              <TextInput value={email} onChangeText={setEmail} style={{ paddingHorizontal: 10, width: 300, fontSize: email ? 16 : 16 }} placeholder="saisissez votre adresse mail" />
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, borderColor: "#D0D0D0", borderWidth: 1, paddingVertical: 5, borderRadius: 5 }}>
              <MaterialIcons name="phone-iphone" size={24} color="black" style={{ paddingLeft: 5 }} />
              <TextInput value={phone} onChangeText={setPhone} style={{ paddingHorizontal: 10, width: 300, fontSize: phone ? 16 : 16 }} maxLength={10} keyboardType="numeric" placeholder="saisissez votre numéro de téléphone" />
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, borderColor: "#D0D0D0", borderWidth: 1, paddingVertical: 5, borderRadius: 5 }}>
              <Octicons name="calendar" size={24} color="black" style={{ paddingLeft: 5 }} />
              <TextInput
                keyboardType='numeric'
                onChangeText={handleDateChange}
                maxLength={10}
                value={birthday}
                placeholder='date de naissance (jj/mm/aaaa)'
                style={{ paddingHorizontal: 10, width: 300, fontSize: birthday ? 16 : 16 }}
              />
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, borderColor: "#D0D0D0", borderWidth: 1, paddingVertical: 5, borderRadius: 5 }}>
              <FontAwesome5 name="address-card" size={24} color="black" style={{ paddingLeft: 5 }} />
              <TextInput value={address} onChangeText={setAddress} style={{ paddingHorizontal: 10, width: 300, fontSize: address ? 16 : 16 }} placeholder="saisissez votre addresse" />
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, borderColor: "#D0D0D0", borderWidth: 1, paddingVertical: 5, borderRadius: 5 }}>
              <MaterialIcons name="location-city" size={24} color="black" style={{ paddingLeft: 5 }} />
              <TextInput value={city} onChangeText={setCity} style={{ paddingHorizontal: 10, width: 300, fontSize: city ? 16 : 16 }} placeholder="saisissez votre ville" />
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, borderColor: "#D0D0D0", borderWidth: 1, paddingVertical: 5, borderRadius: 5 }}>
              <FontAwesome name="picture-o" size={24} color="black" style={{ paddingLeft: 5 }} />
              <Pressable onPress={pickImage}>
                <Text style={{ paddingHorizontal: 10, width: 300, fontSize: avatar ? 16 : 16, color: "gray" }}>choisissez une image</Text>
              </Pressable>
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, borderColor: "#D0D0D0", borderWidth: 1, paddingVertical: 5, borderRadius: 5 }}>
              <MaterialCommunityIcons name="form-textbox-password" style={{ paddingLeft: 5 }} size={24} color="black" />
              <TextInput value={password} secureTextEntry onChangeText={setPassword} style={{ paddingHorizontal: 10, width: 300, fontSize: password ? 16 : 16 }} placeholder="choisissez un mot de passe" />
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, borderColor: "#D0D0D0", borderWidth: 1, paddingVertical: 5, borderRadius: 5 }}>
              <MaterialCommunityIcons name="form-textbox-password" style={{ paddingLeft: 5 }} size={24} color="black" />
              <TextInput value={confirmPassword} secureTextEntry onChangeText={setConfirmPassword} style={{ paddingHorizontal: 10, width: 300, fontSize: confirmPassword ? 16 : 16 }} placeholder="confirmez le mot de passe" />
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
    </ScrollView>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({})