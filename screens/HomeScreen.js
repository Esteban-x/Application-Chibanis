import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useEffect, useContext, useCallback } from 'react'
import { UserType } from '../UserContext'
import base64 from 'react-native-base64'
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { AuthContext } from '../AuthContext'

const HomeScreen = ({ navigation }) => {
  const { userId, setUserId, userRole, setUserRole } = useContext(UserType)
  const { isUserLoggedIn, checkLoginStatus } = useContext(AuthContext)
  const [user, setUser] = useState("")
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {

    navigation.setOptions({
      headerTitle: () => (
        <Text>Coopérative Chibanis</Text>
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

  if (!fontsLoaded) {
    return
  }

  return (
    <ScrollView style={styles.wrapper}>
      <View style={styles.header}>
        <Image style={styles.headerCover} source={require('../assets/img/home-header.png')} resizeMode="contain" />
      </View>
      <View style={styles.mainContent}>
        <View style={styles.title}>
          <Text style={{ textAlign: "center", fontFamily: "Ostrich", color: "#DF5C40", fontSize: 27, paddingVertical: 10 }}>SENSIBILISER. SOUTENIR. ACCOMPAGNER</Text>
          <Text style={{ textAlign: "center", fontFamily: "Mulish", color: "#1A9BD8", fontSize: 20, paddingVertical: 5, marginHorizontal: 12 }}>Ensemble, construisons un monde plus solidaire.</Text>
          <Text style={{ textAlign: "justify", fontFamily: "Mulish", color: "black", fontSize: 15, marginHorizontal: 12, paddingVertical: 10 }}>La Coopérative Chibanis est une association loi 1901 créée dans la métropole lilloise à l’attention des personnes âgées vulnérables, isolées et de leurs aidants. Les membres associatifs ont développé une expertise sur les questions de sensibilisation d’accès aux droits à l’attention de ce public et souhaitent désormais agir sur le terrain directement auprès des séniors. Il s’agit d’accompagner ces personnes au « bien vieillir » à travers des outils et des services adaptés. Les seniors isolés, les aidants isolés, les seniors immigrés, les séniors sans abris, les seniors femmes sont au cœur de ce projet.

            Vous êtes, comme nous, sensibles à la question ?

            Découvrez nos campagnes, agissez à nos côtés !</Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "white",
  },
  header: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    height: hp("28%"),
  },
  headerCover: {
    width: "100%",
    height: "100%",
  },
  mainContent: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

  },
  title: {
    marginTop: hp("5%"),
    width: "100%",
    maxWidth: wp("95%"),
    borderRadius: 10,
  },

})