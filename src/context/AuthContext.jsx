import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  deleteUser
} from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot, deleteDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile = null;
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Listen for real-time profile updates
        unsubscribeProfile = onSnapshot(doc(db, "users", firebaseUser.uid), (docSnap) => {
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            emailVerified: firebaseUser.emailVerified,
            displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            photoURL: firebaseUser.photoURL,
            profile: docSnap.exists() ? docSnap.data() : null
          };
          setUser(userData);
          setLoading(false);
        }, (error) => {
          console.error("Profile sync error:", error);
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, emailVerified: firebaseUser.emailVerified });
          setLoading(false);
        });
      } else {
        if (unsubscribeProfile) unsubscribeProfile();
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      throw error;
    }
  };

  const loginWithEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(result.user);
    return result;
  };

  const resendVerification = () => {
    if (auth.currentUser) return sendEmailVerification(auth.currentUser);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const logout = () => signOut(auth);

  const deleteAccount = async () => {
    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, "users", auth.currentUser.uid));
        await deleteUser(auth.currentUser);
      } catch (e) {
        throw e;
      }
    }
  };

  const value = {
    user,
    loading,
    loginWithGoogle,
    loginWithEmail,
    signUpWithEmail,
    resendVerification,
    resetPassword,
    deleteAccount,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
