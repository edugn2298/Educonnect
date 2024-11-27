import express, { json } from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import messageRoutes from "./routes/message.routes.js";

const corsOptions = {
  origin: ["http://localhost:3050", "http://localhost:5173"],
  methods: ["GET", "POST", "PATCH", "DELETE"],
  optionsSuccessStatus: 200,
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3050", "http://localhost:5173"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

app.use(cors(corsOptions));

//Middleware for parsing json
app.use(json());

//define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//config for static files
app.use("/public", express.static(path.join(__dirname, "public")));

//Ruta Raiz
app.get("/", (req, res) => {
  res.send("Hello from root route!");
});

// Rutas de prueba
app.get("/test", (req, res) => {
  res.send("Hello from test route!");
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/chats", chatRoutes);
app.use("/messages", messageRoutes);

//Conection with socket.io
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

export { app, server, io };
