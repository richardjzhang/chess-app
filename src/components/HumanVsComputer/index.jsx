// @flow

import React from 'react';
import type { Node } from 'react';
import Chessboard from 'chessboardjsx';
import Chess from 'chess.js';

import { colors, fontWeight } from 'utils/theme';

import { minimaxRoot } from './helper';

const DIFFICULTY = 3;

type Props = {
  setGameIsOver: () => void,
  setComputerIsThinking: () => void,
  setIsYourTurn: () => void,
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
    if (
      this.game.game_over() === true ||
      this.game.in_draw() === true ||
      this.game.moves().length === 0
    ) {
      const { setGameIsOver } = this.props;
      setGameIsOver();
      return;
    }
    const { setIsYourTurn } = this.props;

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
    setIsYourTurn();
  };

  onDrop = ({
    sourceSquare,
    targetSquare,
  }: {
    sourceSquare: string,
    targetSquare: string,
  }) => {
    const { setComputerIsThinking } = this.props;
    setComputerIsThinking();
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

  onSquareClick = (square: string) => {
    const { setComputerIsThinking } = this.props;
    setComputerIsThinking();
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

    window.setTimeout(this.makeComputerMoveHard, 1000);
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
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [isThinking, setIsThinking] = React.useState(false);

  const setGameIsOver = () => setIsGameOver(true);
  const setIsYourTurn = () => setIsThinking(false);
  const setComputerIsThinking = () => setIsThinking(true);

  return (
    <React.Fragment>
      <HumanVsComputer
        setGameIsOver={setGameIsOver}
        setComputerIsThinking={setComputerIsThinking}
        setIsYourTurn={setIsYourTurn}
      >
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
            dropSquareStyle={{
              boxShadow: `inset 0 0 1px 4px ${colors.cornflowerBlue}`,
            }}
            showNotation={false}
          />
        )}
      </HumanVsComputer>
      <div
        style={{
          position: 'absolute',
          top: 120,
          color: colors.cloudBurst,
          fontSize: 32,
          fontWeight: fontWeight.semiBold,
        }}
      >
        {isGameOver
          ? 'Game over!'
          : isThinking
          ? "I'm thinking..."
          : 'Your turn'}
      </div>
    </React.Fragment>
  );
}
