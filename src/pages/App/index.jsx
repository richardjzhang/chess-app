// @flow

import React from 'react';
import styled from '@emotion/styled';

import { colors, fontSize, fontWeight, gutters } from 'utils/theme';
import Media from 'components/Media.jsx';
import Random from 'components/Random.jsx';
import Computer from 'components/HumanVsComputer';
import HumanVsRandom from 'components/HumanVsRandom.jsx';

const GameState = styled.div`
  display: flex;
  justify-content: center;
  color: ${colors.cloudBurst};
  font-size: 32px;
  font-weight: ${fontWeight.semiBold};
`;

const Root = styled.div`
  box-sizing: border-box;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChessContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: -${gutters.medium}px 0;
`;

const Button = styled.div`
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
`;

type GameType = 'computer' | 'playRandom' | 'random';

const OPTIONS: {
  [GameType]: string,
} = {
  random: 'Random Moves',
  computer: 'Human vs Computer',
  playRandom: 'Human vs Dumb Computer',
};

const Chess = ({
  gameType,
  isGameOver,
  setGameIsOver,
  setComputerIsThinking,
  setIsYourTurn,
  width,
}: {|
  gameType: GameType,
  isGameOver: boolean,
  setGameIsOver: () => void,
  setComputerIsThinking: () => void,
  setIsYourTurn: () => void,
  width: number,
|}) => {
  switch (gameType) {
    case 'computer':
      return (
        <Computer
          width={width}
          isGameOver={isGameOver}
          setGameIsOver={setGameIsOver}
          setComputerIsThinking={setComputerIsThinking}
          setIsYourTurn={setIsYourTurn}
        />
      );
    case 'playRandom':
      return (
        <HumanVsRandom
          width={width}
          isGameOver={isGameOver}
          setGameIsOver={setGameIsOver}
        />
      );
    case 'random':
      return (
        <Random
          width={width}
          isGameOver={isGameOver}
          setGameIsOver={setGameIsOver}
        />
      );
    default:
      throw new Error('No such option');
  }
};

const getTitle = ({
  gameType,
  isGameOver,
  isThinking,
}: {|
  gameType: GameType,
  isGameOver: boolean,
  isThinking: boolean,
|}) => {
  switch (gameType) {
    case 'computer':
      if (isGameOver) return 'Game Over!';
      if (isThinking) return "I'm thinking...";
      return 'Your turn';
    case 'playRandom':
      return "I'm not very smart";
    case 'random':
      return "We're not very smart";
    default:
      throw new Error('No such option');
  }
};

const App = () => {
  const [gameType, setGameType] = React.useState('random');
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [isThinking, setIsThinking] = React.useState(false);
  const setIsYourTurn = () => setIsThinking(false);
  const setComputerIsThinking = () => setIsThinking(true);
  const setGameIsOver = () => setIsGameOver(true);

  return (
    <React.Fragment>
      <Media query={`(min-width: 900px)`}>
        {isDesktopView => (
          <Root style={{ padding: isDesktopView ? 120 : 60 }}>
            <GameState
              style={{
                marginBottom: isDesktopView ? 60 : 40,
                fontSize: isDesktopView ? 32 : 24,
              }}
            >
              {getTitle({ gameType, isGameOver, isThinking })}
            </GameState>
            <Content
              style={{ flexDirection: isDesktopView ? 'row' : 'column' }}
            >
              <ChessContainer
                style={{
                  ...(isDesktopView
                    ? { marginRight: 60 }
                    : { marginBottom: 60 }),
                }}
              >
                <Chess
                  gameType={gameType}
                  width={isDesktopView ? 450 : 350}
                  isGameOver={isGameOver}
                  setGameIsOver={setGameIsOver}
                  setComputerIsThinking={setComputerIsThinking}
                  setIsYourTurn={setIsYourTurn}
                />
              </ChessContainer>
              <ButtonsContainer>
                {Object.keys(OPTIONS).map(key => (
                  <Button
                    key={key}
                    style={{
                      color:
                        gameType === key ? colors.white : colors.cloudBurst,
                      backgroundColor:
                        gameType === key ? colors.dodgerBlue : colors.white,
                    }}
                    onClick={() => setGameType(key)}
                  >
                    {OPTIONS[key]}
                  </Button>
                ))}
              </ButtonsContainer>
            </Content>
          </Root>
        )}
      </Media>
    </React.Fragment>
  );
};

export default App;
