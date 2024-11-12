"use client";

import { useEffect } from "react";
import { useFirebaseAuth } from "@/services/useFirebaseAuth";
import { useSelector, useDispatch } from "react-redux";
import { setPortfolio, addCrypto } from "@/features/portfolioSlice";

const Portfolio = () => {
  const { savePortfolio, getPortfolio } = useFirebaseAuth();
  const user = useSelector((state) => state.auth.user);
  const portfolio = useSelector((state) => state.portfolio);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!user) return;

      try {
        const portfolioData = await getPortfolio(user.uid);
        if (portfolioData) {
          dispatch(setPortfolio(portfolioData));
        } else {
          dispatch(setPortfolio({ assets: [], totalValue: 0 }));
        }
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      }
    };

    if (user && portfolio?.assets?.length === 0) {
      fetchPortfolio();
    }
  }, [user, getPortfolio, dispatch, portfolio?.assets?.length]);

  const addDummyAsset = () => {
    if (!user) {
      console.error("Cannot add an asset without logging in.");
      return;
    }
    dispatch(
      addCrypto({
        id: Date.now(),
        name: "Bitcoin",
        amount: 1,
        value: 30000,
      })
    );
  };

  const handleSavePortfolio = async () => {
    if (!user) {
      console.error("No user is logged in.");
      return;
    }
    console.log("Saving the following portfolio:", portfolio);
    try {
      await savePortfolio(user.uid, portfolio);
      console.log("Portfolio data saved!");
    } catch (error) {
      console.error("Error saving portfolio:", error);
    }
  };

  return (
    <div>
      <h2>Manage Your Portfolio</h2>
      {user ? (
        <>
          <button onClick={addDummyAsset}>Add Bitcoin</button>
          <button onClick={handleSavePortfolio}>Save Portfolio</button>

          <div>
            <h3>Portfolio Details:</h3>
            <pre>{JSON.stringify(portfolio, null, 2)}</pre>
          </div>
        </>
      ) : (
        <p>Please log in to manage your portfolio.</p>
      )}
    </div>
  );
};

export default Portfolio;
