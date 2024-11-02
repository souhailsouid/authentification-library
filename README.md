
Here’s a README.md to help others understand how to install, set up, and use your authentication library:

Custom Auth Library
A React Native and Next.js compatible authentication library that integrates Clerk and Firebase. This library offers reusable components and functions for Google sign-in and email/password authentication, allowing for seamless integration across multiple projects.

Features
Google Sign-In via Clerk and Firebase integration
Easily extensible to support other authentication methods (e.g., email/password)
Works with both React Native (Expo) and Next.js applications
Installation
Install the library and required peer dependencies:

bash
Copier le code
npm install your-auth-library
Make sure to install react and react-native if they aren’t already present in your project:

bash
Copier le code
npm install react react-native
Additional Dependencies
This library relies on the following packages:

Firebase
Clerk for Expo (@clerk/clerk-expo)
Expo’s expo-web-browser
bash
Copier le code
npm install firebase @clerk/clerk-expo expo-web-browser
Configuration
Firebase Setup
Set up Firebase in your project and add your configuration details to a .env file:

plaintext
Copier le code
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
Ensure Firebase is correctly configured within your project. Your Firebase config file (firebaseConfig.js) is handled within the library.

Clerk Setup
Get your Clerk publishable key and add it to your .env file:

plaintext
Copier le code
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
The library will automatically use this publishable key for Clerk initialization.

Usage
Wrapping Your App with ClerkProvider
In your app’s root component, wrap your components with ClerkProvider from this library. This provides authentication context to all child components.

javascript
Copier le code
import React from 'react';
import { ClerkAuthProvider } from 'your-auth-library';
import App from './App';

export default function Root() {
  return (
    <ClerkAuthProvider>
      <App />
    </ClerkAuthProvider>
  );
}
Google Sign-In Example
In a screen component (e.g., SignInScreen), use the signInWithGoogle function provided by the library to handle Google authentication.

javascript
Copier le code
import React, { useCallback, useState } from 'react';
import { View, Button, Text } from 'react-native';
import { signInWithGoogle } from 'your-auth-library';
import { useNavigation } from '@react-navigation/native';

export default function SignInScreen() {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleGoogleSignIn = useCallback(async () => {
    setLoading(true);
    try {
      const user = await signInWithGoogle(navigation);
      console.log("User signed in:", user);
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  return (
    <View>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <Button title="Sign in with Google" onPress={handleGoogleSignIn} />
      )}
    </View>
  );
}
API Reference
signInWithGoogle(navigation)
Signs the user in with Google using Clerk and Firebase integration.

Parameters:
navigation: Navigation object (for React Navigation), used to redirect on successful sign-in if needed.
Returns: User data if successful, throws an error otherwise.
ClerkAuthProvider
A context provider that wraps the application and manages Clerk authentication.

Props: None.
Future Development
The library is set up to easily add more authentication methods, such as email/password. Simply extend the functions in auth/index.js and export them as needed.

