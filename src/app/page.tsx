"use client";

import Quote from "@/components/Quote";
import { fetchQuotes } from "@/lib/utils/quotes";
import { QuoteProps } from "@/types/QuoteProps";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const images = ["/tj_club.png", "/plakacik_TJ.png", "/tj.jpg"]; // TODO: Replace with firebase images

export default function Home() {
  const [currentImages, setCurrentImages] = useState(images.slice(0, 3));
  const [quotes, setQuotes] = useState<QuoteProps[]>([]);
  const [currentQuotes, setCurrentQuotes] = useState<QuoteProps[]>([]);
  const [fade, setFade] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const loadQuotes = async () => {
    const fetchedQuotes = await fetchQuotes();
    setQuotes(fetchedQuotes);
    setCurrentQuotes(fetchedQuotes.slice(0, 3));
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
      <div className="flex flex-col justify-center items-center w-full overline-top gap-20">
        <div className="flex flex-col md:flex-row justify-center items-center w-full gap-4">
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
            <h2 className="sub-header">Tu nasz albumik</h2>
            <p className="text-sm text-akcent pb-2">
              Zdjęcia Tarnowskiej Mafii
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center w-full md:w-1/2">
            <div
              className={`flex ${
                isDesktop ? "flex-row" : "flex-col"
              } relative pt-4`}
            >
              {currentImages.map((imgSrc, index) => (
                <Link
                  href={"/album"}
                  key={index}
                  className={`transition-opacity duration-500 ease-in-out ${
                    fade
                      ? "opacity-0"
                      : index === 0
                      ? "opacity-100"
                      : "opacity-50"
                  } ${index === 0 && "drop-shadow-button"}`}
                  style={{
                    zIndex: currentImages.length - index,
                    marginLeft:
                      isDesktop && index > 0 ? `-${index * 70}px` : "0",
                    marginTop:
                      !isDesktop && index > 0 ? `-${index * 70}px` : "0", // mobile
                  }}
                >
                  <Image
                    src={imgSrc}
                    alt={`Image ${index + 1}`}
                    width={256}
                    height={256}
                    className="p-2 rounded-3xl"
                    style={{ aspectRatio: "16/10" }}
                    loading="lazy"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <p className="text-xl">
            Więcej zdjęć na{" "}
            <Link href={"/album"} className="link">
              stronie albumu
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Quotes */}
      <div className="flex flex-col justify-center items-center w-full overline-top gap-20">
        <div className="flex flex-col md:flex-row-reverse justify-around items-center w-full gap-4">
          <div className="flex flex-col justify-center items-center">
            <h2 className="sub-header">Cytaty</h2>
            <p className="text-sm text-akcent pb-2">Cytaty wielkich ludzi</p>
          </div>
          <div
            className={`flex pt-4 ${
              isDesktop ? "flex-row-reverse" : "flex-col"
            } relative`}
          >
            {currentQuotes.map((quote, index) => (
              <Link
                href={"/quotes"}
                key={quote.id}
                className={`min-w-72 transition-opacity duration-500 ease-in-out ${
                  fade
                    ? "opacity-0"
                    : index === 0
                    ? "opacity-100"
                    : "opacity-50"
                } ${index === 0 && "drop-shadow-button"}`}
                style={{
                  zIndex: currentQuotes.length - index,
                  marginRight:
                    isDesktop && index > 0 ? `-${index * 70}px` : "0",
                  marginTop: !isDesktop && index > 0 ? `-${index * 70}px` : "0", // mobile
                }}
              >
                <Quote quote={currentQuotes[index]} loadQuotes={loadQuotes} />
              </Link>
            ))}
          </div>
        </div>
        <div className="flex justify-center items-center p-2">
          <p className="text-xl text-center">
            Więcej cytatów na{" "}
            <Link href={"/quotes"} className="link">
              stronie wielkich cytatów
            </Link>
            .
          </p>
        </div>
      </div>

      {/* TODO:  Dodać inne sekcje, jak będą robione ich strony*/}
    </section>
  );
}
