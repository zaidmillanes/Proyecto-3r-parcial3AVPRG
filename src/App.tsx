import React, { useState, useEffect, useRef } from 'react';
import GameBoard from './components/GameBoard';
import JoinGame from './components/JoinGame';
import { Wifi, WifiOff } from 'lucide-react';

export interface Card {
  color: string | null;
  type: 'number' | 'action' | 'wild';
  value: number | string;
  chosenColor?: string;
}

export interface Player {
  id: string;
  name: string;
  handCount: number;
  saidDos: boolean;
}

export interface GameState {
  players: Player[];
  currentPlayer: string | null;
  topCard: Card | null;
  gameStarted: boolean;
  waitingForColorChoice: boolean;
  winner: string | null;
  direction: number;
  deckCount: number;
}

export interface PlayerState extends GameState {
  hand: Card[];
}

function App() {
  const [connected, setConnected] = useState(false);
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const connectToServer = (url: string, name: string) => {
    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;
      
      // Store WebSocket connection globally for calling DOS
      (window as any).wsConnection = ws;

      ws.onopen = () => {
        setConnected(true);
        setPlayerName(name);
        addMessage('Connected to server');
        
        // Join the game
        ws.send(JSON.stringify({
          type: 'joinGame',
          payload: { playerName: name }
        }));
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleServerMessage(message);
      };

      ws.onclose = () => {
        setConnected(false);
        setPlayerState(null);
        setPlayerId(null);
        addMessage('Disconnected from server');
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        addMessage('Connection error - Make sure the server is running');
      };

    } catch (error) {
      console.error('Failed to connect:', error);
      addMessage('Failed to connect to server');
    }
  };

  const handleServerMessage = (message: any) => {
    const { type, payload } = message;

    switch (type) {
      case 'joined':
        setPlayerId(payload.playerId);
        setPlayerState(payload.playerState);
        addMessage('Joined game successfully');
        break;

      case 'gameUpdate':
        setPlayerState(payload.playerState);
        break;

      case 'playerJoined':
        setPlayerState(prev => prev ? { ...prev, ...payload.gameState } : null);
        addMessage(`${payload.playerName} joined the game`);
        break;

      case 'playerLeft':
        setPlayerState(prev => prev ? { ...prev, ...payload.gameState } : null);
        addMessage('A player left the game');
        break;

      case 'gameMessage':
        addMessage(payload.message);
        break;

      case 'error':
        addMessage(`Error: ${payload.message}`);
        break;

      default:
        console.log('Unknown message type:', type);
    }
  };

  const addMessage = (text: string) => {
    setMessages(prev => [...prev.slice(-9), text]);
  };

  const sendMessage = (type: string, payload: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, payload }));
    }
  };

  const startGame = () => {
    sendMessage('startGame', { playerId });
  };

  const playCard = (cardIndex: number, chosenColor?: string) => {
    sendMessage('playCard', { playerId, cardIndex, chosenColor });
  };

  const drawCard = () => {
    sendMessage('drawCard', { playerId });
  };

  const chooseColor = (color: string) => {
    sendMessage('chooseColor', { playerId, color });
  };

  const sayDos = () => {
    sendMessage('sayDos', { playerId });
  };

  if (!connected || !playerState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900/80">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-700/90 via-red-800/90 to-red-900/90 mb-6 drop-shadow-2xl animate-pulse">
              DOS
            </h1>
            <p className="text-2xl text-gray-400 font-semibold">
              Multiplayer Card Game
            </p>
          </div>
          
          <div className="flex items-center justify-center mb-6">
            {connected ? (
              <div className="flex items-center text-green-400 bg-green-400/10 px-4 py-2 rounded-full border border-green-400/30">
                <Wifi className="w-5 h-5 mr-2" />
                Connected
              </div>
            ) : (
              <div className="flex items-center text-red-700/90 bg-red-700/10 px-4 py-2 rounded-full border border-red-700/30">
                <WifiOff className="w-5 h-5 mr-2" />
                Disconnected
              </div>
            )}
          </div>

          <JoinGame onConnect={connectToServer} />
          
          {messages.length > 0 && (
            <div className="mt-8 max-w-md mx-auto">
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-red-700/30">
                <h3 className="text-white font-bold mb-4 text-lg">Messages</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {messages.map((message, index) => (
                    <p key={index} className="text-gray-300 text-sm p-2 bg-red-700/10 rounded border-l-2 border-red-700/50">
                      {message}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900/80">
      <GameBoard
        playerState={playerState}
        playerId={playerId!}
        playerName={playerName}
        onStartGame={startGame}
        onPlayCard={playCard}
        onDrawCard={drawCard}
        onChooseColor={chooseColor}
        onSayDos={sayDos}
        messages={messages}
        connected={connected}
      />
    </div>
  );
}

export default App;