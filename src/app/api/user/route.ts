import { adminAuth } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uid, displayName, photoURL, email, password } = body;

    if (!uid)
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );

    // Update user data
    if (displayName || photoURL || email) {
      await adminAuth.updateUser(uid, {
        displayName,
        photoURL,
        email,
      });
    }

    // Password change
    if (password) await adminAuth.updateUser(uid, { password });

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
