import React, { useState, useEffect } from 'react';
import { GameEngine } from './engine/GameEngine';
import { MainMenu } from './components/MainMenu';
import { CharacterCreation } from './components/CharacterCreation';
import { MobileGameInterface } from './components/MobileGameInterface';
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

    // Auto-save every 30 seconds
    const autoSaveInterval = setInterval(() => {
      if (gameState.gameStarted) {
        gameEngine.saveGame();
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [gameEngine, gameState.gameStarted]);

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

  const handleSaveGame = () => {
    gameEngine.saveGame();
    // Could show a toast notification here
  };

  const handleShowSettings = () => {
    // Implement settings modal
  };

  const handleShowStats = () => {
    // Implement statistics modal
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return (
          <MainMenu
            onNewGame={handleNewGame}
            onLoadGame={handleLoadGame}
            onSettings={handleShowSettings}
            onStats={handleShowStats}
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
          <MobileGameInterface
            character={gameState.character}
            currentYear={gameState.currentYear}
            onAgeUp={handleAgeUp}
            onSaveGame={handleSaveGame}
            onShowSettings={handleShowSettings}
            onShowStats={handleShowStats}
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
    <div className="App min-h-screen">
      {renderCurrentScreen()}
    </div>
  );
}

export default App;