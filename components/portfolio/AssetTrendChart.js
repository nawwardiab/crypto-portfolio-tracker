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
  Filler
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

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div style={{ width: "100%", height: "400px", marginBottom: "2rem" }}>
      {chartData ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: "top",
                labels: {
                  color: "#fff", // Adjust label color to match theme (white for dark theme)
                },
              },
              tooltip: {
                enabled: true,
                mode: "index",
                intersect: false,
                callbacks: {
                  label: (context) => {
                    return `${
                      context.dataset.label
                    }: $${context.parsed.y.toFixed(2)}`;
                  },
                },
              },
            },
            scales: {
              x: {
                ticks: {
                  color: "#fff", // White color for x-axis labels in dark mode
                },
              },
              y: {
                ticks: {
                  color: "#fff", // White color for y-axis labels in dark mode
                },
              },
            },
          }}
        />
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default AssetTrendChart;
