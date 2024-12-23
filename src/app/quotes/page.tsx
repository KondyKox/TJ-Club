"use client";

import Button from "@/components/Button";
import Quote from "@/components/Quote";
import useAuth from "@/hooks/useAuth";
import { getCurrentUser } from "@/lib/auth";
import { firebase } from "@/lib/firebaseConfig";
import { fetchQuotes } from "@/lib/utils/quotes";
import { QuoteProps } from "@/types/QuoteProps";
import { useEffect, useState } from "react";

const Quotes = () => {
  const user = getCurrentUser();
  const { isLoggedIn } = useAuth();
  const [quotes, setQuotes] = useState<QuoteProps[]>([]);
  const [newAuthor, setNewAuthor] = useState<string>("");
  const [newContent, setNewContent] = useState<string>("");
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [quotesPerPage, setQuotesPerPage] = useState<number>(6); // Default for desktop

  // Fetch quotes
  const loadQuotes = async () => {
    const fetchedQuotes = await fetchQuotes();
    setQuotes(fetchedQuotes);
  };

  useEffect(() => {
    loadQuotes();
  }, [user]);

  // Dynamiczna liczba cytatów w zależności od urządzenia
  useEffect(() => {
    const handleResize = () => {
      setQuotesPerPage(window.innerWidth < 768 ? 4 : 6); // 4 cytaty na mobile, 6 na desktop
    };

    handleResize(); // Ustaw na start
    window.addEventListener("resize", handleResize); // Nasłuchuj zmian

    return () => window.removeEventListener("resize", handleResize); // Usuń nasłuchiwacz
  }, []);

  // Add a new quote
  const handleAddQuote = async (newQuote: {
    content: string;
    author: string;
    image: string | null;
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
      image: newImageUrl,
    };

    await handleAddQuote(newQuote);

    console.log("Quote added successfully.");
    setNewAuthor("");
    setNewContent("");
    setNewImageUrl(null);
  };

  // Cytaty na aktualnej stronie
  const indexOfLastQuote = currentPage * quotesPerPage;
  const indexOfFirstQuote = indexOfLastQuote - quotesPerPage;
  const currentQuotes = quotes.slice(indexOfFirstQuote, indexOfLastQuote);

  const totalPages = Math.ceil(quotes.length / quotesPerPage);

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
        <div className="flex flex-col justify-center items-center gap-4">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center gap-4 p-2"
          >
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 p-2">
              <div className="flex flex-col justify-center items-center gap-2">
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
        {currentQuotes.map((quote) => (
          <div key={quote.id} className="min-w-72 md:min-w-96">
            <Quote quote={quote} loadQuotes={loadQuotes} />
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-2 mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className="page-btn"
            style={{
              backgroundColor:
                index + 1 === currentPage ? "var(--clr-akcent)" : "",
              color: index + 1 === currentPage ? "var(--clr-secondary)" : "",
            }}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </section>
  );
};

export default Quotes;
