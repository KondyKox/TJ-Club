"use client";

import { ImageProps } from "@/types/ImageProps";
import Likes from "./features/Likes";
import Image from "next/image";
import useAuth from "@/hooks/useAuth";
import { collections } from "@/lib/firebaseConfig";
import { doc } from "firebase/firestore";
import { handleLike } from "@/lib/utils/handleLike";
import Modal from "./ui/Modal";
import { useState } from "react";

const AlbumPost = ({
  image,
  loadImages,
}: {
  image: ImageProps;
  loadImages: () => void;
}) => {
  const isLoggedIn = useAuth();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Like / Dislike an image
  const handleLikeClick = async (image: ImageProps) => {
    if (!isLoggedIn) return;

    const albumRef = doc(collections.album, image.id);

    await handleLike({
      item: image,
      collectionRef: albumRef,
      loadItems: loadImages,
    });
  };

  // Open modal with image data
  const handlePostClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        key={image.id}
        onClick={handlePostClick}
        className="flex flex-col justify-center items-center gap-4 md:w-1/2 gradient-bg p-6 rounded-lg cursor-pointer"
      >
        <AlbumPostContent image={image} handleLikeClick={handleLikeClick} />
      </div>
      {/* Modal with image data */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AlbumPostContent image={image} handleLikeClick={handleLikeClick} />
      </Modal>
    </>
  );
};

// Component for AlbumPost content
const AlbumPostContent = ({
  image,
  handleLikeClick,
}: {
  image: ImageProps;
  handleLikeClick: (image: ImageProps) => void;
}) => {
  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full">
      <h6 className="header-sm">{image.title}</h6>
      {/* TODO: Add image author here */}
      <Image
        key={image.id}
        src={image.src}
        alt={image.title}
        width={1024}
        height={1024}
        loading="lazy"
        className="w-full rounded border-b-2 border-akcent transition-all duration-300 ease-in-out hover:scale-150"
      />
      <div className="flex justify-between items-center gap-2 w-full mt-4">
        <div className="flex justify-center items-center gap-2">
          <span className="transition-all duration-300 ease-in-out hover:text-interaction cursor-pointer">
            Komentarze
          </span>
        </div>
        {/* Likes */}
        <Likes element={image} handleLike={() => handleLikeClick(image)} />
      </div>
    </div>
  );
};

export default AlbumPost;
