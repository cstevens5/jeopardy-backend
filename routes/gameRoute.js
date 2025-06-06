import express from "express";
import Game from "../models/Game.js";
import Clue from "../models/Clue.js";
import { groupCluesForGame } from "../groupClues.js";

const router = express.Router();

// route to get a list of grouped clues given the air date of the episode
router.get("/grouped/:airdate/:round", async (req, res) => {
  const { airdate, round } = req.params;
  if (round !== "J!" && round !== "DJ!") {
    return res.status(400).json({ error: "Invalid round parameter" });
  }

  // Create range for the day
  const start = new Date(airdate);
  const end = new Date(airdate);
  end.setDate(end.getDate() + 1);

  try {
    // first get game id
    const game = await Game.findOne({
      air_date: { $gte: start, $lt: end },
    });

    if (!game) {
      return res.status(404).json({ error: "Game not found for this airdate" });
    }

    const game_id = game.id;

    // now get all the clues in this game
    const clues = await Clue.find({ game_id: game_id });
    // now group clues
    const grouped = groupCluesForGame(clues, round);
    res.status(200).json(grouped);
  } catch (err) {
    console.log("Error grouping clues or fetching game id: ", err);
    res.status(500).json({ error: err });
  }
});

// route to get a random game
router.get("/random", async (req, res) => {
  try {
    const random_game = await Game.aggregate([{ $sample: { size: 1 } }]);

    if (!random_game) {
      return res.status(404).json({ error: "No games found" });
    }

    res.status(200).json({ game_id: random_game[0].id });
  } catch (err) {
    console.error("Error selecting random game:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// route to get the game id given the air date
router.get("/airdate/:airdate", async (req, res) => {
  // destructure param
  const { airdate } = req.params;

  // Create range for the day
  const start = new Date(airdate);
  const end = new Date(airdate);
  end.setDate(end.getDate() + 1);

  try {
    // query for the game id
    const game = await Game.findOne({
      air_date: { $gte: start, $lt: end },
    });

    if (!game) {
      return res.status(404).json({ error: "Game not found for this airdate" });
    }

    const game_id = game.id;

    // send back the game id
    res.status(200).json({ game_id: game_id });
  } catch (err) {
    console.error("Error finding game id given the air date");
    res.status(500).json({ error: "Server error" });
  }
});

// route to get the game object with the given game id
router.get("/game/:game_id", async (req, res) => {
  const { game_id } = req.params;

  try {
    // fetch the game
    const game = await Game.findOne({
      id: game_id,
    });

    // return the game object
    res.status(200).json(game);
  } catch (err) {
    console.error("Error finding game given the game id");
    res.status(500).json({ error: "Server Error" });
  }
});

export default router;
