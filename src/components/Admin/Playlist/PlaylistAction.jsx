import { Box, IconButton } from "@chakra-ui/react";
import { BiCog, BiTrash } from "react-icons/bi";

const PlaylistAction = ({ row, onEdit, onDelete }) => (
  <Box display="flex" gap={2}>
    <IconButton
      icon={<BiCog />}
      borderRadius="lg"
      bg="#3F3F3F"
      color="white"
      size="sm"
      onClick={onEdit}
    />
    <IconButton
      icon={<BiTrash />}
      borderRadius="lg"
      size="sm"
      bg="red"
      color="white"
      onClick={onDelete}
    />
  </Box>
);

export default PlaylistAction;
