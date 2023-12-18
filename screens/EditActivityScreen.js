import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons';

import axios from 'axios'

const EditActivityScreen = ({ navigation, route }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");
    const [date, setDate] = useState("");
    const navigations = useNavigation();
    const { activityId } = route.params;

    useEffect(() => {
        // Votre code...
        const fetchActivity = async () => {
            axios.get(`http://10.0.2.2:3000/activity/${activityId}`)
                .then((res) => {
                    setTitle(res.data.title);
                    setContent(res.data.content);
                    setImage(res.data.image);
                    setDate(res.data.date);
                }).catch((err) => {
                    console.error(err);
                });
        };
        fetchActivity();
    }, [activityId]);

    const handleEditActivity = async () => {
        const updatedActivity = {
            title,
            content,
            image,
            date,
        };
        axios.post(`http://10.0.2.2:3000/activity/edit/${activityId}`, updatedActivity)
            .then((res) => {
                console.log("Activité modifiée", res);
                navigations.navigate("Main", { screen: "Activity", params: { activity: updatedActivity } });
            }).catch((err) => {
                console.log("Erreur lors de la modification", err);
            });
    };

    return (
        <View style={styles.activityCard}>
            <TextInput value={title} onChangeText={setTitle} style={styles.title} />
            <TextInput value={content} onChangeText={setContent} style={styles.content} />
            <TextInput value={image} onChangeText={setImage} style={styles.content} />
            <TextInput value={date} onChangeText={setDate} style={styles.content} />
            <TouchableOpacity onPress={handleEditActivity} style={{ borderRadius: 5, width: "50%", backgroundColor: "blue" }}>
                <Text style={{ color: "white" }}>Enregistrer</Text>
            </TouchableOpacity>
        </View>
    );
};

export default EditActivityScreen;

const styles = StyleSheet.create({
    content: {
        marginTop: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
})