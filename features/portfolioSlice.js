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
      // Update totalValue accurately after adding a new asset
      state.totalValue.usd += parseFloat(
        action.payload.priceUSD * action.payload.amount
      ).toFixed(2);
      state.totalValue.eur += parseFloat(
        action.payload.priceEUR * action.payload.amount
      ).toFixed(2);
    },
    removeCrypto: (state, action) => {
      console.log("removeCrypto called with payload:", action.payload);
      state.assets = state.assets.filter(
        (asset) => asset.id !== action.payload
      );
      // Recalculate totalValue
      const updatedTotalValue = state.assets.reduce(
        (total, asset) => {
          total.usd += asset.priceUSD * asset.amount;
          total.eur += asset.priceEUR * asset.amount;
          return total;
        },
        { usd: 0, eur: 0 }
      );
      state.totalValue = updatedTotalValue;
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

        // Recalculate totalValue
        const updatedTotalValue = state.assets.reduce(
          (total, asset) => {
            total.usd += asset.priceUSD * asset.amount;
            total.eur += asset.priceEUR * asset.amount;
            return total;
          },
          { usd: 0, eur: 0 }
        );
        state.totalValue = updatedTotalValue;
      }
    },
  },
});

export const { setPortfolio, addCrypto, removeCrypto, updateCrypto } =
  portfolioSlice.actions;

export default portfolioSlice.reducer;
