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
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom"; // Import zoom plugin
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
  Legend,
  Filler,
  zoomPlugin
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
              fill: true,
              borderColor: "rgba(255, 215, 0, 1)", // Gold color for USD
              backgroundColor: "rgba(255, 215, 0, 0.1)", // Light gold background for filled area
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: "rgba(255, 215, 0, 1)",
              pointHoverRadius: 6,
            },
            {
              label: `${coinId} Price (in EUR)`,
              data: eurDataPoints,
              fill: true,
              borderColor: "rgba(0, 191, 255, 1)", // Sky blue color for EUR
              backgroundColor: "rgba(0, 191, 255, 0.1)", // Light blue background for filled area
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: "rgba(0, 191, 255, 1)",
              pointHoverRadius: 6,
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

  // Chart options with tooltips and zoom/pan enabled
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Trend Chart for ${coinId}`,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
          },
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "xy",
          modifierKey: "alt", // Try adding a modifier key (like "alt", "ctrl", or "shift") for Chrome.
        },
        zoom: {
          wheel: {
            enabled: true,
            modifierKey: "ctrl", // This makes sure zoom only happens when a key is pressed (useful for browser-specific behavior)
          },
          pinch: {
            enabled: true,
          },
          drag: {
            enabled: true, // Enable drag to zoom.
          },
          mode: "xy",
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Price",
        },
      },
    },
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div style={{ width: "100%", height: "400px", marginBottom: "2rem" }}>
      {chartData ? (
        <Line data={chartData} options={options} />
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default AssetTrendChart;
