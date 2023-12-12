import { StyleSheet, Text, View, Button } from 'react-native'
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
            {users.map((user, index) => (
                <Button
                    key={index}
                    title={user.name}
                    onPress={() => navigation.navigate("Main", {
                        screen: "Message",
                        params: { receiverId: user._id }
                    })}
                />
            ))}
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
})