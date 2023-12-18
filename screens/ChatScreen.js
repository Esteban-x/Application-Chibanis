import React, { useState, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { Text, Button, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'

const ChatScreen = ({ route, navigation }) => {
    const [messages, setMessages] = useState([])
    const navigations = useNavigation()
    const userId = route.params.userId
    const receiverId = route.params.receiverId
    const receiverName = route.params.receiverName

    useEffect(() => {
        console.log(userId, receiverId, receiverName)

        navigation.setOptions({
            headerTitle: () => (
                <Text>{receiverName}</Text>
            ),
            headerTitleAlign: 'center',
            headerLeft: () => (
                <TouchableOpacity style={{ marginLeft: 13, marginTop: 5 }} onPress={() => navigation.navigate("Main", { screen: "Profile" })}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
            )
        })

        axios.get(`http://10.0.2.2:3000/messages/${userId}/${receiverId}`)
            .then(res => {
                console.log("chargement des messages...")
                setMessages(res.data.map(msg => ({
                    _id: msg._id,
                    text: msg.content,
                    createdAt: new Date(msg.timestamp),
                    user: {
                        _id: msg.sender,
                        name: msg.senderName ? msg.senderName : "exemple",
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                })));
                console.log("messages chargés")
            })
            .catch(err => console.log("erreur lors de la récupération des messages (client)", err))
    }, [userId, receiverId, receiverName, navigation])

    const onSend = (newMessage = []) => {
        axios.post("http://10.0.2.2:3000/message", { sender: userId, receiver: receiverId, content: newMessage[0].text })
            .then(res => {
                const messageFromServer = {
                    _id: res.data._id,
                    text: res.data.content,
                    createdAt: new Date(res.data.timestamp),
                    user: {
                        _id: res.data.sender,
                        name: res.data.senderName,
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                };
                setMessages(previousMessages => GiftedChat.append(previousMessages, messageFromServer));
            })
            .catch(err => console.error(err))
    }

    return (
        <GiftedChat
            messages={messages}
            onSend={newMessage => onSend(newMessage)}
            user={{
                _id: userId,
            }}
            renderUsernameOnMessage={true}
        />
    )
}

export default ChatScreen;
