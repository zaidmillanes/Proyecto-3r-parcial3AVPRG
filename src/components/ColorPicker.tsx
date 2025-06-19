import React from 'react';

interface ColorPickerProps {
  onChooseColor: (color: string) => void;
}

export default function ColorPicker({ onChooseColor }: ColorPickerProps) {
  const colors = [
    { name: 'red', bg: 'bg-gradient-to-br from-red-500 to-red-700', hover: 'hover:from-red-600 hover:to-red-800' },
    { name: 'blue', bg: 'bg-gradient-to-br from-blue-500 to-blue-700', hover: 'hover:from-blue-600 hover:to-blue-800' },
    { name: 'green', bg: 'bg-gradient-to-br from-green-500 to-green-700', hover: 'hover:from-green-600 hover:to-green-800' },
    { name: 'yellow', bg: 'bg-gradient-to-br from-yellow-500 to-yellow-700', hover: 'hover:from-yellow-600 hover:to-yellow-800' }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900/90 via-black/70 to-gray-800/90 backdrop-blur-xl rounded-2xl p-8 border border-red-700/30 text-center shadow-2xl">
      <h3 className="text-white font-black text-2xl mb-4 drop-shadow-lg">Choose a Color</h3>
      <p className="text-gray-400 mb-8 text-lg">Select the color for your wild card</p>
      
      <div className="flex justify-center space-x-6">
        {colors.map((color, index) => (
          <button
            key={color.name}
            onClick={() => onChooseColor(color.name)}
            className={`
              w-20 h-20 rounded-full ${color.bg} ${color.hover}
              border-4 border-white/40 hover:border-white/70
              transition-all duration-300 hover:scale-125 transform-gpu
              flex items-center justify-center
              text-white font-black text-lg capitalize
              shadow-2xl hover:shadow-3xl
              animate-fade-in-scale
              hover:-translate-y-2
            `}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {color.name[0].toUpperCase()}
            
            {/* Glow effect */}
            <div className={`absolute inset-0 ${color.bg} rounded-full blur-lg opacity-50 -z-10 animate-pulse`}></div>
          </button>
        ))}
      </div>
    </div>
  );
}