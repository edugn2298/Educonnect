import { useState, useEffect } from "react";
import { Box, useTheme, Typography, Snackbar, Alert } from "@mui/material";
import Sidebar from "../../../components/layout/Sidebar";
import { useAuth } from "../../../context/AuthContext";
import { getChat, CreateChat, deleteChat } from "../../../services/ChatRequest";
import { searchFollowing } from "../../../services/auth";
import SearchBar from "../../../components/layout/SearchBar";
import ChatList from "../../../components/layout/ChatList";
import ChatContainer from "../../../components/layout/ChatContainer";
import socket from "../../../services/webSocket";

const ChatPage = () => {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  //Initial Function to get the user's chats
  const userChats = async () => {
    try {
      const response = await getChat(currentUser.id);
      setChats(response.data);
      setFilteredChats(response.data);
    } catch (error) {
      throw error.response.data;
    }
  };

  // Effect to get the user's chats when the component is mounted
  useEffect(() => {
    userChats();
  }, [currentUser.id]);

  //Function to find a friend to start a chat
  const SearchFollowing = async (id, query) => {
    try {
      const response = await searchFollowing(id, query);
      setFriends(response.data);
      return response;
    } catch (error) {
      throw error.response.data;
    }
  };

  const handleSearch = async (query) => {
    const filtered = chats.filter((chat) =>
      chat.members.some(
        (member) =>
          member.fullname &&
          member.fullname.toLowerCase().includes(query.toLowerCase())
      )
    );
    setFilteredChats(filtered);

    try {
      const friends = await SearchFollowing(currentUser._id, query);
      setFriends(friends.data);
    } catch (error) {
      console.error("Error searching following:", error);
    }
  };

  // Handle chat selection
  const handleChatSelect = async (chatOrFriend) => {
    if (!chatOrFriend || !chatOrFriend._id) {
      console.error("Invalid chat or friend:", chatOrFriend);
      return;
    }

    // Si chatOrFriend tiene 'members', es un chat activo
    if (chatOrFriend.members) {
      setSelectedChat(chatOrFriend);
      socket.emit("join chat", chatOrFriend._id);
      return;
    }

    // Si chatOrFriend no tiene 'members', es un amigo, buscar un chat existente
    const existingChat = chats.find((chat) => {
      return chat.members.some((member) => {
        return member._id === chatOrFriend._id;
      });
    });

    if (existingChat) {
      setSelectedChat(existingChat);
      socket.emit("join chat", existingChat._id);
    } else {
      try {
        const response = await CreateChat({
          senderId: currentUser._id,
          receiverId: chatOrFriend._id,
        });
        const newChat = response.data;
        newChat.members = [];
        newChat.members.push(chatOrFriend);
        if (newChat) {
          setChats((prevChats) => [...prevChats, newChat]);
          setSelectedChat(newChat);
          socket.emit("join chat", newChat._id);

          setSearchQuery("");
          setFriends([]);
        }
      } catch (error) {
        console.error("Error creating chat:", error);
      }
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      const response = await deleteChat(chatId);
      setChats((prevChats) => prevChats.filter((chat) => chat._id !== chatId));
      setFilteredChats((prevFilteredChats) =>
        prevFilteredChats.filter((chat) => chat._id !== chatId)
      );
      if (selectedChat && selectedChat._id === chatId) {
        setSelectedChat(null);
      }
      setSnackbarMessage(response.data.message);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      display="flex"
      height="100vh"
      sx={{ background: theme.palette.background.default }}
    >
      {/* Sidebar */}
      <Sidebar />
      <Box display="flex" flexGrow={1}>
        <Box
          display="flex"
          flexDirection="column"
          width="30%"
          borderRight={`1px solid ${theme.palette.divider}`}
          padding={2}
          sx={{ bgcolor: theme.palette.background.paper }}
        >
          <SearchBar onSearch={handleSearch} value={searchQuery} />
          <ChatList
            chats={filteredChats}
            friends={friends}
            handleChatSelect={handleChatSelect}
            handleDeleteChat={handleDeleteChat}
          />
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          flexGrow={1}
          padding={2}
          sx={{ bgcolor: theme.palette.background.paper }}
        >
          {selectedChat ? (
            <ChatContainer
              socket={socket}
              currentUser={currentUser}
              selectedChat={selectedChat}
              handleDeleteChat={handleDeleteChat}
            />
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexGrow={1}
              sx={{ color: theme.palette.text.primary }}
            >
              <Typography variant="h4" sx={{ textAlign: "center" }}>
                Select a chat to start
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChatPage;
