"use client";

import { useState, useEffect } from "react";
import { useFirebaseAuth } from "@/services/useFirebaseAuth";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/features/authSlice";
import toast from "react-hot-toast";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp, logIn } = useFirebaseAuth();
  const router = useRouter();
  const user = useSelector(selectUser);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      router.push("/portfolio");
    }
  }, [user, router]);

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
    color: "white",
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
};

export default AuthForm;
