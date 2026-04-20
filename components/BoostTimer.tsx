import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

export const BoostTimer: React.FC<{ activeUntil?: number }> = ({ activeUntil }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    if (!activeUntil) return;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, activeUntil - now);
      setTimeLeft(remaining);
      
      if (remaining === 0 && activeUntil > 0) {
        setHasEnded(true);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeUntil]);

  if (!activeUntil) return <div className="w-10 h-10" />; // Placeholder

  if (timeLeft === 0 && hasEnded) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 backdrop-blur rounded-full border border-white/5 animate-in fade-in duration-500">
        <Zap className="w-4 h-4 text-zinc-500" />
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Boost ended</span>
      </div>
    );
  }

  if (timeLeft === 0) return <div className="w-10 h-10" />;

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const timeString = hours > 0 
    ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}` 
    : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 backdrop-blur rounded-full border border-purple-500/20 transition-all duration-1000">
      <Zap className="w-3.5 h-3.5 text-purple-400 fill-purple-400/20" />
      <span className="text-[11px] font-mono font-bold text-purple-400 tracking-wider">
        {timeString}
      </span>
    </div>
  );
};
