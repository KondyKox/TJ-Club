export interface QuoteProps {
  id: number;
  content: string;
  imageUrl: string | null;
  author: string;
  likes: number;
  isLiked: boolean;
}
