import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { firebase } from "./firebaseConfig";

// Register user to firebase
export const registerUser = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      firebase.auth,
      email,
      password
    );

    await updateProfile(userCredential.user, {
      displayName: username,
    });

    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Login user to firebase
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      firebase.auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Logout user from firebase
export const logoutUser = async () => {
  try {
    await signOut(firebase.auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Check if user is logged in
export const checkUserLoggedIn = (): Promise<boolean> => {
  return new Promise((resolve) => {
    onAuthStateChanged(firebase.auth, (user) => {
      resolve(!!user);
    });
  });
};

// Get current user
export const getCurrentUser = () => {
  return firebase.auth.currentUser;
};
