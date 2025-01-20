import { List, ListItem, ListItemText, Box, useTheme } from "@mui/material";
import { PropTypes } from "prop-types";
import { useEffect, useRef } from "react";

const MessageList = ({ messages, currentUser }) => {
  const theme = useTheme();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <List sx={{ flex: 1, overflowY: "auto", padding: 2 }}>
      {messages.map((msg, index) => (
        <ListItem
          key={index}
          sx={{
            alignSelf:
              msg.sender === currentUser._id ? "flex-end" : "flex-start",
            backgroundColor:
              msg.sender === currentUser._id
                ? theme.palette.primary.light
                : theme.palette.background.paper,
            color:
              msg.sender === currentUser._id
                ? theme.palette.primary.contrastText
                : theme.palette.text.primary,
            borderRadius: 2,
            marginBottom: 1,
            maxWidth: "80%",
            wordBreak: "break-word",
            padding: 1,
          }}
        >
          <ListItemText primary={msg.content} />
        </ListItem>
      ))}
      <Box ref={messagesEndRef} />
    </List>
  );
};

MessageList.propTypes = {
  messages: PropTypes.array.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default MessageList;
