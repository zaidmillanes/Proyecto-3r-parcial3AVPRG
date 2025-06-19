import { WebSocketServer } from 'ws';
import { createDosGame } from './gameLogic.js';

const wss = new WebSocketServer({ port: 8080 });

let game = null;
let players = new Map();

console.log('DOS Game Server started on port 8080');

wss.on('connection', (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  console.log(`New client connected from ${clientIp}`);

  // Store WebSocket connection reference for calling DOS
  ws.playerId = null;

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      handleMessage(ws, data);
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    // Remove player from game when they disconnect
    for (const [playerId, playerWs] of players) {
      if (playerWs === ws) {
        players.delete(playerId);
        if (game) {
          game.removePlayer(playerId);
          broadcastPlayerStates();
          broadcast('gameMessage', { message: `${game.getPlayerName(playerId)} left the game` });
        }
        break;
      }
    }
    console.log(`Client from ${clientIp} disconnected`);
  });
});

function handleMessage(ws, data) {
  const { type, payload } = data;

  switch (type) {
    case 'joinGame':
      handleJoinGame(ws, payload);
      break;
    case 'startGame':
      handleStartGame(ws, payload);
      break;
    case 'playCard':
      handlePlayCard(ws, payload);
      break;
    case 'drawCard':
      handleDrawCard(ws, payload);
      break;
    case 'chooseColor':
      handleChooseColor(ws, payload);
      break;
    case 'sayDos':
      handleSayDos(ws, payload);
      break;
    case 'callDosOnPlayer':
      handleCallDosOnPlayer(ws, payload);
      break;
    default:
      console.log('Unknown message type:', type);
  }
}

function handleJoinGame(ws, { playerName }) {
  const playerId = generatePlayerId();
  players.set(playerId, ws);
  ws.playerId = playerId;

  if (!game) {
    game = createDosGame();
  }

  const success = game.addPlayer(playerId, playerName);
  
  if (success) {
    // Send player their personal state (including their hand)
    const playerState = game.getPlayerState(playerId);
    ws.send(JSON.stringify({
      type: 'joined',
      payload: { playerId, playerState }
    }));

    // Broadcast to other players (without the new player's hand)
    broadcast('playerJoined', { 
      playerId, 
      playerName, 
      gameState: game.getState() 
    }, playerId);

    broadcast('gameMessage', { message: `${playerName} joined the game` });
  } else {
    ws.send(JSON.stringify({
      type: 'error',
      payload: { message: 'Could not join game (room full or game in progress)' }
    }));
  }
}

function handleStartGame(ws, { playerId }) {
  if (!game) return;

  const result = game.startGame();
  
  if (result.success) {
    broadcastPlayerStates();
    broadcast('gameMessage', { message: result.message });
  } else {
    ws.send(JSON.stringify({
      type: 'error',
      payload: { message: result.message }
    }));
  }
}

function handlePlayCard(ws, { playerId, cardIndex, chosenColor }) {
  if (!game) return;

  const result = game.playCard(playerId, cardIndex, chosenColor);
  
  if (result.success) {
    // Send updated state to all players with their individual hands
    broadcastPlayerStates();
    broadcast('gameMessage', { message: result.message });
  } else {
    ws.send(JSON.stringify({
      type: 'error',
      payload: { message: result.message }
    }));
  }
}

function handleDrawCard(ws, { playerId }) {
  if (!game) return;

  const result = game.drawCard(playerId);
  
  if (result.success) {
    broadcastPlayerStates();
    broadcast('gameMessage', { message: `${game.getPlayerName(playerId)} drew a card` });
  } else {
    ws.send(JSON.stringify({
      type: 'error',
      payload: { message: result.message }
    }));
  }
}

function handleChooseColor(ws, { playerId, color }) {
  if (!game) return;

  const result = game.chooseWildColor(playerId, color);
  
  if (result.success) {
    broadcastPlayerStates();
    broadcast('gameMessage', { message: `Color chosen: ${color}` });
  }
}

function handleSayDos(ws, { playerId }) {
  if (!game) return;

  const result = game.sayDos(playerId);
  
  if (result.success) {
    broadcastPlayerStates();
    broadcast('gameMessage', { message: `${game.getPlayerName(playerId)} said DOS!` });
  }
}

function handleCallDosOnPlayer(ws, { callerId, targetId }) {
  if (!game) return;

  const result = game.callDosOnPlayer(callerId, targetId);
  
  if (result.success) {
    broadcastPlayerStates();
    broadcast('gameMessage', { message: result.message });
  } else {
    ws.send(JSON.stringify({
      type: 'error',
      payload: { message: result.message }
    }));
  }
}

function broadcastPlayerStates() {
  for (const [playerId, ws] of players) {
    if (ws.readyState === ws.OPEN) {
      const playerState = game.getPlayerState(playerId);
      ws.send(JSON.stringify({
        type: 'gameUpdate',
        payload: { playerState }
      }));
    }
  }
}

function broadcast(type, payload, excludePlayer = null) {
  const message = JSON.stringify({ type, payload });
  
  for (const [playerId, ws] of players) {
    if (playerId !== excludePlayer && ws.readyState === ws.OPEN) {
      ws.send(message);
    }
  }
}

function generatePlayerId() {
  return Math.random().toString(36).substr(2, 9);
}