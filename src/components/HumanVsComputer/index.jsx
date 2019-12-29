// @flow

import React from 'react';
import type { Node } from 'react';
import Chessboard from 'chessboardjsx';
import Chess from 'chess.js';

import { colors } from 'utils/theme';

import { minimaxRoot } from './helper';

const DIFFICULTY = 2;

type Props = {
  children?: ({
    position: string,
    onDrop: ({ sourceSquare: string, targetSquare: string }) => void,
    squareStyles: Object,
    onSquareClick: (square: string) => void,
  }) => Node,
};
type State = {
  fen: string,
  squareStyles: Object,
  pieceSquare: Object,
};

class HumanVsComputer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      fen: 'start',
      squareStyles: {},
      pieceSquare: '',
    };
  }

  componentDidMount() {
    this.game = new Chess();
  }

  game = () => {};

  makeComputerMoveHard = () => {
    const bestMove = minimaxRoot(DIFFICULTY, this.game, true, 'b');
    this.game.move(bestMove);
    this.setState(state => ({
      ...state,
      fen: this.game.fen(),
      squareStyles: {
        [this.game.history({ verbose: true })[this.game.history().length - 1]
          .to]: {
          backgroundColor: colors.cornflowerBlue,
        },
      },
    }));

    if (this.game.game_over()) {
      alert('Game Over!');
    }
  };

  onDrop = ({
    sourceSquare,
    targetSquare,
  }: {
    sourceSquare: string,
    targetSquare: string,
  }) => {
    // see if the move is legal
    const move = this.game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return;

    this.setState({ fen: this.game.fen() });

    window.setTimeout(this.makeComputerMoveHard, 1);
  };

  onSquareClick = (square: string) => {
    const { pieceSquare } = this.state;
    this.setState({
      squareStyles: { [square]: { backgroundColor: colors.cornflowerBlue } },
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

    window.setTimeout(this.makeComputerMoveHard, 1);
  };

  render() {
    const { fen, squareStyles } = this.state;
    const { children } = this.props;

    if (children == null) return null;
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
    <HumanVsComputer>
      {/* $FlowFixMe */}
      {({ position, onDrop, onSquareClick, squareStyles }) => (
        <Chessboard
          id="humanVsComputer"
          width={450}
          position={position}
          onDrop={onDrop}
          boardStyle={{
            borderRadius: '5px',
            boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
          }}
          onSquareClick={onSquareClick}
          squareStyles={squareStyles}
          lightSquareStyle={{ backgroundColor: colors.athensGrey }}
          darkSquareStyle={{ backgroundColor: colors.saffron }}
          dropSquareStyle={{
            boxShadow: `inset 0 0 1px 4px ${colors.cornflowerBlue}`,
          }}
          showNotation={false}
        />
      )}
    </HumanVsComputer>
  );
}
