"use client";

import AlbumSection from "@/components/layout/AlbumSection";
import LoadingOverlay from "@/components/layout/Loading";
import QuotesSection from "@/components/layout/QuotesSection";
import { fetchQuotes } from "@/lib/utils/quotes";
import { ImageProps } from "@/types/ImageProps";
import { QuoteProps } from "@/types/QuoteProps";
import Image from "next/image";
import { useEffect, useState } from "react";

const testImages = [
  {
    id: "1",
    src: "/tj_club.png",
    title: "Chuj",
    likes: 0,
    isLiked: false,
    createdAt: new Date(),
  },
  {
    id: "2",
    src: "/plakacik_TJ.png",
    title: "Chuj",
    likes: 0,
    isLiked: false,
    createdAt: new Date(),
  },
  {
    id: "3",
    src: "/tj.jpg",
    title: "Chuj",
    likes: 0,
    isLiked: false,
    createdAt: new Date(),
  },
]; // TODO: Replace with firebase images

export default function Home() {
  const [currentImages, setCurrentImages] = useState<ImageProps[]>(
    testImages.slice(0, 3)
  );
  const [currentQuotes, setCurrentQuotes] = useState<QuoteProps[]>([]);
  const [fade, setFade] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch quotes
  const loadQuotes = async () => {
    try {
      const fetchedQuotes = await fetchQuotes();
      setCurrentQuotes(fetchedQuotes.slice(0, 3));
    } catch (error) {
      console.error("Error during fetching quotes: ", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadQuotes();
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
        <h1 className="header">Tarnowska Mafia</h1>
        <Image
          src={"/tj.jpg"}
          alt="Tarnowska Mafia"
          width={512}
          height={512}
          className="lg:max-w-md xl:max-w-2xl md:w-full p-2 rounded-3xl hover:rounded-none transition-all duration-300 
                      ease-in-out drop-shadow-button"
          priority
        />
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
