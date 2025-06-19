import React from 'react';
import { Wifi, WifiOff, MessageCircle } from 'lucide-react';

interface GameMessagesProps {
  messages: string[];
  connected: boolean;
}

export default function GameMessages({ messages, connected }: GameMessagesProps) {
  return (
    <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-lg flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Game Feed
        </h3>
        <div className={`flex items-center text-sm ${connected ? 'text-green-400' : 'text-red-700/90'}`}>
          {connected ? <Wifi className="w-4 h-4 mr-1" /> : <WifiOff className="w-4 h-4 mr-1" />}
          {connected ? 'Online' : 'Offline'}
        </div>
      </div>
      
      <div className="h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <p className="text-white/50 text-center py-8 text-sm">
            No messages yet...
          </p>
        ) : (
          <div className="space-y-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className="text-white/80 text-sm p-2 bg-white/5 rounded border-l-2 border-white/20"
              >
                {message}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}