import Link from "next/link";

export const TextLogo = ({ Width }) => {
  return (
    <Link href="/" className="flex items-center leading-none">
      <img
        src="/twiceflix.svg"
        alt="logo"
        className="block object-contain cursor-pointer"
        style={{ width: Width, height: "28px" }}
      />
    </Link>
  );
};
