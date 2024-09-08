import { Spinner, Center } from "@chakra-ui/react";

const LoadingSpinner = () => {
  return (
    <Center height="100vh">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="red"
        size="xl"
      />
    </Center>
  );
};

export default LoadingSpinner;
