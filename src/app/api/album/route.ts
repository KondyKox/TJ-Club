import { adminAuth } from "@/lib/firebaseAdmin";
import { collections, firebase } from "@/lib/firebaseConfig";
import { CommentProps } from "@/types/CommentProps";
import { addDoc, getDocs, orderBy, query } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  console.log("GET /api/album");
  try {
    // Tworzenie zapytania sortującego po polu `createdAt` w porządku malejącym
    const imagesQuery = query(collections.album, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(imagesQuery);

    const images = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        author: data.addedBy as string,
        src: data.src as string,
        title: data.title as string,
        comments: data.comments as CommentProps[],
        likes: data.likes as number,
        likedBy: data.likedBy || [],
        createdAt:
          data.createdAt instanceof Date
            ? data.createdAt
            : new Date(data.createdAt.seconds * 1000),
      };
    });

    return NextResponse.json(images);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error during getting images: ", error);
      return NextResponse.error();
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer "))
      throw new Error("No authorization token.");

    const token = authHeader.split(" ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const { uid } = decodedToken; // User's UID

    // Wczytanie danych z FormData
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;

    // Tworzenie referencji do pliku w Firebase Storage
    const storageRef = ref(firebase.storage, `images/${file.name}`);

    // Przesyłanie pliku do Firebase Storage
    await uploadBytes(storageRef, file);

    // Uzyskiwanie URL pliku po przesłaniu
    const fileURL = await getDownloadURL(storageRef);

    const docRef = await addDoc(collections.album, {
      title,
      src: fileURL,
      createdAt: new Date(),
      addedBy: uid,
      comments: [],
      likes: 0,
      likedBy: [],
    });

    console.log("Added image with ID: ", docRef.id);
    return NextResponse.json({ id: docRef.id, src: fileURL });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error uploading image:", error);
      return NextResponse.json(
        { error: "Failed to add image", details: error.message },
        { status: 500 }
      );
    }
  }
}
