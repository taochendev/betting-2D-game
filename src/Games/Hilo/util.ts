export const probHigherOrSame = (index: number): number => {
  const rank = (index % 13) + 1; // Ace = 1, 2 = 2, ..., King = 13
  const totalCards = 52;
  const cardsPerRank = 4;

  const higherOrSameCards = (13 - rank + 1) * cardsPerRank;
  const probability = higherOrSameCards / totalCards;

  return Number(probability.toFixed(2));
}

export const probLowerOrSame = (index: number): number => {
  const rank = (index % 13) + 1; // Ace = 1, 2 = 2, ..., King = 13
  const totalCards = 52;
  const cardsPerRank = 4;

  const lowerOrSameCards = rank * cardsPerRank;
  const probability = lowerOrSameCards / totalCards;

  return Number(probability.toFixed(2));
}