// @flow
import React, { useEffect, useState } from 'react';
import Chessboard from 'chessboardjsx';
import * as Chess from 'chess.js';

type Props = {|
  game: any,
  setGameIsOver: () => void,
  width: number,
|};

const RandomVsRandom = ({ game, setGameIsOver, width }: Props) => {
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
      id="random"
      width={width}
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

const RandomVsRandomGame = ({
  isGameOver,
  setGameIsOver,
  width,
}: {|
  isGameOver: boolean,
  setGameIsOver: () => void,
  width: number,
|}) => {
  const game = new Chess();
  return (
    <RandomVsRandom game={game} setGameIsOver={setGameIsOver} width={width} />
  );
};

export default RandomVsRandomGame;
