import { useState, useEffect } from "react";
import { Button, Grid, IconButton, Tooltip, Modal, Box } from "@mui/material";
import AssetTrendChart from "./AssetTrendChart";
import { getCoinsList } from "@/services/coingeckoService";
import { useTheme } from "../theme/ThemeContext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";

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
  const [openModal, setOpenModal] = useState(false);

  const { theme } = useTheme();

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
    if (selectedAsset && selectedAsset.symbol === asset.symbol) {
      // If clicking on the same asset, close both the modal and inline chart
      setSelectedAsset(null);
      setOpenModal(false);
    } else {
      // Open the modal with the selected asset
      setSelectedAsset(asset);
      setOpenModal(true);
    }
  };

  // To handle closing the modal
  const handleCloseTrendModal = () => {
    setSelectedAsset(null);
    setOpenModal(false);
  };

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
          <Grid container spacing={2}>
            {assets.map((asset, index) => {
              const coinId = getCoinIdFromSymbol(asset.symbol);
              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <div
                    style={{
                      marginBottom: "1rem",
                      padding: "0.5rem",
                      backgroundColor: "#555",
                      borderRadius: "4px",
                    }}
                  >
                    <p>
                      {`${asset.symbol} - Amount: ${
                        asset.amount
                      } - Value (USD): $${
                        isNaN(asset.amount * asset.priceUSD)
                          ? 0
                          : (asset.amount * asset.priceUSD).toFixed(2)
                      } - Value (EUR): €${
                        isNaN(asset.amount * asset.priceEUR)
                          ? 0
                          : (asset.amount * asset.priceEUR).toFixed(2)
                      }`}
                    </p>
                    <Tooltip title="Edit Asset">
                      <IconButton
                        onClick={() => handleEditAsset(index)}
                        color="primary"
                        sx={{ marginRight: "5px" }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Asset">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents any other actions from triggering
                          e.preventDefault(); // Prevent the default action (such as page reload)
                          openDeleteConfirmation(index);
                        }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    {coinId ? (
                      <Tooltip
                        title={
                          selectedAsset && selectedAsset.symbol === asset.symbol
                            ? "Hide Trend"
                            : "View Trend"
                        }
                      >
                        <IconButton
                          onClick={() => handleViewTrend(asset)}
                          color="success"
                        >
                          {selectedAsset &&
                          selectedAsset.symbol === asset.symbol ? (
                            <TrendingFlatIcon />
                          ) : (
                            <TrendingUpIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <p style={{ color: "#dc3545" }}>
                        Trend data not available for this asset.
                      </p>
                    )}
                  </div>
                </Grid>
              );
            })}
          </Grid>
          <Modal
            open={!!selectedAsset && openModal}
            onClose={handleCloseTrendModal}
            aria-labelledby="trend-chart-modal-title"
            aria-describedby="trend-chart-modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80%",
                bgcolor: theme === "dark" ? "background.paper" : "#e0e0e0",
                boxShadow: 24,
                p: 4,
                borderRadius: "8px",
              }}
            >
              <h2 id="trend-chart-modal-title">
                Trend Chart for {selectedAsset?.symbol}
              </h2>
              {selectedAsset && (
                <AssetTrendChart
                  coinId={getCoinIdFromSymbol(selectedAsset.symbol)}
                />
              )}
            </Box>
          </Modal>
        </>
      ) : (
        <p>No assets in your portfolio yet.</p>
      )}
    </div>
  );
};

export default PortfolioDetails;
