import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, SafeAreaView, TextInput, Button, Linking } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import FileViewer from 'react-native-file-viewer'
import { UserType } from '../UserContext'
import { Octicons } from '@expo/vector-icons';
import axios from 'axios'
import { AntDesign } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font'



const MissionScreen = () => {
  const navigation = useNavigation()
  const [fontsLoaded, setFontsLoaded] = useState(false)

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text>Nos missions</Text>
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
      setFontsLoaded(true)
    }

    loadFonts()

  }, [])


  if (!fontsLoaded) {
    return
  }

  const openPDF = async () => {
    const localFilePath = '../assets/pdf/livret-chibanis-2021.pdf'

    try {
      await FileViewer.open(localFilePath)
    } catch (err) {
      console.error(err);
    }
  }



  return (
    <ScrollView >
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <AntDesign name="smile-circle" size={40} color="#1A9BD8" style={{ marginBottom: 10, marginRight: 10 }} /><Text style={styles.cardTitle}>Bien vieillir</Text>
          </View>
          <Image style={styles.cardImage} source={(require("../assets/img/chibani-3.png"))} resizeMode="contain" />

          <Text style={styles.cardDescription}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae nisi impedit laboriosam enim. Odio fuga ratione aliquam quae distinctio, explicabo ut iusto ab hic quaerat optio totam facere amet odit? Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laboriosam a maxime sit tempora aut quos quam? Modi id commodi eaque alias quibusdam natus itaque fugiat, rem ea sit, quaerat a!</Text>
        </View>
        <View style={styles.card}>
          <View style={{ flexDirection: "row", justifyContent: "center", marginRight: 20 }}>
            <Ionicons name="ios-walk-outline" size={54} color="#1A9BD8" style={{ marginBottom: 16, marginRight: 2 }} /><Text style={styles.cardTitle}>Mobilité</Text>
          </View>
          <Image style={styles.cardImage} source={(require("../assets/img/chibani-2.png"))} />
          <Text style={styles.cardDescription}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae nisi impedit laboriosam enim. Odio fuga ratione aliquam quae distinctio, explicabo ut iusto ab hic quaerat optio totam facere amet odit? Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laboriosam a maxime sit tempora aut quos quam? Modi id commodi eaque alias quibusdam natus itaque fugiat, rem ea sit, quaerat a!</Text>
        </View>
        <View style={styles.card}>
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Octicons name="law" size={43} color="#1A9BD8" style={{ marginBottom: 10, marginRight: 10 }} /><Text style={styles.cardTitle}>Bien vieillir</Text>
          </View>
          <Image style={styles.cardImage} source={(require("../assets/img/chibani-1.png"))} />
          <Text style={styles.cardDescription}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae nisi impedit laboriosam enim. Odio fuga ratione aliquam quae distinctio, explicabo ut iusto ab hic quaerat optio totam facere amet odit? Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laboriosam a maxime sit tempora aut quos quam? Modi id commodi eaque alias quibusdam natus itaque fugiat, rem ea sit, quaerat a!
          </Text>
          <TouchableOpacity>
            <Text style={{ color: '#1A9BD8' }} onPress={openPDF}>
              Livret d'accès au droit
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}

export default MissionScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: '#EAF6FE',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 40,
    color: '#35363A',
    marginBottom: 10,
    padding: 10,
    fontFamily: "Ostrich",
    textTransform: "uppercase",
  },
  cardImage: {
    width: '100%',
    height: 400,
    borderRadius: 6,
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
    color: 'black',
    textAlign: 'justify',
    paddingVertical: 10,
  },
});
