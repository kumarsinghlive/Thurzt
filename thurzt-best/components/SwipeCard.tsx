import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { ShieldCheck, MapPin, Lock } from 'lucide-react';
import { ProfileTitle } from './ProfileTitle';
import { Images } from '../brandAssets';

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

interface SwipeCardProps {
  user: User;
  currentUser?: User;
  hasGalleryAccess?: boolean;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ user, currentUser, hasGalleryAccess = false }) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const { height } = useWindowDimensions();

  const isOwnProfile = currentUser?.uid === user.uid;
  const isApproved = isOwnProfile || hasGalleryAccess;

  const allPhotos = (user.photos || []).map(p => {
    if (typeof p === 'string') {
      return { url: p, isPrivate: false, isBlurred: false };
    }
    return {
      url: p.url,
      isPrivate: !!p.isPrivate,
      isBlurred: !!p.isPrivate && !isApproved
    };
  });

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photoIndex < allPhotos.length - 1) setPhotoIndex(prev => prev + 1);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photoIndex > 0) setPhotoIndex(prev => prev - 1);
  };

  const currentPhoto = allPhotos[photoIndex] || { url: '', isPrivate: false, isBlurred: false };
  
  const isSmallDevice = height < 700;
  const cardMaxHeight = isSmallDevice ? '60vh' : '65vh';

  return (
    <div 
      className="relative w-full aspect-[4/5] bg-zinc-950 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/5 ring-1 ring-white/10 group"
      style={{ maxHeight: cardMaxHeight }}
    >
      {/* Image Layer */}
      <div className="absolute inset-0">
        {currentPhoto.url ? (
          <img 
            src={currentPhoto.url} 
            alt={user.name} 
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${currentPhoto.isBlurred ? 'blur-[20px] scale-110' : ''}`}
          />
        ) : (
          <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
            <span className="text-zinc-600 text-sm font-bold uppercase tracking-widest">No Photos</span>
          </div>
        )}
        
        {currentPhoto.isBlurred && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[20px]">
            {/* Tiled Pattern Overlay */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `url(${Images.AppIcon})`,
                backgroundSize: '80px 80px',
                backgroundRepeat: 'repeat',
              }}
            />
            {/* Center Pulsing Icon */}
            <div className="relative z-10 flex flex-col items-center">
              <img 
                src={Images.AppIcon} 
                alt="Private" 
                className="w-16 h-16 animate-pulse drop-shadow-[0_0_15px_rgba(255,45,125,0.8)] mb-4"
              />
              <span className="text-white/90 text-xs font-black uppercase tracking-widest drop-shadow-md">Request Access</span>
            </div>
          </div>
        )}
        
        {/* Navigation Overlays */}
        <div className="absolute inset-0 flex">
          <div className="w-1/2 h-full cursor-west-resize" onClick={prevPhoto}></div>
          <div className="w-1/2 h-full cursor-east-resize" onClick={nextPhoto}></div>
        </div>

        {/* Dynamic Photo Indicators */}
        <div className="absolute top-6 left-6 right-6 flex space-x-1.5 z-20">
          {allPhotos.map((photo, idx) => (
            <div 
              key={idx} 
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                idx === photoIndex 
                  ? (photo.isPrivate ? 'bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]' : 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]') 
                  : (photo.isPrivate ? 'bg-purple-400/30' : 'bg-white/20')
              }`}
            />
          ))}
        </div>

        {/* Report / Block Button */}
        {!isOwnProfile && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm("Do you want to report or block this user?")) {
                alert("User reported/blocked successfully.");
              }
            }}
            className="absolute top-10 right-6 z-30 p-2 bg-black/40 backdrop-blur-md rounded-full text-white/70 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
          </button>
        )}
      </div>

      {/* Info Overlay on Card */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4 px-4 py-2.5 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none flex flex-col justify-end">
        <div className="flex items-center gap-x-2 w-full">
          <div className="truncate flex-1">
            <ProfileTitle 
              user={user} 
              nameClassName="text-[22px] font-black tracking-tighter text-white uppercase" 
              ageClassName="text-[18px] font-light text-white/70 ml-1"
              separatorClassName="text-[22px] font-black tracking-tighter text-white/50 uppercase mx-1"
            />
          </div>
          {user.isVerified && (
            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
          )}
        </div>
        <div className="flex items-center text-white/60 text-[12px] leading-tight font-black uppercase tracking-[0.2em] mt-0.5 truncate w-full">
          <MapPin className="w-3 h-3 mr-1 shrink-0" />
          <span className="truncate">{user.distance ? `${user.distance} miles away` : 'Nearby'}</span>
        </div>
      </div>
    </div>
  );
};