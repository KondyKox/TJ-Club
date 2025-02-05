"use client";

import AlbumSection from "@/components/layout/AlbumSection";
import LoadingOverlay from "@/components/layout/Loading";
import QuotesSection from "@/components/layout/QuotesSection";
import MainImage from "@/components/ui/MainImage";
import { getImages } from "@/lib/utils/album";
import { fetchQuotes } from "@/lib/utils/quotes";
import { ImageProps } from "@/types/ImageProps";
import { QuoteProps } from "@/types/QuoteProps";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [currentImages, setCurrentImages] = useState<ImageProps[]>([]);
  const [currentQuotes, setCurrentQuotes] = useState<QuoteProps[]>([]);
  const [fade, setFade] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch quotes
  const loadQuotes = async () => {
    try {
      const fetchedQuotes = await fetchQuotes();
      setCurrentQuotes(fetchedQuotes.slice(0, 3));
    } catch (error: unknown) {
      if (error instanceof Error)
        console.error("Error during fetching quotes: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch images
  const loadImages = async () => {
    try {
      const fetchedImages = await getImages();
      setCurrentImages(fetchedImages.slice(0, 3));
    } catch (error) {
      console.error("Error during fetching quotes: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes();
    loadImages();
  }, []);

  useEffect(() => {
    // Sprawdź szerokość okna tylko w przeglądarce
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize(); // Ustaw na początku
    window.addEventListener("resize", handleResize); // Nasłuchuj zmian rozmiaru

    return () => window.removeEventListener("resize", handleResize); // Usuń nasłuchiwacz
  }, []);

  useEffect(() => {
    // Fade animation for images and quotes
    const interval = setInterval(() => {
      setFade(true); // Start fade out
      setTimeout(() => {
        // Change images
        setCurrentImages((prevImages) => {
          const updatedImages = [...prevImages];
          const firstImage = updatedImages.shift();
          if (firstImage) updatedImages.push(firstImage);
          return updatedImages;
        });

        // Change quotes
        setCurrentQuotes((prevQuotes) => {
          const updatedQuotes = [...prevQuotes];
          const firstQuote = updatedQuotes.shift();
          if (firstQuote) updatedQuotes.push(firstQuote);
          return updatedQuotes;
        });

        setFade(false); // Start fade in
      }, 500); // Duration of fade-out before switching images
    }, 3000); // Change images every 3 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingOverlay />;

  return (
    <section className="flex flex-col justify-center items-center mt-10 gap-20">
      <div className="flex flex-col lg:flex-row justify-center items-center gap-2 md:gap-12">
        <div className="relative">
          <h1 className="header z-10 relative">Tarnowska Mafia</h1>
          <Image
            src={"/kondy.svg"}
            alt="Jezus"
            width={256}
            height={256}
            priority
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 opacity-70 w-32 md:w-72"
          />
        </div>
        <MainImage fade={fade} />
      </div>

      {/* Album section */}
      <AlbumSection images={currentImages} fade={fade} isDesktop={isDesktop} />

      {/* Quotes section */}
      <QuotesSection
        quotes={currentQuotes}
        loadQuotes={loadQuotes}
        fade={fade}
        isDesktop={isDesktop}
      />

      {/* TODO:  Dodać inne sekcje, jak będą robione ich strony*/}
    </section>
  );
}
