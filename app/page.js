"use client";

import Navbar from "../components/Navbar"; // Import the Navbar
import AuthForm from "@/components/auth/AuthForm"; // Import the reusable AuthForm
import { Toaster } from "react-hot-toast"; // Import Toaster for global toast notifications

const HomePage = () => {
  return (
    <>
      <Toaster position="top-right" />{" "}
      {/* Toaster for showing global notifications */}
      <div style={styles.container}>
        <AuthForm /> {/* Use the reusable AuthForm */}
      </div>
    </>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#111111",
  },
};

export default HomePage;
