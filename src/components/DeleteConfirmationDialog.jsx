import { forwardRef } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";

const DeleteConfirmationDialog = forwardRef(
  ({ isOpen, onClose, onConfirm, itemName }, ref) => {
    return (
      <AlertDialog isOpen={isOpen} leastDestructiveRef={ref} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.800">
            <AlertDialogHeader>Confirm Delete</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this {itemName}? This action
              cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={ref} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" ml={3} onClick={onConfirm}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    );
  }
);

export default DeleteConfirmationDialog;
