import {
  arrayRemove,
  arrayUnion,
  DocumentReference,
  updateDoc,
} from "firebase/firestore";
import { getCurrentUser } from "../auth";
import { ImageProps } from "@/types/ImageProps";
import { QuoteProps } from "@/types/QuoteProps";

type LikeableItem = ImageProps | QuoteProps;

// Handle image / quote like or dislike
export const handleLike = async ({
  item,
  collectionRef,
  loadItems,
}: {
  item: LikeableItem;
  collectionRef: DocumentReference;
  loadItems: () => void;
}) => {
  const user = getCurrentUser();

  if (!user) return;

  try {
    const updateData = item.isLiked
      ? {
          likes: item.likes - 1,
          likedBy: arrayRemove(user.uid),
        }
      : {
          likes: item.likes + 1,
          likedBy: arrayUnion(user.uid),
        };

    await updateDoc(collectionRef, updateData);

    loadItems();
    console.log(`${item.isLiked ? "Item disliked" : "Item liked"}`);
  } catch (error: unknown) {
    if (error instanceof Error)
      console.error("Error during liking element: ", error);
  }
};
