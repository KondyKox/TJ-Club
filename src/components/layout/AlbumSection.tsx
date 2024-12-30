import { ImageProps } from "@/types/ImageProps";
import Image from "next/image";
import Link from "next/link";

const AlbumSection = ({
  images,
  fade,
  isDesktop,
}: {
  images: ImageProps[];
  fade: boolean;
  isDesktop: boolean;
}) => {
  return (
    <div className="flex flex-col justify-center items-center w-full overline-top gap-20">
      <div className="flex flex-col lg:flex-row justify-center items-center w-full gap-4">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
          <h2 className="sub-header">Tu nasz albumik</h2>
          <p className="text-sm text-akcent pb-2">Zdjęcia Tarnowskiej Mafii</p>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center w-full md:w-1/2">
          <div
            className={`flex ${
              isDesktop ? "flex-row" : "flex-col"
            } relative pt-4`}
          >
            {images.map((image, index) => (
              <Link
                href={"/album"}
                key={index}
                className={`transition-opacity duration-500 ease-in-out ${
                  fade
                    ? "opacity-0"
                    : index === 0
                    ? "opacity-100"
                    : "opacity-50"
                } ${index === 0 && "drop-shadow-button"}`}
                style={{
                  zIndex: images.length - index,
                  marginLeft: isDesktop && index > 0 ? `-${index * 90}px` : "0",
                  marginTop: !isDesktop && index > 0 ? `-${index * 70}px` : "0", // mobile
                }}
              >
                <Image
                  src={image.src}
                  alt={image.title}
                  width={256}
                  height={256}
                  className="p-2 rounded-3xl"
                  style={{ aspectRatio: "16/10" }}
                  loading="lazy"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <p className="text-xl">
          Więcej zdjęć na{" "}
          <Link href={"/album"} className="link">
            stronie albumu
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default AlbumSection;
