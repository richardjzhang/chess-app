// @flow
import React, { useEffect, useState } from 'react';
import Chessboard from 'chessboardjsx';
import * as Chess from 'chess.js';

import { colors } from 'utils/theme';

type Props = {|
  game: any,
  setGameIsOver: () => void,
  width: number,
|};

const HumanVsRandom = ({ game, setGameIsOver, width }: Props) => {
  const [computerMove, setComputerMove] = useState(false);
  const [fen, setFen] = useState('start');
  const [squareStyles, setSquareStyles] = useState({});
  const [pieceSquare, setPieceSquare] = useState('');

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
    setSquareStyles({
      [game.history({ verbose: true })[game.history().length - 1].to]: {
        backgroundColor: colors.cornflowerBlue,
      },
    });
    setComputerMove(false);
  };

  const onDrop = ({ sourceSquare, targetSquare }) => {
    // see if the move is legal
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return;

    setFen(game.fen());
    setComputerMove(true);
  };

  const onSquareClick = square => {
    setSquareStyles({ [square]: { backgroundColor: colors.cornflowerBlue } });
    setPieceSquare(square);

    const move = game.move({
      from: pieceSquare,
      to: square,
      promotion: 'q', // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return;

    setFen(game.fen());
    setComputerMove(true);
  };

  useEffect(
    () => {
      if (computerMove) {
        const timeout = window.setTimeout(makeRandomMove(), 1000);
        return () => window.clearTimeout(timeout);
      }
      return () => {};
    },
    [computerMove],
  );

  return (
    <Chessboard
      id="humanVsRandom"
      width={width}
      position={fen}
      onDrop={onDrop}
      boardStyle={{
        borderRadius: '5px',
        boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
      }}
      onSquareClick={onSquareClick}
      squareStyles={squareStyles}
      dropSquareStyle={{
        boxShadow: `inset 0 0 1px 4px ${colors.cornflowerBlue}`,
      }}
      transitionDuration={500}
    />
  );
};

const PlayRandomMoveEngine = ({
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
    <HumanVsRandom game={game} setGameIsOver={setGameIsOver} width={width} />
  );
};

export default PlayRandomMoveEngine;
