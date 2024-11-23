"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "@/features/authSlice";
import { getPortfolio, savePortfolio } from "@/services/firestoreService";
import { getCryptoPrice, searchCoins } from "@/services/coingeckoService"; // Import the CoinGecko services
import toast from "react-hot-toast";
import debounce from "lodash.debounce";
// import Autocomplete from "@mui/material/Autocomplete";
// import TextField from "@mui/material/TextField";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from "@mui/material/DialogTitle";
// import Button from "@mui/material/Button";

import AddAssetForm from "./AddAssetForm";
import PortfolioDetails from "./PortfolioDetails";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { addCrypto } from "@/features/portfolioSlice";

const PortfolioManager = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [assets, setAssets] = useState([]);
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
      setAssets(assets || []);
      console.log("🚀 ~ loadPortfolio ~ portfolio:", assets);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      toast.error("Failed to load portfolio. Please try again.");
      setLoading(false);
    }
  };

  const searchCoinBySymbol = debounce(async (symbol) => {
    try {
      const matchingCoins = await searchCoins(symbol);
      if (matchingCoins.length === 0) {
        toast.error("This cryptocurrency is not supported.");
        setSuggestedSymbols([]);
        return null;
      } else {
        // Store both the symbol and id for uniqueness
        setSuggestedSymbols(
          matchingCoins.map((coin) => ({
            symbol: coin.symbol.toUpperCase(),
            id: coin.id,
          }))
        );

        console.log("🚀 ~ Matching Coins:", matchingCoins);
        return matchingCoins.length === 1 ? matchingCoins[0] : null;
      }
    } catch (error) {
      console.error("Error fetching coin by symbol:", error);
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
      console.log("Searching for coin symbol:", cryptoSymbol);

      // Search for the coin based on the input symbol
      const matchingCoins = await searchCoins(cryptoSymbol);
      console.log("🚀 ~ handleAddAsset ~ matchingCoins:", matchingCoins);

      if (matchingCoins.length === 0) {
        toast.error("This cryptocurrency is not supported.");
        setLoading(false);
        return;
      } else if (matchingCoins.length > 1) {
        // Automatically pick the first coin if multiple matches are found
        console.warn(
          "Multiple coins found, selecting the first one by default."
        );
        const coin = matchingCoins[0];
        console.log("Selected coin:", coin);

        // Continue to price fetching and saving logic
        const priceData = await getCryptoPrice(coin.id);
        console.log("Price data:", priceData);

        if (!priceData || !priceData.usd || !priceData.eur) {
          throw new Error("Invalid cryptocurrency symbol");
        }

        // Creating the new asset object
        const newAsset = {
          symbol: cryptoSymbol.trim().toUpperCase(),
          amount: parseFloat(amount),
          priceUSD: parseFloat(priceData.usd),
          priceEUR: parseFloat(priceData.eur),
        };

        console.log("New asset being added:", newAsset);

        // Updating assets and saving to Firestore
        const updatedAssets = [...assets, newAsset];
        console.log("Assets before saving to Firestore:", updatedAssets);

        await savePortfolio(user.uid, { assets: updatedAssets });
        console.log("Portfolio saved successfully!");

        // Update the component state with the new asset
        setAssets(updatedAssets);
        setCryptoSymbol("");
        setAmount("");
        toast.success("Asset added successfully!");
      } else {
        // If there's only one match
        const coin = matchingCoins[0];
        console.log("Matched coin:", coin);

        const priceData = await getCryptoPrice(coin.id);
        console.log("Price data:", priceData);

        if (!priceData || !priceData.usd || !priceData.eur) {
          throw new Error("Invalid cryptocurrency symbol");
        }

        // Creating the new asset object
        const newAsset = {
          symbol: cryptoSymbol.trim().toUpperCase(),
          amount: parseFloat(amount),
          priceUSD: parseFloat(priceData.usd),
          priceEUR: parseFloat(priceData.eur),
        };

        console.log("New asset being added:", newAsset);

        // Updating assets and saving to Firestore
        const updatedAssets = [...assets, newAsset];
        console.log("Assets before saving to Firestore:", updatedAssets);

        await savePortfolio(user.uid, { assets: updatedAssets });
        console.log("Portfolio saved successfully!");

        // Update the component state with the new asset
        setAssets(updatedAssets);
        setCryptoSymbol("");
        setAmount("");
        toast.success("Asset added successfully!");
      }
    } catch (error) {
      console.error("Error adding asset:", error);
      toast.error("Failed to add asset. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditAsset = async (index) => {
    const newAmount = prompt("Enter new amount:", assets[index].amount);
    if (newAmount === null || newAmount === "") return;

    const updatedAsset = { ...assets[index], amount: parseFloat(newAmount) };
    const updatedAssets = [...assets];
    updatedAssets[index] = updatedAsset;

    try {
      setLoading(true);
      await savePortfolio(user.uid, { assets: updatedAssets });
      setAssets(updatedAssets);
      toast.success("Asset updated successfully!");
    } catch (error) {
      console.error("Error updating asset:", error);
      toast.error("Failed to update asset. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAsset = async () => {
    const updatedAssets = assets.filter((_, i) => i !== assetToDelete);

    try {
      setLoading(true);
      await savePortfolio(user.uid, { assets: updatedAssets });
      setAssets(updatedAssets);
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
      {/* Add Asset Form */}
      {/* <div style={styles.form}>
        <h2 style={styles.header}>Add Cryptocurrency</h2>
        <Autocomplete
          freeSolo
          options={[]}
          inputValue={cryptoSymbol}
          onInputChange={(event, newInputValue) => {
            setCryptoSymbol(newInputValue);
            searchCoinBySymbol();
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Crypto Symbol (e.g., BTC)"
              variant="outlined"
              fullWidth
              style={{ marginBottom: "10px" }}
              disabled={loading}
            />
          )}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={styles.input}
          disabled={loading}
        />
        <button
          onClick={handleAddAsset}
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Asset"}
        </button>*/}
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
        assets={assets}
        loading={loading}
        handleEditAsset={handleEditAsset}
        openDeleteConfirmation={openDeleteConfirmation}
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
