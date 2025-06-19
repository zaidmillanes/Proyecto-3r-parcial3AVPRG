# DOS Multiplayer Card Game

A beautiful, fully-featured DOS card game built with React and WebSockets for real-time multiplayer gameplay.

## Features

- **Complete DOS Game Mechanics**: All card types (numbers, Skip, Reverse, Draw 2, Wild, Wild Draw 4)
- **Real-time Multiplayer**: Connect up to 4 players via WebSocket
- **Cross-Platform**: Play across different devices on the same network
- **Beautiful UI**: Modern design with smooth animations and visual effects
- **Game Features**: DOS calling, color selection, turn indicators, game messages

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Game (Both Server & Client)
```bash
npm run dev
```

This will start:
- WebSocket server on port 8080
- React client on port 5173

### 3. Connect Players

**Host Player:**
1. Open http://localhost:5173
2. Enter your name
3. Use "localhost" as server IP
4. Click "Connect & Play"

**Other Players:**
1. Get the host's IP address (e.g., 192.168.1.100)
2. Open http://localhost:5173 on their device
3. Enter their name
4. Use the host's IP address as server IP
5. Click "Connect & Play"

## How to Find Your IP Address

### Windows:
```bash
ipconfig
```
Look for "IPv4 Address" under your network adapter.

### Mac/Linux:
```bash
ifconfig
```
Look for "inet" address under your network interface (usually en0 or wlan0).

### Alternative (All platforms):
```bash
node -e "console.log(require('os').networkInterfaces())"
```

## Game Rules

- **Objective**: Be the first player to play all your cards
- **Matching**: Play cards that match the color or number/symbol of the top card
- **Action Cards**:
  - Skip: Next player loses their turn
  - Reverse: Changes direction of play
  - Draw 2: Next player draws 2 cards and loses their turn
- **Wild Cards**:
  - Wild: Choose any color to continue play
  - Wild Draw 4: Choose color, next player draws 4 cards
- **DOS Rule**: Say "DOS" when you have one card left (click the DOS button)

## Network Setup

### Playing on Local Network:
1. Ensure all devices are on the same WiFi network
2. Host starts the server using `npm run dev`
3. Other players connect using the host's local IP address

### Playing Across Internet:
1. Host needs to port forward port 8080 on their router
2. Players connect using the host's public IP address
3. Consider using services like ngrok for easier setup

## Troubleshooting

### Connection Issues:
- Check firewall settings (allow port 8080)
- Ensure all devices are on the same network
- Verify the IP address is correct
- Try restarting the server

### Game Issues:
- Refresh the browser if the game state seems stuck
- Check the game messages for error information
- Ensure you're playing cards according to DOS rules

## Development

### Run Server Only:
```bash
npm run server
```

### Run Client Only:
```bash
npm run client
```

### Build for Production:
```bash
npm run build
```

## Technical Details

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + WebSocket (ws library)
- **Real-time Communication**: WebSocket protocol
- **Game Logic**: Complete DOS rule implementation
- **UI**: Responsive design with smooth animations

Enjoy playing DOS!