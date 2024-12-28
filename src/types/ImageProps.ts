import { CommentProps } from "./CommentProps";

export interface ImageProps {
  id: string;
  author: string;
  src: string;
  title: string;
  comments: CommentProps[];
  likes: number;
  likedBy: string[];
  isLiked: boolean;
  createdAt: Date;
}
