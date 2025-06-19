import React from 'react';
import { Card } from '../App';

interface DosCardProps {
  card: Card;
  size?: 'small' | 'medium' | 'large';
  highlight?: boolean;
  canPlay?: boolean;
}

export default function DosCard({ card, size = 'medium', highlight = false, canPlay = true }: DosCardProps) {
  const getCardColor = () => {
    if (card.chosenColor) return card.chosenColor;
    if (card.color) return card.color;
    return 'black';
  };

  const getCardBackground = () => {
    const color = getCardColor();
    
    // Always show the card's real color, but make unplayable cards slightly faded
    const opacity = canPlay ? '' : 'opacity-70';
    
    switch (color) {
      case 'red': return `bg-gradient-to-br from-red-600 via-red-700 to-red-800 ${opacity}`;
      case 'blue': return `bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 ${opacity}`;
      case 'green': return `bg-gradient-to-br from-green-600 via-green-700 to-green-800 ${opacity}`;
      case 'yellow': return `bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 ${opacity}`;
      default: return `bg-gradient-to-br from-gray-800 via-gray-900 to-black ${opacity}`;
    }
  };

  const getCardSize = () => {
    switch (size) {
      case 'small': return 'w-16 h-24';
      case 'medium': return 'w-20 h-32';
      case 'large': return 'w-24 h-36';
      default: return 'w-20 h-32';
    }
  };

  const getCardValue = () => {
    if (card.type === 'number') return card.value.toString();
    if (card.type === 'action') {
      switch (card.value) {
        case 'skip': return '⊘';
        case 'reverse': return '↻';
        case 'draw2': return '+2';
        default: return card.value;
      }
    }
    if (card.type === 'wild') {
      return card.value === 'wild_draw4' ? '+4' : 'W';
    }
    return '?';
  };

  const getCenterSize = () => {
    switch (size) {
      case 'small': return 'text-lg';
      case 'medium': return 'text-2xl';
      case 'large': return 'text-4xl';
      default: return 'text-2xl';
    }
  };

  const getCardBorder = () => {
    const color = getCardColor();
    const borderOpacity = canPlay ? '60' : '40';
    
    switch (color) {
      case 'red': return `border-red-400/${borderOpacity}`;
      case 'blue': return `border-blue-400/${borderOpacity}`;
      case 'green': return `border-green-400/${borderOpacity}`;
      case 'yellow': return `border-yellow-400/${borderOpacity}`;
      default: return `border-gray-400/${borderOpacity}`;
    }
  };

  return (
    <div
      className={`
        ${getCardSize()}
        ${getCardBackground()}
        ${getCardBorder()}
        rounded-xl border-2 
        flex flex-col items-center justify-center
        text-white font-black shadow-2xl
        ${canPlay ? 'transition-all duration-300 hover:scale-110 hover:shadow-3xl transform-gpu hover:animate-gentle-bounce cursor-pointer' : 'cursor-not-allowed'}
        relative overflow-hidden
      `}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20"></div>
        <div className="absolute top-2 left-2 w-4 h-4 bg-white/20 rounded-full animate-gentle-bounce animation-delay-500"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 bg-white/15 rounded-full animate-gentle-bounce animation-delay-1000"></div>
      </div>
      
      {/* Center value with enhanced styling - NO corner numbers */}
      <div className={`${getCenterSize()} font-black drop-shadow-2xl relative z-10 animate-gentle-bounce animation-delay-300`}>
        <div className="relative">
          {getCardValue()}
          {/* Glow effect for center text */}
          <div className="absolute inset-0 blur-sm opacity-50">
            {getCardValue()}
          </div>
        </div>
      </div>

      {/* Special effects for wild cards */}
      {card.type === 'wild' && (
        <>
          <div className="absolute inset-0 rounded-xl opacity-40">
            <div className="w-full h-full bg-gradient-conic from-red-500 via-blue-500 via-green-500 via-yellow-500 to-red-500 rounded-xl animate-spin-slow"></div>
          </div>
          <div className="absolute inset-2 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-lg opacity-80"></div>
        </>
      )}

      {/* Card shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-xl"></div>
      
      {/* Subtle inner shadow for depth */}
      <div className="absolute inset-0 rounded-xl shadow-inner"></div>

      {/* Visual indicator for unplayable cards */}
      {!canPlay && (
        <div className="absolute inset-0 bg-gray-900/30 rounded-xl flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/50 rounded-full flex items-center justify-center">
            <div className="w-4 h-0.5 bg-white/70 rotate-45"></div>
            <div className="w-4 h-0.5 bg-white/70 -rotate-45 absolute"></div>
          </div>
        </div>
      )}
    </div>
  );
}