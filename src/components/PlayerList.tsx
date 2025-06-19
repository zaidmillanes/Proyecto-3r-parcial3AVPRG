import React from 'react';
import { Player } from '../App';
import { Crown, User } from 'lucide-react';

interface PlayerListProps {
  players: Player[];
  currentPlayer: string | null;
  myPlayerId: string;
}

export default function PlayerList({ players, currentPlayer, myPlayerId }: PlayerListProps) {
  return (
    <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 mb-6">
      <h2 className="text-white font-bold text-xl mb-4">Players</h2>
      
      <div className="space-y-3">
        {players.map((player) => (
          <div
            key={player.id}
            className={`
              flex items-center justify-between p-3 rounded-lg transition-all duration-200
              ${currentPlayer === player.id ? 'bg-green-500/20 border border-green-400' : 'bg-white/5'}
              ${player.id === myPlayerId ? 'ring-1 ring-gray-600' : ''}
            `}
          >
            <div className="flex items-center space-x-3">
              {player.id === myPlayerId ? (
                <Crown className="w-5 h-5 text-gray-400" />
              ) : (
                <User className="w-5 h-5 text-white/70" />
              )}
              <div>
                <p className={`font-semibold ${player.id === myPlayerId ? 'text-gray-400' : 'text-white'}`}>
                  {player.name}
                  {player.id === myPlayerId && ' (You)'}
                </p>
                {currentPlayer === player.id && (
                  <p className="text-green-400 text-xs font-medium">Current Turn</p>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-white font-bold">
                {player.handCount}
              </p>
              <p className="text-white/70 text-xs">cards</p>
              {player.saidDos && (
                <p className="text-red-700/90 text-xs font-bold">DOS!</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}