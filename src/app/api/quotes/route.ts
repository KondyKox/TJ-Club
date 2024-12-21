import { addQuote, getQuotes } from "@/lib/utils/quotes";
import { NextResponse } from "next/server";

// Get all quotes
export async function GET() {
  try {
    const quotes = await getQuotes();
    return NextResponse.json(quotes);
  } catch (error: any) {
    console.error("Error during getting quotes: ", error);
    return NextResponse.error();
  }
}

// Add new quote
export async function POST(req: Request) {
  try {
    const { content, author, image } = await req.json();
    const quoteId = await addQuote(content, author, image);

    return NextResponse.json({ id: quoteId });
  } catch (error: any) {
    console.error("Error during adding quote: ", error);
    return NextResponse.error();
  }
}
