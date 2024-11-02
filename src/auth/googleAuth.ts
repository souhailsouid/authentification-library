import { auth } from '../firebaseConfig';
import { useAuth, useOAuth } from '@clerk/clerk-expo';
import { signInWithCustomToken, UserCredential } from 'firebase/auth';

interface ExtendedUserCredential extends UserCredential {
    _tokenResponse?: {
      isNewUser: boolean;
      refreshToken?: string;
      idToken?: string;
      expiresIn?: string;
    };
}
 

export const useAuthenticateWithGoogle = () => {
    const { getToken } = useAuth();
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

    const authenticate = async () => {
        const { createdSessionId, setActive } = await startOAuthFlow();

        if (createdSessionId && setActive) {
            await setActive({ session: createdSessionId });

            const token = await getToken({ template: 'integration_firebase' });
            if (!token) throw new Error('Failed to retrieve token');

            const userCredentials = await signInWithCustomToken(auth, token) as ExtendedUserCredential
            const tokenResponse =  userCredentials?._tokenResponse
            const isNewUser = userCredentials?._tokenResponse?.isNewUser;
            const user = userCredentials.user;
            

            return { user, isNewUser, tokenResponse };
        }
    };

    return authenticate;
};
