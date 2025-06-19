import React from 'react';
import { Card } from '../App';
import DosCard from './DosCard';
import { RotateCcw, RotateCw } from 'lucide-react';

interface GameCenterProps {
  topCard: Card | null;
  deckCount: number;
  onDrawCard: () => void;
  canDraw: boolean;
  direction: number;
}

export default function GameCenter({ topCard, deckCount, onDrawCard, canDraw, direction }: GameCenterProps) {
  return (
    <div className="text-center">
      <div className="bg-gradient-to-br from-gray-900/80 via-black/60 to-gray-800/80 backdrop-blur-xl rounded-2xl p-8 border border-red-700/30 shadow-2xl">
        <h2 className="text-white font-bold text-2xl mb-8 drop-shadow-lg">Game Center</h2>
        
        <div className="flex items-center justify-center space-x-12">
          {/* Draw pile */}
          <div className="text-center">
            <div
              className={`relative ${
                canDraw ? 'cursor-pointer hover:scale-110 hover:-translate-y-2' : 'cursor-default'
              } transition-all duration-300 transform-gpu`}
              onClick={canDraw ? onDrawCard : undefined}
            >
              <div className="w-24 h-36 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl border-2 border-red-700/40 flex items-center justify-center shadow-2xl relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-700/10 via-transparent to-red-800/10 animate-pulse"></div>
                
                <div className="text-red-700/90 font-black text-xl drop-shadow-lg relative z-10">DOS</div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-xl"></div>
              </div>
              {canDraw && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm px-3 py-1 rounded-full font-bold shadow-lg animate-bounce">
                  Draw
                </div>
              )}
            </div>
            <p className="text-gray-400 text-sm mt-3 font-semibold">
              Draw Pile ({deckCount})
            </p>
          </div>

          {/* Direction indicator */}
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-gray-800 to-black p-4 rounded-full border border-red-700/30 shadow-xl">
              {direction === 1 ? (
                <RotateCw className="w-8 h-8 text-red-700/90 animate-spin-slow" />
              ) : (
                <RotateCcw className="w-8 h-8 text-red-700/90 animate-spin-slow" />
              )}
            </div>
            <p className="text-gray-400 text-sm mt-2 font-semibold">
              {direction === 1 ? 'Clockwise' : 'Counter-clockwise'}
            </p>
          </div>

          {/* Discard pile */}
          <div className="text-center">
            <div className="relative">
              {topCard ? (
                <div className="animate-gentle-bounce">
                  <DosCard card={topCard} size="large" />
                </div>
              ) : (
                <div className="w-24 h-36 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl border-2 border-red-700/40 flex items-center justify-center shadow-xl">
                  <span className="text-gray-400 text-sm font-bold">Empty</span>
                </div>
              )}
              
              {/* Glow effect around discard pile */}
              {topCard && (
                <div className="absolute -inset-2 bg-gradient-to-r from-red-700/20 via-red-800/20 to-red-900/20 rounded-2xl blur-lg -z-10 animate-pulse"></div>
              )}
            </div>
            <p className="text-gray-400 text-sm mt-3 font-semibold">
              Discard Pile
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}