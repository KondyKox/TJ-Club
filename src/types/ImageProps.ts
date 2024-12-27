export interface ImageProps {
  id: string;
  author: string;
  src: string;
  title: string;
  likes: number;
  likedBy: string[];
  isLiked: boolean;
  createdAt: Date;
}
