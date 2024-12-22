import { getImages, uploadImage } from "@/lib/utils/album";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("GET /api/album");
  try {
    const images = await getImages(req);
    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  console.log("POST /api/album");
  try {
    return await uploadImage(req);
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
