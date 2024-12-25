import Link from "next/link";
import Quote from "../Quote";
import { QuoteProps } from "@/types/QuoteProps";

const QuotesSection = ({
  quotes,
  loadQuotes,
  fade,
  isDesktop,
}: {
  quotes: QuoteProps[];
  loadQuotes: () => void;
  fade: boolean;
  isDesktop: boolean;
}) => {
  return (
    <div className="flex flex-col justify-center items-center w-full overline-top gap-20">
      <div className="flex flex-col md:flex-row-reverse justify-around items-center w-full gap-4">
        <div className="flex flex-col justify-center items-center">
          <h2 className="sub-header">Mądre słowa</h2>
          <p className="text-sm text-akcent pb-2">Mądrości wielkich ludzi</p>
        </div>
        <div
          className={`flex pt-4 ${
            isDesktop ? "flex-row-reverse" : "flex-col"
          } relative`}
        >
          {quotes.map((quote, index) => (
            <Link
              href={"/quotes"}
              key={quote.id}
              className={`min-w-72 transition-opacity duration-500 ease-in-out ${
                fade ? "opacity-0" : index === 0 ? "opacity-100" : "opacity-50"
              } ${index === 0 && "drop-shadow-button"}`}
              style={{
                zIndex: quotes.length - index,
                marginRight: isDesktop && index > 0 ? `-${index * 70}px` : "0",
                marginTop: !isDesktop && index > 0 ? `-${index * 70}px` : "0", // mobile
              }}
            >
              <Quote quote={quotes[index]} loadQuotes={loadQuotes} />
            </Link>
          ))}
        </div>
      </div>
      <div className="flex justify-center items-center p-2">
        <p className="text-xl text-center">
          Więcej porad życiowych na{" "}
          <Link href={"/quotes"} className="link">
            stronie mądrości
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default QuotesSection;
