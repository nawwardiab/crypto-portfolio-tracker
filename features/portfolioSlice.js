import { createSlice } from "@reduxjs/toolkit";

// Initial state of the portfolio (It's empty to start with)
const initialState = {
  portfolio: [],
};

// Creating a slice for managing portfolio data
const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    addCrypto: (state, action) => {
      // Adding a new crypto asset to the portfolio
      state.portfolio.push(action.payload);
    },
    removeCrypto: (state, action) => {
      // Removing a crypto asset from the portfolio by its ID
      state.portfolio = state.portfolio.filter(
        (crypto) => crypto.id !== action.payload
      );
    },
    setPortfolio: (state, action) => {
      state.portfolio = action.payload;
    },
  },
});

// Exporting the actions to be used in the components
export const { addCrypto, removeCrypto, setPortfolio } = portfolioSlice.actions;

// Exporting the reducer to be used by the store
export default portfolioSlice.reducer;
