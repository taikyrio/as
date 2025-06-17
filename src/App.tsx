import React, { useState, useEffect } from 'react';
import { GameEngine } from './engine/GameEngine';
import { MainMenu } from './components/MainMenu';
import { CharacterCreation } from './components/CharacterCreation';
import { GameInterface } from './components/GameInterface';
import { CrimeInterface } from './components/CrimeInterface';
import { GameState } from './types/GameTypes';

type GameScreen = 'menu' | 'character-creation' | 'game' | 'crime';

function App() {
  const [gameEngine] = useState(() => new GameEngine());
  const [gameState, setGameState] = useState<GameState>(gameEngine.getGameState());
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('menu');
  const [hasExistingSave, setHasExistingSave] = useState(false);

  useEffect(() => {
    // Check for existing save on startup
    const hasSave = gameEngine.loadGame();
    setHasExistingSave(hasSave);
    if (hasSave) {
      setGameState(gameEngine.getGameState());
      if (gameEngine.getGameState().gameStarted) {
        setCurrentScreen('game');
      }
    }
  }, [gameEngine]);

  const handleNewGame = () => {
    setCurrentScreen('character-creation');
  };

  const handleLoadGame = () => {
    if (gameEngine.loadGame()) {
      setGameState(gameEngine.getGameState());
      setCurrentScreen('game');
    }
  };

  const handleCreateCharacter = (name: string, country: string) => {
    gameEngine.startNewLife(name, country);
    setGameState(gameEngine.getGameState());
    setCurrentScreen('game');
  };

  const handleAgeUp = () => {
    gameEngine.ageUp();
    setGameState(gameEngine.getGameState());
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  const handleViewCrime = () => {
    setCurrentScreen('crime');
  };

  const handleBackToGame = () => {
    setCurrentScreen('game');
  };

  const handleCommitCrime = (crimeId: string) => {
    const result = gameEngine.commitCrime(crimeId);
    setGameState(gameEngine.getGameState());
    return result;
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return (
          <MainMenu
            onNewGame={handleNewGame}
            onLoadGame={handleLoadGame}
            onSettings={() => {}}
            onStats={() => {}}
            hasExistingSave={hasExistingSave}
          />
        );

      case 'character-creation':
        return (
          <CharacterCreation
            countries={gameState.countries}
            onCreateCharacter={handleCreateCharacter}
            onBack={handleBackToMenu}
          />
        );

      case 'game':
        return (
          <GameInterface
            character={gameState.character}
            currentYear={gameState.currentYear}
            onAgeUp={handleAgeUp}
            onViewProfile={() => {}}
            onViewCrime={handleViewCrime}
            onViewCareer={() => {}}
          />
        );

      case 'crime':
        return (
          <CrimeInterface
            character={gameState.character}
            onCommitCrime={handleCommitCrime}
            onBack={handleBackToGame}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="App">
      {renderCurrentScreen()}
    </div>
  );
}

export default App;