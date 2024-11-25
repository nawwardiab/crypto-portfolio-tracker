"use client";

import { useState, useEffect } from "react";
import { useFirebaseAuth } from "@/services/useFirebaseAuth";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectUser } from "@/features/authSlice";
import toast from "react-hot-toast";

const AuthForm = ({ isSignUp, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, logIn } = useFirebaseAuth();
  const router = useRouter();
  const user = useSelector(selectUser);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      router.push("/portfolio");
      if (onClose) onClose(); // Close the modal if already logged in
    }
  }, [user, router, onClose]);

  const validateInput = () => {
    if (!email) {
      toast.error("Please enter an email address.");
      return false;
    }
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateInput()) return;
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
        toast.success("Sign-up successful!");
      } else {
        await logIn(email, password);
        toast.success("Logged in successfully!");
        router.push("/portfolio");
      }
      if (onClose) onClose(); // Close the modal after successful action
    } catch (err) {
      toast.error(
        err.message ||
          (isSignUp
            ? "Sign-up failed. Please try again."
            : "Login failed. Please try again.")
      );
    } finally {
      setLoading(false);
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
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          disabled={loading}
        />
        <button onClick={handleSubmit} style={styles.button} disabled={loading}>
          {loading
            ? isSignUp
              ? "Signing Up..."
              : "Logging In..."
            : isSignUp
            ? "Sign Up"
            : "Log In"}
        </button>
        <button
          onClick={() => setIsSignUp((prev) => !prev)}
          style={styles.toggleButton}
          disabled={loading}
        >
          {isSignUp
            ? "Already have an account? Log In"
            : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  form: {
    width: "350px",
    padding: "20px 24px",
    borderRadius: "16px",
    boxShadow: "none", // Remove the box-shadow to prevent layering effects
    backgroundColor: "#1e1e1e", // Match with the dialog box background
    textAlign: "center",
  },
  header: {
    marginBottom: "20px",
    color: "white",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "8px", // Softer rounding for inputs
    border: "1px solid #555", // Slightly lighter border for better visibility
    backgroundColor: "#333",
    color: "white",
  },
  button: {
    width: "100%",
    padding: "12px",
    margin: "12px 0",
    backgroundColor: "#d4af37", // Bright button to draw attention
    color: "white",
    border: "none",
    borderRadius: "8px", // More rounded for modern styling
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },

  toggleButton: {
    background: "none",
    border: "none",
    color: "#007bff",
    cursor: "pointer",
    textDecoration: "underline",
    marginTop: "10px",
  },
};

export default AuthForm;
