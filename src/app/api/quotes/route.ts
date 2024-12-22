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
    const { content, author, image } = await req.json();
    let imageUrl = "";

    // If quote has image - upload image
    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "tj_quotes");

      // Upload image to cloudinary
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await uploadResponse.json();
      imageUrl = data.secure_url;
    }

    const docRef = await addDoc(collections.quotes, {
      content,
      author,
      image: imageUrl,
      createdAt: new Date(),
      likes: 0,
      likedBy: [],
    });

    console.log("Added quote with ID: ", docRef.id);
    return NextResponse.json({ id: docRef.id });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to add quote" }, { status: 500 });
  }
}
