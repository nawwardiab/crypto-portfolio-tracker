"use client"; // Ensures this component runs on the client side in Next.js

import AuthForm from "@/components/auth/AuthForm"; // Import the reusable authentication form
import { Toaster } from "react-hot-toast"; // Import Toaster for displaying global toast notifications
import {
  Box,
  Grid,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
  Dialog,
  IconButton,
} from "@mui/material"; // Import Material UI components
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close"; // Import close icon for the dialog

const HomePage = () => {
  const theme = useTheme(); // Get the current theme from Material UI
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md")); // Detect if the screen size is small (mobile view)
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to manage the authentication dialog visibility
  const [isSignUp, setIsSignUp] = useState(false); // State to determine whether to show Sign Up or Log In form

  // Hero image URL (adjust the path if necessary)
  const heroImageUrl = "/hero-crypto.png";

  // Function to open the authentication dialog
  const handleOpenDialog = (signUp = false) => {
    setIsSignUp(signUp); // Set whether the form is for sign-up or login
    setIsDialogOpen(true);
  };

  // Function to close the authentication dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      {/* Toaster for displaying success/error messages */}
      <Toaster position="top-right" />

      <Box
        sx={{
          backgroundColor: "#111111", // Dark background color
          minHeight: "100vh", // Ensure full-page height
        }}
      >
        {/* Hero section with background image */}
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          sx={{
            backgroundImage: `url(${heroImageUrl})`, // Set background image
            backgroundSize: "cover", // Ensure the image covers the section
            backgroundPosition: "center", // Center the background image
            height: isSmallScreen ? "50vh" : "70vh", // Adjust height based on screen size
            color: "white", // Set text color to white
            p: 4, // Padding for spacing
          }}
        >
          {/* Show Jumbotron only in mobile view */}
          {isSmallScreen && (
            <Grid item xs={12}>
              <Jumbotron handleOpenDialog={handleOpenDialog} />
            </Grid>
          )}
        </Grid>

        {/* Show Jumbotron below the hero section for larger screens */}
        {!isSmallScreen && (
          <Grid container justifyContent="center" sx={{ mt: -10 }}>
            <Grid item xs={10} md={6}>
              <Jumbotron handleOpenDialog={handleOpenDialog} />
            </Grid>
          </Grid>
        )}

        {/* Authentication Dialog */}
        <Dialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          maxWidth="xs" // Set the dialog width
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: "#1e1e1e", // Dark background for the dialog
              boxShadow: "none", // Remove box shadow
              borderRadius: "8px", // Rounded corners for a modern look
              padding: 0, // Remove padding to avoid unnecessary spacing
            },
          }}
          BackdropProps={{
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.95)", // Dark overlay when dialog is open
            },
          }}
        >
          <Box
            sx={{
              padding: 0, // Remove unnecessary padding
              textAlign: "center", // Center align content
              position: "relative", // Position for close button
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#1e1e1e", // Match dark theme
              borderRadius: "8px",
              boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.6)", // Soft shadow for focus
            }}
          >
            {/* Close button for dialog */}
            <IconButton
              onClick={handleCloseDialog}
              sx={{
                position: "absolute",
                top: "12px",
                right: "12px",
                color: "#ccc",
                "&:hover": {
                  color: "#fff",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
            {/* Authentication Form (Sign Up / Log In) */}
            <AuthForm isSignUp={isSignUp} onClose={handleCloseDialog} />
          </Box>
        </Dialog>
      </Box>
    </>
  );
};

// Jumbotron component for main call-to-action section
const Jumbotron = ({ handleOpenDialog }) => {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent background
        color: "white", // Text color
        borderRadius: "8px", // Rounded corners
        p: 4, // Padding for spacing
        textAlign: "center", // Center align content
      }}
    >
      {/* Welcome message */}
      <Typography variant="h3" gutterBottom>
        Welcome to Crypto Portfolio Tracker
      </Typography>
      <Typography variant="body1" gutterBottom>
        Track and manage your cryptocurrency investments easily with our
        platform.
      </Typography>
      {/* Call-to-action buttons */}
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 2 }}
          onClick={() => handleOpenDialog(true)} // Open Sign-Up Form
        >
          Get Started
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleOpenDialog(false)} // Open Log-In Form
        >
          Log In
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage; // Export the HomePage component
