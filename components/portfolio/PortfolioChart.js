"use client";

import { Line, Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PortfolioChart = () => {
  const portfolio = useSelector((state) => state.portfolio);

  // Prepare data for Chart.js
  const chartData = {
    labels: portfolio.assets.map((asset) => asset.symbol),
    datasets: [
      {
        label: "Portfolio Value in USD",
        data: portfolio.assets.map((asset) => asset.priceUSD * asset.amount),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Portfolio Value in EUR",
        data: portfolio.assets.map((asset) => asset.priceEUR * asset.amount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={styles.chartContainer}>
      <h2>Portfolio Value by Asset</h2>
      <Bar data={chartData} />
    </div>
  );
};

const styles = {
  chartContainer: {
    maxWidth: "800px",
    margin: "2rem auto",
    padding: "1rem",
    backgroundColor: "#333",
    borderRadius: "8px",
    textAlign: "center",
    color: "white",
  },
};

export default PortfolioChart;
