import { FlatList, StyleSheet, Text, View, TextInput, Button } from 'react-native'
import React, { useContext, useState, useEffect, } from 'react'
import { UserType } from '../UserContext'
import { MessageContext } from '../MessageContext'
import axios from 'axios'

const ChatScreen = ({ route }) => {
    const { userId } = useContext(UserType)
    const { messages, setMessages } = useContext(MessageContext)
    const [newMessage, setNewMessage] = useState("")
    const receiverId = route.params.receiverId

    useEffect(() => {
        axios.get(`http://10.0.2.2:3000/${userId}/${receiverId}`)
            .then(res => setMessages(res.data)
            )
            .catch(err => console.log("erreur lors de la récupération des messages", err))
    }, [userId, receiverId])

    const sendMessage = () => {
        axios.post("http://10.0.2.2:3000/message", { sender: userId, receiver: receiverId, content: newMessage })
            .then(res => {
                setMessages(oldMessages => [...oldMessages, res.data])
                setNewMessage("")
            })
            .catch(err => console.error(err))
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.messageBox}>
                        <Text>{item.content}</Text>
                    </View>
                )}
            />
            <TextInput
                style={styles.input}
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Ecrivez un message..."
            />
            <Button title="Envoyer" onPress={sendMessage} />
        </View>
    )
}

export default ChatScreen

const styles = StyleSheet.create({})