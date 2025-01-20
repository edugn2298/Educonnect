import { useState } from "react";
import { TextField, Box, useTheme, IconButton } from "@mui/material";
import PropTypes from "prop-types";
import { Send } from "@mui/icons-material";

const ChatInput = ({ sendMessageToChat }) => {
  const theme = useTheme();
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() !== "") {
      sendMessageToChat(newMessage);
      setNewMessage(""); // Limpiar el campo de entrada después de enviar el mensaje
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSendMessage}
      sx={{
        display: "flex",
        gap: 2,
        padding: 2,
        borderTop: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.primary,
      }}
    >
      <TextField
        label="Escribe un mensaje..."
        variant="outlined"
        fullWidth
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        sx={{ bgcolor: theme.palette.background.paper }}
      />
      <IconButton type="submit" variant="contained" color="primary">
        <Send />
      </IconButton>
    </Box>
  );
};

ChatInput.propTypes = {
  sendMessageToChat: PropTypes.func.isRequired,
};

export default ChatInput;
