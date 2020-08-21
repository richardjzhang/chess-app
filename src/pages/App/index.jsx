// @flow

import React, { Fragment } from 'react';

import { colors, fontSize, gutters } from 'utils/theme';
import HumanVsHuman from 'components/HumanVsHuman';
import Random from 'components/Random';
import Computer from 'components/HumanVsComputer';
import HumanVsRandom from 'components/HumanVsRandom';

type Props = {};

type State = {
  type: string,
  options: {
    [string]: string,
  },
};

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      type: 'computer',
      options: {
        random: 'Random Moves',
        computer: 'Human vs Computer',
        playRandom: 'Human vs Dumb Computer',
        human: 'Human vs Human',
      },
    };
  }

  changeGameType = (type: string) => {
    this.setState({
      type,
    });
  };

  render() {
    const { type, options } = this.state;
    const Chess = () => {
      switch (type) {
        case 'human':
          return <HumanVsHuman />;
        case 'computer':
          return <Computer />;
        case 'playRandom':
          return <HumanVsRandom />;
        default:
          return <Random />;
      }
    };
    return (
      <Fragment>
        <div className="root">
          <div className="chess-container">
            <Chess />
          </div>
          <div className="buttons-container">
            {Object.keys(options).map(key => (
              /* eslint-disable */
              <div
                key={key}
                className="button"
                style={{
                  color: type === key ? colors.white : colors.cloudBurst,
                  backgroundColor: type === key ? colors.dodgerBlue : colors.white,
                }}
                onClick={() => this.changeGameType(key)}
              >
                {options[key]}
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          .root {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background-color: ${colors.cupid};
          }
          .button {
            height: 50px;
            cursor: pointer;
            margin: ${gutters.small}px 0;
            border-radius: ${gutters.xsmall}px;
            background-color: ${colors.mischka};
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: ${fontSize.description}px;
            padding: 0 ${gutters.medium}px;
          }
          .chess-container {
            margin-right: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .buttons-container {
            display: flex;
            justify-content: center;
            flex-direction: column;
            margin: -${gutters.medium}px 0;
          }
        `}</style>
      </Fragment>
    );
  }
}

export default App;
