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
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

// Initialize Firebase only once
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

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
        assets: fetchedData.assets || [],
        totalValue: fetchedData.totalValue || { usd: 0, eur: 0 },
      };
    } else {
      console.warn("No portfolio found for user:", userId);
      return { assets: [], totalValue: { usd: 0, eur: 0 } };
    }
  } catch (error) {
    console.error("Error fetching portfolio:", error.message);
    throw error;
  }
};

export const savePortfolio = async (userId, portfolioData) => {
  if (!db) {
    console.error("Firestore database instance is not initialized");
    return;
  }
  try {
    console.log("Attempting to save portfolio to Firestore for user:", userId);
    console.log("Portfolio data to be saved:", portfolioData); // Log data being saved

    // Ensure portfolioData.assets is never undefined, and totalValue has both usd and eur
    const totalValue = portfolioData.totalValue || { usd: 0, eur: 0 };

    // Ensure portfolioData.assets is never undefined
    const dataToSave = {
      assets: Array.isArray(portfolioData.assets) ? portfolioData.assets : [],
      totalValue: {
        usd: totalValue.usd ? parseFloat(totalValue.usd.toFixed(2)) : 0,
        eur: totalValue.eur ? parseFloat(totalValue.eur.toFixed(2)) : 0,
      }, // Update to include total value
    };
    console.log("Data being saved to Firestore:", dataToSave);

    await setDoc(doc(db, "portfolios", userId), dataToSave, { merge: true });

    console.log("Portfolio saved successfully for user:", userId);
  } catch (error) {
    console.error("Error saving portfolio:", error.message);
    throw error;
  }
};
// const testSavePortfolio = async () => {
//   try {
//     const testUserId = "testUserId";
//     const testPortfolioData = {
//       assets: [{ symbol: "BTC", amount: 1 }],
//       totalValue: 50000,
//     };
//     await savePortfolio(testUserId, testPortfolioData);
//     console.log("Test save successful");
//   } catch (error) {
//     console.error("Test save failed:", error);
//   }
// };
// testSavePortfolio();

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
