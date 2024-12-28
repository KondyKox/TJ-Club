import { ReactNode, useEffect, useState } from "react";
import { addComment, getComments } from "@/lib/utils/comments";
import { CommentProps } from "@/types/CommentProps";
import Button from "../ui/Button";
import { getCurrentUser } from "@/lib/auth";
import useUser from "@/hooks/useUser";
import { searchUserById } from "@/lib/utils/friends";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

const Comments = ({
  imageId,
  children,
}: {
  imageId: string;
  children?: ReactNode;
}) => {
  const [author, setAuthor] = useState<string | null>(null);
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const user = getCurrentUser();
  const userInfo = useUser(user?.uid || "");
  const { userData } = userInfo;

  useEffect(() => {
    const fetchAuthor = async () => {
      if (!userData?.uid) return;

      const user = await searchUserById(userData.uid);
      setAuthor(user?.username || null);
    };

    fetchAuthor();
  }, [userData]);

  useEffect(() => {
    const fetchComments = async () => {
      const commentsData = await getComments(imageId);
      setComments(commentsData);
      setLoading(false);
    };
    fetchComments();
  }, [imageId]);

  // Add new comment
  const handleAddComment = async () => {
    if (!newComment.trim() || !userData) return;

    try {
      const commentData: Omit<CommentProps, "id"> = {
        author: userData.uid,
        content: newComment,
        createdAt: new Date(),
      };

      await addComment(imageId, commentData);

      setComments((prev) => [
        ...prev,
        { id: Date.now().toString(), ...commentData }, // Dodanie nowego komentarza
      ]);

      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="py-2 w-full">
      <div className="flex justify-between items-center w-full">
        <h3>Komentarze</h3>
        {children}
      </div>
      {loading ? (
        <p>Ładowanie komentarzy...</p>
      ) : (
        <ul className="overflow-y-auto max-h-[150px] pr-2 my-2 flex flex-col gap-2">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="p-2 border-b border-button bg-slate-700 rounded-lg"
            >
              <div className="flex justify-between items-center">
                <p className="font-bold text-interaction">{author}</p>
                <p className="text-red text-xs">
                  {new Date(comment.createdAt).toLocaleDateString("pl-PL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <p className="text-sm">{comment.content}</p>
            </li>
          ))}
        </ul>
      )}
      <div className="flex items-center gap-2 mt-4">
        <input
          type="text"
          placeholder="Dodaj komentarz..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="input"
        />
        <Button
          onClick={handleAddComment}
          noHover
          className="hover:text-green-500"
        >
          <PlusCircleIcon className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default Comments;
