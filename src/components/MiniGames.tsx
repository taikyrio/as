
import React, { useState, useEffect } from 'react';
import { Character } from '../types/GameTypes';
import { Zap, Target, Brain, Clock, Trophy, ArrowLeft } from 'lucide-react';

interface MiniGamesProps {
  character: Character;
  onBack: () => void;
  gameEngine: any;
  onGameStateChange: () => void;
}

export const MiniGames: React.FC<MiniGamesProps> = ({
  character,
  onBack,
  gameEngine,
  onGameStateChange
}) => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [gameResult, setGameResult] = useState<string>('');

  const QuickTimeGame = () => {
    const [timeLeft, setTimeLeft] = useState(10);
    const [clicks, setClicks] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);

    useEffect(() => {
      if (gameStarted && timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else if (timeLeft === 0 && gameStarted) {
        setGameEnded(true);
        const reward = Math.floor(clicks * 10);
        if (clicks > 25) {
          character.stats.health = Math.min(100, character.stats.health + 5);
          character.bankAccount.balance += reward;
          gameEngine.addLifeEvent({
            id: Date.now().toString(),
            title: 'Workout Challenge',
            description: `You completed a fitness challenge! Earned $${reward}`,
            year: character.age,
            impact: { health: 5 }
          });
          setGameResult(`Great job! ${clicks} clicks earned you $${reward} and improved your health!`);
        } else {
          setGameResult(`You clicked ${clicks} times. Try to get over 25 clicks for rewards!`);
        }
        onGameStateChange();
      }
    }, [timeLeft, gameStarted, clicks]);

    return (
      <div className="text-center p-6">
        <h3 className="text-xl font-bold text-white mb-4">Fitness Challenge</h3>
        <p className="text-gray-300 mb-4">Click as fast as you can for 10 seconds!</p>
        
        {!gameStarted && !gameEnded && (
          <button
            onClick={() => setGameStarted(true)}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Start Challenge
          </button>
        )}

        {gameStarted && !gameEnded && (
          <div>
            <div className="text-4xl text-white mb-4">{timeLeft}</div>
            <button
              onClick={() => setClicks(clicks + 1)}
              className="w-32 h-32 bg-red-500 text-white text-2xl font-bold rounded-full hover:bg-red-600 transition-colors active:scale-95"
            >
              CLICK!
            </button>
            <div className="text-white mt-4">Clicks: {clicks}</div>
          </div>
        )}

        {gameEnded && (
          <div>
            <p className="text-white mb-4">{gameResult}</p>
            <button
              onClick={() => setActiveGame(null)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Back to Games
            </button>
          </div>
        )}
      </div>
    );
  };

  const MemoryGame = () => {
    const [sequence, setSequence] = useState<number[]>([]);
    const [playerSequence, setPlayerSequence] = useState<number[]>([]);
    const [displaying, setDisplaying] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [level, setLevel] = useState(1);
    const [gameEnded, setGameEnded] = useState(false);

    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'];

    const startGame = () => {
      const newSequence = [Math.floor(Math.random() * 4)];
      setSequence(newSequence);
      setPlayerSequence([]);
      setGameStarted(true);
      showSequence(newSequence);
    };

    const showSequence = (seq: number[]) => {
      setDisplaying(true);
      // Implementation would show sequence with delays
      setTimeout(() => setDisplaying(false), seq.length * 600);
    };

    const playerClick = (index: number) => {
      if (displaying) return;
      
      const newPlayerSequence = [...playerSequence, index];
      setPlayerSequence(newPlayerSequence);

      if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
        // Wrong sequence
        setGameEnded(true);
        const reward = (level - 1) * 50;
        if (level > 3) {
          character.stats.intelligence = Math.min(100, character.stats.intelligence + level);
          character.bankAccount.balance += reward;
          gameEngine.addLifeEvent({
            id: Date.now().toString(),
            title: 'Memory Challenge',
            description: `You completed ${level - 1} levels! Earned $${reward}`,
            year: character.age,
            impact: { intelligence: level }
          });
          setGameResult(`Excellent memory! Level ${level - 1} completed. Earned $${reward} and boosted intelligence!`);
        } else {
          setGameResult(`Game over at level ${level}. Try to reach level 3 for rewards!`);
        }
        onGameStateChange();
      } else if (newPlayerSequence.length === sequence.length) {
        // Correct sequence completed
        const nextLevel = level + 1;
        setLevel(nextLevel);
        const newSequence = [...sequence, Math.floor(Math.random() * 4)];
        setSequence(newSequence);
        setPlayerSequence([]);
        showSequence(newSequence);
      }
    };

    return (
      <div className="text-center p-6">
        <h3 className="text-xl font-bold text-white mb-4">Memory Challenge</h3>
        <p className="text-gray-300 mb-4">Remember and repeat the sequence!</p>
        
        {!gameStarted && !gameEnded && (
          <button
            onClick={startGame}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Game
          </button>
        )}

        {gameStarted && !gameEnded && (
          <div>
            <div className="text-white mb-4">Level: {level}</div>
            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
              {colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => playerClick(index)}
                  className={`w-20 h-20 ${color} rounded-lg hover:opacity-80 transition-opacity ${
                    displaying ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                  disabled={displaying}
                />
              ))}
            </div>
          </div>
        )}

        {gameEnded && (
          <div>
            <p className="text-white mb-4">{gameResult}</p>
            <button
              onClick={() => setActiveGame(null)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Back to Games
            </button>
          </div>
        )}
      </div>
    );
  };

  const NumberGame = () => {
    const [target, setTarget] = useState(0);
    const [current, setCurrent] = useState(0);
    const [operations, setOperations] = useState<string[]>([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
      if (gameStarted && timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else if (timeLeft === 0 && gameStarted) {
        endGame();
      }
    }, [timeLeft, gameStarted]);

    const startGame = () => {
      setTarget(Math.floor(Math.random() * 100) + 50);
      setCurrent(Math.floor(Math.random() * 20) + 1);
      setOperations([]);
      setGameStarted(true);
      setTimeLeft(30);
    };

    const endGame = () => {
      setGameEnded(true);
      const difference = Math.abs(target - current);
      if (difference <= 5) {
        const reward = Math.max(100, 200 - difference * 20);
        character.stats.intelligence = Math.min(100, character.stats.intelligence + 10);
        character.bankAccount.balance += reward;
        gameEngine.addLifeEvent({
          id: Date.now().toString(),
          title: 'Math Challenge',
          description: `You solved a complex math puzzle! Earned $${reward}`,
          year: character.age,
          impact: { intelligence: 10 }
        });
        setGameResult(`Excellent! You got within ${difference} of the target! Earned $${reward}!`);
      } else {
        setGameResult(`Close! You were ${difference} away from ${target}. Try to get within 5 for rewards!`);
      }
      onGameStateChange();
    };

    return (
      <div className="text-center p-6">
        <h3 className="text-xl font-bold text-white mb-4">Math Challenge</h3>
        <p className="text-gray-300 mb-4">Get as close to the target number as possible!</p>
        
        {!gameStarted && !gameEnded && (
          <button
            onClick={startGame}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Start Challenge
          </button>
        )}

        {gameStarted && !gameEnded && (
          <div>
            <div className="text-white mb-4">Time: {timeLeft}s</div>
            <div className="text-2xl text-white mb-2">Target: {target}</div>
            <div className="text-xl text-blue-300 mb-4">Current: {current}</div>
            
            <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto mb-4">
              <button
                onClick={() => setCurrent(current + 1)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                +1
              </button>
              <button
                onClick={() => setCurrent(current - 1)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                -1
              </button>
              <button
                onClick={() => setCurrent(current * 2)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                ×2
              </button>
              <button
                onClick={() => setCurrent(Math.floor(current / 2))}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                ÷2
              </button>
            </div>
            
            <button
              onClick={endGame}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Submit Answer
            </button>
          </div>
        )}

        {gameEnded && (
          <div>
            <p className="text-white mb-4">{gameResult}</p>
            <button
              onClick={() => setActiveGame(null)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Back to Games
            </button>
          </div>
        )}
      </div>
    );
  };

  if (activeGame === 'fitness') return <QuickTimeGame />;
  if (activeGame === 'memory') return <MemoryGame />;
  if (activeGame === 'math') return <NumberGame />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">Mini Games</h1>
        </div>

        <div className="space-y-4">
          <div 
            onClick={() => setActiveGame('fitness')}
            className="p-6 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl cursor-pointer hover:from-green-500 hover:to-emerald-500 transition-all transform hover:scale-105"
          >
            <div className="flex items-center gap-4">
              <Zap className="w-8 h-8 text-white" />
              <div>
                <h3 className="text-white font-bold text-lg">Fitness Challenge</h3>
                <p className="text-green-100 text-sm">Test your reflexes and earn health points!</p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setActiveGame('memory')}
            className="p-6 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl cursor-pointer hover:from-blue-500 hover:to-cyan-500 transition-all transform hover:scale-105"
          >
            <div className="flex items-center gap-4">
              <Brain className="w-8 h-8 text-white" />
              <div>
                <h3 className="text-white font-bold text-lg">Memory Challenge</h3>
                <p className="text-blue-100 text-sm">Boost your intelligence with memory games!</p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setActiveGame('math')}
            className="p-6 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl cursor-pointer hover:from-purple-500 hover:to-indigo-500 transition-all transform hover:scale-105"
          >
            <div className="flex items-center gap-4">
              <Target className="w-8 h-8 text-white" />
              <div>
                <h3 className="text-white font-bold text-lg">Math Challenge</h3>
                <p className="text-purple-100 text-sm">Solve puzzles to increase intelligence!</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-white/5 rounded-xl">
          <h3 className="text-white font-semibold mb-2">How Mini Games Work</h3>
          <p className="text-gray-300 text-sm">
            Complete mini games to earn money and improve your stats! Each game rewards different abilities and becomes available at different ages.
          </p>
        </div>
      </div>
    </div>
  );
};
