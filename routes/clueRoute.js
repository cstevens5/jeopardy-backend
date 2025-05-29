import express from "express";
import Clue from "../models/Clue.js";
import { groupCluesForGame } from "../groupClues.js";

const router = express.Router();

// get clue by id
router.get("/clue/:id", async (req, res) => {
  try {
    const clue = await Clue.findOne({ id: req.params.id });
    res.status(200).json(clue);
  } catch (err) {
    console.error("Error retrieving clue: ", err);
    res.status(500);
  }
});

// route to get all clues by game id
router.get("/game/:id", async (req, res) => {
  try {
    const clues = await Clue.find({ game_id: req.params.id });
    res.status(200).json(clues);
  } catch (err) {
    console.error("Error fetching clues: ", err);
    res.status(500);
  }
});

// get grouped clues by round
router.get("/grouped/:game_id/:round", async (req, res) => {
  const { game_id, round } = req.params;
  if (isNaN(game_id)) {
    return res.status(400).json({ error: "Invalid game id" });
  } else if (round !== "J!" && round !== "DJ!") {
    return res.status(400).json({ error: "Invalid round parameter" });
  }

  try {
    const clues = await Clue.find({ game_id: game_id });
    const grouped = groupCluesForGame(clues, round);
    res.status(200).json(grouped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to group clues" });
  }
});

export default router;
