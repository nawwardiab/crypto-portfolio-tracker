"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import PortfolioManager from "@/components/portfolio/PortfolioManager"; // Updated to use PortfolioManager component

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
          <PortfolioManager />{" "}
          {/* Updated to use PortfolioManager for managing assets */}
        </>
      ) : (
        <p>Redirecting to login...</p>
      )}
    </div>
  );
};

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
