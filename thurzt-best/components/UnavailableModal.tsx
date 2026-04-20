import React from 'react';
import { X, Construction } from 'lucide-react';

interface UnavailableModalProps {
  onClose: () => void;
  featureName?: string;
}

export const UnavailableModal: React.FC<UnavailableModalProps> = ({ onClose, featureName = "Feature" }) => {
  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-8 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[2rem] p-8 text-center shadow-2xl relative animate-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <Construction className="w-8 h-8 text-zinc-500" />
        </div>
        <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2">Coming Soon</h3>
        <p className="text-zinc-500 text-sm font-medium">
          {featureName} is not available in this prototype yet.
        </p>
        <button 
          onClick={onClose}
          className="mt-8 w-full py-4 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
