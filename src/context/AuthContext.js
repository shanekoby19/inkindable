import React, { createContext, useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, deleteUser, updatePassword, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { app } from '../firebase/firebase';

export const AuthContext = createContext();

export const AuthProvider = (props) => {
    const [currentUser, setCurrentUser] = useState(null);

    const createAccount = (email, password) => {
        return createUserWithEmailAndPassword(getAuth(app), email, password)
    }

    const signIn = (email, password) => {
        return signInWithEmailAndPassword(getAuth(app), email, password);
    }

    const signOutUser = () => signOut(getAuth(app));

    const deleteUserAccount = () => deleteUser(currentUser);

    const reauthenticate = (password) => {
        const credential = EmailAuthProvider.credential(currentUser.email, password);
        return reauthenticateWithCredential(currentUser, credential);
    }

    const updateUserEmail = (email, password) => {
        if(password) {
            reauthenticate(password);
        }
        return updateEmail(currentUser, email);
    }

    const updateUserPassword = (newPassword, oldPassword) => {  
        if(oldPassword) { 
            reauthenticate(oldPassword);
        }
        return updatePassword(currentUser, newPassword);
    }

    useEffect(() => {
        onAuthStateChanged(getAuth(), setCurrentUser);
    }, []);


    return (
        <AuthContext.Provider value={{
            currentUser,
            createAccount,
            signIn,
            signOutUser,
            deleteUserAccount,
            reauthenticate,
            updateUserEmail,
            updateUserPassword,
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}