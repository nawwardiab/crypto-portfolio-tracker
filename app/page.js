"use client";

import { useState } from "react";
import { useFirebaseAuth } from "@/services/useFirebaseAuth";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const { signUp, logIn, error } = useFirebaseAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      await signUp(email, password);
      setIsSignUp(false); // After signing up, go to login mode
    } catch (err) {
      console.error("Error signing up:", err);
    }
  };

  const handleLogin = async () => {
    try {
      await logIn(email, password);
      router.push("/dashboard"); // Redirect to the dashboard after login
    } catch (err) {
      console.error("Error logging in:", err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h1 style={styles.header}>{isSignUp ? "Sign Up" : "Log In"}</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        {isSignUp ? (
          <button onClick={handleSignUp} style={styles.button}>
            Sign Up
          </button>
        ) : (
          <button onClick={handleLogin} style={styles.button}>
            Log In
          </button>
        )}
        <button
          onClick={() => setIsSignUp((prev) => !prev)}
          style={styles.toggleButton}
        >
          {isSignUp
            ? "Already have an account? Log In"
            : "Don't have an account? Sign Up"}
        </button>
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
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
  form: {
    width: "300px",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#333333",
    textAlign: "center",
  },
  header: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  toggleButton: {
    background: "none",
    border: "none",
    color: "#007bff",
    cursor: "pointer",
    textDecoration: "underline",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
};

export default HomePage;
