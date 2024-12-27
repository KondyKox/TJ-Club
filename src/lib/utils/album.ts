import { ImageProps } from "@/types/ImageProps";
import { getCurrentUser } from "../auth";

// Get all images from Firestore
export const getImages = async () => {
  const response = await fetch("/api/album");
  const data: ImageProps[] = await response.json();

  if (!response.ok) throw new Error("Failed to fetch images");

  return data;
};

// Upload new image
export const uploadImage = async (file: File, title: string) => {
  const user = getCurrentUser();
  if (!user) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);

  const token = await user.getIdToken();
  if (!token) {
    console.error("No token available");
    return;
  }

  const response = await fetch("/api/album", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // Przekazujemy token
    },
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to upload image");

  return response.json(); // Zwracamy dane z API po pomyślnym przesłaniu
};
