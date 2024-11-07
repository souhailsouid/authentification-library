import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { UserResource } from '@clerk/types';

interface ExtendedUser extends User {
    currentUser?: User;
}

interface AuthContextType {
    clerkUser: UserResource | null | undefined;
    userRecorded: ExtendedUser | null | undefined;
    isSignedIn: boolean | undefined;
    token: string | null;
    refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userRecorded, setCurrentUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const { user: clerkUser, isSignedIn } = useUser();
    const { getToken } = useAuth();

    // Function to refresh and store token
    const refreshToken = async () => {
        try {
            const newToken = await getToken({ template: 'integration_firebase' });
            if (newToken) {
                setToken(newToken);
                await AsyncStorage.setItem('authToken', newToken); // Store token in AsyncStorage
            } else {
                throw new Error('Failed to retrieve token');
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
        }
    };

    // Initialize Firebase authentication listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser({ ...auth, ...user });
                await AsyncStorage.setItem('currentUser', JSON.stringify(user));
                // Refresh and store token when user signs in
                await refreshToken();
            } else {
                setCurrentUser(null);
                setToken(null);
                await AsyncStorage.removeItem('currentUser');
                await AsyncStorage.removeItem('authToken');
            }
        });

        return unsubscribe;
    }, []);

    // Load user and token data from AsyncStorage on app start
    useEffect(() => {
        const loadStoredData = async () => {
            const storedUser = await AsyncStorage.getItem('currentUser');
            const storedToken = await AsyncStorage.getItem('authToken');
            if (storedUser) setCurrentUser(JSON.parse(storedUser));
            if (storedToken) setToken(storedToken);
        };
        loadStoredData();
    }, []);

    return (
        <AuthContext.Provider value={{ clerkUser, userRecorded, isSignedIn, token, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
};
