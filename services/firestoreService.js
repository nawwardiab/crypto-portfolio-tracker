// services/firestoreService.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxM2V8whOe_dURuuDz0OLL99OsbxazyWQ",
  authDomain: "crypto-portfolio-tracker-cb3ad.firebaseapp.com",
  projectId: "crypto-portfolio-tracker-cb3ad",
  storageBucket: "crypto-portfolio-tracker-cb3ad.firebasestorage.app",
  messagingSenderId: "658570634400",
  appId: "1:658570634400:web:dc8ded274701ed2abc55c5",
};

// Initialize Firebase only once
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

// Firestore Portfolio Operations
export const getPortfolio = async (userId) => {
  if (!db) return;
  try {
    console.log("Fetching portfolio for user:", userId); // Log before fetching data

    const portfolioDoc = await getDoc(doc(db, "portfolios", userId));
    if (portfolioDoc.exists()) {
      const fetchedData = portfolioDoc.data();
      console.log("Portfolio data fetched successfully:", portfolioDoc.data()); // Log fetched data
      return {
        assets: fetchedData.portfolio || [],
        totalValue: fetchedData.totalValue || 0,
      };
    } else {
      console.warn("No portfolio found for user:", userId);
      return { assets: [], totalValue: 0 };
    }
  } catch (error) {
    console.error("Error fetching portfolio:", error.message);
    throw error;
  }
};

export const savePortfolio = async (userId, portfolioData) => {
  if (!db) return;
  try {
    console.log("Attempting to save portfolio to Firestore for user:", userId);
    console.log("Portfolio data to be saved:", portfolioData); // Log data being saved

    // Ensure portfolioData.assets is never undefined
    const dataToSave = {
      portfolio: portfolioData.assets || [], // Fallback to an empty array if undefined
      totalValue:
        portfolioData.totalValue !== undefined ? portfolioData.totalValue : 0, // Fallback to 0 if undefined
    };

    await setDoc(doc(db, "portfolios", userId), dataToSave, { merge: true });

    console.log("Portfolio saved successfully for user:", userId);
  } catch (error) {
    console.error("Error saving portfolio:", error.message);
    throw error;
  }
};

// Firebase Auth Operations
export const createUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User signed up:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing up:", error.message);
    throw error;
  }
};

export const logInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User logged in:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error.message);
    throw error;
  }
};

// Auth State Change Listener
export const onAuthStateChangeListener = (callback) => {
  onAuthStateChanged(auth, callback);
};
