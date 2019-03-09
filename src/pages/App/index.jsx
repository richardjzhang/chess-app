// @flow

import React, { Fragment } from 'react';

import HumanVsHuman from 'components/HumanVsHuman';
import Random from 'components/Random';
import { colors, fontSize, fontWeight, gutters } from 'utils/theme';

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
      type: 'human',
      options: { human: 'Human', random: 'Random' },
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
            width: ${gutters.xlarge * 2}px;
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
          }
          .button {
            width: 96px;
            cursor: pointer;
            margin: 0 ${gutters.medium}px;
            border-radius: ${gutters.xsmall}px;
            background-color: ${colors.mischka};
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: ${fontSize.description}px;
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
