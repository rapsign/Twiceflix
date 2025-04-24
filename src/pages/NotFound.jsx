import { Box, Button, Heading, Text, Center } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Center height="100vh" flexDirection="column" textAlign="center">
      <DotLottieReact
        src="https://lottie.host/776c0faa-12f1-42e8-aa3c-c45341e3bbfc/9Grv2iIUry.lottie"
        loop
        autoplay
      />
    </Center>
  );
};

export default NotFound;
