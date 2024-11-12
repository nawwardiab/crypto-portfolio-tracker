import { configureStore } from "@reduxjs/toolkit";
import portfolioReducer from "./portfolioSlice";
import authReducer from "./authSlice";

// Creating the store
const store = configureStore({
  reducer: {
    portfolio: portfolioReducer, // Adding the portfolio reducer to the store
    auth: authReducer,
  },
});

export default store;
