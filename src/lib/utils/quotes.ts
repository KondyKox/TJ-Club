import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { firebase } from "../firebaseConfig";

// Add new quote
export const addQuote = async (
  content: string,
  authorID: string,
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
      authorID,
      image: imageUrl,
      createdAt: serverTimestamp(),
      likes: [],
      comments: [],
    });

    console.log("Added quote with ID: ", docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error("Error during adding quote: ", error);
  }
};

// Get mafia members to select quote author
export const getAuthors = async () => {
  const querySnapshot = await getDocs(collection(firebase.db, "mafia_members"));
  const authors = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return authors;
};
