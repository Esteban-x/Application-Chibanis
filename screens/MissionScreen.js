import { StyleSheet, Text, View, Image, ScrollView, SafeAreaView, TextInput, Button } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { UserType } from '../UserContext'
import axios from 'axios'

const MissionScreen = () => {

  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text>Nos missions</Text>
      ),
      headerTitleAlign: 'center',
    })
  }, [])

  return (
    <ScrollView >
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bien vieillir</Text>
          <Image style={styles.cardImage} source={(require("../assets/img/chibani-3.png"))} resizeMode="contain" />
          <Text style={styles.cardDescription}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae nisi impedit laboriosam enim. Odio fuga ratione aliquam quae distinctio, explicabo ut iusto ab hic quaerat optio totam facere amet odit? Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laboriosam a maxime sit tempora aut quos quam? Modi id commodi eaque alias quibusdam natus itaque fugiat, rem ea sit, quaerat a!</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Mobilité</Text>
          <Image style={styles.cardImage} source={(require("../assets/img/chibani-2.png"))} />
          <Text style={styles.cardDescription}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae nisi impedit laboriosam enim. Odio fuga ratione aliquam quae distinctio, explicabo ut iusto ab hic quaerat optio totam facere amet odit? Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laboriosam a maxime sit tempora aut quos quam? Modi id commodi eaque alias quibusdam natus itaque fugiat, rem ea sit, quaerat a!</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Accès au droit</Text>
          <Image style={styles.cardImage} source={(require("../assets/img/chibani-1.png"))} />
          <Text style={styles.cardDescription}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae nisi impedit laboriosam enim. Odio fuga ratione aliquam quae distinctio, explicabo ut iusto ab hic quaerat optio totam facere amet odit? Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laboriosam a maxime sit tempora aut quos quam? Modi id commodi eaque alias quibusdam natus itaque fugiat, rem ea sit, quaerat a!</Text>
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
    backgroundColor: 'white',
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
    fontSize: 30,
    fontWeight: 'bold',
    color: '#677A63',
    marginBottom: 10,
    padding: 10,
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
