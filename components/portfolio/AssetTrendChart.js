"use client"; // Ensures this component runs on the client side in Next.js

// Import necessary modules from Chart.js for rendering the line chart
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

import { Line } from "react-chartjs-2"; // Import Line chart component from Chart.js
import zoomPlugin from "chartjs-plugin-zoom"; // Import zoom plugin for interactive zooming
import { useEffect, useState } from "react"; // Import React hooks
import { getHistoricalData } from "@/services/coingeckoService"; // Import API service to fetch historical crypto data
import { CircularProgress, Button, Box, Typography } from "@mui/material"; // Import Material UI components

// Register Chart.js components and plugins
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin // Enables zooming and panning
);

// Component to display historical price trends of a cryptocurrency
const AssetTrendChart = ({ coinId }) => {
  const [chartData, setChartData] = useState(null); // State to store formatted chart data
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [days, setDays] = useState(30); // State to store selected time range (default: 30 days)

  // Fetch historical data whenever the coinId or days selection changes
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        setLoading(true); // Set loading state while fetching data
        const historicalData = await getHistoricalData(coinId, days); // Fetch price data

        // Extract timestamps and prices for USD and EUR
        const labels = historicalData.usd.map(([timestamp]) =>
          new Date(timestamp).toLocaleDateString()
        );
        const usdDataPoints = historicalData.usd.map(([, price]) => price);
        const eurDataPoints = historicalData.eur.map(([, price]) => price);

        // Set up chart data
        setChartData({
          labels,
          datasets: [
            {
              label: `${coinId} Price (in USD)`, // Label for USD prices
              data: usdDataPoints,
              fill: true,
              borderColor: "rgba(255, 215, 0, 1)", // Gold color for USD line
              backgroundColor: "rgba(255, 215, 0, 0.1)", // Light gold fill
              tension: 0.4, // Curve smoothing
              pointRadius: 4,
              pointBackgroundColor: "rgba(255, 215, 0, 1)",
              pointHoverRadius: 6,
            },
            {
              label: `${coinId} Price (in EUR)`, // Label for EUR prices
              data: eurDataPoints,
              fill: true,
              borderColor: "rgba(0, 191, 255, 1)", // Blue color for EUR line
              backgroundColor: "rgba(0, 191, 255, 0.1)", // Light blue fill
              tension: 0.4, // Curve smoothing
              pointRadius: 4,
              pointBackgroundColor: "rgba(0, 191, 255, 1)",
              pointHoverRadius: 6,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching historical data for chart:", error);
      } finally {
        setLoading(false); // Set loading state to false after data fetch
      }
    };

    fetchHistoricalData();
  }, [coinId, days]); // Re-run effect when coinId or days selection changes

  // Chart options for customization
  const options = {
    responsive: true, // Ensure chart resizes properly
    plugins: {
      legend: {
        position: "top", // Position legend at the top
      },
      title: {
        display: true,
        text: `Trend Chart for ${coinId}`, // Chart title
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`; // Customize tooltip format
          },
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "xy", // Enable panning in both X and Y directions
        },
        zoom: {
          wheel: {
            enabled: true, // Enable zooming via mouse scroll
          },
          pinch: {
            enabled: true, // Enable pinch-to-zoom for touch devices
          },
          mode: "xy", // Allow zooming in both X and Y directions
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date", // X-axis title
        },
      },
      y: {
        title: {
          display: true,
          text: "Price", // Y-axis title
        },
      },
    },
  };

  // Function to change the time range for the chart
  const handleTimeRangeChange = (newDays) => {
    setDays(newDays);
  };

  return (
    <Box sx={{ width: "100%", mb: 4, p: 3 }}>
      {loading ? (
        <CircularProgress /> // Show loading spinner while fetching data
      ) : chartData ? (
        <>
          {/* Title for time range selection */}
          <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
            Select Time Range
          </Typography>

          {/* Buttons for selecting time range */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2, // Spacing between buttons
              mb: 3, // Margin below buttons
            }}
          >
            <Button
              variant={days === 7 ? "contained" : "outlined"} // Highlight selected time range
              onClick={() => handleTimeRangeChange(7)} // Set time range to 1 week
              sx={{
                color: "white",
                borderColor: "yellow",
                "&:hover": { backgroundColor: "rgba(255, 255, 0, 0.1)" },
              }}
            >
              1 Week
            </Button>
            <Button
              variant={days === 30 ? "contained" : "outlined"} // Highlight selected time range
              onClick={() => handleTimeRangeChange(30)} // Set time range to 1 month
              sx={{
                color: "white",
                borderColor: "yellow",
                "&:hover": { backgroundColor: "rgba(255, 255, 0, 0.1)" },
              }}
            >
              1 Month
            </Button>
            <Button
              variant={days === 90 ? "contained" : "outlined"} // Highlight selected time range
              onClick={() => handleTimeRangeChange(90)} // Set time range to 3 months
              sx={{
                color: "white",
                borderColor: "yellow",
                "&:hover": { backgroundColor: "rgba(255, 255, 0, 0.1)" },
              }}
            >
              3 Months
            </Button>
            <Button
              variant={days === 365 ? "contained" : "outlined"} // Highlight selected time range
              onClick={() => handleTimeRangeChange(365)} // Set time range to 1 year
              sx={{
                color: "white",
                borderColor: "yellow",
                "&:hover": { backgroundColor: "rgba(255, 255, 0, 0.1)" },
              }}
            >
              1 Year
            </Button>
          </Box>

          {/* Render the chart */}
          <Line data={chartData} options={options} />
        </>
      ) : (
        <Typography>No data available.</Typography> // Show message if no data is available
      )}
    </Box>
  );
};

export default AssetTrendChart; // Export component for use in other parts of the app
