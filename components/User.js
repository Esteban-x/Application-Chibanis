import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useContext, useState } from 'react'
import { UserType } from '../UserContext'
import base64 from 'react-native-base64'

const User = ({ item }) => {
    const { userId, setUserId } = useContext(UserType)
    const [requestSent, setRequestSent] = useState(false)
    const sendFollow = async (currentUserId, selectedUserId) => {
        try {
            const response = await fetch("http://10.0.2.2:3000/follow", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ currentUserId, selectedUserId })
            })
            if (response.ok) {
                setRequestSent(true)
            }
        } catch (err) {
            console.log("erreur: "), err
        }
    }
    const unFollow = async (loggedInUserId, targetUserId) => {
        try {
            const response = await fetch("http://10.0.2.2:3000/users/unfollow", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ loggedInUserId, targetUserId })

            })
            if (response.ok) {
                setRequestSent(false)
            }
        } catch (err) {
            console.log("erreur: ", err)
        }
    }
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
    return (
        <View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        resizeMode: "contain"
                    }}
                    source={{
                        uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
                    }}
                />
                <Text style={{ fontSize: 15, fontWeight: "500", flex: 1, paddingLeft: 15 }}>{item?.name}</Text>
                {requestSent || item?.followers?.includes(userId) ? (
                    <Pressable onPress={() => unFollow(userId, item._id)} style={{ borderColor: "#D0D0D0", borderWidth: 1, padding: 10, marginLeft: 10, width: 100, borderRadius: 7 }}>
                        <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                            Ne plus suivre
                        </Text>
                    </Pressable>
                ) : (
                    <Pressable onPress={() => sendFollow(userId, item._id)} style={{ borderColor: "#D0D0D0", borderWidth: 1, padding: 10, marginLeft: 10, width: 100, borderRadius: 7 }}>
                        <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                            Suivre
                        </Text>
                    </Pressable>
                )}

            </View>
        </View>
    )
}

export default User

const styles = StyleSheet.create({})