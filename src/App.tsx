import React, { useState, useEffect } from 'react';
import { GameEngine } from './engine/GameEngine';
import { MainMenu } from './components/MainMenu';
import { CharacterCreation } from './components/CharacterCreation';
import { MobileGameInterface } from './components/MobileGameInterface';
import { CrimeInterface } from './components/CrimeInterface';
import { CareerInterface } from './components/CareerInterface';
import { LifeActionsInterface } from './components/LifeActionsInterface';
import { Settings } from './components/Settings';
import { Statistics } from './components/Statistics';
import { DecisionModal } from './components/DecisionModal';
import { DeathScene } from './components/DeathScene';
import { GameState } from './types/GameTypes';
import { localDB, SaveData } from './engine/LocalDatabase';

// Create a single instance of GameEngine
const gameEngine = new GameEngine();

type GameScreen = 'menu' | 'character-creation' | 'game' | 'crime' | 'career' | 'life-actions';

function App() {
  const [gameState, setGameState] = useState<GameState>(gameEngine.getGameState());
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('menu');
  const [hasExistingSave, setHasExistingSave] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [isDead, setIsDead] = useState(false);
  const [causeOfDeath, setCauseOfDeath] = useState<string>('natural causes');

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

  const handleLoadGame = (saveData?: SaveData) => {
    if (saveData) {
      // Load from specific save data
      const loadedState = gameEngine.loadGameFromSave(saveData);
      setGameState(loadedState);
      setCurrentScreen('game');
    } else if (gameEngine.loadGame()) {
      // Load from localStorage
      setGameState(gameEngine.getGameState());
      setCurrentScreen('game');
    }
  };

  const handleCreateCharacter = (name: string, country: string) => {
    try {
      gameEngine.startNewLife(name, country);
      setGameState(gameEngine.getGameState());
      setCurrentScreen('game');
    } catch (error) {
      console.error('Error starting game:', error);
      // Reset game engine if there's an error
      gameEngine.resetGame();
      setGameState(gameEngine.getGameState());
    }
  };

  const handleAgeUp = () => {
    const result = gameEngine.ageUp();
    setGameState(gameEngine.getGameState());

    if (result.isDead) {
      setIsDead(true);
      setCauseOfDeath(result.causeOfDeath || 'natural causes');
      return;
    }

    if (result.decisions.length > 0) {
      setCurrentScreen('game');
    }
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  const handleViewCrime = () => {
    setCurrentScreen('crime');
  };

  const handleViewCareer = () => {
    setCurrentScreen('career');
  };

  const handleViewLifeActions = () => {
    setCurrentScreen('life-actions');
  };

  const handleBackToGame = () => {
    setCurrentScreen('game');
  };

  const handleCommitCrime = (crimeId: string) => {
    const result = gameEngine.commitCrime(crimeId);
    setGameState(gameEngine.getGameState());
    return result;
  };

  const handleApplyForJob = (careerId: string) => {
    const result = gameEngine.applyForJob(careerId);
    setGameState(gameEngine.getGameState());
    return result;
  };

  const handleSuicide = () => {
    const result = gameEngine.commitSuicide();
    setIsDead(true);
    setCauseOfDeath('suicide');
    setGameState(gameEngine.getGameState());
  };

  const handleSaveGame = () => {
    gameEngine.saveGame();
    // Could show a toast notification here
  };

  const handleShowSettings = () => {
    setShowSettings(true);
  };

  const handleShowStats = () => {
    setShowStats(true);
  };

  const handleQuickStart = () => {
    const randomName = 'Random Name'; // Implement your name generation logic here
    const randomCountry = 'Random Country'; // Implement your country selection logic here
    gameEngine.startNewLife(randomName, randomCountry);
    setGameState(gameEngine.getGameState());
    setCurrentScreen('game');
  };

  const handleNewGameAfterDeath = () => {
    setIsDead(false);
    setCauseOfDeath('natural causes');
    setGameState(gameEngine.getGameState());
    setCurrentScreen('character-creation');
  };

  const handleMainMenuAfterDeath = () => {
    setIsDead(false);
    setCauseOfDeath('natural causes');
    setGameState(gameEngine.getGameState());
    setCurrentScreen('menu');
  };

  const renderCurrentScreen = () => {
    if (isDead && gameState.character) {
      return (
        <DeathScene
          character={gameState.character}
          causeOfDeath={causeOfDeath}
          onNewGame={handleNewGameAfterDeath}
          onMainMenu={handleMainMenuAfterDeath}
        />
      );
    }

    switch (currentScreen) {
      case 'menu':
        return (
          <MainMenu
            onNewGame={handleNewGame}
            onQuickStart={handleQuickStart}
            onLoadGame={handleLoadGame}
            onSettings={handleShowSettings}
            onStats={handleShowStats}
            hasExistingSave={hasExistingSave}
          />
        );

      case 'character-creation':
        return (
          <CharacterCreation
            countries={gameState.countries || []}
            onCreateCharacter={handleCreateCharacter}
            onBack={handleBackToMenu}
          />
        );

      case 'game':
        if (!gameState.character) {
          // If no character exists, redirect to character creation
          setCurrentScreen('character-creation');
          return null;
        }
        return (
          <MobileGameInterface
            character={gameState.character}
            currentYear={gameState.currentYear}
            onAgeUp={handleAgeUp}
            onSaveGame={handleSaveGame}
            onShowSettings={handleShowSettings}
            onShowStats={handleShowStats}
            onViewCareer={handleViewCareer}
            onViewCrime={handleViewCrime}
            onViewLifeActions={handleViewLifeActions}
            prisonStatus={gameEngine.getPrisonStatus()}
          />
        );

      case 'crime':
        if (!gameState.character) {
          setCurrentScreen('character-creation');
          return null;
        }
        return (
          <CrimeInterface
            character={gameState.character}
            onCommitCrime={handleCommitCrime}
            onBack={handleBackToGame}
          />
        );

      case 'career':
        if (!gameState.character) {
          setCurrentScreen('character-creation');
          return null;
        }
        return (
          <CareerInterface
            character={gameState.character}
            careers={gameState.careers}
            onApplyForJob={handleApplyForJob}
            onBack={handleBackToGame}
          />
        );

      case 'life-actions':
        if (!gameState.character) {
          setCurrentScreen('character-creation');
          return null;
        }
        return (
          <LifeActionsInterface
            character={gameState.character}
            onViewCareer={handleViewCareer}
            onViewCrime={handleViewCrime}
            onSuicide={handleSuicide}
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

      {showSettings && (
        <Settings
          onClose={() => setShowSettings(false)}
        />
      )}

      {showStats && gameState.character && (
        <Statistics
          character={gameState.character}
          onClose={() => setShowStats(false)}
        />
      )}
    </div>
  );
}

export default App;