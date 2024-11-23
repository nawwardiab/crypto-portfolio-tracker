"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/features/authSlice";
import { getPortfolio, savePortfolio } from "@/services/firestoreService";
import {
  getCryptoPrice,
  getSupportedCoins,
  searchCoins,
} from "@/services/coingeckoService"; // Import the CoinGecko services
import toast from "react-hot-toast";
import debounce from "lodash.debounce";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const PortfolioManager = () => {
  const user = useSelector(selectUser);
  const [assets, setAssets] = useState([]);
  const [cryptoSymbol, setCryptoSymbol] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);

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
      setAssets(portfolio.assets || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      toast.error("Failed to load portfolio. Please try again.");
      setLoading(false);
    }
  };

  const searchCoinBySymbol = debounce(async () => {
    try {
      const matchingCoins = await searchCoins(cryptoSymbol);
      if (matchingCoins.length === 0) {
        toast.error("This cryptocurrency is not supported.");
        return null;
      } else if (matchingCoins.length > 1) {
        toast.error(
          "Multiple coins found with this symbol. Please specify the exact coin."
        );
        console.log("🚀 ~ Matching Coins:", matchingCoins);
        return null;
      }
      return matchingCoins[0];
    } catch (error) {
      console.error("Error fetching coin by symbol:", error);
      toast.error("Failed to fetch coin. Please try again.");
      return null;
    }
  }, 500); // Debounce the function to delay API calls by 500ms

  const handleAddAsset = async () => {
    if (!cryptoSymbol.trim() || !amount) {
      toast.error(
        "Please enter both a valid cryptocurrency symbol and amount."
      );
      return;
    }

    const coin = await searchCoinBySymbol();
    if (!coin) return;

    try {
      setLoading(true);
      // Fetch the current price from CoinGecko
      const priceData = await getCryptoPrice(coin.id);
      console.log("🚀 ~ handleAddAsset ~ priceData:", priceData);
      if (!priceData || !priceData.usd || !priceData.eur) {
        throw new Error("Invalid cryptocurrency symbol");
      }

      const newAsset = {
        symbol: cryptoSymbol.trim().toUpperCase(), // Trim and convert to uppercase
        amount: parseFloat(amount),
        priceUSD: parseFloat(priceData.usd),
        priceEUR: parseFloat(priceData.eur),
      };

      console.log("New asset being added:", newAsset);

      await savePortfolio(user.uid, { assets: [...assets, newAsset] });
      setAssets((prev) => [...prev, newAsset]);
      setCryptoSymbol("");
      setAmount("");
      toast.success("Asset added successfully!");
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
      <div style={styles.form}>
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
        </button>
      </div>

      {/* Portfolio Details */}
      <div style={styles.assets}>
        <h2 style={styles.header}>Portfolio Details</h2>
        {loading ? (
          <p>Loading portfolio...</p>
        ) : assets.length > 0 ? (
          assets.map((asset, index) => (
            <div key={index} style={styles.asset}>
              <p>
                {`${asset.symbol} - Amount: ${asset.amount} - Value (USD): $${
                  isNaN(asset.amount * asset.priceUSD)
                    ? 0
                    : (asset.amount * asset.priceUSD).toFixed(2)
                } - Value (EUR): €${
                  isNaN(asset.amount * asset.priceEUR)
                    ? 0
                    : (asset.amount * asset.priceEUR).toFixed(2)
                }`}
              </p>
              <button
                onClick={() => handleEditAsset(index)}
                style={{ ...styles.assetButton, marginLeft: "10px" }}
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevents any other actions from triggering
                  e.preventDefault(); // Prevent the default action (such as page reload)
                  openDeleteConfirmation(index);
                }}
                style={{
                  ...styles.assetButton,
                  marginLeft: "5px",
                  background: "#dc3545",
                }}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No assets in your portfolio yet.</p>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={closeDeleteConfirmation}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this asset from your portfolio?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirmation} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteAsset} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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
