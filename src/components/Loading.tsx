import Logo from "./Logo";

const LoadingOverlay = ({ message = "Ładowanie, nie zesraj się..." }) => {
  return (
    <div className="fixed inset-0 bg-secondary flex flex-col justify-center items-center z-[9999]">
      <Logo />
      <div className="flex flex-col items-center mt-4">
        <div className="w-12 h-12 border-4 border-primary border-t-4 border-t-akcent rounded-full animate-spin mb-4"></div>
        <p className="text-lg text-primary text-center">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
