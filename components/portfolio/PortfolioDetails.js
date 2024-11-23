// components/PortfolioDetails.js
import { Button } from "@mui/material";

const PortfolioDetails = ({
  assets,
  loading,
  handleEditAsset,
  openDeleteConfirmation,
}) => {
  console.log("PortfolioDetails received assets:", assets); // Debugging log

  return (
    <div
      style={{ backgroundColor: "#444", padding: "1rem", borderRadius: "8px" }}
    >
      <h2 style={{ marginBottom: "1rem" }}>Portfolio Details</h2>
      {loading ? (
        <p>Loading portfolio...</p>
      ) : assets.length > 0 ? (
        assets.map((asset, index) => (
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
          </div>
        ))
      ) : (
        <p>No assets in your portfolio yet.</p>
      )}
    </div>
  );
};

export default PortfolioDetails;
