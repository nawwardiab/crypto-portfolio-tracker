"use client"; // Ensures this component runs only on the client side in Next.js

// Import necessary components from Chart.js and React-ChartJS-2
import { Line, Bar } from "react-chartjs-2"; // Importing Bar and Line charts
import { useSelector } from "react-redux"; // Import useSelector to access Redux state
import {
  Chart as ChartJS,
  CategoryScale, // Used for x-axis categorization
  LinearScale, // Used for y-axis linear scaling
  BarElement, // Enables bar chart rendering
  LineElement, // Enables line chart rendering
  Title, // Allows adding chart titles
  Tooltip, // Enables tooltips on hover
  Legend, // Displays chart legend
} from "chart.js";

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Component to display the portfolio chart
const PortfolioChart = () => {
  // Retrieve the portfolio data from Redux state
  const portfolio = useSelector((state) => state.portfolio);

  // Prepare data for the Bar chart (showing asset values in USD & EUR)
  const chartData = {
    labels: portfolio.assets.map((asset) => asset.symbol), // Extract asset symbols for x-axis labels
    datasets: [
      {
        label: "Portfolio Value in USD", // Label for the dataset
        data: portfolio.assets.map((asset) => asset.priceUSD * asset.amount), // Calculate asset value in USD
        backgroundColor: "rgba(54, 162, 235, 0.6)", // Soft blue bar color
        borderColor: "rgba(54, 162, 235, 1)", // Solid blue border color
        borderWidth: 1, // Border thickness
      },
      {
        label: "Portfolio Value in EUR", // Label for the dataset
        data: portfolio.assets.map((asset) => asset.priceEUR * asset.amount), // Calculate asset value in EUR
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Soft teal bar color
        borderColor: "rgba(75, 192, 192, 1)", // Solid teal border color
        borderWidth: 1, // Border thickness
      },
    ],
  };

  return (
    <div style={styles.chartContainer}>
      <h2>Portfolio Value by Asset</h2>
      {/* Render Bar chart with the prepared data */}
      <Bar data={chartData} />
    </div>
  );
};

// Styling for the chart container
const styles = {
  chartContainer: {
    maxWidth: "800px", // Limit the maximum width of the chart
    margin: "2rem auto", // Center the chart horizontally with margins
    padding: "1rem", // Add spacing inside the container
    backgroundColor: "#333", // Dark background for better contrast
    borderRadius: "8px", // Rounded corners
    textAlign: "center", // Center-align text inside the container
    color: "white", // Set text color to white
  },
};

export default PortfolioChart; // Export component for use in other parts of the app
