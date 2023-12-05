import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    const checkLoginStatus = async () => {
        const token = await AsyncStorage.getItem("authToken")
        if (token) {
            setIsUserLoggedIn(true)
        }
        else {
            setIsUserLoggedIn(false)
        }
    }

    return (
        <AuthContext.Provider value={{ isUserLoggedIn, checkLoginStatus }}>
            {children}
        </AuthContext.Provider>
    );
};
