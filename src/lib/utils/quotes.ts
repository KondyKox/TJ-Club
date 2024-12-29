import { QuoteProps } from "@/types/QuoteProps";
import { getCurrentUser } from "../auth";

// Fetch quotes
export const fetchQuotes = async () => {
  try {
    const user = getCurrentUser();

    const response = await fetch("/api/quotes");
    const data: QuoteProps[] = await response.json();

    // Check if user liked a quote
    const updatedQuotes = data.map((quote) => ({
      ...quote,
      isLiked: user?.uid ? quote.likedBy.includes(user?.uid) : false,
    }));

    // Sort quotes by date
    return updatedQuotes.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error: unknown) {
    if (error instanceof Error)
      console.error("Error during fetching quotes: ", error);
    return [];
  }
};
