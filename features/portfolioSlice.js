// portfolioSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  assets: [],
  totalValue: 0,
};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    setPortfolio: (state, action) => {
      console.log("setPortfolio called with payload:", action.payload);
      state.assets = action.payload.assets;
      state.totalValue = action.payload.totalValue;
    },
    addCrypto: (state, action) => {
      console.log("addCrypto called with payload:", action.payload);
      state.assets.push(action.payload);
      state.totalValue += action.payload.value;
    },
    removeCrypto: (state, action) => {
      console.log("removeCrypto called with payload:", action.payload);
      state.assets = state.assets.filter(
        (asset) => asset.id !== action.payload
      );
    },
    updateCrypto: (state, action) => {
      const index = state.assets.findIndex(
        (asset) => asset.id === action.payload.id
      );
      if (index !== -1) {
        console.log("updateCrypto called with payload:", action.payload);
        state.assets[index] = {
          ...state.assets[index],
          ...action.payload.updateAsset,
        };
      }
    },
  },
});

export const { setPortfolio, addCrypto, removeCrypto, updateCrypto } =
  portfolioSlice.actions;

export default portfolioSlice.reducer;
