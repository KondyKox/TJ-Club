export interface QuoteProps {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
  likes: number;
  likedBy: string[];
  isLiked: boolean;
}
