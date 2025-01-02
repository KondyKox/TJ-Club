"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const images = [
  { src: "wakacje2024.webp", alt: "Wakacje 2024" },
  { src: "sylwester2024.webp", alt: "Sylwester 2024" },
];

const MainImage = ({ fade }: { fade: boolean }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (fade) {
      // Zmieniamy zdjęcie po krótkim czasie, by zsynchronizować z animacją fade
      const timeout = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 500); // Czas trwania fade (w ms)

      return () => clearTimeout(timeout); // Czyścimy timeout, by uniknąć wycieków
    }
  }, [fade]);

  const currentImage = images[currentIndex];

  return (
    <Image
      src={`/main_images/${currentImage.src}`}
      alt="Tarnowska Mafia"
      width={512}
      height={512}
      priority
      className={`lg:max-w-md xl:max-w-2xl md:w-full p-2 rounded-3xl hover:rounded-none transition-all duration-500 ease-in-out drop-shadow-button ${
        fade ? "opacity-0" : "opacity-100"
      }`}
    />
  );
};

export default MainImage;
