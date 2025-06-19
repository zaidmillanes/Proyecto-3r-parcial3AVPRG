import React from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface GameControlsProps {
  gameStarted: boolean;
  winner: string | null;
  playerCount: number;
  onStartGame: () => void;
}

export default function GameControls({ gameStarted, winner, playerCount, onStartGame }: GameControlsProps) {
  const canStart = playerCount >= 2;
  const showRestartButton = gameStarted && winner;
  const showStartButton = !gameStarted && canStart;

  if (!showStartButton && !showRestartButton) {
    return (
      <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
        <h3 className="text-white font-bold text-lg mb-4">Game Status</h3>
        {!canStart ? (
          <p className="text-white/70 text-center">
            Need at least 2 players to start
          </p>
        ) : gameStarted && !winner ? (
          <p className="text-green-400 text-center font-semibold">
            Game in Progress
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
      <h3 className="text-white font-bold text-lg mb-4">Game Controls</h3>
      
      {showStartButton && (
        <button
          onClick={onStartGame}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Play className="w-5 h-5" />
          <span>Start Game</span>
        </button>
      )}

      {showRestartButton && (
        <button
          onClick={onStartGame}
          className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <RotateCcw className="w-5 h-5" />
          <span>New Game</span>
        </button>
      )}

      <p className="text-white/70 text-sm mt-3 text-center">
        {showStartButton && `${playerCount} players ready`}
        {showRestartButton && 'Start a new round'}
      </p>
    </div>
  );
}