import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { firebase } from "../firebaseConfig";
import { QuoteProps } from "@/types/QuoteProps";

// Get all quotes
export const getQuotes = async (): Promise<QuoteProps[]> => {
  const quotesCollection = collection(firebase.db, "quotes");
  const snapshot = await getDocs(quotesCollection);

  return snapshot.docs.map((doc) => {
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
      isLiked: false,
    };
  });
};

// Add new quote
export const addQuote = async (
  content: string,
  author: string,
  image: File | null
) => {
  try {
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

    const docRef = await addDoc(collection(firebase.db, "quotes"), {
      content,
      author,
      image: imageUrl,
      createdAt: new Date(),
      likes: 0,
    });

    console.log("Added quote with ID: ", docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error("Error during adding quote: ", error);
  }
};
