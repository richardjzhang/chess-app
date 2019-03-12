// @flow

import React from 'react';
import type { Node } from 'react';
import Chessboard from 'chessboardjsx';
import * as Chess from 'chess.js';

type Props = {
  children?: Node,
};
type State = { fen: string, squareStyles: Object, pieceSquare: string };

class HumanVsRandom extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { fen: 'start', squareStyles: {}, pieceSquare: '' };
  }

  componentDidMount() {
    this.game = new Chess();
  }

  game = () => {};

  makeRandomMove = () => {
    const possibleMoves = this.game.moves();

    // exit if the game is over
    if (
      this.game.game_over() === true ||
      this.game.in_draw() === true ||
      possibleMoves.length === 0
    )
      return;

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    this.game.move(possibleMoves[randomIndex]);
    this.setState({
      fen: this.game.fen(),
      squareStyles: {
        [this.game.history({ verbose: true })[this.game.history().length - 1]
          .to]: {
          backgroundColor: 'DarkTurquoise',
        },
      },
    });
  };

  onDrop = ({ sourceSquare, targetSquare }) => {
    // see if the move is legal
    const move = this.game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return;

    this.setState({ fen: this.game.fen() });

    window.setTimeout(this.makeRandomMove, 1000);
  };

  onSquareClick = square => {
    const { pieceSquare } = this.state;
    this.setState({
      squareStyles: { [square]: { backgroundColor: 'DarkTurquoise' } },
      pieceSquare: square,
    });

    const move = this.game.move({
      from: pieceSquare,
      to: square,
      promotion: 'q', // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return;

    this.setState({ fen: this.game.fen() });

    window.setTimeout(this.makeRandomMove, 1000);
  };

  render() {
    const { fen, squareStyles } = this.state;
    const { children } = this.props;
    return children({
      position: fen,
      onDrop: this.onDrop,
      onSquareClick: this.onSquareClick,
      squareStyles,
    });
  }
}

export default function PlayRandomMoveEngine() {
  return (
    <div>
      <HumanVsRandom>
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
    </div>
  );
}
