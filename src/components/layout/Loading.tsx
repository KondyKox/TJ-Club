import Logo from "../ui/Logo";

const LoadingOverlay = ({ message = "Ładowanie, nie zesraj się..." }) => {
  return (
    <div className="fixed inset-0 bg-primary flex flex-col justify-center items-center z-[9999]">
      <Logo />
      <div className="flex flex-col items-center mt-4">
        <div className="w-12 h-12 border-4 border-secondary border-t-4 border-t-akcent rounded-full animate-spin mb-4"></div>
        <p className="text-lg text-secondary text-center">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
