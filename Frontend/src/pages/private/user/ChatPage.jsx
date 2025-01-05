import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  IconButton,
  InputBase,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import Sidebar from "../../../components/layout/Sidebar";
import { useAuth } from "../../../context/AuthContext";
import {
  getChat,
  CreateChat,
  findChat,
  deleteChat,
} from "../../../services/ChatRequest";
import { sendMessage, getMessages } from "../../../services/MessageRequest";
import socket from "../../../services/webSocket";

const ChatPage = () => {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]); // Estado para almacenar los mensajes
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState(""); // Estado para almacenar el nuevo mensaje

  useEffect(() => {
    socket.on("chat message", (msg) => {
      console.log("Mensaje recibido:", msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
    return () => {
      socket.off("chat message");
    };
  }, []);

  const userChats = async () => {
    try {
      const response = await getChat(currentUser.id);
      setChats(response.data);
      console.log(response);
    } catch (error) {
      throw error.response.data;
    }
  };

  const fetchMessages = async (id) => {
    try {
      const response = await getMessages(id);
      setMessages(response.data); // Actualizar el estado de los mensajes
      console.log(response.data);
    } catch (error) {
      throw error.response.data;
    }
  };

  const sendMessageToChat = async (message) => {
    const formData = {
      chatId: selectedChat._id,
      senderId: currentUser._id,
      content: message,
    };
    const formResponse = new FormData();
    formResponse.append("chatId", selectedChat._id);
    formResponse.append("sender", currentUser._id);
    formResponse.append("content", message);
    console.log(formResponse.entries());
    console.log(formData);
    try {
      const response = await sendMessage(formData);
      console.log(response);
      socket.emit("chat message", {
        ...response.data,
        chatId: selectedChat._id,
      });
      setMessages([...messages, response.data]); // Actualizar los mensajes con el nuevo mensaje
      setNewMessage(""); // Limpiar el TextField
    } catch (error) {
      throw error.response.data;
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() !== "") {
      sendMessageToChat(newMessage);
    }
  };

  useEffect(() => {
    userChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
    }
  }, [selectedChat]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleChatSelect = (chat) => {
    console.log(chat);
    socket.emit("join chat", chat._id);
    setSelectedChat(chat);
  };

  const handleNewMessageChange = (e) => {
    setNewMessage(e.target.value); // Actualizar el valor del TextField
  };

  const getSenderName = (message) => {
    if (message.sender === currentUser._id) {
      return currentUser.fullname; // Nombre del usuario actual
    } else {
      const sender = selectedChat.members.find(
        (member) => member._id === message.sender
      );
      return sender ? sender.fullname : "Desconocido"; // Nombre del remitente, o "Desconocido" si no se encuentra
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <Box display="flex" height="100vh">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <Box flexGrow={1} display="flex" flexDirection="column">
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            backgroundColor: "primary.main",
            color: "white",
          }}
        >
          <Typography variant="h6">Chats Activos</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Paper
            component="form"
            sx={{
              display: "flex",
              alignItems: "center",
              p: "2px 4px",
              width: 300,
            }}
          >
            <InputBase
              placeholder="Buscar amigos"
              inputProps={{ "aria-label": "buscar amigos" }}
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ ml: 1, flex: 1 }}
            />
            <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>

        {/* Main content */}
        <Box display="flex" flexGrow={1}>
          {/* Chats list */}
          <Box sx={{ width: 300, borderRight: "1px solid lightgray" }}>
            <List>
              {chats.map((chat) => (
                <ListItem
                  button
                  key={chat._id}
                  onClick={() => handleChatSelect(chat)}
                  selected={selectedChat?._id === chat._id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.08)", // Color de fondo al hacer hover
                    },
                  }}
                >
                  <Avatar src={chat.members[0].profilePicture} />
                  <ListItemText
                    primary={chat.members[0].fullname}
                    sx={{ ml: 2 }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Chat area */}
          <Box flexGrow={1} display="flex" flexDirection="column">
            {selectedChat ? (
              <>
                <Box sx={{ p: 2, borderBottom: "1px solid lightgray" }}>
                  <Typography variant="h6">
                    {selectedChat.members[0].fullname}
                  </Typography>
                </Box>
                <Box
                  flexGrow={1}
                  p={2}
                  sx={{ overflowY: "auto", height: "70vh" }}
                >
                  {/* Mostrar mensajes del chat */}
                  {messages.map((message) => (
                    <Box key={message._id} sx={{ mb: 2 }}>
                      <Typography variant="body1">
                        {getSenderName(message)}: {message.content}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Box
                  sx={{
                    p: 2,
                    borderTop: "1px solid lightgray",
                    display: "flex",
                  }}
                >
                  <TextField
                    fullWidth
                    placeholder="Escribe un mensaje..."
                    variant="outlined"
                    value={newMessage}
                    onChange={handleNewMessageChange}
                    onKeyDown={handleKeyPress} // Detectar la tecla Enter
                    sx={{ mr: 2 }}
                  />
                  <IconButton color="primary" onClick={handleSendMessage}>
                    <SendIcon />
                  </IconButton>
                </Box>
              </>
            ) : (
              <Box
                flexGrow={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography variant="body2" color="textSecondary">
                  Selecciona un chat para comenzar a conversar.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatPage;
