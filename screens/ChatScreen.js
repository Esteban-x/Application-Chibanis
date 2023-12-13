import React, { useState, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import axios from 'axios'

const ChatScreen = ({ route, navigation }) => {
    const [messages, setMessages] = useState([]);

    const userId = route.params.userId
    const receiverId = route.params.receiverId
    const receiverName = route.params.receiverName

    useEffect(() => {
        axios.get(`http://10.0.2.2:3000/messages/${userId}/${receiverId}`)
            .then(res => {
                setMessages(res.data.map(msg => ({
                    _id: msg._id,
                    text: msg.content,
                    createdAt: new Date(msg.timestamp),
                    user: {
                        _id: msg.sender === userId ? 1 : 2,
                        name: msg.senderName,
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                })));
            })
            .catch(err => console.log("erreur lors de la récupération des messages", err))
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
                        name: res.data.senderName, // Remplacez par le nom de l'utilisateur
                        avatar: 'https://placeimg.com/140/140/any', // Remplacez par l'URL de l'avatar de l'utilisateur
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
                _id: 1,
            }}
            renderUsernameOnMessage={true}
        />
    );
};

export default ChatScreen;
