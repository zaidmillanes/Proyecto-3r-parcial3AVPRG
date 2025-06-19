import React from 'react';
import { Card } from '../App';
import DosCard from './DosCard';

interface PlayerHandProps {
  hand: Card[];
  topCard: Card | null;
  onPlayCard: (cardIndex: number, chosenColor?: string) => void;
  canPlay: boolean;
  playerName: string;
}

export default function PlayerHand({ hand, topCard, onPlayCard, canPlay, playerName }: PlayerHandProps) {
  const canPlayCard = (card: Card): boolean => {
    if (!topCard) return false;
    if (card.type === 'wild') return true;
    if (card.color === topCard.color || card.color === topCard.chosenColor) return true;
    if (card.type === 'number' && topCard.type === 'number' && card.value === topCard.value) return true;
    if (card.type === 'action' && topCard.type === 'action' && card.value === topCard.value) return true;
    return false;
  };

  const handleCardClick = (cardIndex: number) => {
    if (!canPlay) return;
    
    const card = hand[cardIndex];
    if (!canPlayCard(card)) return;

    onPlayCard(cardIndex);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-gray-900/80 to-transparent backdrop-blur-lg border-t border-red-500/30">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h2 className="text-white font-bold text-2xl drop-shadow-lg animate-gentle-bounce">
            {playerName}'s Hand ({hand.length} cards)
          </h2>
          {!canPlay && (
            <p className="text-red-300/80 text-sm mt-2 animate-gentle-bounce animation-delay-500">
              Wait for your turn to play cards
            </p>
          )}
        </div>
        
        {hand.length === 0 ? (
          <p className="text-white/70 text-center py-12 text-lg animate-gentle-bounce">No cards in hand</p>
        ) : (
          <div className="flex justify-center">
            <div className="flex gap-1 overflow-x-auto max-w-full pb-4">
              {hand.map((card, index) => {
                const cardCanPlay = canPlayCard(card);
                return (
                  <div
                    key={index}
                    className={`flex-shrink-0 transition-all duration-500 ease-out ${
                      canPlay && cardCanPlay
                        ? 'hover:scale-125 hover:-translate-y-8 cursor-pointer transform-gpu hover:z-50 hover:rotate-3 hover:animate-gentle-bounce'
                        : 'cursor-default'
                    }`}
                    onClick={() => handleCardClick(index)}
                    style={{
                      transform: `translateX(${index * -12}px) rotate(${(index - hand.length / 2) * 2}deg)`,
                      zIndex: hand.length - index,
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="animate-gentle-bounce">
                      <DosCard
                        card={card}
                        size="medium"
                        highlight={canPlay && cardCanPlay}
                        canPlay={canPlay && cardCanPlay}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}