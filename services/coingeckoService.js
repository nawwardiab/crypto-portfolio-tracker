import axios from "axios";

// Function to get the list of supported coins from CoinGecko
export const getSupportedCoins = async () => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/list"
    );
    // console.log("API response from CoinGecko:", response.data); // Log API response
    return response.data; // Returns an array of supported coins
  } catch (error) {
    console.error("Error fetching supported coins:", error);
    throw error;
  }
};

// Function to get the price of a cryptocurrency from CoinGecko
export const getCryptoPrice = async (coinId) => {
  try {
    // Fetch price using the CoinGecko ID
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price`,
      {
        params: {
          ids: coinId, // Use the CoinGecko ID
          vs_currencies: "usd,eur", // Fetch prices in both USD and EUR
        },
      }
    );
    console.log("Price data from API", response.data);

    if (response.data[coinId]) {
      return response.data[coinId]; // Return both USD and EUR prices
    } else {
      throw new Error("Price data not found for this cryptocurrency");
    }
  } catch (error) {
    console.error("Error fetching crypto price:", error);
    throw error;
  }
};

export const searchCoins = async (query) => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/search",
      {
        params: {
          query,
        },
      }
    );
    console.log("Response from CoinGecko search:", response);
    return response.data.coins;
  } catch (error) {
    console.error("Error searching coins:", error);
    throw error;
  }
};
