"use client";

import Button from "@/components/Button";
import useAuth from "@/hooks/useAuth";
import { QuoteProps } from "@/types/QuoteProps";
import Image from "next/image";
import { useEffect, useState } from "react";

const Quotes = () => {
  const user = useAuth();
  const [quotes, setQuotes] = useState<QuoteProps[]>([]);
  const [newAuthor, setNewAuthor] = useState<string>("");
  const [newContent, setNewContent] = useState<string>("");
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);

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
    {
      id: 3,
      content: "przestan pawianić",
      imageUrl: "/tj_club.png",
      author: "Olga i Wika",
      likes: 10,
      isLiked: false,
    },
    {
      id: 4,
      content: "przestan pawianić",
      imageUrl: null,
      author: "Olga i Wika",
      likes: 10,
      isLiked: false,
    },
    {
      id: 5,
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

  // Add a new quote
  const handleAddQuote = (
    newQuote: Omit<QuoteProps, "id" | "likes" | "isLiked">
  ) => {
    console.log("Add quote");
    setQuotes((prev) => [
      ...prev,
      {
        ...newQuote,
        id: prev.length + 1,
        likes: 0,
        isLiked: false,
      },
    ]);
  };

  // Submit a form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submit form");
    handleAddQuote({
      author: newAuthor,
      content: newContent,
      imageUrl: newImageUrl,
    });

    // Reset
    setNewAuthor("");
    setNewContent("");
    setNewImageUrl("");
  };

  return (
    <section
      className="flex flex-col justify-center items-center"
      style={{ gap: "2rem" }}
    >
      {/* Header */}
      <div className="flex flex-col justify-center items-center">
        <h2 className="sub-header" style={{ paddingBottom: "0" }}>
          Cytaty Tarnowskich Mafiozów
        </h2>
        <span className="text-gray-600 text-sm">(są zajebiste)</span>
      </div>

      {/* Add quote form */}
      {user.isLoggedIn && (
        <div className="flex flex-col justify-center items-center gap-4">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center gap-4"
          >
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 p-2">
              <div className="flex flex-col justify-center items-center gap-4">
                <input
                  type="file"
                  className="input"
                  value={newImageUrl || ""}
                  // onChange={(e) =>
                  //   setNewImageUrl(URL.createObjectURL(e.target.files?.[0] || null))
                  // }
                />
                <input
                  type="text"
                  placeholder="Autor..."
                  value={newAuthor}
                  className="input"
                  onChange={(e) => setNewAuthor(e.target.value)}
                  required
                />
              </div>
              <textarea
                placeholder="Dodaj cytat..."
                value={newContent}
                className="input min-w-full md:min-w-72 min-h-24"
                onChange={(e) => setNewContent(e.target.value)}
                required
              ></textarea>
            </div>
            <Button className="border-2 border-button">Dodaj cytat</Button>
          </form>
        </div>
      )}

      {/* Quotes */}
      <div className="p-2 flex flex-col justify-center items-center gap-2 border-b-2 border-interaction">
        {quotes.map((quote) => (
          <div
            key={quote.id}
            className="flex flex-col md:flex-row justify-center items-center gap-4 w-full p-4 border-t-2 border-interaction"
          >
            <div className="flex justify-around items-center gap-4 w-full md:w-max">
              {quote.imageUrl && (
                <Image
                  src={quote.imageUrl}
                  alt={`Cytat od ${quote.author}`}
                  width={256}
                  height={256}
                  className="rounded w-56"
                />
              )}
            </div>
            {/* Quote content */}
            <div className="flex flex-col gap-2 w-full max-w-1/2">
              <p className="text-akcent font-bold italic text-wrap text-sm md:text-lg">
                "{quote.content}"
              </p>
              <div className="flex justify-between items-center w-full">
                <span className="text-gray-600 text-xs md:text-sm">
                  ~ {quote.author}
                </span>

                {/* Likes */}
                <div
                  className="flex md:justify-center items-center gap-2 text-sm md:text-base cursor-pointer transition-all duration-300 ease-in-out hover:text-red"
                  onClick={() => handleLike(quote)}
                >
                  <span className={`${quote.isLiked && "text-red"}`}>
                    {quote.likes}
                  </span>
                  <Image
                    src={"/ano_vodka.svg"}
                    alt="Polubienia"
                    width={64}
                    height={64}
                    className={`max-w-1.5 md:max-w-2 transition-all duration-300 ease-in-out ${
                      quote.isLiked ? "drop-shadow-red" : ""
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Quotes;
