// PortfolioManager.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "@/features/authSlice";
import { getPortfolio, savePortfolio } from "@/services/firestoreService";
import { getCryptoPrice, searchCoins } from "@/services/coingeckoService";
import toast from "react-hot-toast";
import debounce from "lodash.debounce";

import AddAssetForm from "./AddAssetForm";
import PortfolioDetails from "./PortfolioDetails";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import {
  setPortfolio,
  addCrypto,
  removeCrypto,
  updateCrypto,
} from "@/features/portfolioSlice";
import PortfolioChart from "./PortfolioChart";
import {
  Grid,
  Box,
  Card,
  Collapse,
  IconButton,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const PortfolioManager = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const portfolio = useSelector((state) => state.portfolio);
  const [cryptoSymbol, setCryptoSymbol] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);
  const [suggestedSymbols, setSuggestedSymbols] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  // Fetch user's portfolio on component mount
  useEffect(() => {
    if (user) {
      loadPortfolio();
    }
  }, [user]);

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      const portfolio = await getPortfolio(user.uid);
      console.log("=== LOADED PORTFOLIO ===");
      console.log("Fetched Assets:", portfolio.assets);
      console.log("Fetched Total Value:", portfolio.totalValue);
      // Handle totalValue properly
      if (portfolio.totalValue && typeof portfolio.totalValue === "object") {
        portfolio.totalValue = {
          usd: parseFloat(portfolio.totalValue.usd || 0),
          eur: parseFloat(portfolio.totalValue.eur || 0),
        };
      } else {
        portfolio.totalValue = {
          usd: 0,
          eur: 0,
        };
      }

      console.log("Processed Total Value:", portfolio.totalValue);

      console.log("🚀 ~ loadPortfolio ~ user.uid:", user.uid);
      dispatch(setPortfolio(portfolio));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      toast.error("Failed to load portfolio. Please try again.");
      setLoading(false);
    }
  };

  const searchCoinBySymbol = debounce(async (symbol) => {
    if (!symbol.trim()) {
      setSuggestedSymbols([]);
      return;
    }

    try {
      console.log("🚀 ~ Searching coins with symbol:", symbol); // Debugging log
      const matchingCoins = await searchCoins(symbol);

      if (!matchingCoins || matchingCoins.length === 0) {
        toast.error("This cryptocurrency is not supported.");
        setSuggestedSymbols([]);
        return null;
      }

      // Update suggested symbols for the Autocomplete
      setSuggestedSymbols(
        matchingCoins.map((coin) => ({
          symbol: coin.symbol.toUpperCase(),
          id: coin.id,
        }))
      );

      console.log("🚀 ~ Matching Coins:", matchingCoins);
      // Return first matching coin if only one match is found
      return matchingCoins.length === 1 ? matchingCoins[0] : null;
    } catch (error) {
      console.error("🚨 Error fetching coin by symbol:", error.message);
      toast.error("Failed to fetch coin. Please try again.");
      setSuggestedSymbols([]);
      return null;
    }
  }, 500);

  const handleAddAsset = async (cryptoSymbol, amount) => {
    if (!cryptoSymbol.trim() || !amount) {
      toast.error(
        "Please enter both a valid cryptocurrency symbol and amount."
      );
      return;
    }

    try {
      setLoading(true);

      // Search for the coin based on the input symbol
      const matchingCoins = await searchCoins(cryptoSymbol.trim());

      if (!matchingCoins || matchingCoins.length === 0) {
        toast.error("This cryptocurrency is not supported.");
        setLoading(false);
        return;
      }

      const coin = matchingCoins[0];
      const priceData = await getCryptoPrice(coin.id);

      if (!priceData || !priceData.usd || !priceData.eur) {
        throw new Error(
          "Unable to retrieve valid price data for the given coin."
        );
      }

      // Create the new asset object
      const newAsset = {
        symbol: coin.symbol.toUpperCase(),
        amount: parseFloat(amount),
        priceUSD: parseFloat(priceData.usd),
        priceEUR: parseFloat(priceData.eur),
      };

      // Update assets and calculate total value
      const updatedAssets = [...portfolio.assets, newAsset];
      // let totalValueUSD = 0;
      // let totalValueEUR = 0;

      // updatedAssets.forEach((asset) => {
      //   totalValueUSD += asset.priceUSD * asset.amount;
      //   totalValueEUR += asset.priceEUR * asset.amount;
      // });
      // Calculate new total value
      const totalValueUSD = updatedAssets.reduce(
        (acc, asset) => acc + asset.amount * asset.priceUSD,
        0
      );
      const totalValueEUR = updatedAssets.reduce(
        (acc, asset) => acc + asset.amount * asset.priceEUR,
        0
      );
      const updatedTotalValue = {
        usd: parseFloat(totalValueUSD.toFixed(2)),
        eur: parseFloat(totalValueEUR.toFixed(2)),
      };

      // Check the computed total value before saving
      console.log("Total Value USD:", updatedTotalValue.usd);
      console.log("Total Value EUR:", updatedTotalValue.eur);

      // Save to Firestore
      await savePortfolio(user.uid, {
        assets: updatedAssets,
        totalValue: updatedTotalValue,
      });

      // Update Redux state
      dispatch(addCrypto(newAsset));
      setCryptoSymbol("");
      setAmount("");
      toast.success("Asset added successfully!");
    } catch (error) {
      console.error("🚨 Error adding asset:", error.message);
      toast.error("Failed to add asset. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditAsset = async (index) => {
    const newAmount = prompt(
      "Enter new amount:",
      portfolio.assets[index].amount
    );
    if (newAmount === null || newAmount === "" || isNaN(newAmount)) return;

    // Create a new updated asset
    const updatedAsset = {
      ...portfolio.assets[index],
      amount: parseFloat(newAmount),
    };

    // Create a new array for updated assets
    const updatedAssets = portfolio.assets.map((asset, i) =>
      i === index ? updatedAsset : asset
    );
    // Calculate the updated total value
    const totalValueUSD = updatedAssets.reduce(
      (acc, asset) => acc + asset.amount * asset.priceUSD,
      0
    );
    const totalValueEUR = updatedAssets.reduce(
      (acc, asset) => acc + asset.amount * asset.priceEUR,
      0
    );

    // let totalValueUSD = 0;
    // let totalValueEUR = 0;

    // updatedAssets.forEach((asset) => {
    //   totalValueUSD += asset.priceUSD * asset.amount;
    //   totalValueEUR += asset.priceEUR * asset.amount;
    // });

    const updatedTotalValue = {
      usd: parseFloat(totalValueUSD.toFixed(2)),
      eur: parseFloat(totalValueEUR.toFixed(2)),
    };

    try {
      setLoading(true);

      // Save to Firestore
      await savePortfolio(user.uid, {
        assets: updatedAssets,
        totalValue: updatedTotalValue,
      });

      // Dispatch the update to Redux to update the specific asset
      dispatch(updateCrypto({ id: portfolio.assets[index].id, updatedAsset }));

      // Ensure Redux store is fully in sync with Firestore
      dispatch(
        setPortfolio({ assets: updatedAssets, totalValue: updatedTotalValue })
      );

      toast.success("Asset updated successfully!");
    } catch (error) {
      console.error("Error updating asset:", error);
      toast.error("Failed to update asset. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAsset = async () => {
    if (assetToDelete === null || assetToDelete === undefined) {
      console.error("No asset to delete is selected.");
      return;
    }

    const updatedAssets = portfolio.assets.filter(
      (_, i) => i !== assetToDelete
    );

    const totalValueUSD = updatedAssets.reduce(
      (acc, asset) => acc + asset.amount * asset.priceUSD,
      0
    );
    const totalValueEUR = updatedAssets.reduce(
      (acc, asset) => acc + asset.amount * asset.priceEUR,
      0
    );

    const updatedTotalValue = {
      usd: parseFloat(totalValueUSD.toFixed(2)),
      eur: parseFloat(totalValueEUR.toFixed(2)),
    };

    try {
      setLoading(true);

      // Save the updated portfolio to Firestore
      await savePortfolio(user.uid, {
        assets: updatedAssets,
        totalValue: updatedTotalValue,
      });

      // Dispatch Redux action to update the store
      // dispatch(removeCrypto(assetToDelete));

      // Dispatch the removal to Redux to update the specific asset
      dispatch(removeCrypto(portfolio.assets[assetToDelete].id));

      // Ensure Redux store is fully in sync with Firestore
      dispatch(
        setPortfolio({ assets: updatedAssets, totalValue: updatedTotalValue })
      );

      toast.success("Asset deleted successfully!");

      setOpenDeleteDialog(false);
      setAssetToDelete(null);
    } catch (error) {
      console.error("Error deleting asset:", error);
      toast.error("Failed to delete asset. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteConfirmation = (index) => {
    setAssetToDelete(index);
    setOpenDeleteDialog(true);
  };

  const closeDeleteConfirmation = () => {
    setOpenDeleteDialog(false);
    setAssetToDelete(null);
  };

  return (
    <Box sx={{ padding: "2rem" }}>
      {/* Chart Section */}
      <Box sx={{ marginBottom: "2rem" }}>
        <PortfolioChart />
      </Box>

      {/* Two-Column Layout */}
      <Grid container spacing={4}>
        {/* Left Column: Portfolio Details */}
        <Grid item xs={12} md={8}>
          <PortfolioDetails
            assets={portfolio.assets}
            loading={loading}
            handleEditAsset={handleEditAsset}
            openDeleteConfirmation={openDeleteConfirmation}
            totalValueUSD={portfolio.assets.reduce(
              (acc, asset) => acc + asset.amount * asset.priceUSD,
              0
            )}
            totalValueEUR={portfolio.assets.reduce(
              (acc, asset) => acc + asset.amount * asset.priceEUR,
              0
            )}
          />
        </Grid>

        {/* Right Column: Add Asset Form */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              backgroundColor: "background.paper",
              padding: "2rem",
              borderRadius: "8px",
              boxShadow: 2,
            }}
          >
            <AddAssetForm
              cryptoSymbol={cryptoSymbol}
              setCryptoSymbol={setCryptoSymbol}
              amount={amount}
              setAmount={setAmount}
              addAsset={handleAddAsset}
              loading={loading}
              suggestedSymbols={suggestedSymbols}
              searchCoinBySymbol={searchCoinBySymbol}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={closeDeleteConfirmation}
        onDelete={handleDeleteAsset}
      />
    </Box>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    color: "white",
  },
};

export default PortfolioManager;
