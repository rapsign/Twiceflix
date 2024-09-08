import React from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  useToast,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/firebase";

const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();

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
      <Box maxW="lg" p={6} borderRadius="md" boxShadow="lg" bg="gray.800">
        <VStack spacing={4} align="stretch">
          <Heading textAlign="center" color="red.500">
            TWICEFLIX
          </Heading>
          <Divider />
          <Text textAlign="center" color="white">
            Please sign in to access the admin panel.
          </Text>
          <Button
            colorScheme="red"
            onClick={handleLogin}
            size="lg"
            fontSize="lg"
            variant="solid"
            borderRadius="md"
          >
            Sign in with Google
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default Login;
