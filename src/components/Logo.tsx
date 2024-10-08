import Image from "next/image";
import Link from "next/link";
import React from "react";

// Just the Logo component
const Logo: React.FC = () => {
  return (
    <div className="hover:scale-125 hover:drop-shadow-custom transition-all duration-300 ease-in-out">
      <Link href="/">
        <Image
          className="w-20 sm:w-24 md:w-24 lg:w-28"
          src="/logo.svg"
          alt="Logo"
          width={120}
          height={60}
        />
      </Link>
    </div>
  );
};

export default Logo;
