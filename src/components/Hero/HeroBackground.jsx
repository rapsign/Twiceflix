const HeroBackground = ({ thumbnail }) => {
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <img
        src={thumbnail}
        alt="Hero Background"
        className="w-full h-full opacity-50"
        style={{ objectFit: "cover" }}
      />
      <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent via-[rgba(0,0,0,0.38)] to-black z-10" />
    </div>
  );
};

export default HeroBackground;
