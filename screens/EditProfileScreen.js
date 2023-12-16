import { Text, StyleSheet, View, TextInput, Button, Alert, ScrollView, TouchableOpacity } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { UserType } from '../UserContext'
import axios from 'axios'

const EditProfileScreen = ({ route, navigation }) => {
    const { userId } = useContext(UserType)
    const [user, setUser] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    useEffect(() => {

        navigation.setOptions({
            headerTitle: () => (
                <Text>Modifier le profil</Text>
            ),
            headerTitleAlign: 'center',
            headerLeft: () => (
                <TouchableOpacity style={{ marginLeft: 13, marginTop: 5 }} onPress={() => navigation.navigate("Main", { screen: "Profile" })}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
            )
        })

        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://10.0.2.2:3000/profile/${userId}`)
                setUser(response.data.user)
                console.log(user)
            } catch (err) {
                console.log(user, err)
            }
        }

        fetchUser()

    }, [])

    const handleDateChange = (text) => {
        let formattedText = text.replace(/[^0-9]/g, '')
        if (formattedText.length > 2 && formattedText.length < 5) {
            formattedText = formattedText.replace(/^(\d{2})/, '$1/')
        } else if (formattedText.length >= 5) {
            formattedText = formattedText.replace(/^(\d{2})(\d{2})/, '$1/$2/')
        }
        setUser({ ...user, birthday: formattedText })
    }

    const calculateAge = (birthday) => {
        const [day, month, year] = birthday.split('/')
        const birthDate = new Date(`${year}-${month}-${day}`)

        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    const handleSave = () => {
        if (user.password !== confirmPassword) {
            Alert.alert("Erreur", "les mots de passe ne correspondent pas")
            return
        }

        const age = calculateAge(user.birthday);

        const updatedUser = {
            ...user,
            age: age,
        }

        axios.post(`http://10.0.2.2:3000/profile/edit/${userId}`, updatedUser)
            .then((res) => {
                console.log("Succès", res)
                setUser(updatedUser)
                navigation.navigate("Main", { screen: "Profile", params: { user: updatedUser } })
            }).catch((err) => {
                console.error("Erreur lors de la modification", err)
                Alert.alert("Erreur", "la modification du profil a échoué")
            })
    }

    const handleDeleteAccount = () => {
        Alert.alert(
            "Supprimer le compte",
            "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
            [
                {
                    text: "Annuler",
                    style: "cancel",
                },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: () => {
                        axios.delete(`http://10.0.2.2:3000/delete/${userId}`)
                            .then((res) => {
                                console.log(res)
                                Alert.alert("Compte supprimé avec succés")
                                navigation.navigate("Main", { screen: "Register" })
                            }).catch((err) => {
                                console.log("erreur lors de la demande de suppression", err)
                            })
                    }
                }
            ]
        )
    }

    return (
        <ScrollView style={styles.container}>

            <Text style={styles.label}>Nom</Text>
            <TextInput style={styles.input} value={user.name} onChangeText={(value) => setUser({ ...user, name: value })} />

            <Text style={styles.label}>Prénom</Text>
            <TextInput style={styles.input} value={user.firstname} onChangeText={(value) => setUser({ ...user, firstname: value })} />

            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={user.email} onChangeText={(value) => setUser({ ...user, email: value })} />

            <Text style={styles.label}>Date de naissance</Text>
            <TextInput style={styles.input} value={user.birthday} maxLength={10} onChangeText={handleDateChange} />

            <Text style={styles.label}>Mot de passe</Text>
            <TextInput style={styles.input} value={user.password} onChangeText={(value) => setUser({ ...user, password: value })} secureTextEntry />

            <Text style={styles.label}>Confirmer le mot de passe</Text>
            <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

            <Text style={styles.label}>Téléphone</Text>
            <TextInput style={styles.input} value={user.phone} maxLength={10} onChangeText={(value) => setUser({ ...user, phone: value })} keyboardType="numeric" />

            <Text style={styles.label}>Adresse</Text>
            <TextInput style={styles.input} value={user.address} onChangeText={(value) => setUser({ ...user, address: value })} />

            <Text style={styles.label}>Ville</Text>
            <TextInput style={styles.input} value={user.city} onChangeText={(value) => setUser({ ...user, city: value })} />

            <Text style={styles.label}>Avatar</Text>
            <TextInput style={styles.input} value={user.avatar} onChangeText={(value) => setUser({ ...user, avatar: value })} />

            <TouchableOpacity
                style={{
                    marginTop: 10,
                    backgroundColor: '#3498db',
                    padding: 10,
                    borderRadius: 5,
                    alignItems: 'center'
                }}
                onPress={handleSave}
            >
                <Text style={{ color: 'white', fontSize: 16 }}>Enregistrer</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    marginTop: 10,
                    marginBottom: 40,
                    backgroundColor: '#e74c3c',
                    padding: 10,
                    borderRadius: 5,
                    alignItems: 'center'
                }}
                onPress={handleDeleteAccount}
            >
                <Text style={{ color: 'white', fontSize: 16 }}>Supprimer le compte</Text>
            </TouchableOpacity>

        </ScrollView>
    )
}

export default EditProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    label: {
        fontSize: 18,
        marginBottom: 4,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 8,
        marginBottom: 16,
    },
})