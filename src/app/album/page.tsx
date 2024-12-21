"use client";

import useAuth from "@/hooks/useAuth";
import { useState } from "react";
import { collections } from "@/lib/firebaseConfig";
import { useEffect } from "react";
import { getDocs } from "firebase/firestore";
import Button from "@/components/Button";
import Image from "next/image";

const Album = () => {
  const user = useAuth();
  const [images, setImages] = useState<string[]>([]);
  const [newImage, setNewImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      const snapshot = await getDocs(collections.images);
      const imagesData = snapshot.docs.map((doc) => doc.data().url);
      setImages(imagesData);
    };

    fetchImages();
  }, []);

  const handleUpload = async () => {
    if (!newImage) return;

    const formData = new FormData();
    formData.append("file", newImage);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      setImages([...images, data.url]);
    } catch (error: any) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center">
      <h2 className="sub-header">Albumik</h2>
      {user.isLoggedIn && (
        <div className="flex flex-col md:flex-row justify-center items-center gap-2">
          <input
            type="file"
            className="input"
            onChange={(e) =>
              setNewImage(e.target.files ? e.target.files[0] : null)
            }
          />
          <Button onClick={handleUpload} className="border-2 border-button">
            Upload
          </Button>
        </div>
      )}
      <div>
        {images.map((url, index) => (
          <Image
            key={index}
            src={url}
            alt={`Image ${index}`}
            width={128}
            height={128}
          />
        ))}
      </div>
    </section>
  );
};

export default Album;
