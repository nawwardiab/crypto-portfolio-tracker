"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/features/authSlice";
import { getPortfolio, savePortfolio } from "@/services/firestoreService";
import { updateDoc, arrayRemove, arrayUnion, doc } from "firebase/firestore"; // Import Firebase Firestore functions

import toast from "react-hot-toast";

const PortfolioManager = () => {
  const user = useSelector(selectUser);
  const [assets, setAssets] = useState([]);
  const [cryptoSymbol, setCryptoSymbol] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleAddAsset = async () => {
    if (!cryptoSymbol.trim() || !amount) {
      toast.error(
        "Please enter both a valid cryptocurrency symbol and amount."
      );
      return;
    }

    const newAsset = {
      symbol: cryptoSymbol.trim().toUpperCase(), // Trim and convert to uppercase
      amount: parseFloat(amount),
    };

    try {
      setLoading(true);
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

  const handleDeleteAsset = async (index) => {
    const assetToDelete = assets[index];
    const updatedAssets = assets.filter((_, i) => i !== index);

    try {
      setLoading(true);
      const assetToDelete = assets[index];
      const updatedAssets = assets.filter((_, i) => i !== index);

      await savePortfolio(user.uid, { assets: updatedAssets });
      setAssets(updatedAssets);
      toast.success("Asset deleted successfully!");
    } catch (error) {
      console.error("Error deleting asset:", error);
      toast.error("Failed to delete asset. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Add Asset Form */}
      <div style={styles.form}>
        <h2 style={styles.header}>Add Cryptocurrency</h2>
        <input
          type="text"
          placeholder="Crypto Symbol (e.g., BTC)"
          value={cryptoSymbol}
          onChange={(e) => setCryptoSymbol(e.target.value)}
          style={styles.input}
          disabled={loading}
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
              {`${asset.symbol} - Amount: ${asset.amount}`}
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
                  handleDeleteAsset(index);
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
};

export default PortfolioManager;
