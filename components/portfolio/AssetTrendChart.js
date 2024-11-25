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
import zoomPlugin from "chartjs-plugin-zoom";
import { useEffect, useState } from "react";
import { getHistoricalData } from "@/services/coingeckoService";
import { CircularProgress, Button, Box, Typography } from "@mui/material";

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

const AssetTrendChart = ({ coinId }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        setLoading(true);
        const historicalData = await getHistoricalData(coinId, days);

        const labels = historicalData.usd.map(([timestamp]) =>
          new Date(timestamp).toLocaleDateString()
        );
        const usdDataPoints = historicalData.usd.map(([, price]) => price);
        const eurDataPoints = historicalData.eur.map(([, price]) => price);

        setChartData({
          labels,
          datasets: [
            {
              label: `${coinId} Price (in USD)`,
              data: usdDataPoints,
              fill: true,
              borderColor: "rgba(255, 215, 0, 1)",
              backgroundColor: "rgba(255, 215, 0, 0.1)",
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: "rgba(255, 215, 0, 1)",
              pointHoverRadius: 6,
            },
            {
              label: `${coinId} Price (in EUR)`,
              data: eurDataPoints,
              fill: true,
              borderColor: "rgba(0, 191, 255, 1)",
              backgroundColor: "rgba(0, 191, 255, 0.1)",
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
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
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

  const handleTimeRangeChange = (newDays) => {
    setDays(newDays);
  };

  return (
    <Box sx={{ width: "100%", mb: 4, p: 3 }}>
      {loading ? (
        <CircularProgress />
      ) : chartData ? (
        <>
          <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
            Select Time Range
          </Typography>
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
              variant={days === 7 ? "contained" : "outlined"}
              onClick={() => handleTimeRangeChange(7)}
              sx={{
                color: "white",
                borderColor: "yellow",
                "&:hover": { backgroundColor: "rgba(255, 255, 0, 0.1)" },
              }}
            >
              1 Week
            </Button>
            <Button
              variant={days === 30 ? "contained" : "outlined"}
              onClick={() => handleTimeRangeChange(30)}
              sx={{
                color: "white",
                borderColor: "yellow",
                "&:hover": { backgroundColor: "rgba(255, 255, 0, 0.1)" },
              }}
            >
              1 Month
            </Button>
            <Button
              variant={days === 90 ? "contained" : "outlined"}
              onClick={() => handleTimeRangeChange(90)}
              sx={{
                color: "white",
                borderColor: "yellow",
                "&:hover": { backgroundColor: "rgba(255, 255, 0, 0.1)" },
              }}
            >
              3 Months
            </Button>
            <Button
              variant={days === 365 ? "contained" : "outlined"}
              onClick={() => handleTimeRangeChange(365)}
              sx={{
                color: "white",
                borderColor: "yellow",
                "&:hover": { backgroundColor: "rgba(255, 255, 0, 0.1)" },
              }}
            >
              1 Year
            </Button>
          </Box>
          <Line data={chartData} options={options} />
        </>
      ) : (
        <Typography>No data available.</Typography>
      )}
    </Box>
  );
};

export default AssetTrendChart;
