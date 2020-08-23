// @flow
import { getPieceValue } from './values';

const evaluateBoard = (
  board: Array<
    Array<{
      type: string,
      color: string,
      value: number,
    }>,
  >,
  color: string,
) => {
  // Loop through all pieces on the board and sum up total
  let value = 0;
  board.forEach((row, i) => {
    row.forEach((piece, j) => {
      if (piece) {
        // Subtract piece value if it is opponent's piece
        value += getPieceValue(piece, i, j) * (piece.color === color ? 1 : -1);
      }
    });
  });

  return value;
};

const minimax = (
  depth: number,
  game: any,
  playerColor: string,
  isMaximisingPlayer: boolean = false,
  alpha: number = Number.NEGATIVE_INFINITY,
  beta: number = Number.POSITIVE_INFINITY,
) => {
  if (depth === 0) {
    return evaluateBoard(game.board(), playerColor);
  }

  const possibleMoves = game.moves().sort(function(a, b) {
    return 0.5 - Math.random();
  });

  if (isMaximisingPlayer) {
    let bestMove = -Infinity;
    possibleMoves.forEach(move => {
      game.move(move);
      bestMove = Math.max(
        bestMove,
        minimax(depth - 1, game, playerColor, !isMaximisingPlayer),
      );
      game.undo();
      const newAlpha = Math.max(alpha, bestMove);
      if (beta <= newAlpha) return bestMove;
    });
    return bestMove;
  }
  let bestMove = Infinity;
  possibleMoves.forEach(move => {
    game.move(move);
    bestMove = Math.min(
      bestMove,
      minimax(depth - 1, game, playerColor, !isMaximisingPlayer),
    );
    game.undo();
    const newBeta = Math.min(beta, bestMove);
    if (newBeta <= alpha) return bestMove;
  });
  return bestMove;
};

export const minimaxRoot = (
  depth: number,
  game: Object,
  playerColor: string,
  isMaximisingPlayer: boolean,
) => {
  const possibleMoves = game.moves();
  let bestMove = -Infinity;
  let bestMoveFound;

  possibleMoves.forEach(move => {
    game.move(move);
    const value = minimax(depth - 1, game, playerColor, !isMaximisingPlayer);
    game.undo();
    if (value >= bestMove) {
      bestMove = value;
      bestMoveFound = move;
    }
  });
  return bestMoveFound;
};
