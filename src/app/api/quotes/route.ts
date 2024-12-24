import { adminAuth } from "@/lib/firebaseAdmin";
import { collections } from "@/lib/firebaseConfig";
import { addDoc, getDocs, orderBy, query } from "firebase/firestore";
import { NextResponse } from "next/server";

// Get all quotes
export async function GET() {
  try {
    // Tworzenie zapytania sortującego po polu `createdAt` w porządku malejącym
    const quotesQuery = query(collections.quotes, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(quotesQuery);

    const quotes = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        content: data.content as string,
        imageUrl: data.image as string | null,
        author: data.author as string,
        createdAt:
          data.createdAt instanceof Date
            ? data.createdAt
            : new Date(data.createdAt.seconds * 1000),
        likes: data.likes as number,
        likedBy: data.likedBy || [],
      };
    });

    return NextResponse.json(quotes);
  } catch (error: any) {
    console.error("Error during getting quotes: ", error);
    return NextResponse.error();
  }
}

// Add new quote
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer "))
      throw new Error("No authorization token.");

    const token = authHeader.split(" ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);

    const { uid } = decodedToken; // User's UID

    const { content, author } = await req.json();

    const docRef = await addDoc(collections.quotes, {
      content,
      author,
      createdAt: new Date(),
      addedBy: uid,
      likes: 0,
      likedBy: [],
    });

    console.log("Added quote with ID: ", docRef.id);
    return NextResponse.json({ id: docRef.id });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to add quote" }, { status: 500 });
  }
}
