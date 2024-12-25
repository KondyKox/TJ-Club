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
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div
        className="group rounded-lg p-16 w-96 flex flex-col justify-center items-center shadow-secondary gradient-bg 
                    transition-all duration- relative"
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
