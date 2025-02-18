// Import necessary React hooks and Material UI components
import { useState, useEffect } from "react";
import { Button, Grid, IconButton, Tooltip, Modal, Box } from "@mui/material";
import AssetTrendChart from "./AssetTrendChart"; // Import component for displaying asset price trends
import { getCoinsList } from "@/services/coingeckoService"; // Import API function to fetch coin list from CoinGecko
import { useTheme } from "../theme/ThemeContext"; // Import custom theme context for dark/light mode
import EditIcon from "@mui/icons-material/Edit"; // Edit icon for modifying an asset
import DeleteIcon from "@mui/icons-material/Delete"; // Delete icon for removing an asset
import TrendingUpIcon from "@mui/icons-material/TrendingUp"; // Icon for viewing an asset's trend
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat"; // Icon for closing asset trend view

// Component to display details of the user's portfolio
const PortfolioDetails = ({
  assets, // List of assets in the portfolio
  loading, // Boolean indicating if portfolio data is being fetched
  handleEditAsset, // Function to handle asset editing
  openDeleteConfirmation, // Function to open the delete confirmation dialog
  totalValueUSD = 0, // Total portfolio value in USD (default: 0)
  totalValueEUR = 0, // Total portfolio value in EUR (default: 0)
}) => {
  const [selectedAsset, setSelectedAsset] = useState(null); // State to track selected asset for trend view
  const [coinsList, setCoinsList] = useState([]); // State to store the list of supported coins from CoinGecko
  const [openModal, setOpenModal] = useState(false); // State to control the trend chart modal visibility

  const { theme } = useTheme(); // Get the current theme (dark/light mode)

  useEffect(() => {
    // Fetch the list of supported cryptocurrencies from CoinGecko on component mount
    const fetchCoinsList = async () => {
      try {
        const list = await getCoinsList();
        setCoinsList(list); // Store the retrieved list in state
      } catch (error) {
        console.error("Error fetching coins list:", error);
      }
    };
    fetchCoinsList();
  }, []); // Run this effect only once when the component mounts

  // Function to get the CoinGecko ID based on the asset's symbol
  const getCoinIdFromSymbol = (symbol) => {
    const coin = coinsList.find(
      (c) =>
        c.symbol.toLowerCase() === symbol.toLowerCase() &&
        c.id.toLowerCase().includes(symbol.toLowerCase()) // Ensures strict matching
    );
    return coin ? coin.id : null;
  };

  // Function to handle viewing/hiding the trend chart for an asset
  const handleViewTrend = (asset) => {
    if (selectedAsset && selectedAsset.symbol === asset.symbol) {
      // If clicking on the same asset, close the trend modal
      setSelectedAsset(null);
      setOpenModal(false);
    } else {
      // Otherwise, open the modal with the selected asset's trend chart
      setSelectedAsset(asset);
      setOpenModal(true);
    }
  };

  // Function to close the trend modal
  const handleCloseTrendModal = () => {
    setSelectedAsset(null);
    setOpenModal(false);
  };

  return (
    <div
      style={{ backgroundColor: "#444", padding: "1rem", borderRadius: "8px" }} // Dark background with padding
    >
      <h2 style={{ marginBottom: "1rem" }}>Portfolio Details</h2>

      {/* Show loading indicator while fetching portfolio data */}
      {loading ? (
        <p>Loading portfolio...</p>
      ) : assets.length > 0 ? (
        <>
          {/* Display total portfolio value in USD and EUR */}
          <h3>{`Total Portfolio Value: USD: $${totalValueUSD.toFixed(
            2
          )} | EUR: €${totalValueEUR.toFixed(2)}`}</h3>

          <Grid container spacing={2}>
            {assets.map((asset, index) => {
              const coinId = getCoinIdFromSymbol(asset.symbol); // Get the CoinGecko ID for this asset
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
                    {/* Display asset details: symbol, amount, and value in USD & EUR */}
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

                    {/* Button to edit the asset */}
                    <Tooltip title="Edit Asset">
                      <IconButton
                        onClick={() => handleEditAsset(index)}
                        color="primary"
                        sx={{ marginRight: "5px" }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    {/* Button to delete the asset */}
                    <Tooltip title="Delete Asset">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents unintended interactions
                          e.preventDefault(); // Prevents page reload
                          openDeleteConfirmation(index); // Open delete confirmation dialog
                        }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>

                    {/* Button to view or hide asset trend chart */}
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

          {/* Modal for displaying asset trend chart */}
          <Modal
            open={!!selectedAsset && openModal} // Show modal if an asset is selected
            onClose={handleCloseTrendModal} // Handle modal close
            aria-labelledby="trend-chart-modal-title"
            aria-describedby="trend-chart-modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)", // Center modal
                width: "80%",
                bgcolor: theme === "dark" ? "background.paper" : "#e0e0e0", // Adjust background based on theme
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

export default PortfolioDetails; // Export component for use in the application
