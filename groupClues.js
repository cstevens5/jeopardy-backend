const valueOrders = {
  "J!": [200, 400, 600, 800, 1000],
  "DJ!": [400, 800, 1200, 1600, 2000],
};

export const groupCluesForGame = (clues, round) => {
  const roundValues = valueOrders[round];

  // Filter clues by round
  const cluesForRound = clues.filter((clue) => clue.round === round);

  // Group by category
  const categoryMap = {};
  cluesForRound.forEach((clue) => {
    if (!categoryMap[clue.category]) {
      categoryMap[clue.category] = [];
    }
    categoryMap[clue.category].push(clue);
  });

  const categories = Object.entries(categoryMap)
    .slice(0, 6)
    .map(([category, clueList]) => {
      const sortedClues = roundValues.map((value) => {
        const match = clueList.find((c) => c.value === value);
        return (
          match || {
            id: null,
            game_id: null,
            value,
            daily_double: null,
            round: null,
            category: null,
            clue: null,
            response: null,
          }
        );
      });

      return { category, clues: sortedClues };
    });

  // If fewer than 6 categories, fill with placeholders
  while (categories.length < 6) {
    const placeholderClues = roundValues.map((value) => ({
      id: null,
      game_id: null,
      value,
      daily_double: null,
      round: null,
      category: null,
      clue: null,
      response: null,
    }));

    categories.push({
      category: null,
      clues: placeholderClues,
    });
  }

  return categories;
};
