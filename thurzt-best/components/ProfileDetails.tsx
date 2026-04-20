import React from 'react';
import { User } from '../types';
import { Zap, Users, Flag, ShieldAlert } from 'lucide-react';
import { BioBlock } from './BioBlock';

interface ProfileDetailsProps {
  user: User;
  currentUser?: User;
  onReport?: () => void;
  onBlock?: () => void;
  showSafetyActions?: boolean;
}

export const ProfileDetails: React.FC<ProfileDetailsProps> = ({ 
  user, 
  currentUser,
  onReport,
  onBlock,
  showSafetyActions = false
}) => {
  return (
    <div className="space-y-10 px-4 pt-4 pb-10">
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">About {user.displayName || user.name}</h4>
        <BioBlock bio={user.bio} />
      </div>

      {user.partnerId && (
        <div className="flex items-center space-x-4 bg-pink-500/10 p-6 rounded-[2rem] border border-pink-500/20">
          <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
            <Users className="w-6 h-6 text-pink-400" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-pink-400 mb-1">Couple</p>
            <p className="text-sm font-bold text-white">Linked with {user.partnerName}</p>
          </div>
        </div>
      )}

      <div className="space-y-8">
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">Basics</h4>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set([
              ...(user.members?.flatMap(m => m.genderIdentity ? [m.genderIdentity] : []) || [])
            ])).map(g => (
              <span key={g} className="bg-zinc-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 border border-white/5">
                {g}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">Heritage / Background</h4>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set([
              ...(user.members?.flatMap(m => m.heritage || []) || [])
            ])).map(h => (
              <span key={h} className="bg-zinc-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 border border-white/5">
                {h}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">Interests</h4>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set([
              ...(user.members?.flatMap(m => m.interests || []) || [])
            ])).map(i => (
              <span key={i} className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                {i}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">Dynamics</h4>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set([
              ...(user.members?.flatMap(m => m.dynamics || []) || [])
            ])).map(s => (
              <span key={s} className="bg-zinc-800 text-zinc-300 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {showSafetyActions && (
        <div className="flex justify-center gap-4 pt-8 pb-4 border-t border-white/5">
          <button 
            onClick={onReport}
            className="flex items-center gap-2 px-6 py-3 bg-zinc-900/50 rounded-full text-zinc-500 hover:text-red-500 transition-colors"
          >
            <Flag className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Report</span>
          </button>
          <button 
            onClick={onBlock}
            className="flex items-center gap-2 px-6 py-3 bg-zinc-900/50 rounded-full text-zinc-500 transition-colors"
          >
            <ShieldAlert className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Block</span>
          </button>
        </div>
      )}
    </div>
  );
};
