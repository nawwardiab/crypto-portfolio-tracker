"use client";

import Navbar from "../components/Navbar"; // Import the Navbar
import AuthForm from "@/components/auth/AuthForm"; // Import the reusable AuthForm
import { Toaster } from "react-hot-toast"; // Import Toaster for global toast notifications
import {
  Box,
  Grid,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
  Dialog,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close"; // Import close icon

const HomePage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Hero image URL (adjust the path if necessary)
  const heroImageUrl = "/hero-crypto.png";

  // Handlers for opening and closing the dialog
  const handleOpenDialog = (signUp = false) => {
    setIsSignUp(signUp);
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <Toaster position="top-right" />
      <Box
        sx={{
          backgroundColor: "#111111",
          minHeight: "100vh",
        }}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          sx={{
            backgroundImage: `url(${heroImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: isSmallScreen ? "50vh" : "70vh",
            color: "white",
            p: 4,
          }}
        >
          {isSmallScreen && (
            <Grid item xs={12}>
              <Jumbotron handleOpenDialog={handleOpenDialog} />
            </Grid>
          )}
        </Grid>

        {!isSmallScreen && (
          <Grid container justifyContent="center" sx={{ mt: -10 }}>
            <Grid item xs={10} md={6}>
              <Jumbotron handleOpenDialog={handleOpenDialog} />
            </Grid>
          </Grid>
        )}

        {/* Updated Dialog Configuration */}
        <Dialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: "#1e1e1e",
              boxShadow: "none", // Remove any box shadow
              borderRadius: "8px",
              padding: 0, // Remove any padding that could add space around the dialog content
            },
          }}
          BackdropProps={{
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.95)", // Make the background overlay darker
            },
          }}
        >
          <Box
            sx={{
              padding: 0, // Remove any unnecessary padding
              textAlign: "center",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#1e1e1e",
              borderRadius: "8px",
              boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.6)", // Soft shadow to create focus
            }}
          >
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
            <AuthForm isSignUp={isSignUp} onClose={handleCloseDialog} />
          </Box>
        </Dialog>
      </Box>
    </>
  );
};

// Jumbotron component to be used for the main call-to-action section
const Jumbotron = ({ handleOpenDialog }) => {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "white",
        borderRadius: "8px",
        p: 4,
        textAlign: "center",
      }}
    >
      <Typography variant="h3" gutterBottom>
        Welcome to Crypto Portfolio Tracker
      </Typography>
      <Typography variant="body1" gutterBottom>
        Track and manage your cryptocurrency investments easily with our
        platform.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 2 }}
          onClick={() => handleOpenDialog(true)}
        >
          Get Started
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleOpenDialog(false)}
        >
          Log In
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
