import {
  Typography,
  Box,
  Avatar,
  Stack,
  IconButton,
  useTheme,
} from "@mui/material";
import PropTypes from "prop-types";
import DeleteIcon from "@mui/icons-material/Delete";

const ChatHeader = ({ selectedChat, handleDeleteChat }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        paddingBottom: theme.spacing(1),
        marginBottom: theme.spacing(2),
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.palette.background.primary,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          src={selectedChat.members[0].profilePicture}
          alt={selectedChat.members[0].fullname}
        >
          {!selectedChat.members[0].profilePicture &&
            selectedChat.members[0].fullname[0]}
        </Avatar>
        <Typography variant="h5" sx={{ color: theme.palette.text.primary }}>
          {selectedChat.members.map((member) => member.fullname).join(", ")}
        </Typography>
      </Stack>
      <IconButton onClick={() => handleDeleteChat(selectedChat._id)}>
        <DeleteIcon sx={{ color: theme.palette.error.main }} />
      </IconButton>
    </Box>
  );
};

ChatHeader.propTypes = {
  selectedChat: PropTypes.object.isRequired,
  handleDeleteChat: PropTypes.func.isRequired,
};

export default ChatHeader;
