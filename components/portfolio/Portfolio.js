"use client";

import { useEffect } from "react";
import { useFirebaseAuth } from "@/services/useFirebaseAuth";
import { useSelector, useDispatch } from "react-redux";
import {
  setPortfolio,
  addCrypto,
  removeCrypto,
  updateCrypto,
} from "@/features/portfolioSlice";

const Portfolio = () => {
  const { savePortfolio, getPortfolio } = useFirebaseAuth();
  const user = useSelector((state) => state.auth.user);
  const portfolio = useSelector((state) => state.portfolio) || {
    assets: [],
    totalValue: { usd: 0, eur: 0 },
  }; // Ensure default value
  const dispatch = useDispatch();

  // Fetch the portfolio when the user logs in
  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!user) return;

      try {
        const portfolioData = await getPortfolio(user.uid);

        console.log("Fetched portfolio data:", portfolioData); // Log fetched data to verify

        if (portfolioData && portfolioData.assets) {
          dispatch(setPortfolio(portfolioData));
        } else {
          dispatch(setPortfolio({ assets: [], totalValue: 0 }));
        }
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      }
    };

    // Fetch the portfolio only if the user is logged in and the Redux portfolio is empty
    if (user) {
      fetchPortfolio();
    }
  }, [user, getPortfolio, dispatch]);

  // Using useEffect to save portfolio when changes occur
  useEffect(() => {
    if (user && portfolio.assets.length > 0) {
      const savePortfolioToFirestore = async () => {
        try {
          console.log("Saving updated portfolio to Firestore:", portfolio);
          await savePortfolio(user.uid, portfolio);
          console.log("Portfolio saved successfully!");
        } catch (error) {
          console.error("Error saving portfolio:", error);
        }
      };
      savePortfolioToFirestore();
    }
  }, [user, portfolio, savePortfolio]);

  // Function to add a new asset (example for adding Bitcoin)
  const addDummyAsset = () => {
    if (!user) {
      console.error("Cannot add an asset without logging in.");
      return;
    }

    const newAsset = {
      id: Date.now(),
      name: "Bitcoin",
      amount: 1,
      value: 30000, // Example value
    };
    dispatch(addCrypto(newAsset)); // Update the Redux state with the new asset
  };

  return (
    <div>
      <h2>Manage Your Portfolio</h2>
      <button onClick={addDummyAsset}>Add Bitcoin</button>
      <div>
        <h3>Portfolio Details:</h3>
        <ul>
          {portfolio.assets && portfolio.assets.length > 0 ? (
            portfolio.assets.map((asset) => (
              <li key={asset.id}>
                <span>
                  {asset.name} - Amount: {asset.amount} - Value: ${asset.value}
                </span>
                <button onClick={() => dispatch(removeCrypto(asset.id))}>
                  Delete
                </button>
                <button
                  onClick={() =>
                    dispatch(
                      updateCrypto({
                        id: asset.id,
                        updatedAsset: { ...asset, amount: asset.amount + 1 },
                      })
                    )
                  }
                >
                  Edit
                </button>
              </li>
            ))
          ) : (
            <p>No assets in your portfolio yet</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Portfolio;
