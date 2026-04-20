import React from 'react';
import { User } from '../types';
import { Images } from '../brandAssets';
import { THEME } from '../config';

interface MatchModalProps {
  currentUser: User;
  matchedUser: User;
  onClose: () => void;
  onSendMessage: () => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({ currentUser, matchedUser, onClose, onSendMessage }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/85 backdrop-blur-[15px] animate-in fade-in duration-300">
      {/* Watermark */}
      <img 
        src={Images.AppIcon} 
        alt="Thurzt" 
        style={{ width: THEME.iconSizes.watermark.width, height: THEME.iconSizes.watermark.height }}
        className="absolute object-contain opacity-10 pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center w-full px-6">
        {/* The 'V' Formation */}
        <div className="flex items-center justify-center mb-12">
          <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-2 border-[#ffd700] shadow-[0_0_20px_rgba(255,215,0,0.3)] z-10 translate-x-4">
            <img src={currentUser.photos[0]} alt={currentUser.name} className="w-full h-full object-cover" />
          </div>
          <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-2 border-[#ff00ff] shadow-[0_0_20px_rgba(255,0,255,0.3)] z-0 -translate-x-4">
            <img src={matchedUser.photos[0]} alt={matchedUser.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Headlines */}
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00d2ff] drop-shadow-[0_0_10px_rgba(255,0,255,0.5)] text-center">
          IT'S A MATCH!
        </h1>
        <p className="text-lg font-bold text-white/80 uppercase tracking-widest mb-16 text-center">
          The Thurzt is Mutual.
        </p>

        {/* Buttons */}
        <div className="w-full max-w-sm space-y-4">
          <button 
            onClick={onSendMessage}
            className="w-full py-4 bg-[#ff00ff] text-white rounded-full text-sm font-black uppercase tracking-widest shadow-[0_0_20px_rgba(255,0,255,0.4)] hover:bg-[#ff00ff]/90 transition-all active:scale-95"
          >
            Send a Message
          </button>
          <button 
            onClick={onClose}
            className="w-full py-4 bg-transparent border-2 border-white/20 text-white rounded-full text-sm font-black uppercase tracking-widest hover:border-white/40 hover:bg-white/5 transition-all active:scale-95"
          >
            Return To Matching
          </button>
        </div>
      </div>
    </div>
  );
};
