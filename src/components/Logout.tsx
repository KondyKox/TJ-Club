import React from "react";
import { logoutUser } from "../lib/auth";
import Button from "./Button";

const Logout = () => {
  const handleLogout = async () => {
    try {
      await logoutUser();
      console.log("Logout successful!");
    } catch (err: any) {
      console.error("Logout error:", err.message);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      className="border-2 border-red hover:bg-red hover:drop-shadow-red"
    >
      Wyloguj się
    </Button>
  );
};

export default Logout;
