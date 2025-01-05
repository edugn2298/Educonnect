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
import transactionRoutes from "./routes/transaction.routes.js";
import trasactionReport from "./routes/transacreport.routes.js";
import messageReport from "./routes/messagereport.routes.js";
import userReport from "./routes/userreport.routes.js";
import subscriptionReport from "./routes/subscriptionreport.routes.js";
import postReport from "./routes/postreport.routes.js";
import commentReport from "./routes/commentreport.routes.js";
import { updateUser } from "./controllers/user.controller.js";

const corsOptions = {
  origin: ["http://localhost:3005", "http://localhost:5173"],
  methods: ["GET", "POST", "PATCH", "DELETE"],
  optionsSuccessStatus: 200,
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3005", "http://localhost:5173"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
  pingInterval: 10000,
  pingTimeout: 5000,
});

app.use(cors(corsOptions));

//Middleware for parsing json
app.use(json());

//define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//config for static files
app.use("/public", express.static(path.join(__dirname, "public")));

//Route Root
app.get("/", (req, res) => {
  res.send("Hello from root route!");
});
//Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/chats", chatRoutes);
app.use("/messages", messageRoutes);
app.use("/transactions", transactionRoutes);
//Reports
app.use("/trasactionreport", trasactionReport);
app.use("/messagereport", messageReport);
app.use("/userreport", userReport);
app.use("/subscriptionreport", subscriptionReport);
app.use("/postreport", postReport);
app.use("/commentreport", commentReport);

//Conection with socket.io
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

export { app, server, io };
