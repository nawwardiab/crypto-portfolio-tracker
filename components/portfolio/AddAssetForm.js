// components/AddAssetForm.js
import { TextField, Button, Autocomplete } from "@mui/material";

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
  const handleAdd = () => {
    console.log("Add button clicked", { cryptoSymbol, amount }); // Debugging log
    if (!cryptoSymbol.trim() || !amount) {
      alert("Please enter a valid cryptocurrency symbol and amount.");
      return;
    }
    // Call the function to add the asset with the current symbol and amount
    addAsset(cryptoSymbol, amount);
  };

  return (
    <div
      style={{
        marginBottom: "2rem",
        backgroundColor: "#333",
        padding: "1rem",
        borderRadius: "8px",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "1rem" }}>Add Cryptocurrency</h2>
      <Autocomplete
        freeSolo
        options={suggestedSymbols}
        getOptionLabel={(option) => option.symbol}
        inputValue={cryptoSymbol}
        onInputChange={(event, newInputValue) => {
          setCryptoSymbol(newInputValue);
          searchCoinBySymbol(newInputValue); // Trigger search on input change with new value
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
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.symbol}
          </li>
        )}
      />
      <TextField
        type="number"
        label="Amount"
        variant="outlined"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        style={{ marginBottom: "10px" }}
        disabled={loading}
      />
      <Button
        onClick={handleAdd}
        fullWidth
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Asset"}
      </Button>
    </div>
  );
};

export default AddAssetForm;
