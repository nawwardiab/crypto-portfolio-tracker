"use client"; // Ensures this component runs on the client side in Next.js

import { useState, useEffect } from "react"; // Import state and effect hooks
import { useFirebaseAuth } from "@/services/useFirebaseAuth"; // Import custom Firebase authentication hook
import { useRouter } from "next/navigation"; // Import router for navigation
import { useSelector } from "react-redux"; // Import useSelector to access Redux state
import { selectUser } from "@/features/authSlice"; // Selector to get the user from Redux state
import toast from "react-hot-toast"; // Import toast notifications for user feedback

// Authentication form component that handles sign-up and log-in
const AuthForm = ({ isSignUp, onClose }) => {
  // State variables for managing form input and submission state
  const [email, setEmail] = useState(""); // Stores user email input
  const [password, setPassword] = useState(""); // Stores user password input
  const [loading, setLoading] = useState(false); // Manages loading state during authentication

  const { signUp, logIn } = useFirebaseAuth(); // Get authentication functions from Firebase service
  const router = useRouter(); // Initialize the router for navigation
  const user = useSelector(selectUser); // Get current user from Redux state

  // Redirect the user to the portfolio page if they are already logged in
  useEffect(() => {
    if (user) {
      router.push("/portfolio"); // Navigate to portfolio page
      if (onClose) onClose(); // Close the authentication modal if open
    }
  }, [user, router, onClose]); // Run effect when user, router, or onClose changes

  // Function to validate user input before submission
  const validateInput = () => {
    if (!email) {
      toast.error("Please enter an email address."); // Show error message if email is empty
      return false;
    }
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters long."); // Ensure password length requirement
      return false;
    }
    return true;
  };

  // Handles form submission for login or signup
  const handleSubmit = async () => {
    if (!validateInput()) return; // Stop if input validation fails
    setLoading(true); // Set loading state to true while processing

    try {
      if (isSignUp) {
        await signUp(email, password); // Call Firebase sign-up function
        toast.success("Sign-up successful!"); // Notify user of successful registration
      } else {
        await logIn(email, password); // Call Firebase login function
        toast.success("Logged in successfully!"); // Notify user of successful login
        router.push("/portfolio"); // Redirect user to the portfolio page
      }
      if (onClose) onClose(); // Close the authentication modal after success
    } catch (err) {
      // Display error messages for authentication failures
      toast.error(
        err.message ||
          (isSignUp
            ? "Sign-up failed. Please try again."
            : "Login failed. Please try again.")
      );
    } finally {
      setLoading(false); // Reset loading state after process completion
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        {/* Display form title based on authentication mode */}
        <h1 style={styles.header}>{isSignUp ? "Sign Up" : "Log In"}</h1>

        {/* Email input field */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          disabled={loading} // Disable input while processing authentication
        />

        {/* Password input field */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          disabled={loading} // Disable input while processing authentication
        />

        {/* Submit button for login/signup */}
        <button onClick={handleSubmit} style={styles.button} disabled={loading}>
          {loading
            ? isSignUp
              ? "Signing Up..."
              : "Logging In..."
            : isSignUp
            ? "Sign Up"
            : "Log In"}
        </button>

        {/* Toggle button to switch between Sign Up and Log In */}
        <button
          onClick={() => setIsSignUp((prev) => !prev)} // Toggle authentication mode
          style={styles.toggleButton}
          disabled={loading} // Disable button during loading
        >
          {isSignUp
            ? "Already have an account? Log In"
            : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
};

// Styles for the authentication form
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
    boxShadow: "none", // Remove box-shadow for a flat UI
    backgroundColor: "#1e1e1e", // Dark background for contrast
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
    backgroundColor: "#d4af37", // Bright gold button to draw attention
    color: "white",
    border: "none",
    borderRadius: "8px", // More rounded corners for modern styling
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

export default AuthForm; // Export the AuthForm component
