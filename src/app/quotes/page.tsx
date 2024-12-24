"use client";

import Button from "@/components/Button";
import Pagination from "@/components/Pagination";
import Quote from "@/components/Quote";
import useAuth from "@/hooks/useAuth";
import { getCurrentUser } from "@/lib/auth";
import { fetchQuotes } from "@/lib/utils/quotes";
import { QuoteProps } from "@/types/QuoteProps";
import { useEffect, useState } from "react";

const Quotes = () => {
  const user = getCurrentUser();
  const { isLoggedIn } = useAuth();
  const [quotes, setQuotes] = useState<QuoteProps[]>([]);
  const [newAuthor, setNewAuthor] = useState<string>("");
  const [newContent, setNewContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch quotes
  const loadQuotes = async () => {
    const fetchedQuotes = await fetchQuotes();
    setQuotes(fetchedQuotes);
  };

  useEffect(() => {
    loadQuotes();
  }, [user]);

  // Add a new quote
  const handleAddQuote = async (newQuote: {
    content: string;
    author: string;
  }) => {
    try {
      setLoading(true);

      const token = await user?.getIdToken();

      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newQuote),
      });

      if (!response.ok) throw new Error("Failed to add quote.");

      await loadQuotes();
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
    };

    await handleAddQuote(newQuote);

    console.log("Quote added successfully.");
    setNewAuthor("");
    setNewContent("");
  };

  return (
    <section
      className="flex flex-col justify-center items-center"
      style={{ gap: "2rem" }}
    >
      {/* Header */}
      <div className="flex flex-col justify-center items-center">
        <h2 className="sub-header">Cytaty Tarnowskich Mafiozów</h2>
        <span className="text-gray-600 text-sm">(są zajebiste)</span>
      </div>

      {/* Add quote form */}
      {isLoggedIn && (
        <div className="flex flex-col justify-center items-center gap-4 w-full md:w-1/2">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center gap-4 p-4 w-full"
          >
            <div className="flex flex-col justify-center items-center gap-4 w-full">
              <input
                type="text"
                placeholder="Autor..."
                value={newAuthor}
                className="input"
                onChange={(e) => setNewAuthor(e.target.value)}
                required
              />
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
      <Pagination
        items={quotes}
        itemsPerPage={6}
        renderItem={(quote) => (
          <div key={quote.id} className="min-w-72 md:min-w-96">
            <Quote quote={quote} loadQuotes={loadQuotes} />
          </div>
        )}
      />
    </section>
  );
};

export default Quotes;
