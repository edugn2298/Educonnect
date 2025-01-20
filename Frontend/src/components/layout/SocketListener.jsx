import PropTypes from "prop-types";
import { useEffect } from "react";

const SocketListener = ({ socket, setMessages }) => {
  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("chat message");
    };
  }, [socket, setMessages]);

  return null;
};

SocketListener.propTypes = {
  socket: PropTypes.object.isRequired,
  setMessages: PropTypes.func.isRequired,
};

export default SocketListener;
