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

// Middleware for syncing portfolio with Firestore

const portfolioMiddleware = (store) => (next) => (action) => {
  console.log("Middleware - Action dispatched:", action);

  const result = next(action);

  if (action.type.startsWith("portfolio/")) {
    const state = store.getState();
    const portfolio = state.portfolio;

    try {
      console.log("Middleware - Saving portfolio:", portfolio);
      savePortfolio(state.auth.user.uid, {
        assets: portfolio.assets,
        totalValue: portfolio.totalValue,
      });
      console.log(
        "Portfolio saved to Firestore successfully after state update."
      );
    } catch (error) {
      console.error("Error saving portfolio after state update:", error);
    }
  }

  return result;
};

// Create Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    portfolio: portfolioReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(portfolioMiddleware),
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
