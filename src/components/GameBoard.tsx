import React from 'react';
import { PlayerState } from '../App';
import PlayerHand from './PlayerHand';
import GameCenter from './GameCenter';
import PlayerList from './PlayerList';
import GameMessages from './GameMessages';
import ColorPicker from './ColorPicker';
import GameControls from './GameControls';

interface GameBoardProps {
  playerState: PlayerState;
  playerId: string;
  playerName: string;
  onStartGame: () => void;
  onPlayCard: (cardIndex: number, chosenColor?: string) => void;
  onDrawCard: () => void;
  onChooseColor: (color: string) => void;
  onSayDos: () => void;
  messages: string[];
  connected: boolean;
}

export default function GameBoard({
  playerState,
  playerId,
  playerName,
  onStartGame,
  onPlayCard,
  onDrawCard,
  onChooseColor,
  onSayDos,
  messages,
  connected
}: GameBoardProps) {
  const isMyTurn = playerState.currentPlayer === playerId;
  const needsColorChoice = playerState.waitingForColorChoice && isMyTurn;
  
  const currentPlayerName = playerState.players.find(p => p.id === playerState.currentPlayer)?.name || '';
  const myPlayer = playerState.players.find(p => p.id === playerId);

  // Find players with 1 card who haven't said DOS (including myself)
  const playersWithOneCard = playerState.players.filter(p => 
    p.handCount === 1 && !p.saidDos
  );

  const handleCallDosOnPlayer = (targetPlayerId: string) => {
    // Send message to call DOS on another player via WebSocket
    const ws = (window as any).wsConnection;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'callDosOnPlayer',
        payload: { callerId: playerId, targetId: targetPlayerId }
      }));
    }
  };

  const handleSayDos = (targetPlayerId: string) => {
    // If it's my own DOS button, use the onSayDos prop
    if (targetPlayerId === playerId) {
      onSayDos();
    } else {
      // If calling DOS on another player
      handleCallDosOnPlayer(targetPlayerId);
    }
  };

  return (
    <div className="min-h-screen pb-48">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            DOS Game
          </h1>
          {playerState.gameStarted ? (
            <p className="text-white/80">
              {playerState.winner ? (
                <span className="text-gray-400 font-bold text-xl">
                  🎉 {playerState.players.find(p => p.id === playerState.winner)?.name} Wins! 🎉
                </span>
              ) : isMyTurn ? (
                <span className="text-green-400 font-semibold">Your Turn</span>
              ) : (
                <span>{currentPlayerName}'s Turn</span>
              )}
            </p>
          ) : (
            <p className="text-white/80">
              Waiting for game to start... ({playerState.players.length}/4 players)
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar - Player list and Game Controls */}
          <div className="lg:col-span-1 space-y-6">
            <PlayerList 
              players={playerState.players} 
              currentPlayer={playerState.currentPlayer}
              myPlayerId={playerId}
            />
            <GameControls
              gameStarted={playerState.gameStarted}
              winner={playerState.winner}
              playerCount={playerState.players.length}
              onStartGame={onStartGame}
            />
            <GameMessages messages={messages} connected={connected} />
          </div>

          {/* Main game area */}
          <div className="lg:col-span-2">
            <GameCenter
              topCard={playerState.topCard}
              deckCount={playerState.deckCount}
              onDrawCard={onDrawCard}
              canDraw={isMyTurn && !needsColorChoice && !playerState.winner}
              direction={playerState.direction}
            />
            
            {needsColorChoice && (
              <div className="mt-6">
                <ColorPicker onChooseColor={onChooseColor} />
              </div>
            )}
          </div>

          {/* Right sidebar - DOS buttons for ALL players with 1 card */}
          <div className="lg:col-span-1 space-y-4">
            {playersWithOneCard.length > 0 && !playerState.winner && (
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
                <h3 className="text-white font-bold text-lg mb-3 text-center">DOS Alert!</h3>
                <p className="text-white/70 text-xs mb-4 text-center">
                  Players with 1 card - Click DOS button!
                </p>
                <div className="space-y-3">
                  {playersWithOneCard.map((player) => (
                    <div key={player.id} className="text-center">
                      <button
                        onClick={() => handleSayDos(player.id)}
                        className={`w-full font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm ${
                          player.id === playerId
                            ? 'bg-gradient-to-r from-red-700/90 to-red-800/90 hover:from-red-800/90 hover:to-red-900/90 text-white animate-pulse'
                            : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white animate-bounce'
                        }`}
                      >
                        {player.id === playerId ? 'Say DOS!' : `Call DOS on ${player.name}!`}
                      </button>
                      <p className="text-white/50 text-xs mt-2">
                        {player.id === playerId 
                          ? 'You have 1 card left!' 
                          : `${player.name} gets 3 penalty cards!`
                        }
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions when no one has 1 card */}
            {playersWithOneCard.length === 0 && playerState.gameStarted && !playerState.winner && (
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
                <h3 className="text-white font-bold text-lg mb-3 text-center">DOS Rules</h3>
                <div className="text-white/70 text-xs space-y-2">
                  <p>• When you have 1 card left, click "Say DOS!"</p>
                  <p>• If someone forgets to say DOS, click their button to give them 3 penalty cards</p>
                  <p>• Win instantly with a black +4 card as your last card</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Player's hand - Fixed at bottom */}
      <PlayerHand
        hand={playerState.hand}
        topCard={playerState.topCard}
        onPlayCard={onPlayCard}
        canPlay={isMyTurn && !needsColorChoice && !playerState.winner}
        playerName={playerName}
      />
    </div>
  );
}