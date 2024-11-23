// PortfolioManager.js
"use client";

import { useState, useEffect } from "react";
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
      console.log("🚀 ~ loadPortfolio ~ user.uid:", user.uid);
      dispatch(setPortfolio(portfolio));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      toast.error("Failed to load portfolio. Please try again.");
      setLoading(false);
    }
  };

  const calculateTotalValue = () => {
    return portfolio.assets.reduce(
      (total, asset) => total + asset.priceUSD * asset.amount,
      0
    );
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
      console.log("🚀 ~ Searching for coin symbol:", cryptoSymbol);

      // Search for the coin based on the input symbol
      const matchingCoins = await searchCoins(cryptoSymbol.trim());
      console.log("🚀 ~ handleAddAsset ~ matchingCoins:", matchingCoins);

      if (!matchingCoins || matchingCoins.length === 0) {
        toast.error("This cryptocurrency is not supported.");
        setLoading(false);
        return;
      } else if (matchingCoins.length > 1) {
        // Let user pick the correct coin if multiple matches are found
        console.warn(
          "Multiple coins found, selecting the first one by default."
        );
      }

      const coin = matchingCoins[0];
      console.log("🚀 ~ handleAddAsset ~ Selected coin:", coin);

      const priceData = await getCryptoPrice(coin.id);
      console.log("🚀 ~ handleAddAsset ~ Price data:", priceData);

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

      console.log("🚀 ~ handleAddAsset ~ New asset being added:", newAsset);

      // Update assets and save to Firestore
      const updatedAssets = [...portfolio.assets, newAsset];
      console.log(
        "🚀 ~ handleAddAsset ~ Assets before saving to Firestore:",
        updatedAssets
      );
      const totalValueUSD = updatedAssets.reduce(
        (acc, asset) => acc + asset.amount * asset.priceUSD,
        0
      );
      const totalValueEUR = updatedAssets.reduce(
        (acc, asset) => acc + asset.amount * asset.priceEUR,
        0
      );

      console.log("Total Value USD:", totalValueUSD);
      console.log("Total Value EUR:", totalValueEUR);

      await savePortfolio(user.uid, {
        assets: updatedAssets,
        totalValue: {
          usd: totalValueUSD,
          eur: totalValueEUR,
        },
      });
      console.log("🚀 ~ handleAddAsset ~ Portfolio saved successfully!");

      // Update the Redux store with the new asset
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
    if (newAmount === null || newAmount === "") return;

    const updatedAsset = {
      ...portfolio.assets[index],
      amount: parseFloat(newAmount),
    };
    const updatedAssets = [...portfolio.assets];
    updatedAssets[index] = updatedAsset;

    try {
      setLoading(true);
      dispatch(updateCrypto({ id: portfolio.assets[index].id, updatedAsset }));
      await savePortfolio(user.uid, {
        assets: updatedAssets,
        totalValue: calculateTotalValue(),
      });
      toast.success("Asset updated successfully!");
    } catch (error) {
      console.error("Error updating asset:", error);
      toast.error("Failed to update asset. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAsset = async () => {
    const updatedAssets = portfolio.assets.filter(
      (_, i) => i !== assetToDelete
    );

    try {
      setLoading(true);
      dispatch(removeCrypto(assetToDelete));
      await savePortfolio(user.uid, {
        assets: updatedAssets,
        totalValue: calculateTotalValue(),
      });
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
    <div style={styles.container}>
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
      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={closeDeleteConfirmation}
        onDelete={handleDeleteAsset}
      />
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    color: "white",
  },
  form: {
    marginBottom: "2rem",
    backgroundColor: "#333",
    padding: "1rem",
    borderRadius: "8px",
    textAlign: "center",
  },
  header: {
    marginBottom: "1rem",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  assets: {
    backgroundColor: "#444",
    padding: "1rem",
    borderRadius: "8px",
  },
  asset: {
    marginBottom: "1rem",
    padding: "0.5rem",
    backgroundColor: "#555",
    borderRadius: "4px",
  },
  assetButton: {
    padding: "5px 10px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#333",
    padding: "1rem",
    borderRadius: "8px",
    zIndex: 1000,
    textAlign: "center",
  },
  modalButton: {
    display: "block",
    margin: "10px 0",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default PortfolioManager;
