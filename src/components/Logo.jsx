import { Image } from "@chakra-ui/react";

export const TextLogo = ({ Width }) => {
  return (
    <Image src="/twiceflix.svg" alt="logo" objectFit="contain" width={Width} />
  );
};

export const Logo = ({ Width }) => {
  return (
    <Image src="/twice.svg" alt="logo" objectFit="contain" width={Width} />
  );
};
