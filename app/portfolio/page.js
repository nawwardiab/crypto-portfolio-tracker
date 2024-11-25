"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import PortfolioManager from "@/components/portfolio/PortfolioManager"; // Import PortfolioManager

const PortfolioPage = () => {
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/"); // Redirect to the home page if not authenticated
    }
  }, [user, router]);

  return (
    <div style={styles.container}>
      {user ? (
        <>
          <h1 style={styles.header}>Welcome, {user.email}!</h1>
          {/* Use PortfolioManager for managing the entire portfolio view */}
          <PortfolioManager />
        </>
      ) : (
        <p>Redirecting to login...</p>
      )}
    </div>
  );
};

// Styles for the page container and header
const styles = {
  container: {
    padding: "2rem",
    color: "white",
    backgroundColor: "#111111",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
};

export default PortfolioPage;
