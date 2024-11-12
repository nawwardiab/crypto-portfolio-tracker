// services/useFirebaseAuth.js
"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/features/authSlice";
import {
  createUser,
  logInUser,
  getPortfolio,
  savePortfolio,
  onAuthStateChangeListener,
} from "./firestoreService"; // Importing the new service functions

export const useFirebaseAuth = () => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // Listen for auth state changes and update Redux state
    onAuthStateChangeListener((user) => {
      if (user) {
        console.log("User logged in:", user);
        dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
          })
        );
      } else {
        console.log("User logged out");
        dispatch(clearUser());
      }
    });
  }, [dispatch]);

  const signUp = async (email, password) => {
    try {
      const user = await createUser(email, password);
      console.log("User signed up successfully, please log in:", user);
    } catch (error) {
      console.error("Sign-up error:", error.message);
      setError(error.message);
    }
  };

  const logIn = async (email, password) => {
    try {
      const user = await logInUser(email, password);
      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
        })
      );
    } catch (error) {
      console.error("Log-in error:", error.message);
      setError(error.message);
    }
  };

  return {
    signUp,
    logIn,
    getPortfolio, // Now provided from firestoreService
    savePortfolio, // Now provided from firestoreService
    error,
  };
};
