"use client";

import useAuth from "@/hooks/useAuth";
import { useState } from "react";
import { useEffect } from "react";
import Button from "@/components/ui/Button";
import { ImageProps } from "@/types/ImageProps";
import Pagination from "@/components/features/Pagination";
import AlbumPost from "@/components/AlbumPost";
import LoadingOverlay from "@/components/layout/Loading";

const Album = () => {
  const user = useAuth();
  const [images, setImages] = useState<ImageProps[]>([]);
  const [file, setFile] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);

  // Fetch images from the album
  const fetchImages = async () => {
    try {
      const response = await fetch("/api/album");
      if (!response.ok) throw new Error("Error fetching images");

      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchImages();

    // ! For testing
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
      setUploading(true);

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
      setUploading(false);
    }
  };

  // Submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await handleUpload();

    setTitle("");
    setFile(null);
  };

  if (loading) return <LoadingOverlay message="Wczytuję zajebiste fotki..." />;

  return (
    <section className="flex flex-col items-center justify-center">
      <h2 className="sub-header">Albumik</h2>
      {user.isLoggedIn && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col  justify-center items-center gap-4 p-2 md:w-1/3"
        >
          <div className="flex flex-col justify-center items-center gap-2 w-full">
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
          <Button className="border-2 border-button w-full" loading={uploading}>
            Dodaj
          </Button>
        </form>
      )}
      <div className="flex flex-col justify-center items-center gap-4 mt-10 w-full p-2 overline-top">
        <Pagination
          items={images}
          itemsPerPage={5}
          renderItem={(image) => (
            <div key={image.id} className="flex justify-center items-center">
              <AlbumPost image={image} loadImages={fetchImages} />
            </div>
          )}
        />
      </div>
    </section>
  );
};

export default Album;
