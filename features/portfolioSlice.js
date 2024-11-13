import { createSlice } from "@reduxjs/toolkit";

// Initial state of the portfolio (It's empty to start with)
const initialState = {
  assets: [],
  totalValue: 0,
};

// Creating a slice for managing portfolio data
const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    setPortfolio: (state, action) => {
      state.assets = action.payload.assets;
      state.totalValue = action.payload.totalValue;
    },
    addCrypto: (state, action) => {
      // Adding a new crypto asset to the portfolio
      state.assets.push(action.payload);
      state.totalValue += action.payload.value;
    },
    removeCrypto: (state, action) => {
      // Removing a crypto asset from the portfolio by its ID
      state.assets = state.assets.filter(
        (asset) => asset.id !== action.payload
      );
    },
    updateCrypto: (state, action) => {
      const index = state.assets.findIndex(
        (asset) => asset.id === action.payload.id
      );
      if (index !== -1) {
        state.assets[index] = {
          ...state.assets[index],
          ...action.payload.updateAsset,
        };
      }
    },
  },
});

// Exporting the actions to be used in the components
export const { setPortfolio, addCrypto, removeCrypto, updateCrypto } =
  portfolioSlice.actions;

// Exporting the reducer to be used by the store
export default portfolioSlice.reducer;
