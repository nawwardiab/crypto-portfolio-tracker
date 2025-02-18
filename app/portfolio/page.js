"use client"; // Indicates that this component should run on the client side in Next.js

import { useEffect } from "react"; // Import useEffect for side effects
import { useSelector } from "react-redux"; // Import useSelector to access Redux state
import { useRouter } from "next/navigation"; // Import useRouter for programmatic navigation
import PortfolioManager from "@/components/portfolio/PortfolioManager"; // Import PortfolioManager component

const PortfolioPage = () => {
  // Retrieve the current authenticated user from Redux state
  const user = useSelector((state) => state.auth.user);
  const router = useRouter(); // Initialize the router for navigation

  useEffect(() => {
    // Redirect to the home page if the user is not authenticated
    if (!user) {
      router.push("/");
    }
  }, [user, router]); // Dependency array ensures this effect runs when user or router changes

  return (
    <div style={styles.container}>
      {user ? (
        <>
          {/* Display a welcome message with the user's email */}
          <h1 style={styles.header}>Welcome, {user.email}!</h1>
          {/* Render the PortfolioManager component to manage the user's portfolio */}
          <PortfolioManager />
        </>
      ) : (
        // Show a loading message while redirecting
        <p>Redirecting to login...</p>
      )}
    </div>
  );
};

// Define inline styles for the page layout
const styles = {
  container: {
    padding: "2rem", // Adds padding around the page
    color: "white", // Text color
    backgroundColor: "#111111", // Dark background for a modern UI
    minHeight: "100vh", // Ensure the page takes at least the full height of the viewport
  },
  header: {
    textAlign: "center", // Centers the header text
    marginBottom: "2rem", // Adds spacing below the header
  },
};

export default PortfolioPage; // Export the component as the default export
