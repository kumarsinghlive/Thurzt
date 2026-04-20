
import React, { useEffect, useState } from 'react';
import { Images } from '../brandAssets';
import { THEME } from '../config';

interface SplashProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashProps> = ({ onFinish }) => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // 1. Reveal Logo Text after a delay
    const timer2 = setTimeout(() => setShowText(true), 1500);
    
    // 2. Final delay: Exit Splash to the main app
    const timer3 = setTimeout(onFinish, 3500);

    return () => {
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-[#0a0510] overflow-hidden flex flex-col items-center justify-center z-[200]">
      
      {/* Background Images Removed */}

      {/* The Animated Flame Icon */}
      <div className="relative z-10 mb-8 animate-flame flex items-center justify-center" style={{ width: THEME.iconSizes.splash.width, height: THEME.iconSizes.splash.height, maxWidth: '50vw', maxHeight: '50vw' }}>
        <img 
          src={Images.AppIcon} 
          alt="Thurzt Icon" 
          className="w-full h-full object-contain" 
        />
      </div>

      {/* The Logo Text Reveal (using LogoText asset) */}
      <div className={`relative z-10 transition-all duration-1000 transform ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} flex flex-col items-center`}>
        <img 
          src={Images.LogoText} 
          alt="Thurzt" 
          className="h-14 object-contain mb-4" 
        />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 text-center">
          where curiosity meets connection.
        </p>
      </div>

    </div>
  );
};
