const HeroBackground = ({ thumbnail }) => {
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Background Image */}
      <img
        src={thumbnail}
        alt="Hero Background"
        className="w-full h-full object-cover opacity-50"
      />

      {/* Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[rgba(0,0,0,0.38)] to-black z-10" />
    </div>
  );
};

export default HeroBackground;
