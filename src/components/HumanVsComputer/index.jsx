// @flow
import React from 'react';
import Chessboard from 'chessboardjsx';
import Chess from 'chess.js';

import { colors } from 'utils/theme';

import { minimaxRoot } from './helper';

const DIFFICULTY = 3;

type Props = {|
  setGameIsOver: () => void,
  setComputerIsThinking: () => void,
  setIsYourTurn: () => void,
  width: number,
|};
type State = {
  fen: string,
  squareStyles: Object,
  pieceSquare: Object,
};

// I've kept this component as a class rather than a functional component
// as there is a weird visual bug occurs where the Chessboard does not update
// the position of the pieces when the player moves a piece
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
    // see if the move is legal
    const move = this.game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return;
    setComputerIsThinking();

    this.setState({ fen: this.game.fen() });

    window.setTimeout(this.makeComputerMoveHard, 1000);
  };

  onSquareClick = (square: string) => {
    const { setComputerIsThinking } = this.props;
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
    setComputerIsThinking();

    this.setState({ fen: this.game.fen() });

    window.setTimeout(this.makeComputerMoveHard, 1000);
  };

  render() {
    const { fen, squareStyles } = this.state;
    const { width } = this.props;
    return (
      <Chessboard
        id="humanVsComputer"
        width={width}
        position={fen}
        onDrop={this.onDrop}
        boardStyle={{
          borderRadius: '5px',
          boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
        }}
        onSquareClick={this.onSquareClick}
        squareStyles={squareStyles}
        dropSquareStyle={{
          boxShadow: `inset 0 0 1px 4px ${colors.cornflowerBlue}`,
        }}
        transitionDuration={500}
      />
    );
  }
}

export default function PlayComputerEngine({
  isGameOver,
  setGameIsOver,
  setComputerIsThinking,
  setIsYourTurn,
  width,
}: {|
  isGameOver: boolean,
  setGameIsOver: () => void,
  setComputerIsThinking: () => void,
  setIsYourTurn: () => void,
  width: number,
|}) {
  return (
    <HumanVsComputer
      setGameIsOver={setGameIsOver}
      setComputerIsThinking={setComputerIsThinking}
      setIsYourTurn={setIsYourTurn}
      width={width}
    />
  );
}
