import { adminAuth } from "@/lib/firebaseAdmin";
import { collections, firebase } from "@/lib/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer "))
      throw new Error("No authorization token.");

    const token = authHeader.split(" ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const { uid } = decodedToken;

    const formData = await req.formData();
    const displayName = formData.get("displayName") as string;
    const email = formData.get("email") as string;
    const file = formData.get("photo") as File;

    let profilePicture = null;

    if (file) {
      // Upload file to Firebase Storage
      const storageRef = ref(firebase.storage, `profilePictures/${file.name}`);
      await uploadBytes(storageRef, file);
      profilePicture = await getDownloadURL(storageRef);
    }

    // Update Firestore user document
    const userDoc = doc(collections.users, uid);
    await updateDoc(userDoc, {
      displayName,
      email,
      ...(profilePicture && { profilePicture }),
    });

    return NextResponse.json({ success: true, profilePicture });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error updating user:", error);
      return NextResponse.json(
        { error: "Failed to update user", details: error.message },
        { status: 500 }
      );
    }
  }
}
