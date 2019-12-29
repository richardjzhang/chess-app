// @flow

import React from 'react';
import type { Node } from 'react';
import Chessboard from 'chessboardjsx';
import * as Chess from 'chess.js';

type Props = {
  children?: ({ position: string }) => Node,
};
type State = { fen: string };

class RandomVsRandom extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { fen: 'start' };
  }

  componentDidMount() {
    this.game = new Chess();
    setTimeout(() => this.makeRandomMove(), 1000);
  }

  componentWillUnmount() {
    window.clearTimeout(this.timer());
  }

  game = () => {};

  timer = () => window.setTimeout(this.makeRandomMove, 1000);

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
    this.setState({ fen: this.game.fen() });

    this.timer();
  };

  render() {
    const { fen } = this.state;
    const { children } = this.props;
    if (children == null) return null;
    return children({ position: fen });
  }
}

export default function RandomVsRandomGame() {
  return (
    <div>
      <RandomVsRandom>
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
    </div>
  );
}
