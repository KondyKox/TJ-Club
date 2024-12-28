import { CommentProps } from "@/types/CommentProps";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { firebase } from "../firebaseConfig";

// Get image comments
export const getComments = async (imageId: string) => {
  const commentsRef = collection(firebase.db, `album/${imageId}/comments`);
  const q = query(commentsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    author: doc.data().displayName,
    content: doc.data().content,
    createdAt:
      doc.data().createdAt instanceof Date
        ? doc.data().createdAt
        : new Date(doc.data().createdAt.seconds * 1000),
  }));
};

// Add a comment to an image
export const addComment = async (
  imageId: string,
  commentData: Omit<CommentProps, "id">
) => {
  const commentsRef = collection(firebase.db, `album/${imageId}/comments`);
  await addDoc(commentsRef, {
    ...commentData,
    createdAt: new Date(),
  });
};
