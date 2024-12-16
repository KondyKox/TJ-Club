"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const images = [
  "/tj_club.png",
  "/plakacik_TJ.png",
  "/tj.jpg",
  "/plakacik_TJ.png",
];

export default function Home() {
  const [currentImages, setCurrentImages] = useState(images.slice(0, 3));
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Fade animation for images
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
    <section className="flex flex-col justify-center items-center mt-10 gap-20">
      <div className="flex flex-col lg:flex-row justify-center items-center gap-2 md:gap-12">
        <h1 className="header">Tarnowska Mafia</h1>
        <Image
          src={"/tj.jpg"}
          alt="Tarnowska Mafia"
          width={512}
          height={512}
          className="lg:max-w-md xl:max-w-2xl md:w-full p-2 rounded-3xl hover:rounded-none transition-all duration-300 ease-in-out drop-shadow-button"
          priority
        />
      </div>

      {/* Album section */}
      <div className="flex flex-col md:flex-row justify-center items-center w-full overline-top">
        <div className="w-full md:w-1/2 mb-2 flex flex-col justify-center items-center">
          <h2 className="sub-header" style={{ paddingBottom: 0 }}>
            Tu nasz albumik
          </h2>
          <p className="text-sm text-akcent pb-2">Zdjęcia Tarnowskiej Mafii</p>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center w-full md:w-1/2 relative">
          {currentImages.map((imgSrc, index) => (
            <Link
              href={"/album"}
              key={index}
              className={`absolute md:relative transition-all duration-500 ease-in-out ${
                fade ? "opacity-0" : index === 0 ? "opacity-100" : "opacity-50"
              } ${index === 0 && "drop-shadow-button"}`}
              style={{
                zIndex: currentImages.length - index, // Kolejność obrazów
                transform:
                  window.innerWidth >= 768
                    ? `translateX(-${index * 150}px)` // Przesunięcie w poziomie na md+
                    : `translateY(${index * 30}px)`, // Przesunięcie w pionie na mobilnych
              }}
            >
              <Image
                src={imgSrc}
                alt={`Image ${index + 1}`}
                width={256}
                height={256}
                className="md:min-w-48 p-2 rounded-3xl"
                style={{ aspectRatio: "16/10" }}
                loading="lazy"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="flex justify-center items-center pb-2">
        <p className="text-xl">
          Więcej zdjęć na{" "}
          <Link href={"/album"} className="text-interaction">
            stronie albumu
          </Link>
          .
        </p>
      </div>

      {/* TODO:  Dodać inne sekcje, jak będą robione ich strony*/}
    </section>
  );
}
