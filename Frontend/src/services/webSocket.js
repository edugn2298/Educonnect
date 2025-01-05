import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3005";

const socket = io(SOCKET_URL, {
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
  timeout: 20000,
});

socket.on("connect", () => {
  console.log("Connected to WebSocket server", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("WebSocket connection error:", error);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected from WebSocket server", reason);
  if (reason === "io server disconnect") {
    socket.connect(); // Reconnect when the server disconnects
  }
});

export default socket;
