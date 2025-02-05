"use client";

import Button from "@/components/ui/Button";
import LoadingOverlay from "@/components/layout/Loading";
import Pagination from "@/components/features/Pagination";
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
  const [saving, setSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch quotes
  const loadQuotes = async () => {
    try {
      const fetchedQuotes = await fetchQuotes();
      setQuotes(fetchedQuotes);
    } catch (error: unknown) {
      if (error instanceof Error)
        console.error("Error during fetching quotes: ", error);
    } finally {
      setLoading(false);
    }
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
      setSaving(true);

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
    } catch (error: unknown) {
      if (error instanceof Error)
        console.error("Error during adding quote: ", error);
    } finally {
      setSaving(false);
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

  if (loading) return <LoadingOverlay message="Wczytywanie mądrych słów..." />;

  return (
    <section
      className="flex flex-col justify-center items-center"
      style={{ gap: "2rem" }}
    >
      {/* Header */}
      <div className="flex flex-col justify-center items-center">
        <h2 className="sub-header">Mądre mądrości</h2>
        <span className="text-gray-600 text-sm">(są zajebiste)</span>
      </div>

      {/* Add quote form */}
      {isLoggedIn && (
        <div className="flex flex-col justify-center items-center gap-4 w-full md:w-1/3">
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
                placeholder="Kontent..."
                value={newContent}
                className="input min-w-full md:min-w-72 min-h-24"
                onChange={(e) => setNewContent(e.target.value)}
                required
              ></textarea>
            </div>
            <Button className="border-2 border-button w-full" loading={saving}>
              Dodaj
            </Button>
          </form>
        </div>
      )}

      {/* Quotes */}
      <div className="flex flex-col justify-center items-center gap-4 mt-4 w-full p-2 overline-top">
        <Pagination
          items={quotes}
          itemsPerPage={6}
          renderItem={(quote) => (
            <div key={quote.id} className="min-w-72 md:min-w-96">
              <Quote quote={quote} loadQuotes={loadQuotes} />
            </div>
          )}
        />
      </div>
    </section>
  );
};

export default Quotes;
