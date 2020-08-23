// @flow
import React, { useEffect, useState } from 'react';
import Chessboard from 'chessboardjsx';
import * as Chess from 'chess.js';
import styled from '@emotion/styled';

import { colors, fontWeight } from 'utils/theme';

const game = new Chess();

const GameState = styled.div`
  position: absolute;
  top: 120px;
  color: ${colors.cloudBurst};
  font-size: 32px;
  font-weight: ${fontWeight.semiBold};
`;

type Props = {
  setGameIsOver: () => void,
};

const RandomVsRandom = ({ setGameIsOver }: Props) => {
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

  return (
    <Chessboard
      width={450}
      id="random"
      position={fen}
      transitionDuration={500}
      boardStyle={{
        borderRadius: '5px',
        boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
      }}
      draggable={false}
    />
  );
};

const RandomVsRandomGame = () => {
  const [isGameOver, setIsGameOver] = React.useState(false);
  const setGameIsOver = () => setIsGameOver(true);

  return (
    <React.Fragment>
      <RandomVsRandom setGameIsOver={setGameIsOver} />
      <GameState>{isGameOver ? 'Game over!' : "We're not very good"}</GameState>
    </React.Fragment>
  );
};

export default RandomVsRandomGame;
