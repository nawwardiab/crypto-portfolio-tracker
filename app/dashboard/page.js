"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Portfolio from "@/components/Portfolio";

const DashboardPage = () => {
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/"); // Redirect to the home page if not authenticated
    }
  }, [user, router]);

  return (
    <div>
      {user ? (
        <>
          <h1>Welcome, {user.email}!</h1>
          <Portfolio />
        </>
      ) : (
        <p>Redirecting to login...</p>
      )}
    </div>
  );
};

export default DashboardPage;
