import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Lock, Image as ImageIcon, Camera } from 'lucide-react';
import { MockService } from '../services/mockData';

import { CONFIG } from '../config';
import { PrivatePhotoViewer } from './PrivatePhotoViewer';

interface PrivateGallerySectionProps {
  profile: User;
  currentUser: User;
}

export const PrivateGallerySection: React.FC<PrivateGallerySectionProps> = ({ profile, currentUser }) => {
  const isOwner = profile.uid === currentUser.uid;
  
  // Keep access state in sync with the actual profile data
  const [accessState, setAccessState] = useState<"LOCKED" | "REQUESTED" | "APPROVED" | "REVOKED">("LOCKED");
  const [viewingPhoto, setViewingPhoto] = useState<string | null>(null);
  const [screenshotDetected, setScreenshotDetected] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const callHarness = async <T,>(name: string, fn: () => Promise<T> | T): Promise<T> => {
    return fn();
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (isOwner) {
      setAccessState("APPROVED");
    } else {
      setAccessState(profile.privateGallery?.access[currentUser.uid] || "LOCKED");
    }
  }, [profile, currentUser, isOwner]);

  useEffect(() => {
    if (accessState === 'APPROVED' && !viewingPhoto) {
      // Apply protection to the grid view as well
      // console.log('[Privacy] Android FLAG_SECURE enabled for PrivateGallerySection.');
      document.body.classList.add('secure-screen-active');
      
      const handleMockScreenshot = () => {
        // console.log('[Privacy] Screenshot detected in grid view!');
        setScreenshotDetected(true);
        setTimeout(() => setScreenshotDetected(false), 3000);
      };
      
      window.addEventListener('mock-screenshot', handleMockScreenshot);
      
      return () => {
        // console.log('[Privacy] Android FLAG_SECURE disabled.');
        document.body.classList.remove('secure-screen-active');
        window.removeEventListener('mock-screenshot', handleMockScreenshot);
      };
    }
  }, [accessState, viewingPhoto]);

  if (!profile.privateGallery || profile.privateGallery.photos.length === 0) {
    return null;
  }

  const handleRequestAccess = async () => {
    try {
      const result = await callHarness('requestPrivateGalleryAccess', async () => {
        return MockService.requestPrivateGalleryAccess(profile.uid, currentUser.uid);
      });
      if (result && !result.success) {
        showToast(result.message);
        return;
      }
      setAccessState('REQUESTED');
    } catch (error) {
      showToast("Failed to request access. Please try again.");
    }
  };

  const handleCancelRequest = async () => {
    try {
      await callHarness('cancelPrivateGalleryAccess', async () => {
        MockService.cancelPrivateGalleryAccess(profile.uid, currentUser.uid);
      });
      setAccessState('LOCKED');
    } catch (error) {
      showToast("Failed to cancel request. Please try again.");
    }
  };

  const simulateScreenshot = () => {
    window.dispatchEvent(new Event('mock-screenshot'));
  };

  if (accessState === 'APPROVED') {
    return (
      <div className="space-y-4 relative">
        <div className="flex justify-between items-center">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">Private Photos</h4>
          <button 
            onClick={simulateScreenshot}
            className="px-2 py-1 bg-zinc-900 border border-white/5 rounded text-[8px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
          >
            [Dev] Screenshot
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2 relative">
          {profile.privateGallery.photos.map((photo, idx) => (
            <div 
              key={idx} 
              onClick={() => setViewingPhoto(photo)}
              className="aspect-[3/4] rounded-xl overflow-hidden relative cursor-pointer group"
            >
              <img 
                src={photo} 
                alt="" 
                className={`w-full h-full object-cover transition-all duration-500 ${screenshotDetected ? 'blur-xl scale-110 opacity-50' : 'group-hover:scale-105'}`} 
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
          
          {screenshotDetected && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none animate-in zoom-in duration-200">
              <div className="bg-red-500/90 backdrop-blur-md text-white px-4 py-3 rounded-xl flex flex-col items-center gap-1 shadow-2xl border border-red-400/50">
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-xs font-black uppercase tracking-widest">Screenshot detected</span>
              </div>
            </div>
          )}
        </div>
        
        <p className="text-center text-zinc-500 text-[8px] font-medium">
          Screenshots may be blocked or detected depending on device.
        </p>
        
        {viewingPhoto && (
          <PrivatePhotoViewer 
            photo={viewingPhoto} 
            onClose={() => setViewingPhoto(null)} 
          />
        )}
        {toast && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-zinc-900 border border-white/10 rounded-full text-white text-[10px] font-bold uppercase tracking-widest shadow-2xl z-50 animate-in slide-in-from-bottom-4 whitespace-nowrap">
            {toast}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 relative">
      <div className="flex justify-between items-center">
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">Private Photos</h4>
      </div>
      
      <div className="grid grid-cols-2 gap-2 relative">
        {profile.privateGallery.photos.map((photo, idx) => (
          <div 
            key={idx} 
            className="aspect-[3/4] rounded-xl overflow-hidden relative"
          >
            <img 
              src={photo} 
              alt="" 
              className="w-full h-full object-cover blur-xl scale-110 opacity-50" 
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock className="w-6 h-6 text-white/50" />
            </div>
          </div>
        ))}
        
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4 text-center">
          {accessState === 'REQUESTED' ? (
            <div className="flex flex-col gap-2 w-full max-w-[200px]">
              <button 
                disabled
                className="w-full text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-full transition-all bg-zinc-800/80 backdrop-blur-md text-zinc-300 cursor-not-allowed"
              >
                Request sent
              </button>
              <button 
                onClick={handleCancelRequest}
                className="w-full text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-full transition-all bg-transparent text-zinc-300 hover:text-white border border-zinc-600/50 hover:border-zinc-400 backdrop-blur-md"
              >
                Cancel request
              </button>
            </div>
          ) : accessState === 'REVOKED' ? (
            <div className="flex flex-col gap-2 w-full max-w-[200px]">
              <div className="w-full text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-full bg-red-900/50 backdrop-blur-md text-red-200 border border-red-500/30">
                Access revoked
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 w-full max-w-[200px]">
              {currentUser.entitlements?.plan === 'PLUS' || currentUser.entitlements?.plan === 'PRO' || currentUser.entitlements?.plan === 'PLUS' || currentUser.entitlements?.plan === 'PRO' ? (
                <button 
                  onClick={handleRequestAccess}
                  className="w-full text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-full transition-all bg-white/90 backdrop-blur-md text-black hover:bg-white"
                >
                  Request access
                </button>
              ) : (
                <div className="bg-zinc-900/80 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                    Request private photos in chat after matching.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {toast && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-zinc-900 border border-white/10 rounded-full text-white text-[10px] font-bold uppercase tracking-widest shadow-2xl z-50 animate-in slide-in-from-bottom-4 whitespace-nowrap">
          {toast}
        </div>
      )}
    </div>
  );
};
