import { Box, Button, Text, useToast, VStack, Divider } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/firebase";
import { TextLogo } from "../components/Logo";

const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/admin");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message || "Unable to sign in. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box maxW="lg" p={6} borderRadius="md" boxShadow="lg" bg="#303030">
        <VStack spacing={4} align="stretch">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            padding={6}
          >
            <TextLogo />
          </Box>
          <Divider />
          <Text textAlign="center" color="white">
            Please sign in to access the admin panel.
          </Text>
          <Button
            colorScheme="red"
            background="red"
            color="white"
            onClick={handleLogin}
            size="lg"
            fontSize="lg"
            variant="solid"
            borderRadius="md"
          >
            Sign in with Google
          </Button>

          <Text
            textAlign="center"
            color="white"
            onClick={handleBack}
            cursor="pointer"
            _hover={{ textDecoration: "underline", color: "#ccc" }}
          >
            Back
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default Login;
