// @flow
import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import Chessboard from 'chessboardjsx';
import * as Chess from 'chess.js';

import { colors, fontWeight } from 'utils/theme';

type Props = {
  game: any,
  setGameIsOver: () => void,
  children?: ({ position: string }) => Node,
};

const RandomVsRandom = ({ game, setGameIsOver, children }: Props) => {
  const [fen, setFen] = useState('start');

  const makeRandomMove = () => {
    const possibleMoves = game.moves();

    // exit if the game is over
    if (
      game.game_over() === true ||
      game.in_draw() === true ||
      possibleMoves.length === 0
    ) {
      setGameIsOver();
      return;
    }

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

const RandomVsRandomGame = () => {
  const game = new Chess();
  const [isGameOver, setIsGameOver] = React.useState(false);
  const setGameIsOver = () => setIsGameOver(true);

  return (
    <React.Fragment>
      <RandomVsRandom game={game} setGameIsOver={setGameIsOver}>
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
      <div
        style={{
          position: 'absolute',
          top: 120,
          color: colors.cloudBurst,
          fontSize: 32,
          fontWeight: fontWeight.semiBold,
        }}
      >
        {isGameOver ? 'Game over!' : "We're not very good"}
      </div>
    </React.Fragment>
  );
};

export default RandomVsRandomGame;
