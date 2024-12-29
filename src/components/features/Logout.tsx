"use client";

import { useState } from "react";
import { logoutUser } from "../../lib/auth";
import Button from "../ui/Button";
import { useRouter } from "next/navigation";

const Logout = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      console.log("Logout successful!");
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof Error) console.error("Logout error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={loading}
      className="border-2 border-red px-8 font-bold bg-red hover:bg-red hover:drop-shadow-red"
    >
      {loading ? "Wylogowywanie..." : "Wyloguj się"}
    </Button>
  );
};

export default Logout;
