// @flow

import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import Chessboard from 'chessboardjsx';
import * as Chess from 'chess.js';

import { colors, fontWeight } from 'utils/theme';

type Props = {
  game: any,
  setGameIsOver: () => void,
  children?: ({
    position: string,
    onDrop: ({ sourceSquare: string, targetSquare: string }) => void,
    squareStyles: Object,
    onSquareClick: (square: string) => void,
  }) => Node,
};

const HumanVsRandom = ({ game, setGameIsOver, children }: Props) => {
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
    setSquareStyles({ [square]: { backgroundColor: 'DarkTurquoise' } });
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

  if (children == null) return null;
  return children({
    position: fen,
    onDrop,
    onSquareClick,
    squareStyles,
  });
};

const PlayRandomMoveEngine = () => {
  const game = new Chess();
  const [isGameOver, setIsGameOver] = React.useState(false);
  const setGameIsOver = () => setIsGameOver(true);

  return (
    <React.Fragment>
      <HumanVsRandom game={game} setGameIsOver={setGameIsOver}>
        {({ position, onDrop, onSquareClick, squareStyles }) => (
          <Chessboard
            width={450}
            id="humanVsRandom"
            position={position}
            onDrop={onDrop}
            boardStyle={{
              borderRadius: '5px',
              boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
            }}
            onSquareClick={onSquareClick}
            squareStyles={squareStyles}
          />
        )}
      </HumanVsRandom>
      <div
        style={{
          position: 'absolute',
          top: 120,
          color: colors.cloudBurst,
          fontSize: 32,
          fontWeight: fontWeight.semiBold,
        }}
      >
        {isGameOver ? 'Game over!' : "I'm not very good!"}
      </div>
    </React.Fragment>
  );
};

export default PlayRandomMoveEngine;
