// portfolioSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  assets: [],
  totalValue: { usd: 0, eur: 0 },
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
      const { symbol, amount, priceUSD, priceEUR } = action.payload;

      // Adding the new crypto asset
      state.assets.push({ symbol, amount, priceUSD, priceEUR });

      // Updating total portfolio value for USD and EUR
      state.totalValue.usd += priceUSD * amount;
      state.totalValue.eur += priceEUR * amount;
    },
    removeCrypto: (state, action) => {
      console.log("removeCrypto called with payload:", action.payload);

      // Find the asset to be removed
      const assetToRemove = state.assets.find(
        (asset) => asset.symbol === action.payload
      );

      if (assetToRemove) {
        // Subtract the value of the removed asset from the totalValue
        state.totalValue.usd -= assetToRemove.priceUSD * assetToRemove.amount;
        state.totalValue.eur -= assetToRemove.priceEUR * assetToRemove.amount;

        // Remove the asset from the assets array
        state.assets = state.assets.filter(
          (asset) => asset.symbol !== action.payload
        );
      }
    },
    updateCrypto: (state, action) => {
      const { id, updateAsset } = action.payload;

      const index = state.assets.findIndex((asset) => asset.symbol === id);
      if (index !== -1) {
        console.log("updateCrypto called with payload:", action.payload);

        // Update the asset and recalculate the total value accordingly
        const oldAsset = state.assets[index];
        const newAmount = updateAsset.amount;

        // Update the total value by removing the old amount and adding the new one
        state.totalValue.usd -= oldAsset.priceUSD * oldAsset.amount;
        state.totalValue.eur -= oldAsset.priceEUR * oldAsset.amount;

        state.assets[index] = {
          ...oldAsset,
          ...updateAsset,
        };

        // Update total value with the new amounts
        state.totalValue.usd += oldAsset.priceUSD * newAmount;
        state.totalValue.eur += oldAsset.priceEUR * newAmount;
      }
    },
  },
});

export const { setPortfolio, addCrypto, removeCrypto, updateCrypto } =
  portfolioSlice.actions;

export default portfolioSlice.reducer;
