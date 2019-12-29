// @flow
import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import Chessboard from 'chessboardjsx';
import * as Chess from 'chess.js';

const game = new Chess();

type Props = {
  children?: ({ position: string }) => Node,
};

const RandomVsRandom = ({ children }: Props) => {
  const [fen, setFen] = useState('start');

  const makeRandomMove = () => {
    const possibleMoves = game.moves();

    // exit if the game is over
    if (
      game.game_over() === true ||
      game.in_draw() === true ||
      possibleMoves.length === 0
    )
      return;

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIndex]);
    setFen(game.fen());
  };

  useEffect(() => {
    const interval = setInterval(() => makeRandomMove(), 1000);
    return () => window.clearInterval(interval);
  }, []);

  if (children == null) return null;
  return children({ position: fen });
};

const RandomVsRandomGame = () => (
  <RandomVsRandom>
    {({ position }) => (
      <Chessboard
        width={450}
        id="random"
        position={position}
        transitionDuration={300}
        boardStyle={{
          borderRadius: '5px',
          boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
        }}
      />
    )}
  </RandomVsRandom>
);

export default RandomVsRandomGame;
