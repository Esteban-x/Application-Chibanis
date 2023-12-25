import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';


import axios from 'axios'

const EditActivityScreen = ({ navigation, route }) => {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [image, setImage] = useState("")
    const [date, setDate] = useState("")
    const navigations = useNavigation()
    const { activityId } = route.params

    useEffect(() => {
        const fetchActivity = async () => {
            axios.get(`http://10.0.2.2:3000/activity/${activityId}`)
                .then((res) => {
                    setTitle(res.data.title)
                    setContent(res.data.content)
                    setImage(res.data.image)
                    setDate(res.data.date)
                }).catch((err) => {
                    console.error(err)
                })
        }
        navigation.setOptions({
            headerTitle: () => (
                <Text>Ajouter une activité</Text>
            ),
            headerTitleAlign: 'center',
            headerLeft: () => (
                <TouchableOpacity style={{ marginLeft: 13, marginTop: 5 }} onPress={() => navigations.navigate("Main", { screen: "Activity" })}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
            )
        })
        fetchActivity()
    }, [activityId])

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
        <View style={styles.container}>
            <View style={{ alignItems: "center", marginTop: 30 }}>
                <View style={{ flexDirection: "row", alignItems: "center", }}>
                    <FontAwesome5 name="edit" size={50} color="#677A63" />
                    <Text style={{ fontSize: 50, marginTop: 5 }}>Activité</Text>
                </View>
            </View>
            <View style={{ marginTop: 10 }}>
                <Text style={styles.label}>Titre</Text>
                <TextInput style={styles.input} value={title} onChangeText={setTitle} />

                <Text style={styles.label}>Liens vers l'image (url)</Text>
                <TextInput style={styles.input} value={image} onChangeText={setImage} />

                <Text style={styles.label}>Description</Text>
                <TextInput style={styles.input} value={content} onChangeText={setContent} multiline />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={{ backgroundColor: "#677A63", borderRadius: 6, padding: 10 }} onPress={handleEditActivity} ><Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>Enregistrer</Text></TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
export default EditActivityScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 27,
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 18,
        fontWeight: 'medium',
        marginTop: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 5,
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: 30,
    },
});