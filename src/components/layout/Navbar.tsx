"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/solid";
import Button from "../ui/Button";
import Logo from "../ui/Logo";
import UserIconCustom from "../ui/UserIconCustom";

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
          <Link href="/album">
            <Button>Album</Button>
          </Link>
          <Link href="/quotes">
            <Button>Mądrości</Button>
          </Link>
          {/* <Link href="/gaming">
            <Button>Gaming</Button>
          </Link> */}
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
        <div className="fixed inset-0 bg-opacity-90 z-40 flex flex-col justify-center items-center gap-8 bg-primary">
          <Logo />
          <span className="overline-top w-1/2"></span>

          <div className="flex flex-col justify-center items-center gap-2">
            <Link href="/album">
              <Button onClick={toggleMenu} className="text-2xl py-1">
                Album
              </Button>
            </Link>
            <Link href="/quotes">
              <Button onClick={toggleMenu} className="text-2xl py-1">
                Mądrości
              </Button>
            </Link>
            {/* <Link href="/gaming">
            <Button onClick={toggleMenu} className="text-2xl py-1">
              Gaming
            </Button>
          </Link> */}
          </div>

          {/* User icon */}
          <span className="underline-custom w-1/2"></span>
          <UserIconCustom />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
