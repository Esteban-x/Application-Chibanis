import { StyleSheet, Text, View, Image, SafeAreaView, TextInput, Button } from 'react-native'
import React, { useState, useContext } from 'react'
import { UserType } from '../UserContext'
import axios from 'axios'

const ThreadScreen = () => {
  const { userId, setUserId } = useContext(UserType)
  const [content, setContent] = useState('')
  const handlePostSubmit = () => {
    const postData = {
      userId,
    }
    if (content) {
      postData.content = content
    }
    axios.post("http://10.0.2.2:3000/create-post", postData).then((response) => {
      setContent("")
    }).catch((err) => {
      console.log("erreur lors de la publication du post", err)
    })
  }
  return (
    <SafeAreaView style={{ padding: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, padding: 10 }}>
        <Image style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          resizeMode: "contain"
        }}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
          }} />
        <Text>Ma musique</Text>
      </View>
      <View style={{ flexDirection: "row", marginLeft: 10 }}>
        <TextInput value={content} onChangeText={setContent} placeholderTextColor={"black"} placeholder="ecrivez du texte..." multiline />
        <View style={{ marginTop: 20 }} />
        <Button onPress={handlePostSubmit} title="Partager" />
      </View>
    </SafeAreaView>
  )
}

export default ThreadScreen

const styles = StyleSheet.create({})