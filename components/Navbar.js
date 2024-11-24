// components/Navbar.js

"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "@/services/firestoreService";
import { clearUser, selectUser } from "@/features/authSlice";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { useTheme } from "./theme/ThemeContext";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectUser);
  const { theme, toggleTheme } = useTheme();

  // Function to handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      router.push("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, color: "primary.main" }}>
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            Home
          </Link>
        </Typography>
        {user && (
          <>
            <Typography variant="h6" sx={{ marginRight: 2 }}>
              <Link
                href="/portfolio"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Portfolio
              </Link>
            </Typography>
          </>
        )}
        <Box>
          <IconButton onClick={toggleTheme} color="inherit">
            {theme === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
          {user && (
            <>
              <Link
                href="/profile"
                style={{
                  color: "inherit",
                  textDecoration: "none",
                  marginRight: "1rem",
                }}
              >
                <Button color="inherit">Profile</Button>
              </Link>
              <Button
                onClick={handleSignOut}
                color="secondary"
                variant="contained"
                sx={{ ml: 2 }}
              >
                Sign Out
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
