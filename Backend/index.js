import { config } from "dotenv"; //importing dotenv
config({ path: "./config/.env" }); //configuring dotenv

import mongoose from "mongoose"; //importing mongoose
import app from "./app.js";

const PORT = process.env.PORT || 3050; //defining port

//connecting to database
async function connectDB() {
  try {
    console.log("DATABASE URI:", process.env.MONGO_URI); // Añade este console.log para verificar la URI
    await mongoose.connect(process.env.MONGO_URI); // Quita las opciones obsoletas
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
}
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
