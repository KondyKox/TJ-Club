"use client";

import { ImageProps } from "@/types/ImageProps";
import Likes from "./features/Likes";
import Image from "next/image";
import useAuth from "@/hooks/useAuth";
import { collections } from "@/lib/firebaseConfig";
import { doc } from "firebase/firestore";
import { handleLike } from "@/lib/utils/handleLike";
import Modal from "./ui/Modal";
import { useEffect, useState } from "react";
import { searchUserById } from "@/lib/utils/friends";
import Comments from "./features/Comments";

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
        className="flex flex-col justify-center items-center gap-4 gradient-bg p-6 rounded-lg"
      >
        <AlbumPostContent
          image={image}
          handleLikeClick={handleLikeClick}
          handlePostClick={handlePostClick}
        />
      </div>
      {/* Modal with image data */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AlbumPostContent
          image={image}
          handleLikeClick={handleLikeClick}
          handlePostClick={handlePostClick}
        />
      </Modal>
    </>
  );
};

// Component for AlbumPost content
const AlbumPostContent = ({
  image,
  handleLikeClick,
  handlePostClick,
}: {
  image: ImageProps;
  handleLikeClick: (image: ImageProps) => void;
  handlePostClick: () => void;
}) => {
  const [author, setAuthor] = useState<string>("");

  // Pobierz dane autora na podstawie `uid`
  useEffect(() => {
    const fetchAuthor = async () => {
      if (!image.author) return;

      const imgAuthor = await searchUserById(image.author);
      setAuthor(imgAuthor?.username);
    };

    fetchAuthor();

    fetchAuthor();
  }, [image.author]);

  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full">
      <div className="flex flex-col justify-center items-center pb-2">
        <h6 className="header-sm">{image.title}</h6>
        <span className="text-akcent">{author}</span>
      </div>
      <Image
        key={image.id}
        src={image.src}
        alt={image.title}
        width={1024}
        height={1024}
        loading="lazy"
        onClick={handlePostClick}
        className="w-full rounded border-b-2 border-akcent transition-all duration-300 ease-in-out hover:scale-150 cursor-pointer"
      />
      <div className="flex justify-between items-center gap-2 w-full mt-4 border-t-2 border-interaction">
        <Comments imageId={image.id}>
          <Likes element={image} handleLike={() => handleLikeClick(image)} />
        </Comments>
      </div>
    </div>
  );
};

export default AlbumPost;
