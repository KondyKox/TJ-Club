"use client";

import useAuth from "@/hooks/useAuth";
import { useState } from "react";
import { useEffect } from "react";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { ImageProps } from "@/types/ImageProps";
import Likes from "@/components/features/Likes";

const Album = () => {
  const user = useAuth();
  const [images, setImages] = useState<ImageProps[]>([]);
  const [file, setFile] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch images from the album
  const fetchImages = async () => {
    try {
      const response = await fetch("/api/album");
      if (!response.ok) throw new Error("Error fetching images");

      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    // fetchImages();

    const newImage1: ImageProps = {
      id: "1",
      src: "/tj_club.png",
      title: "Test1",
      likes: 1,
      isLiked: false,
      createdAt: new Date(),
    };
    const newImage2: ImageProps = {
      id: "2",
      src: "/tj_club.png",
      title: "Test2",
      likes: 1,
      isLiked: false,
      createdAt: new Date(),
    };
    setImages([newImage1, newImage2]);
  }, []);

  // Upload new image to the album
  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/album", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${JSON.stringify(errorData)}`);
      }

      await fetchImages();
    } catch (error: any) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  // Submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await handleUpload();

    setTitle("");
    setFile(null);
  };

  // Like / Dislike a quote
  const handleLike = (image: ImageProps) => {
    console.log(`${image.isLiked ? "Dislike" : "Like"}`);
    setImages((prev) =>
      prev.map((img) =>
        img === image
          ? {
              ...img,
              likes: img.isLiked ? img.likes - 1 : img.likes + 1,
              isLiked: !img.isLiked,
            }
          : img
      )
    );
  };

  return (
    <section className="flex flex-col items-center justify-center">
      <h2 className="sub-header">Albumik</h2>
      {user.isLoggedIn && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col  justify-center items-center gap-4 p-2"
        >
          <div className="flex flex-col justify-center items-center gap-2">
            <input
              type="text"
              name="title"
              placeholder="Tytuł..."
              value={title}
              className="input"
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="file"
              name="file"
              // value={newImage || ""} // TODO: Fix this
              className="input"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setFile(URL.createObjectURL(file));
              }}
              // onChange={(e) =>
              //   setFile(e.target.files ? e.target.files[0] : null)
              // }
              required
            />
          </div>
          <Button className="border-2 border-button w-full">
            {loading ? "Dodawanie..." : "Dodaj"}
          </Button>
        </form>
      )}
      <div className="flex flex-col justify-center items-center gap-4 mt-10 w-full p-2 overline-top">
        {images?.map((image) => (
          <div
            key={image.id}
            className="flex flex-col justify-center items-center gap-4 md:w-1/2 gradient-bg p-6 rounded-lg"
          >
            <h6 className="image-header">{image.title}</h6>
            <Image
              key={image.id}
              src={image.src}
              alt={`image.title`}
              width={1024}
              height={1024}
              className="w-full rounded border-b-2 border-akcent"
            />
            <div className="flex justify-between items-center gap-2 w-full mt-4">
              <div className="flex justify-center items-center gap-2">
                <span>Komentarze</span>
              </div>
              {/* Likes */}
              <Likes element={image} handleLike={() => handleLike(image)} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Album;
