/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState, createContext, useContext } from "react";
import { useAuth } from "@clerk/clerk-react";
import { signInWithCredential, OAuthProvider } from "firebase/auth";
import { auth } from "../lib/firebase";

const FirebaseAuthContext = createContext({ isAuthReady: false, isAuthLoading: true, firebaseUid: null });

export const useFirebaseAuth = () => useContext(FirebaseAuthContext);

export default function FirebaseAuthProvider({ children }) {
  const { getToken } = useAuth();
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [firebaseUid, setFirebaseUid] = useState(null);

  useEffect(() => {
    const signInWithClerk = async () => {
      try {
        const token = await getToken({ template: "firebase" });
        if (token) {
          
          const provider = new OAuthProvider('oidc.clerk');
          const credential = provider.credential({
            idToken: token,
          });
          
          const userCredential = await signInWithCredential(auth, credential);
          setFirebaseUid(userCredential.user.uid);
          setIsAuthReady(true);
          setIsAuthLoading(false);
        }
      } catch (error) {
        console.error("DEBUG - Full Firebase Error:", error.code, error.message);
        console.error("Error signing in to Firebase with Clerk token", error);
        // Ensure we stop loading state even on error so user isn't stuck forever (optional but good UX)
        // However, user requested to keep the gate active. If it fails, they probably WANT it stuck or handling error.
        // I will follow the user's specific request: "Ensure the isAuthReady gate is still active so the dashboard doesn't load until this new login succeeds."
        // So I will NOT set isAuthLoading(false) on error, effectively blocking the dashboard if auth fails.
      }
    };

    signInWithClerk();
  }, [getToken]);

  return (
    <FirebaseAuthContext.Provider value={{ isAuthReady, isAuthLoading, firebaseUid }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}
