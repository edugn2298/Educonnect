import { useState, useEffect } from "react";
import MessageList from "../layout/MessageList";
import ChatInput from "../layout/ChatInput";
import ChatHeader from "./ChatHeader";
import SocketListener from "../layout/SocketListener";
import { sendMessage, getMessages } from "../../services/MessageRequest";
import PropTypes from "prop-types";
import { Paper, useTheme } from "@mui/material";

const ChatContainer = ({
  socket,
  currentUser,
  selectedChat,
  handleDeleteChat,
}) => {
  const theme = useTheme();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async (id) => {
      try {
        const response = await getMessages(id);
        setMessages(response.data);
      } catch (error) {
        console.error(error.response.data);
      }
    };

    if (selectedChat) {
      fetchMessages(selectedChat._id);
    }
  }, [selectedChat]);

  const handleSendMessage = async (message) => {
    const formData = {
      chatId: selectedChat._id,
      senderId: currentUser._id,
      content: message,
    };

    try {
      const response = await sendMessage(formData);

      // Emit the message through the socket
      socket.emit("chat message", {
        ...response.data,
        chatId: selectedChat._id,
      });

      // Update messages with the new message

      //setMessages((prevMessages) => [...prevMessages, response.data]); ya esta en socket listener
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: theme.palette.background.primary,
      }}
    >
      <ChatHeader
        selectedChat={selectedChat}
        handleDeleteChat={handleDeleteChat}
      />
      <SocketListener socket={socket} setMessages={setMessages} />
      <MessageList messages={messages} currentUser={currentUser} />
      <ChatInput sendMessageToChat={handleSendMessage} />
    </Paper>
  );
};

ChatContainer.propTypes = {
  socket: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  selectedChat: PropTypes.object.isRequired,
  handleDeleteChat: PropTypes.func.isRequired,
};

export default ChatContainer;
