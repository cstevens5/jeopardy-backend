import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import clueRoute from "./routes/clueRoute.js";
import gameRoute from "./routes/gameRoute.js";

const app = express();
dotenv.config();

// connect to the db
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => console.log("DB Connection Successful"))
  .catch((err) => {
    console.error("DB Connection Error: ", err.message);
  });

// routes
app.use(express.json());
app.use("/api/clues", clueRoute);
app.use("/api/games", gameRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend Server is Running on Port:", process.env.PORT);
});
