import React, { useState, useCallback } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
  useToast,
  Box,
} from "@chakra-ui/react";
import { BiPlus } from "react-icons/bi";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const PlaylistModalForm = ({ onPlaylistAdded }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSave = async () => {
    try {
      await addDoc(collection(db, "playlists"), {
        name: formData.name,
        description: formData.description,
        created_at: new Date(),
      });
      toast({
        title: "Playlist saved.",
        description: "Your playlist has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      if (onPlaylistAdded) {
        onPlaylistAdded();
      }
      resetFormData();
    } catch (error) {
      console.error("Error saving playlist:", error);
      toast({
        title: "Error.",
        description: "There was an error saving your playlist.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onClose();
    }
  };

  // Reset form data
  const resetFormData = () => {
    setFormData({
      name: "",
      description: "",
    });
  };

  return (
    <>
      <Button
        onClick={onOpen}
        colorScheme="red"
        rounded="none"
        py={5}
        size={{ base: "xs", md: "md" }}
        leftIcon={<BiPlus size="2em" />}
      >
        Add Playlist
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          resetFormData();
          onClose();
        }}
      >
        <ModalOverlay />
        <ModalContent bg="gray.800">
          <ModalHeader>Add New Playlist</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Playlist Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Description (Max 300 characters)</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={(e) => {
                  if (e.target.value.length <= 300) {
                    handleChange(e);
                  }
                }}
                minHeight="200px"
              />
              <Box textAlign="right" fontSize="sm" color="gray.400">
                {formData.description.length}/300
              </Box>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="solid"
              onClick={() => {
                resetFormData();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button colorScheme="red" ml={3} onClick={handleSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PlaylistModalForm;
