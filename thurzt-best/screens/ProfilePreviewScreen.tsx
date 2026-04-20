import React from 'react';
import { User } from '../types';
import { X } from 'lucide-react';
import { SwipeCard } from '../components/SwipeCard';
import { ProfileDetails } from '../components/ProfileDetails';
import { MockService } from '../services/mockData';

interface ProfilePreviewScreenProps {
  user: User;
  onClose: () => void;
}

export const ProfilePreviewScreen: React.FC<ProfilePreviewScreenProps> = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 z-[110] flex flex-col bg-black text-white animate-in slide-in-from-bottom duration-300 overflow-y-auto no-scrollbar pb-[calc(80px+env(safe-area-inset-bottom))]">
      <div className="sticky top-0 w-full flex justify-between items-center px-8 py-6 z-30 bg-gradient-to-b from-black to-transparent">
        <div className="w-10 h-10" />
        <button 
          onClick={onClose}
          className="p-3 bg-zinc-900/50 backdrop-blur rounded-full text-zinc-400 border border-white/5 hover:text-white transition-colors"
        >
          <X className="w-7 h-7" />
        </button>
      </div>

      <div className="px-4 max-w-md mx-auto space-y-4 w-full">
        <div className="relative group">
          <SwipeCard key={user.uid} user={user} currentUser={MockService.getCurrentUser()} />
        </div>

        <ProfileDetails 
          user={user} 
          currentUser={MockService.getCurrentUser()} 
          showSafetyActions={false}
        />
      </div>
    </div>
  );
};
