import { TextField, Button, Autocomplete, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const AddAssetForm = ({
  cryptoSymbol,
  setCryptoSymbol,
  amount,
  setAmount,
  addAsset,
  loading,
  suggestedSymbols,
  searchCoinBySymbol,
}) => {
  // Use theme from MUI
  const theme = useTheme();

  const handleAdd = () => {
    if (!cryptoSymbol.trim() || !amount) {
      alert("Please enter a valid cryptocurrency symbol and amount.");
      return;
    }
    addAsset(cryptoSymbol, amount);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        backgroundColor:
          theme.palette.mode === "dark"
            ? theme.palette.background.paper
            : theme.palette.grey[100], // Using MUI's grey color for light mode background
        padding: "1rem",
        borderRadius: "8px",
        color: theme.palette.text.primary,
      }}
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleAdd();
      }}
    >
      <Autocomplete
        options={suggestedSymbols}
        getOptionLabel={(option) => (option.symbol ? option.symbol : "")}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Crypto Symbol (e.g., BTC)"
            variant="outlined"
            onChange={(e) => searchCoinBySymbol(e.target.value)}
            sx={{
              backgroundColor: theme.palette.background.default,
              borderRadius: "4px",
            }}
          />
        )}
        value={cryptoSymbol}
        onChange={(_, newValue) =>
          setCryptoSymbol(newValue ? newValue.symbol : "")
        }
      />
      <TextField
        label="Amount"
        type="number"
        variant="outlined"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        sx={{
          backgroundColor: theme.palette.background.default,
          borderRadius: "4px",
        }}
      />
      <Button
        type="submit"
        variant="contained"
        color="warning" // Change button color to better match finance theme
        disabled={loading}
        sx={{
          alignSelf: "flex-start",
          backgroundColor:
            theme.palette.mode === "dark" ? "#b8860b" : "#ffd700", // Dark: GoldenRod, Light: Gold
          color: "white",
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "dark" ? "#d4af37" : "#ffea00", // Lighter gold on hover
          },
        }}
      >
        {loading ? "Adding..." : "Add Asset"}
      </Button>
    </Box>
  );
};

export default AddAssetForm;
