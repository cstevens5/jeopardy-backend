import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
  id: Number,
  episode_num: Number,
  season_id: Number,
  air_date: Date,
  notes: String,
  contestant1: Number,
  contestant2: Number,
  contestant3: Number,
  winner: Number,
  score1: Number,
  score2: Number,
  score3: Number,
});

const Game = mongoose.model("Game", GameSchema);
export default Game;
