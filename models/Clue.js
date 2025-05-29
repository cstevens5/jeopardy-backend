import mongoose from "mongoose";

const ClueSchema = new mongoose.Schema({
  id: Number,
  game_id: Number,
  value: Number,
  daily_double: Boolean,
  round: {
    type: String,
    enum: ["J!", "DJ!"],
  },
  category: String,
  clue: String,
  response: String,
});

const Clue = mongoose.model("Clue", ClueSchema);
export default Clue;
