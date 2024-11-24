// app/layout.js

"use client";

import "../styles/globals.css";
import { CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";
import { ThemeProvider as CustomThemeProvider } from "@/components/theme/ThemeContext";
import ClientProvider from "../components/ClientProvider";
import Navbar from "@/components/Navbar";
import muiTheme from "@/components/theme/theme"; // Import your custom MUI theme

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Custom theme provider for toggling between light/dark mode */}
        <CustomThemeProvider>
          {/* MUI theme provider for consistent Material UI styling */}
          <MuiThemeProvider theme={muiTheme}>
            {/* Ensures consistent baseline styling for all MUI components */}
            <CssBaseline />
            {/* Context provider for Firebase authentication and other client data */}
            <ClientProvider>
              <Navbar />
              {children}
            </ClientProvider>
          </MuiThemeProvider>
        </CustomThemeProvider>
      </body>
    </html>
  );
}
