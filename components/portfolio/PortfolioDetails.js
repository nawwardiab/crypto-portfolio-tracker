import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import AssetTrendChart from "./AssetTrendChart";
import { getCoinsList } from "@/services/coingeckoService";

const PortfolioDetails = ({
  assets,
  loading,
  handleEditAsset,
  openDeleteConfirmation,
  totalValueUSD = 0,
  totalValueEUR = 0,
}) => {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [coinsList, setCoinsList] = useState([]);

  useEffect(() => {
    // Fetch the list of coins from CoinGecko
    const fetchCoinsList = async () => {
      try {
        const list = await getCoinsList();
        setCoinsList(list);
      } catch (error) {
        console.error("Error fetching coins list:", error);
      }
    };
    fetchCoinsList();
  }, []);

  // Function to get Coin ID based on symbol with strict matching
  const getCoinIdFromSymbol = (symbol) => {
    const coin = coinsList.find(
      (c) =>
        c.symbol.toLowerCase() === symbol.toLowerCase() &&
        c.id.toLowerCase().includes(symbol.toLowerCase())
    );
    return coin ? coin.id : null;
  };

  const handleViewTrend = (asset) => {
    setSelectedAsset((prevSelected) =>
      prevSelected && prevSelected.symbol === asset.symbol ? null : asset
    );
  };

  console.log("PortfolioDetails received assets:", assets); // Debugging log

  return (
    <div
      style={{ backgroundColor: "#444", padding: "1rem", borderRadius: "8px" }}
    >
      <h2 style={{ marginBottom: "1rem" }}>Portfolio Details</h2>
      {loading ? (
        <p>Loading portfolio...</p>
      ) : assets.length > 0 ? (
        <>
          <h3>{`Total Portfolio Value: USD: $${totalValueUSD.toFixed(
            2
          )} | EUR: €${totalValueEUR.toFixed(2)}`}</h3>
          {assets.map((asset, index) => {
            const coinId = getCoinIdFromSymbol(asset.symbol);
            return (
              <div
                key={index}
                style={{
                  marginBottom: "1rem",
                  padding: "0.5rem",
                  backgroundColor: "#555",
                  borderRadius: "4px",
                }}
              >
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
                <Button
                  onClick={() => handleEditAsset(index)}
                  style={{ marginLeft: "10px" }}
                >
                  Edit
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents any other actions from triggering
                    e.preventDefault(); // Prevent the default action (such as page reload)
                    openDeleteConfirmation(index);
                  }}
                  style={{ marginLeft: "5px", background: "#dc3545" }}
                  variant="contained"
                  color="secondary"
                >
                  Delete
                </Button>
                {coinId ? (
                  <Button
                    onClick={() => handleViewTrend(asset)}
                    style={{ marginLeft: "10px", background: "#28a745" }}
                    variant="contained"
                    color="primary"
                  >
                    {selectedAsset && selectedAsset.symbol === asset.symbol
                      ? "Hide Trend"
                      : "View Trend"}
                  </Button>
                ) : (
                  <p style={{ color: "#dc3545" }}>
                    Trend data not available for this asset.
                  </p>
                )}
                {selectedAsset &&
                  selectedAsset.symbol === asset.symbol &&
                  coinId && <AssetTrendChart coinId={coinId} />}
              </div>
            );
          })}
        </>
      ) : (
        <p>No assets in your portfolio yet.</p>
      )}
    </div>
  );
};

export default PortfolioDetails;
