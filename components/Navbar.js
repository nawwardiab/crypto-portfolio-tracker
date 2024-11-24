"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "@/services/firestoreService";
import { clearUser, selectUser } from "@/features/authSlice";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectUser);

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
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "1rem",
        background: "#333333",
      }}
    >
      <div>
        <Link href="/" style={{ color: "white", marginRight: "1rem" }}>
          Home
        </Link>
        {user && (
          <>
            <Link
              href="/portfolio"
              style={{ color: "white", marginRight: "1rem" }}
            >
              Portfolio
            </Link>
          </>
        )}
      </div>
      <div>
        {user && (
          <>
            <Link
              href="/profile"
              style={{ color: "white", marginRight: "1rem" }}
            >
              Profile
            </Link>
            <button
              onClick={handleSignOut}
              style={{
                padding: "0.5rem 1rem",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
