export interface QuoteProps {
  id: string;
  content: string;
  imageUrl: string | null;
  author: string;
  createdAt: Date;
  likes: number;
  likedBy: string[];
  isLiked: boolean;
}
