import { Link } from "react-router-dom";

export const TextLogo = ({ Width }) => {
  return (
    <Link to="/" className="flex items-center leading-none">
      <img
        src="/twiceflix.svg"
        alt="logo"
        className="block object-contain cursor-pointer"
        style={{ width: Width, height: "28px" }}
      />
    </Link>
  );
};

export const Logo = ({ Width }) => {
  return (
    <Link to="/" className="flex items-center h-full leading-none">
      <img
        src="/twice.svg"
        alt="logo"
        className="block object-contain cursor-pointer"
        style={{ width: Width }}
      />
    </Link>
  );
};
