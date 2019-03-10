// @flow

import React from 'react';
import Chessboard from 'chessboardjsx';
import * as Chess from 'chess.js';

import { convertFen, evaluateBoard, minMax } from 'utils/helper';

type Props = {
  children?: React.Node,
};
type State = { fen: string, squareStyles: Object };

class HumanVsComputer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { fen: 'start', squareStyles: {}, pieceSquare: '' };
  }

  componentDidMount() {
    this.game = new Chess();
  }

  makeComputerMoveEasy = () => {
    const possibleMoves = this.game.moves();
    possibleMoves.sort(() => 0.5 - Math.random());

    // exit if the game is over
    if (
      this.game.game_over() === true ||
      this.game.in_draw() === true ||
      possibleMoves.length === 0
    )
      return;

    // Search for move with highest value
    let bestMoveSoFar = null;
    let bestMoveValue = Number.NEGATIVE_INFINITY;
    possibleMoves.forEach(move => {
      this.game.move(move);
      const board = convertFen(this.game.fen().split(''));
      const moveValue = evaluateBoard(board, 'b');
      if (moveValue > bestMoveValue) {
        bestMoveSoFar = move;
        bestMoveValue = moveValue;
      }
      this.game.undo();
    });

    this.game.move(bestMoveSoFar);
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

  makeComputerMoveHard = () => {
    const bestMove = minMax(
      3,
      this.game,
      'b',
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      true,
    )[1];
    this.game.move(bestMove);
    console.log(bestMove);
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

    window.setTimeout(this.makeComputerMoveHard, 1000);
  };

  onSquareClick = square => {
    this.setState({
      squareStyles: { [square]: { backgroundColor: 'DarkTurquoise' } },
      pieceSquare: square,
    });

    const move = this.game.move({
      from: this.state.pieceSquare,
      to: square,
      promotion: 'q', // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return;

    this.setState({ fen: this.game.fen() });

    window.setTimeout(this.makeComputerMoveHard, 10000);
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

export default function PlayComputerEngine() {
  return (
    <div>
      <HumanVsComputer>
        {({ position, onDrop, onSquareClick, squareStyles }) => (
          <Chessboard
            width={450}
            id="humanVsComputer"
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
      </HumanVsComputer>
    </div>
  );
}
