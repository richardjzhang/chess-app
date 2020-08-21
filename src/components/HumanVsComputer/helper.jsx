// @flow
import { getPieceValue } from './values';

const convertFen = (fenArray: Array<string>) => {
  // Transform into following format:
  // [[{type: 'p', color: 'b'}, {type: 'q', color: 'b'}, ...], [...], ...]
  const board = [[]];
  let count = 0;
  for (let i = 0; i < fenArray.length; i += 1) {
    if (fenArray[i] === ' ') break;
    if (!['/', '1', '2', '3', '4', '5', '6', '7', '8'].includes(fenArray[i])) {
      if (fenArray[i] === fenArray[i].toUpperCase()) {
        board[count].push({
          type: fenArray[i].toLowerCase(),
          color: 'w',
        });
      } else {
        board[count].push({
          type: fenArray[i],
          color: 'b',
        });
      }
    } else if (['1', '2', '3', '4', '5', '6', '7', '8'].includes(fenArray[i])) {
      for (let j = 0; j < parseInt(fenArray[i], 10); j += 1) {
        board[count].push(null);
      }
    }

    if (fenArray[i] === '/') {
      count += 1;
      board[count] = [];
    }
  }
  return board;
};

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

const minimax = (depth, game, alpha, beta, isMaximisingPlayer, playerColor) => {
  if (depth === 0) {
    const board = convertFen(game.fen().split(''));
    /* $FlowFixMe */
    return evaluateBoard(board, playerColor);
  }

  const newGameMoves = game.moves();

  if (isMaximisingPlayer) {
    let bestMove = -9999;
    newGameMoves.forEach(newGameMove => {
      game.move(newGameMove);
      bestMove = Math.max(
        bestMove,
        minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer, playerColor),
      );
      game.undo();
      const newAlpha = Math.max(alpha, bestMove);
      if (beta <= newAlpha) return bestMove;
      return null;
    });
    return bestMove;
  }
  let bestMove = 9999;
  newGameMoves.forEach(newGameMove => {
    game.move(newGameMove);
    bestMove = Math.min(
      bestMove,
      minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer, playerColor),
    );
    game.undo();
    const newBeta = Math.min(beta, bestMove);
    if (newBeta <= alpha) return bestMove;
    return null;
  });
  return bestMove;
};

export const minimaxRoot = (
  depth: number,
  game: Object,
  isMaximisingPlayer: boolean,
  playerColor: string,
) => {
  const newGameMoves = game.moves();
  let bestMove = -9999;
  let bestMoveFound;

  newGameMoves.forEach(newGameMove => {
    game.move(newGameMove);
    const value = minimax(
      depth - 1,
      game,
      -10000,
      10000,
      !isMaximisingPlayer,
      playerColor,
    );
    game.undo();
    if (value >= bestMove) {
      bestMove = value;
      bestMoveFound = newGameMove;
    }
  });
  return bestMoveFound;
};
