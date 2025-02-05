"use client";

import useAuth from "@/hooks/useAuth";
import { useState } from "react";
import { useEffect } from "react";
import Button from "@/components/ui/Button";
import { ImageProps } from "@/types/ImageProps";
import Pagination from "@/components/features/Pagination";
import AlbumPost from "@/components/AlbumPost";
import LoadingOverlay from "@/components/layout/Loading";
import { getImages, uploadImage } from "@/lib/utils/album";

const Album = () => {
  const isLoggedIn = useAuth();
  const [images, setImages] = useState<ImageProps[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);

  // Fetch images from the album
  const fetchImages = async () => {
    try {
      const data = await getImages();
      setImages(data);
    } catch (error: unknown) {
      if (error instanceof Error)
        console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Upload new image to the album
  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);

      await uploadImage(file, title);

      await fetchImages();
    } catch (error: unknown) {
      if (error instanceof Error)
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
      {isLoggedIn && (
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
              className="input"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setFile(file);
              }}
              required
            />
          </div>
          <Button className="border-2 border-button w-full" loading={uploading}>
            Dodaj
          </Button>
        </form>
      )}
      <div className="flex flex-col justify-center items-center gap-4 mt-10 w-full md:w-1/2 p-2 overline-top">
        <Pagination
          items={images}
          itemsPerPage={5}
          renderItem={(image) => (
            <div
              key={image.id}
              className="flex justify-center items-center w-full"
            >
              <AlbumPost image={image} loadImages={fetchImages} />
            </div>
          )}
        />
      </div>
    </section>
  );
};

export default Album;
