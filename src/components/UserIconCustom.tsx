import Link from "next/link";
import React from "react";
import Button from "./Button";
import { UserIcon } from "@heroicons/react/24/solid";
import UserIconProps from "@/types/UserIconProps";
import useAuth from "@/hooks/useAuth";

const UserIconCustom: React.FC<UserIconProps> = ({ children, onClick }) => {
  const { isLoggedIn } = useAuth();

  return (
    <Link href={isLoggedIn ? "/user" : "/login"}>
      <Button
        onClick={onClick}
        noHover={true}
        className="relative hover:text-button hover:drop-shadow-button"
      >
        {children}
        <UserIcon className="h-10 w-10" />
      </Button>
    </Link>
  );
};

export default UserIconCustom;
