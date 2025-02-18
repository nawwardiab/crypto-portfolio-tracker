// ./features/store.js

import { configureStore } from "@reduxjs/toolkit";
import authReducer, { setUser, clearUser } from "./authSlice";
import portfolioReducer, {
  addCrypto,
  removeCrypto,
  updateCrypto,
} from "./portfolioSlice";
import {
  onAuthStateChangeListener,
  savePortfolio,
} from "@/services/firestoreService"; // Correct imports for Firebase
import { useSelector } from "react-redux";

// Create Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    portfolio: portfolioReducer,
  },
});

// Set up an authentication state listener using the service
onAuthStateChangeListener((user) => {
  if (user) {
    // Extract only serializable parts of the user object
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    };
    store.dispatch(setUser(userData));
  } else {
    store.dispatch(clearUser());
  }
});

export default store;
