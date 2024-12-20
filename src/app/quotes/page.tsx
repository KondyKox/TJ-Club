"use client";

import { QuoteProps } from "@/types/QuoteProps";
import Image from "next/image";
import { useEffect, useState } from "react";

const Quotes = () => {
  const [quotes, setQuotes] = useState<QuoteProps[]>([]);

  //   Testing
  const initialQuotes: QuoteProps[] = [
    {
      id: 1,
      content: "komu w drogę temu chuj pod nogę",
      imageUrl: "/plakacik_TJ.png",
      author: "Olga i Wika",
      likes: 0,
      isLiked: false,
    },
    {
      id: 2,
      content: "przestan pawianić",
      imageUrl: "/tj_club.png",
      author: "Olga i Wika",
      likes: 10,
      isLiked: false,
    },
  ];

  useEffect(() => {
    setQuotes(initialQuotes);
  }, []);

  // Like / Dislike a quote
  const handleLike = (quote: QuoteProps) => {
    console.log(`${quote.isLiked ? "Dislike" : "Like"}`);
    setQuotes((prev) =>
      prev.map((q) =>
        q === quote
          ? {
              ...q,
              likes: q.isLiked ? q.likes - 1 : q.likes + 1,
              isLiked: !q.isLiked,
            }
          : q
      )
    );
  };

  return (
    <section
      className="flex flex-col justify-center items-center"
      style={{ gap: "2rem" }}
    >
      <div className="flex flex-col justify-center items-center">
        <h2 className="sub-header" style={{ paddingBottom: "0" }}>
          Cytaty Tarnowskich Mafiozów
        </h2>
        <span className="text-gray-600 text-sm">(są zajebiste)</span>
      </div>
      <div className="p-2 flex flex-col justify-center items-center gap-2">
        {quotes.map((quote) => (
          <div
            key={quote.id}
            className="flex justify-center items-center gap-2 w-full p-2"
          >
            <Image
              src={quote.imageUrl}
              alt={`Cytat od ${quote.author}`}
              width={256}
              height={256}
              className="rounded w-32"
            />
            <div className="flex flex-col gap-2 w-full max-w-1/2">
              <p className="text-akcent font-bold italic text-wrap">
                "{quote.content}"
              </p>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">~ {quote.author}</span>
                <button onClick={() => handleLike(quote)}>
                  {quote.isLiked ? "❤️" : "♡"} {quote.likes}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Quotes;
