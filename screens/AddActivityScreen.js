import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity } from 'react-native'
import React, { useState, useContext } from 'react'
import axios from 'axios'
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { UserType } from '../UserContext';

const AddActivityScreen = () => {
    const navigation = useNavigation()
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [title, setTitle] = useState('')
    const [date, setDate] = useState(new Date())
    const [image, setImage] = useState('')
    const [content, setContent] = useState('')
    const { userId } = useContext(UserType)

    const handleSubmit = async () => {
        const activity = { title: title, date: date, image: image, content: content, userId: userId }
        if (!title || !date || !content) {
            console.error("Le titre, la date et le contenu sont requis")
            return
        }
        axios.post("http://10.0.2.2:3000/create-activity", activity)
            .then((response) => {
                navigation.navigate("Main", { screen: "Activity" })
            }).catch((error) => {
                console.error("erreur lors de la publication", error)
            })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Titre:</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} />

            <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.label}>Date: {date.toLocaleDateString()}</Text>
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

            <Text style={styles.label}>Image:</Text>
            <TextInput style={styles.input} value={image} onChangeText={setImage} />

            <Text style={styles.label}>Contenu:</Text>
            <TextInput style={styles.input} value={content} onChangeText={setContent} multiline />
            <View style={styles.buttonContainer}>
                <Button title="Publier" onPress={handleSubmit} />
            </View>
        </View>
    )
}

export default AddActivityScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: 20, // Ajoutez un espace en haut du bouton
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginTop: 20,
    },
})
