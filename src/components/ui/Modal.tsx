import { ReactNode } from "react";

const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 w-full bg-slate-900 bg-opacity-70">
      <div
        className="group rounded-lg py-16 px-8 w-96 flex flex-col justify-center items-center shadow-secondary gradient-bg 
                    transition-all duration-300 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 hover:text-red transition-colors"
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
