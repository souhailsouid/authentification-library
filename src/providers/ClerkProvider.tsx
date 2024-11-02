import React from 'react';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';

const ClerkAuthProvider = ({ children }) => {
    const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

    if (!publishableKey) {
        throw new Error('Missing Publishable Key for Clerk');
    }

    return (
        <ClerkProvider publishableKey={publishableKey}>
            <ClerkLoaded>
                {children}
            </ClerkLoaded>
        </ClerkProvider>
    );
};

export default ClerkAuthProvider;
