import React, { useState, useEffect } from 'react';
import { X, Camera, ShieldAlert } from 'lucide-react';

interface PrivatePhotoViewerProps {
  photo: string;
  onClose: () => void;
}

export const PrivatePhotoViewer: React.FC<PrivatePhotoViewerProps> = ({ photo, onClose }) => {
  const [screenshotDetected, setScreenshotDetected] = useState(false);

  useEffect(() => {
    // 1) Android screenshot/recording blocking (best-effort, OS-level)
    // In a real app, this would call a native plugin to set FLAG_SECURE.
    // For this prototype, we simulate the behavior by logging and adding a meta tag or class.
    // console.log('[Privacy] Android FLAG_SECURE enabled for Private Photos viewer.');
    document.body.classList.add('secure-screen-active');

    const handleMockScreenshot = () => {
      // console.log('[Privacy] Screenshot detected!');
      setScreenshotDetected(true);
      
      // Auto-hide the warning after 3 seconds
      setTimeout(() => {
        setScreenshotDetected(false);
      }, 3000);
    };

    window.addEventListener('mock-screenshot', handleMockScreenshot);

    return () => {
      // console.log('[Privacy] Android FLAG_SECURE disabled.');
      document.body.classList.remove('secure-screen-active');
      window.removeEventListener('mock-screenshot', handleMockScreenshot);
    };
  }, []);

  const simulateScreenshot = () => {
    window.dispatchEvent(new Event('mock-screenshot'));
  };

  return (
    <div className="fixed inset-0 z-[130] bg-black flex flex-col animate-in fade-in duration-200">
      <div className="flex justify-between items-center p-6 bg-gradient-to-b from-black/80 to-transparent absolute top-0 w-full z-10">
        <button onClick={onClose} className="p-3 bg-zinc-900/50 backdrop-blur rounded-full text-white border border-white/5">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/80 backdrop-blur rounded-full text-white/70 text-[10px] font-black uppercase tracking-widest">
          <ShieldAlert className="w-3.5 h-3.5" />
          Protected
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* 3) iOS behavior: optionally blur/hide the private photo view immediately after detection */}
        <img 
          src={photo} 
          alt="Private photo" 
          className={`max-w-full max-h-full object-contain transition-all duration-300 ${screenshotDetected ? 'blur-xl scale-110 opacity-50' : ''}`} 
        />
        
        {screenshotDetected && (
          <div className="absolute inset-0 flex items-center justify-center z-20 animate-in zoom-in duration-200">
            <div className="bg-red-500/90 backdrop-blur-md text-white px-6 py-4 rounded-2xl flex flex-col items-center gap-2 shadow-2xl border border-red-400/50">
              <Camera className="w-8 h-8 mb-1" />
              <span className="text-sm font-black uppercase tracking-widest">Screenshot detected</span>
              <span className="text-[10px] font-medium text-white/80 text-center max-w-[200px]">
                This is a private photo. Repeated screenshots may result in account suspension.
              </span>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col items-center gap-4 absolute bottom-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent">
        {/* 4) UX copy (must be honest) */}
        <p className="text-center text-zinc-500 text-[10px] font-medium max-w-[250px]">
          Screenshots may be blocked or detected depending on device.
        </p>
        
        {/* 2) Android screenshot detection (optional / best-effort) - Dev Tools Button */}
        <button 
          onClick={simulateScreenshot}
          className="px-4 py-2 bg-zinc-800 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
        >
          [Dev] Simulate Screenshot
        </button>
      </div>
    </div>
  );
};
