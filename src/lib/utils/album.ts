import { collections, firebase } from "@/lib/firebaseConfig";
import { getCurrentUser } from "@/lib/auth";
import { addDoc, getDocs } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

// Get all images from Firestore
export const getImages = async (req: NextRequest) => {
  try {
    const snapshot = await getDocs(collections.album);
    const images = snapshot.docs.map((doc) => doc.data());

    return NextResponse.json(images, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Error fetching images" },
      { status: 500 }
    );
  }
};

// Upload new image to Cloudinary and save its URL in Firestore
export const uploadImage = async (req: NextRequest) => {
  try {
    const user = getCurrentUser();
    // if (!user)
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;

    if (!file)
      return NextResponse.json({ error: "Invalid file" }, { status: 400 });

    // Tworzenie referencji do pliku w Firebase Storage
    const storageRef = ref(firebase.storage, `images/${file.name}`);

    // Przesyłanie pliku do Firebase Storage
    await uploadBytes(storageRef, file);

    // Pobieranie URL do pobranego pliku
    const downloadURL = await getDownloadURL(storageRef);

    // Zapisanie URL-a w Firestore (opcjonalne)
    const docRef = await addDoc(collections.album, {
      src: downloadURL,
      title,
      author: user?.displayName || "Anonymous",
      createdAt: new Date(),
    });

    return NextResponse.json({ url: downloadURL, id: docRef.id });

    // Upload do Cloudinary
    // const result = await Image.upload(file as File, {
    //   upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
    // });

    // return NextResponse.json({ url: result.secure_url });

    // const result: any = await uploadPromise;

    // const docRef = await addDoc(collections.album, {
    //   src: result.secure_url,
    //   author: user?.displayName || "Anonymous",
    //   title,
    //   createdAt: new Date(),
    // });

    // return docRef.id;
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Error during upload" }, { status: 500 });
  }
};
