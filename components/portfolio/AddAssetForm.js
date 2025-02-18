import { TextField, Button, Autocomplete, Grid } from "@mui/material"; // Import Material UI components
import { useTheme } from "@mui/material/styles"; // Import useTheme to access the current theme

// Component for adding a new cryptocurrency asset to the portfolio
const AddAssetForm = ({
  cryptoSymbol, // The selected cryptocurrency symbol
  setCryptoSymbol, // Function to update the crypto symbol state
  amount, // The entered amount of the cryptocurrency
  setAmount, // Function to update the amount state
  addAsset, // Function to handle adding the asset to the portfolio
  loading, // Boolean indicating whether an action is in progress
  suggestedSymbols, // List of suggested symbols from API search
  searchCoinBySymbol, // Function to fetch suggested cryptocurrencies
}) => {
  // Retrieve the current theme from Material UI (used for styling)
  const theme = useTheme();

  // Function to handle adding an asset when the user submits the form
  const handleAdd = () => {
    if (!cryptoSymbol.trim() || !amount) {
      alert("Please enter a valid cryptocurrency symbol and amount."); // Validate input before adding asset
      return;
    }
    addAsset(cryptoSymbol, amount); // Call the function to add the asset
  };

  return (
    <Grid
      container
      spacing={2} // Adds spacing between grid items
      component="form"
      onSubmit={(e) => {
        e.preventDefault(); // Prevents default form submission behavior
        handleAdd(); // Calls the add asset function
      }}
    >
      {/* Input field for selecting a cryptocurrency */}
      <Grid item xs={12} md={6}>
        <Autocomplete
          options={suggestedSymbols} // Populate with suggested cryptocurrency symbols
          getOptionLabel={(option) => (option.symbol ? option.symbol : "")} // Extract the symbol for display
          renderInput={(params) => (
            <TextField
              {...params}
              label="Crypto Symbol (e.g., BTC)" // Label for input field
              variant="outlined"
              onChange={(e) => searchCoinBySymbol(e.target.value)} // Fetch matching symbols from API
              sx={{
                backgroundColor: theme.palette.background.default, // Apply background based on theme
                borderRadius: "4px", // Rounded corners for styling
              }}
            />
          )}
          value={cryptoSymbol} // Bind value to the selected symbol
          onChange={
            (_, newValue) => setCryptoSymbol(newValue ? newValue.symbol : "") // Update state when selecting an option
          }
        />
      </Grid>

      {/* Input field for entering the cryptocurrency amount */}
      <Grid item xs={12} md={6}>
        <TextField
          label="Amount" // Label for input field
          type="number" // Ensure numeric input
          variant="outlined"
          value={amount} // Bind value to state
          onChange={(e) => setAmount(e.target.value)} // Update amount state on change
          sx={{
            backgroundColor: theme.palette.background.default, // Apply background based on theme
            borderRadius: "4px", // Rounded corners for styling
          }}
        />
      </Grid>

      {/* Button to add the asset to the portfolio */}
      <Grid item xs={12} md={6}>
        <Button
          type="submit" // Submit button for the form
          variant="contained"
          color="warning" // Warning color theme to highlight action
          disabled={loading} // Disable button while loading
          sx={{
            alignSelf: "flex-start", // Align button to the start
            backgroundColor:
              theme.palette.mode === "dark" ? "#b8860b" : "#ffd700", // Use gold tones for finance theme
            color: "white",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark" ? "#d4af37" : "#ffea00", // Lighter gold shade on hover
            },
          }}
        >
          {loading ? "Adding..." : "Add Asset"}{" "}
          {/* Show loading state when submitting */}
        </Button>
      </Grid>
    </Grid>
  );
};

export default AddAssetForm; // Export component for use in other parts of the application
