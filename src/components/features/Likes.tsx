import { ImageProps } from "@/types/ImageProps";
import { QuoteProps } from "@/types/QuoteProps";
import Image from "next/image";

const Likes = ({
  element,
  handleLike,
}: {
  element: QuoteProps | ImageProps;
  handleLike: (element: QuoteProps | ImageProps) => void;
}) => {
  return (
    <div
      className="flex justify-center items-center gap-2 transition-all duration-300 ease-in-out hover:text-red cursor-pointer"
      onClick={() => handleLike(element)}
    >
      <span className={`${element.isLiked && "text-red"}`}>
        {element.likes}
      </span>
      <Image
        src={"/ano_vodka.svg"}
        alt="Polubienia"
        width={64}
        height={64}
        className={`max-w-1.5 md:max-w-2 transition-all duration-300 ease-in-out ${
          element.isLiked ? "drop-shadow-red" : ""
        }`}
      />
    </div>
  );
};

export default Likes;
