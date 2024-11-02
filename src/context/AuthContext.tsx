import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useUser } from '@clerk/clerk-expo';
import { UserResource } from '@clerk/types';

interface ExtendedUser extends User {
    currentUser?: User
}

interface AuthContextType {
    clerkUser: UserResource | null | undefined;
    userRecorded: ExtendedUser | null | undefined;
    isSignedIn: boolean | undefined;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => useContext(AuthContext);

import { ReactNode } from 'react';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userRecorded, setCurrentUser] = useState<User | null>(null);
    const { user: clerkUser, isSignedIn } = useUser();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {

                setCurrentUser({ ...auth, ...user });
                await AsyncStorage.setItem('currentUser', JSON.stringify(user));
            } else {
                setCurrentUser(null);
                await AsyncStorage.removeItem('currentUser');
            }
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        const loadUser = async () => {
            const storedUser = await AsyncStorage.getItem('currentUser');
            if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
            }
        };
        loadUser();
    }, []);

    return (
        <AuthContext.Provider value={{ clerkUser, userRecorded, isSignedIn }}>
            {children}
        </AuthContext.Provider>
    );
};
