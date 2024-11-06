"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const images = [
    "/tj_club.png",
    "/plakacik_TJ.png",
    "/tj.jpg",
    "/plakacik_TJ.png",
  ];
  const [currentImages, setCurrentImages] = useState(images.slice(0, 2));
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true); // Start fade out
      setTimeout(() => {
        setCurrentImages((prevImages) => {
          const updatedImages = [...prevImages];
          const firstImage = updatedImages.shift();
          if (firstImage) updatedImages.push(firstImage);
          return updatedImages;
        });
        setFade(false); // Start fade in
      }, 500); // Duration of fade-out before switching images
    }, 3000); // Change images every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center mt-10 gap-20">
      <div className="flex flex-col lg:flex-row justify-center items-center gap-2 md:gap-12">
        <h1 className="header">Tarnowska Mafia</h1>
        <Image
          src={"/tj.jpg"}
          alt="Tarnowska Mafia"
          width={512}
          height={512}
          className="lg:max-w-md xl:max-w-2xl md:w-full p-2 rounded-3xl hover:rounded-none transition-all duration-300 ease-in-out drop-shadow-button"
        />
      </div>
      <div className="flex flex-col justify-center items-center w-full">
        <h2 className="sub-header">Tu nasz albumik</h2>
        <div className="w-full grid place-items-center md:grid-cols-2">
          {currentImages.map((imgSrc, index) => (
            <Link href={"/album"} key={index}>
              <Image
                src={imgSrc}
                alt={`Image ${index + 1}`}
                width={256}
                height={256}
                className={`md:max-w-md p-2 rounded-3xl transition-all duration-500 ease-in-out drop-shadow-button ${
                  fade ? "opacity-0" : "opacity-100"
                }`}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
