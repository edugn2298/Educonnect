import PropTypes from "prop-types";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Box,
  Avatar,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/system";
import { TransitionGroup } from "react-transition-group";
import Collapse from "@mui/material/Collapse";

const ScrollBox = styled(Box)({
  overflowY: "auto",
  maxHeight: "calc(100vh - 100px)",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#888",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#555",
  },
});

const getInitials = (name) => {
  const names = name.split(" ");
  const initials = names.map((n) => n[0]).join("");
  return initials.toUpperCase();
};

const ChatList = ({ chats, friends, handleChatSelect, handleDeleteChat }) => {
  return (
    <ScrollBox
      sx={{
        bgcolor: "background.paper",
        padding: 2,
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Chats Activos
      </Typography>
      <List>
        <TransitionGroup>
          {chats.map((chat) => (
            <Collapse key={chat._id}>
              <ListItem
                button
                onClick={() => handleChatSelect(chat)}
                sx={{ color: "text.primary" }}
              >
                <Avatar
                  sx={{ marginRight: 2 }}
                  src={chat.members[0].profilePicture}
                >
                  {!chat.members[0].profilePicture &&
                    getInitials(chat.members[0].fullname)}
                </Avatar>
                <ListItemText
                  primary={chat.members
                    .map((member) => member.fullname)
                    .join(", ")}
                />
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(chat._id);
                  }}
                  sx={{ marginLeft: "auto" }}
                >
                  <DeleteIcon sx={{ color: "error.main" }} />
                </IconButton>
              </ListItem>
            </Collapse>
          ))}
        </TransitionGroup>
      </List>
      <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
      <Typography variant="h6" sx={{ marginTop: 4, marginBottom: 2 }}>
        Amigos
      </Typography>
      <List>
        <TransitionGroup>
          {friends.map((friend) => (
            <Collapse key={friend._id}>
              <ListItem
                button
                onClick={() => handleChatSelect(friend)}
                sx={{ color: "text.primary" }}
              >
                <Avatar sx={{ marginRight: 2 }} src={friend.profilePicture}>
                  {!friend.profilePicture && getInitials(friend.fullname)}
                </Avatar>
                <ListItemText primary={friend.fullname} />
              </ListItem>
            </Collapse>
          ))}
        </TransitionGroup>
      </List>
    </ScrollBox>
  );
};

ChatList.propTypes = {
  chats: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      members: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          fullname: PropTypes.string.isRequired,
          username: PropTypes.string.isRequired,
          profilePicture: PropTypes.string,
        })
      ).isRequired,
    })
  ).isRequired,
  friends: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      fullname: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      profilePicture: PropTypes.string,
    })
  ).isRequired,
  handleChatSelect: PropTypes.func.isRequired,
  handleDeleteChat: PropTypes.func.isRequired,
};

export default ChatList;
