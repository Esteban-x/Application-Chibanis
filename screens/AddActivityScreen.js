import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { UserType } from '../UserContext';

const AddActivityScreen = ({ navigation }) => {
    const navigations = useNavigation()
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [title, setTitle] = useState('')
    const [date, setDate] = useState(new Date())
    const [image, setImage] = useState('')
    const [content, setContent] = useState('')
    const { userId } = useContext(UserType)

    useEffect(() => {
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
    }, [])

    const handleSubmit = async () => {
        const activity = { title: title, date: date, image: image, content: content, userId: userId }
        if (!title || !date || !content) {
            console.error("Le titre, la date et le contenu sont requis")
            return
        }
        axios.post("http://10.0.2.2:3000/create-activity", activity)
            .then((response) => {
                navigations.navigate("Main", { screen: "Activity" })
            }).catch((error) => {
                console.error("erreur lors de la publication", error)
            })
    }

    return (
        <View style={styles.container}>
            <View style={{ alignItems: "center", marginTop: 30 }}>
                <View style={{ flexDirection: "row", alignItems: "center", }}>
                    <AntDesign name="addfile" size={84} color="#1A9BD8" />
                    <Text style={{ fontSize: 50, marginTop: 25 }}>Activité</Text>
                </View>
            </View>
            <View style={{ marginTop: 10 }}>
                <Text style={styles.label}>Titre</Text>
                <TextInput style={styles.input} value={title} onChangeText={setTitle} />

                <Text style={styles.label}>Choisir une date</Text>
                <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
                    <Text style={{}}>{date.toLocaleDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false)
                            setDate(selectedDate || date)
                        }}
                    />
                )}

                <Text style={styles.label}>Liens vers l'image (url)</Text>
                <TextInput style={styles.input} value={image} onChangeText={setImage} />

                <Text style={styles.label}>Description</Text>
                <TextInput style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 5,
                    padding: 25,
                    fontSize: 16,
                }} value={content} onChangeText={setContent} multiline />
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={{ backgroundColor: "#1A9BD8", borderRadius: 6, padding: 10 }} onPress={handleSubmit} ><Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>Publier</Text></TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default AddActivityScreen

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
    dateInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
    },
})
