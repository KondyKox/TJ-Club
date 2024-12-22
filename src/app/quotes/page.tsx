"use client";

import Button from "@/components/Button";
import useAuth from "@/hooks/useAuth";
import { getCurrentUser } from "@/lib/auth";
import { collections } from "@/lib/firebaseConfig";
import { QuoteProps } from "@/types/QuoteProps";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";

const Quotes = () => {
  const user = getCurrentUser();
  const { isLoggedIn } = useAuth();
  const [quotes, setQuotes] = useState<QuoteProps[]>([]);
  const [newAuthor, setNewAuthor] = useState<string>("");
  const [newContent, setNewContent] = useState<string>("");
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch quotes
  const fetchQuotes = async () => {
    try {
      const response = await fetch("/api/quotes");
      const data: QuoteProps[] = await response.json();

      // Check if user liked a quote
      const updatedQuotes = data.map((quote) => ({
        ...quote,
        isLiked: user?.uid ? quote.likedBy.includes(user?.uid) : false,
      }));

      // Sort quotes by date
      const sortedQuotes = updatedQuotes.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setQuotes(sortedQuotes);
    } catch (error) {
      console.error("Error during fetching quotes: ", error);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [user]);

  // Like / Dislike a quote
  const handleLike = async (quote: QuoteProps) => {
    if (!isLoggedIn) return;

    const quoteRef = doc(collections.quotes, quote.id);

    try {
      if (quote.isLiked) {
        await updateDoc(quoteRef, {
          likes: quote.likes - 1,
          likedBy: user?.uid ? arrayRemove(user?.uid) : false,
        });
      } else {
        await updateDoc(quoteRef, {
          likes: quote.likes + 1,
          likedBy: user?.uid ? arrayUnion(user?.uid) : false,
        });
      }

      fetchQuotes();
      console.log(`${quote.isLiked ? "Dislike" : "Like"}`);
    } catch (error) {
      console.error("Error during liking quote: ", error);
    }
  };

  // Add a new quote
  const handleAddQuote = async (newQuote: {
    content: string;
    author: string;
    image: string | null;
  }) => {
    try {
      setLoading(true);

      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuote),
      });

      if (!response.ok) throw new Error("Failed to add quote.");

      await fetchQuotes();
    } catch (error) {
      console.error("Error during adding quote: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Submit a form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newQuote = {
      content: newContent,
      author: newAuthor,
      image: newImageUrl,
    };

    await handleAddQuote(newQuote);

    console.log("Quote added successfully.");
    setNewAuthor("");
    setNewContent("");
    setNewImageUrl(null);
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
      {isLoggedIn && (
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
                  value={newImageUrl || ""} // TODO: Fix this
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setNewImageUrl(URL.createObjectURL(file));
                  }}
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
            <Button className="border-2 border-button w-full">
              {!loading ? "Dodaj cytat" : "Dodawanie..."}
            </Button>
          </form>
        </div>
      )}

      {/* Quotes */}
      <div className="flex flex-col justify-center items-center md:grid md:grid-cols-2 md:place-items-center gap-4 p-2">
        {quotes.map((quote) => (
          <div
            key={quote.id}
            className="flex flex-col md:flex-row justify-center items-center gap-4 w-full bg-gray-950 p-6 rounded-lg"
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
                <span className="text-gray-500 text-xs md:text-sm">
                  ~ {quote.author}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2 text-xs text-gray-700">
                {/* Date */}
                <div className="flex gap-2">
                  Dodano:{" "}
                  <span className="text-red">
                    {new Date(quote.createdAt).toLocaleDateString("pl-PL", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
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
