"use client"; // For NextJS - indicates it's client-side

import Link from "next/link";
import React, { useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/solid";
import Button from "./Button";
import Logo from "./Logo";
import UserIconCustom from "./UserIconCustom";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="w-full flex justify-center items-center px-4 py-2">
      <div className="w-full max-w-5xl flex justify-between items-center">
        {/* Logo with link to Home page */}
        <Logo />

        {/* Buttons for desktop */}
        <div className="hidden md:flex space-x-12 text-xl">
          <Link href="/gaming">
            <Button>Gaming</Button>
          </Link>
          <Link href="/album">
            <Button>Album</Button>
          </Link>
        </div>

        {/* User icon for desktop */}
        <div className="hidden md:flex">
          <UserIconCustom />
        </div>

        {/* Buttons for mobile */}
        <div className="z-50 md:hidden">
          <Button onClick={toggleMenu} noHover={true}>
            <Bars3Icon className="h-10 w-10" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-opacity-90 z-40 flex flex-col justify-center items-center space-y-4 bg-primary">
          <div className="relative flex flex-col items-center">
            <Logo />
            <span className="underline-custom mt-8"></span>
          </div>

          <Link href="/gaming">
            <Button onClick={toggleMenu} className="text-2xl py-1">
              Gaming
            </Button>
          </Link>
          <Link href="/album">
            <Button onClick={toggleMenu} className="text-2xl py-1">
              Album
            </Button>
          </Link>

          {/* User icon */}
          <UserIconCustom>
            <Button
              onClick={toggleMenu}
              noHover={true}
              className="mb-4 relative"
            >
              <span className="underline-custom"></span>
            </Button>
          </UserIconCustom>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
