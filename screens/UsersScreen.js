import { StyleSheet, Text, View, Button, FlatList, Image } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { UserType } from '../UserContext'
import { useNavigation } from '@react-navigation/native'

const UsersScreen = () => {
    const { userId } = useContext(UserType)
    const [users, setUsers] = useState([])
    const navigation = useNavigation()

    useEffect(() => {
        axios.get(`http://10.0.2.2:3000/user/${userId}`)
            .then((res) => setUsers(res.data))
            .catch((err) => console.error(err))
    }, [userId])

    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.userBox}>
                        <Image source={{ uri: item.photo }} style={styles.userPhoto} />
                        <Text>{item.name}</Text>
                        <Text>{item.lastMessage}</Text>
                        <Text>{item.lastMessageTime}</Text>
                        <Button
                            title=">"
                            onPress={() => navigation.navigate("Main", {
                                screen: "Message",
                                params: { receiverId: item._id, receiverName: item.name, userId: userId }
                            })}
                        />
                    </View>
                )}
            />
        </View>
    )
}

export default UsersScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    userBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    userPhoto: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    messageBox: {
        padding: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        width: '100%',
    },
})