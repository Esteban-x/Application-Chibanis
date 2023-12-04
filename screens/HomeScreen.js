import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { useEffect, useContext, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { UserType } from '../UserContext'
import base64 from 'react-native-base64'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const HomeScreen = () => {
  const { userId, setUserId } = useContext(UserType)
  const [posts, setPosts] = useState([])
  useEffect(() => {
    const fetchLoggedInUser = async () => {
      const token = await AsyncStorage.getItem("authToken")
      const base64Url = token.split('.')[1]
      const base64String = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const decodedToken = JSON.parse(base64.decode(base64String))
      const userId = decodedToken.userId
      setUserId(userId)
    }

    fetchLoggedInUser()

  }, [])

  useEffect(() => {

    fetchPosts()

  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchPosts()
    }, [])
  )

  const fetchPosts = async () => {
    try {
      console.log("Fetching posts...")
      const response = await axios.get("http://10.0.2.2:3000/get-posts")
      setPosts(response.data)
    } catch (err) {
      console.log("erreur lors de la récuperation des post", err)
    }
  }

  console.log("Voici tous les post : ", posts)

  const handleLike = async (postId) => {
    try {
      const response = await axios.put(`http://10.0.2.2:3000/post/${postId}/${userId}/like`)
      const updatedPost = response.data
      const updatedPosts = posts?.map((post) => post?._id === updatedPost._id ? updatedPost : post)
      setPosts(updatedPosts)
    } catch (err) {
      console.log("erreur lors du like", err)
    }
  }
  const handleDislike = async (postId) => {
    try {
      const response = await axios.put(`http://10.0.2.2:3000/post/${postId}/${userId}/unlike`)
      const updatedPost = response.data
      const updatedPosts = posts?.map((post) => post?._id === updatedPost._id ? updatedPost : post)
      setPosts(updatedPosts)
    } catch (err) {
      console.log("erreur lors du like", err)
    }
  }
  return (
    <ScrollView style={{ marginTop: 50, flex: 1, backgroundColor: "white" }}>
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <Image style={{ width: 60, height: 40, resizedMode: "contain" }} source={{
          uri: "https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png"
        }} />
      </View>
      <View style={{ marginTop: 20 }}>
        {posts?.map((post) => (
          <View style={{ padding: 15, borderColor: "#D0D0D0", borderTopWidth: 1, flexDirection: "row", gap: 10, marginVertical: 10 }}>
            <View>
              <Image style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                resizeMode: "contain"
              }}
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
                }}
              />
            </View>
            <View>
              <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 4 }}>
                {post?.user?.name}
              </Text>
              <Text>
                {post?.content}
              </Text>
              <View style={{ flexDirection: "row", gap: 10, alignItems: "center", marginTop: 15 }}>
                {post?.likes?.includes(userId) ? (
                  <AntDesign onPress={() => handleDislike(post?._id)} name="heart" size={24} color="black" />
                ) :
                  (
                    <Ionicons onPress={() => handleLike(post?._id)} name="heart-outline" size={24} color="black" />
                  )
                }

                <FontAwesome name="comment-o" size={24} color="black" />
                <Entypo name="share-alternative" size={24} color="black" />
              </View>
              <Text style={{ marginTop: 7, color: "gray" }}>{post?.likes?.length} likes {post?.replies?.length} comments</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})