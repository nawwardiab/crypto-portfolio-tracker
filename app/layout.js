// app/layout.js

import "../styles/globals.css";
import ClientProvider from "../components/ClientProvider";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProvider>
          <Navbar />
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}
