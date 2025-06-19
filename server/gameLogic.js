export function createDosGame() {
  let players = new Map();
  let deck = [];
  let discardPile = [];
  let currentPlayerIndex = 0;
  let direction = 1; // 1 for clockwise, -1 for counter-clockwise
  let gameStarted = false;
  let waitingForColorChoice = false;
  let winner = null;

  const colors = ['red', 'blue', 'green', 'yellow'];
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const actionCards = ['skip', 'reverse', 'draw2'];
  const wildCards = ['wild', 'wild_draw4'];

  function initializeDeck() {
    deck = [];
    
    // Add number cards (0-9) - one 0 per color, two of each 1-9 per color
    for (const color of colors) {
      deck.push({ color, type: 'number', value: 0 });
      for (let i = 1; i <= 9; i++) {
        deck.push({ color, type: 'number', value: i });
        deck.push({ color, type: 'number', value: i });
      }
    }

    // Add action cards - two of each per color
    for (const color of colors) {
      for (const action of actionCards) {
        deck.push({ color, type: 'action', value: action });
        deck.push({ color, type: 'action', value: action });
      }
    }

    // Add wild cards - four of each
    for (let i = 0; i < 4; i++) {
      deck.push({ color: null, type: 'wild', value: 'wild' });
      deck.push({ color: null, type: 'wild', value: 'wild_draw4' });
    }

    shuffleDeck();
  }

  function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  function dealCards() {
    const playerIds = Array.from(players.keys());
    
    // Deal 7 cards to each player
    for (let i = 0; i < 7; i++) {
      for (const playerId of playerIds) {
        const card = deck.pop();
        players.get(playerId).hand.push(card);
      }
    }

    // Place first card in discard pile (can't be a wild card)
    let firstCard;
    do {
      firstCard = deck.pop();
    } while (firstCard.type === 'wild');
    
    discardPile.push(firstCard);

    // Apply first card effect if it's an action card
    if (firstCard.type === 'action') {
      applyCardEffect(firstCard, null);
    }
  }

  function addPlayer(playerId, playerName) {
    if (players.size >= 4) {
      return false;
    }

    players.set(playerId, {
      id: playerId,
      name: playerName,
      hand: [],
      saidDos: false
    });

    return true;
  }

  function removePlayer(playerId) {
    players.delete(playerId);
    
    if (players.size < 2 && gameStarted) {
      resetGame();
    } else if (gameStarted) {
      // Adjust current player index if needed
      const playerIds = Array.from(players.keys());
      if (currentPlayerIndex >= playerIds.length) {
        currentPlayerIndex = 0;
      }
    }
  }

  function startGame() {
    if (players.size < 2) {
      return { success: false, message: 'Need at least 2 players to start' };
    }
    
    resetGame();
    initializeDeck();
    dealCards();
    gameStarted = true;
    currentPlayerIndex = 0;
    
    return { success: true, message: 'Game started!' };
  }

  function resetGame() {
    gameStarted = false;
    deck = [];
    discardPile = [];
    currentPlayerIndex = 0;
    direction = 1;
    waitingForColorChoice = false;
    winner = null;
    
    for (const player of players.values()) {
      player.hand = [];
      player.saidDos = false;
    }
  }

  function getCurrentPlayer() {
    const playerIds = Array.from(players.keys());
    return playerIds[currentPlayerIndex];
  }

  function getPlayerName(playerId) {
    const player = players.get(playerId);
    return player ? player.name : 'Unknown';
  }

  function nextPlayer() {
    const playerCount = players.size;
    currentPlayerIndex = (currentPlayerIndex + direction + playerCount) % playerCount;
  }

  function canPlayCard(card, topCard) {
    if (card.type === 'wild') return true;
    if (card.color === topCard.color) return true;
    if (card.color === topCard.chosenColor) return true;
    if (card.type === 'number' && topCard.type === 'number' && card.value === topCard.value) return true;
    if (card.type === 'action' && topCard.type === 'action' && card.value === topCard.value) return true;
    return false;
  }

  function playCard(playerId, cardIndex, chosenColor = null) {
    if (!gameStarted || winner) {
      return { success: false, message: 'Game not in progress' };
    }

    const currentPlayerId = getCurrentPlayer();
    if (playerId !== currentPlayerId) {
      return { success: false, message: 'Not your turn' };
    }

    if (waitingForColorChoice) {
      return { success: false, message: 'Waiting for color choice' };
    }

    const player = players.get(playerId);
    if (!player || cardIndex >= player.hand.length) {
      return { success: false, message: 'Invalid card' };
    }

    const card = player.hand[cardIndex];
    const topCard = discardPile[discardPile.length - 1];

    if (!canPlayCard(card, topCard)) {
      return { success: false, message: 'Cannot play this card' };
    }

    // Remove card from player's hand
    player.hand.splice(cardIndex, 1);
    
    // Add card to discard pile
    if (card.type === 'wild' && chosenColor) {
      card.chosenColor = chosenColor;
    }
    discardPile.push(card);

    // Check for automatic win with black +4 card
    if (player.hand.length === 0 && card.type === 'wild' && card.value === 'wild_draw4') {
      winner = playerId;
      return { success: true, message: `${player.name} wins with a black +4 card!` };
    }

    // Check for regular win
    if (player.hand.length === 0) {
      winner = playerId;
      return { success: true, message: `${player.name} wins!` };
    }

    // Apply card effect
    applyCardEffect(card, playerId);

    // Reset DOS status after playing a card
    player.saidDos = false;

    return { success: true, message: `${player.name} played ${getCardName(card)}` };
  }

  function applyCardEffect(card, playerId) {
    switch (card.value) {
      case 'skip':
        nextPlayer(); // Skip next player
        nextPlayer(); // Move to player after skipped one
        break;
        
      case 'reverse':
        if (players.size === 2) {
          // In 2-player game, reverse acts like skip
          nextPlayer();
          nextPlayer();
        } else {
          direction *= -1;
          nextPlayer();
        }
        break;
        
      case 'draw2':
        nextPlayer();
        const nextPlayerId = getCurrentPlayer();
        drawCards(nextPlayerId, 2);
        nextPlayer();
        break;
        
      case 'wild':
        if (card.chosenColor) {
          discardPile[discardPile.length - 1].color = card.chosenColor;
        } else {
          waitingForColorChoice = true;
          return; // Don't advance to next player yet
        }
        nextPlayer();
        break;
        
      case 'wild_draw4':
        if (card.chosenColor) {
          discardPile[discardPile.length - 1].color = card.chosenColor;
        } else {
          waitingForColorChoice = true;
          return; // Don't advance to next player yet
        }
        nextPlayer();
        const targetPlayerId = getCurrentPlayer();
        drawCards(targetPlayerId, 4);
        nextPlayer();
        break;
        
      default:
        nextPlayer();
    }
  }

  function drawCard(playerId) {
    if (!gameStarted || winner) {
      return { success: false, message: 'Game not in progress' };
    }

    const currentPlayerId = getCurrentPlayer();
    if (playerId !== currentPlayerId) {
      return { success: false, message: 'Not your turn' };
    }

    if (waitingForColorChoice) {
      return { success: false, message: 'Choose a color first' };
    }

    drawCards(playerId, 1);
    nextPlayer();

    return { success: true };
  }

  function drawCards(playerId, count) {
    const player = players.get(playerId);
    if (!player) return;

    for (let i = 0; i < count; i++) {
      if (deck.length === 0) {
        reshuffleDeck();
      }
      if (deck.length > 0) {
        player.hand.push(deck.pop());
      }
    }
  }

  function reshuffleDeck() {
    if (discardPile.length <= 1) return;
    
    const topCard = discardPile.pop();
    deck = [...discardPile];
    discardPile = [topCard];
    shuffleDeck();
  }

  function chooseWildColor(playerId, color) {
    if (!waitingForColorChoice || playerId !== getCurrentPlayer()) {
      return { success: false };
    }

    const topCard = discardPile[discardPile.length - 1];
    topCard.color = color;
    topCard.chosenColor = color;

    waitingForColorChoice = false;

    // Apply remaining effect and advance turn
    if (topCard.value === 'wild_draw4') {
      nextPlayer();
      const targetPlayerId = getCurrentPlayer();
      drawCards(targetPlayerId, 4);
    }
    nextPlayer();

    return { success: true };
  }

  function sayDos(playerId) {
    const player = players.get(playerId);
    if (!player) return { success: false };

    player.saidDos = true;
    return { success: true };
  }

  function callDosOnPlayer(callerId, targetId) {
    if (!gameStarted || winner) {
      return { success: false, message: 'Game not in progress' };
    }

    const caller = players.get(callerId);
    const target = players.get(targetId);
    
    if (!caller || !target) {
      return { success: false, message: 'Invalid players' };
    }

    // Check if target has exactly 1 card and hasn't said DOS
    if (target.hand.length === 1 && !target.saidDos) {
      // Give target 3 penalty cards
      drawCards(targetId, 3);
      return { 
        success: true, 
        message: `${caller.name} called DOS on ${target.name}! ${target.name} draws 3 cards.` 
      };
    }

    return { success: false, message: 'Invalid DOS call' };
  }

  function getCardName(card) {
    if (card.type === 'number') {
      return `${card.color} ${card.value}`;
    } else if (card.type === 'action') {
      return `${card.color} ${card.value}`;
    } else if (card.type === 'wild') {
      return card.value === 'wild' ? 'Wild' : 'Wild Draw 4';
    }
    return 'Unknown';
  }

  function getState() {
    const playerIds = Array.from(players.keys());
    const playersData = playerIds.map(id => {
      const player = players.get(id);
      return {
        id: player.id,
        name: player.name,
        handCount: player.hand.length,
        saidDos: player.saidDos
      };
    });

    return {
      players: playersData,
      currentPlayer: gameStarted ? getCurrentPlayer() : null,
      topCard: discardPile.length > 0 ? discardPile[discardPile.length - 1] : null,
      gameStarted,
      waitingForColorChoice,
      winner,
      direction,
      deckCount: deck.length
    };
  }

  function getPlayerState(playerId) {
    const player = players.get(playerId);
    if (!player) return null;

    return {
      hand: player.hand,
      ...getState()
    };
  }

  return {
    addPlayer,
    removePlayer,
    startGame,
    playCard,
    drawCard,
    chooseWildColor,
    sayDos,
    callDosOnPlayer,
    getState,
    getPlayerState,
    getPlayerName
  };
}