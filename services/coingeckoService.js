import axios from "axios";

// Function to get the list of supported coins from CoinGecko
export const getSupportedCoins = async () => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/list"
    );

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
    return response.data.coins;
  } catch (error) {
    console.error("Error searching coins:", error);
    throw error;
  }
};

let coinsListCache = null; // Cache the list to reduce API calls

// Function to get the complete list of coins from CoinGecko
export const getCoinsList = async () => {
  if (coinsListCache) {
    return coinsListCache;
  }

  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/list"
    );
    if (response.data) {
      coinsListCache = response.data; // Cache the response for future use
      return coinsListCache;
    } else {
      throw new Error("Unable to retrieve coins list from CoinGecko");
    }
  } catch (error) {
    console.error("Error fetching coins list:", error);
    throw error;
  }
};

// Function to get Coin ID from symbol
export const getCoinId = async (symbol) => {
  try {
    const coinsList = await getCoinsList(); // Fetch or get cached coin list
    const coin = coinsList.find(
      (c) => c.symbol.toLowerCase() === symbol.toLowerCase()
    );
    if (coin) {
      return coin.id; // Return CoinGecko ID
    } else {
      throw new Error(`Coin with symbol "${symbol}" not found`);
    }
  } catch (error) {
    console.error("Error fetching coin ID:", error);
    throw error;
  }
};

export const getHistoricalData = async (coinId, days = 30) => {
  try {
    // Fetch historical data for USD and EUR concurrently
    const [responseUSD, responseEUR] = await Promise.all([
      axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
        {
          params: {
            vs_currency: "usd",
            days: days,
          },
        }
      ),
      axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
        {
          params: {
            vs_currency: "eur",
            days: days,
          },
        }
      ),
    ]);

    if (
      responseUSD.data &&
      responseUSD.data.prices &&
      responseEUR.data &&
      responseEUR.data.prices
    ) {
      return {
        usd: responseUSD.data.prices,
        eur: responseEUR.data.prices,
      };
    } else {
      throw new Error("No historical data available");
    }
  } catch (error) {
    console.error("Error fetching historical data:", error);
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait before retrying
      return getHistoricalData(coinId, days);
    } else {
      throw error;
    }
  }
};
