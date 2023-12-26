import { StyleSheet, Text, View, Linking, TouchableOpacity } from 'react-native';
import React from 'react';
import { Zocial } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ContactScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Nous contacter</Text>
            </View>
            <View style={styles.content}>
                {createContact('envelope', '#C5221F', 'Envoyer un email')}
                {createContact('facebook-official', 'blue', 'Nous rejoindre sur facebook')}
                {createContact('instagram', 'black', 'Nous rejoindre sur instagram')}
                {createContact('safari', '#1A9BD8', 'Consulter notre site')}
            </View>
        </View>
    )
}

const createContact = (iconName, iconColor, linkText) => (
    <View style={styles.contactContainer}>
        <FontAwesome name={iconName} size={44} color={iconColor} />
        <TouchableOpacity onPress={() => Linking.openURL('mailto:contact@chibanis.fr?subject=Sujet&body=')}>
            <Text style={styles.link}>{linkText}</Text>
        </TouchableOpacity>
    </View>
)

export default ContactScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        marginBottom: 50,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        width: '80%',
    },
    contactContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },
    link: {
        marginLeft: 20,
        fontSize: 18,
        color: '#333',
    },
});
