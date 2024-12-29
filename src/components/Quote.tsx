"use client";

import { QuoteProps } from "@/types/QuoteProps";
import Likes from "./features/Likes";
import { doc } from "firebase/firestore";
import { collections } from "@/lib/firebaseConfig";
import useAuth from "@/hooks/useAuth";
import { handleLike } from "@/lib/utils/handleLike";

const Quote = ({
  quote,
  loadQuotes,
}: {
  quote: QuoteProps;
  loadQuotes: () => void;
}) => {
  const isLoggedIn = useAuth();

  // Like / Dislike a quote
  const handleLikeClick = async (quote: QuoteProps) => {
    if (!isLoggedIn) return;

    const quoteRef = doc(collections.quotes, quote.id);

    await handleLike({
      item: quote,
      collectionRef: quoteRef,
      loadItems: loadQuotes,
    });
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-4 w-full gradient-bg p-6 rounded-lg">
      {/* Quote content */}
      <div className="flex flex-col gap-2 w-full max-w-1/2">
        <p className="text-akcent font-bold italic text-wrap text-sm md:text-lg">
          &quot;{quote.content}&quot;
        </p>
        <div className="flex justify-between items-center w-full">
          <span className="text-gray-500 text-xs md:text-sm">
            ~ {quote.author}
          </span>
        </div>
        <div className="flex justify-between items-center gap-2 text-xs text-gray-400">
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
          <Likes element={quote} handleLike={() => handleLikeClick(quote)} />
        </div>
      </div>
    </div>
  );
};

export default Quote;
