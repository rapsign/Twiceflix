import { Box, IconButton } from "@chakra-ui/react";
import { BiCog, BiTrash } from "react-icons/bi";

const VideoActionButtons = ({ row, onEdit, onDelete }) => (
  <Box display="flex" gap={2}>
    <IconButton
      icon={<BiCog />}
      bg="#3F3F3F"
      borderRadius="lg"
      color="white"
      size="sm"
      onClick={() => onEdit(row)}
    />
    <IconButton
      icon={<BiTrash />}
      bg="red"
      color="white"
      size="sm"
      onClick={() => onDelete(row)}
    />
  </Box>
);

export default VideoActionButtons;
