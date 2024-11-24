"use client";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { getHistoricalData } from "@/services/coingeckoService";
import { CircularProgress } from "@mui/material";

// Register the required Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

const AssetTrendChart = ({ coinId, days = 30 }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch historical data when the component mounts
    const fetchHistoricalData = async () => {
      try {
        setLoading(true);
        const historicalData = await getHistoricalData(coinId, days);

        // Transform the historical data into format suitable for Chart.js
        const labels = historicalData.usd.map(([timestamp]) =>
          new Date(timestamp).toLocaleDateString()
        );
        const usdDataPoints = historicalData.usd.map(([, price]) => price);
        const eurDataPoints = historicalData.eur.map(([, price]) => price);

        // Set the chart data
        setChartData({
          labels,
          datasets: [
            {
              label: `${coinId} Price (in USD)`,
              data: usdDataPoints,
              fill: false,
              borderColor: "rgba(75,192,192,1)",
              tension: 0.1,
            },
            {
              label: `${coinId} Price (in EUR)`,
              data: eurDataPoints,
              fill: false,
              borderColor: "rgba(192,75,75,1)",
              tension: 0.1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching historical data for chart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [coinId, days]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div style={{ width: "100%", height: "400px", marginBottom: "2rem" }}>
      {chartData ? <Line data={chartData} /> : <p>No data available.</p>}
    </div>
  );
};

export default AssetTrendChart;
