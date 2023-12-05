import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    const checkLoginStatus = async () => {
        const token = await AsyncStorage.getItem("authToken")
        if (token) {
            setIsUserLoggedIn(true)
            console.log("utilisateur connecté")
        }
        else { 
        setIsUserLoggedIn(false)
        console.log("utilisateur déconnecté")
        }
    }

    return (
        <AuthContext.Provider value={{ isUserLoggedIn, checkLoginStatus }}>
            {children}
        </AuthContext.Provider>
    );
};
