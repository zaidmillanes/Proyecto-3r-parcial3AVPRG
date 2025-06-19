import React, { useState } from 'react';
import { Play, User } from 'lucide-react';

interface JoinGameProps {
  onConnect: (url: string, name: string) => void;
}

export default function JoinGame({ onConnect }: JoinGameProps) {
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      // Always connect to localhost:8080
      const url = 'ws://localhost:8080';
      onConnect(url, playerName.trim());
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-white/20">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-red-700/90 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Join DOS Game
          </h2>
          <p className="text-white/70">
            Enter your name to start playing
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="playerName" className="block text-white font-medium mb-3">
              Your Name
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-4 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent text-lg"
              placeholder="Enter your name"
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-gray-700 to-red-700/90 hover:from-gray-800 hover:to-red-800/90 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
          >
            <Play className="w-6 h-6" />
            <span>Start Playing</span>
          </button>
        </form>

        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <h3 className="text-white font-semibold mb-2">How to Play with Friends</h3>
          <div className="text-white/70 text-sm space-y-1">
            <p>• Make sure the server is running with <code className="bg-white/10 px-1 rounded">npm run dev</code></p>
            <p>• Share your computer's IP address with friends</p>
            <p>• Friends can connect from their devices using your IP</p>
          </div>
        </div>
      </div>
    </div>
  );
}