import { StyleSheet, Text, View, Button, FlatList, Image, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { UserType } from '../UserContext'
import { useNavigation } from '@react-navigation/native'

const UsersScreen = ({ navigation }) => {
    const { userId } = useContext(UserType)
    const [users, setUsers] = useState([])
    const navigations = useNavigation()

    useEffect(() => {
        axios.get(`http://10.0.2.2:3000/user/${userId}`)
            .then((res) => setUsers(res.data))
            .catch((err) => console.error(err))
        navigation.setOptions({
            headerTitle: () => (
                <Text>Messages</Text>
            ),
            headerTitleAlign: 'center',
        })
    }, [userId])

    return (

        <ScrollView>
            {users.map((user) => (
                <Pressable
                    key={user._id}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        borderWidth: 0.7,
                        borderColor: "#D0D0D0",
                        borderTopWidth: 0,
                        borderLeftWidth: 0,
                        borderRightWidth: 0,
                        padding: 10,
                    }}
                    onPress={() => navigations.navigate("Main",
                        { screen: "Message", params: { receiverId: user._id, receiverName: user.name, userId: userId } })}
                >
                    <Image
                        style={{ width: 50, height: 50, borderRadius: 25, resizeMode: "cover", }}
                        source={{ uri: user.avatarUrl || "https://media.istockphoto.com/vectors/default-avatar-photo-placeholder-profile-icon-vector-id1313110704?k=20&m=1313110704&s=170667a&w=0&h=gE703WhYCETVYgDzUwElRoF6MbKffCcfzLpQVByIqdk=" }}
                    />
                    <View>
                        <Text style={{ fontSize: 15, fontWeight: "500", }}>{user.name}</Text>
                        <Text style={{ marginTop: 5, color: "gray", fontWeight: "500", }}>{user.lastMessage}</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 11, fontWeight: "400", color: "#585858" }}>{user.lastMessageTime}</Text>
                    </View>
                </Pressable>
            ))}
        </ScrollView>
    )
}

export default UsersScreen