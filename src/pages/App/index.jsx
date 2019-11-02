// @flow

import React, { Fragment } from 'react';

import { colors, fontSize, fontWeight, gutters } from 'utils/theme';
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
        human: 'Human',
        random: 'Random',
        computer: 'Computer',
        playRandom: 'Dumb Computer',
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
        <div className="header">
          {Object.keys(options).map(key => (
            /* eslint-disable */
            <div
              key={key}
              className={type === key ? 'buttonSelected' : 'button'}
              onClick={() => this.changeGameType(key)}
            >
              {options[key]}
            </div>
          ))}
        </div>
        <div className="container">
          <Chess />
        </div>

        <style jsx>{`
          .buttonSelected {
            min-width: ${gutters.xlarge * 2}px;
            cursor: pointer;
            margin: 0 ${gutters.medium}px;
            border-radius: ${gutters.xsmall}px;
            background-color: ${colors.diamondBlue};
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: ${fontSize.description}px;
            color: ${colors.white};
            font-weight: ${fontWeight.bold};
            padding: 0 ${gutters.small}px;
          }
          .button {
            min-width: 96px;
            cursor: pointer;
            margin: 0 ${gutters.medium}px;
            border-radius: ${gutters.xsmall}px;
            background-color: ${colors.mischka};
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: ${fontSize.description}px;
            padding: 0 ${gutters.small}px;
          }
          .container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 500px;
          }
          .header {
            display: flex;
            justify-content: center;
            height: 50px;
            margin-top: ${gutters.xlarge}px;
          }
        `}</style>
      </Fragment>
    );
  }
}

export default App;
