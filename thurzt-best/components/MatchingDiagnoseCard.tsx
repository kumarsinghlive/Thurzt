import React from 'react';
import { CONFIG } from '../config';
import { MockService } from '../services/mockData';
import { useFilters } from '../hooks/useFilters';
import { User } from '../types';
import { RefreshCw, ShieldCheck, Users, EyeOff } from 'lucide-react';

interface MatchingDiagnoseCardProps {
  currentUser: User;
  onActionComplete: () => void;
}

export const MatchingDiagnoseCard: React.FC<MatchingDiagnoseCardProps> = ({ currentUser, onActionComplete }) => {
  const { filters, resetToDefaults } = useFilters();
  
  const isRestricted = currentUser.verificationRequired && currentUser.verificationStatus !== 'VERIFIED';
  const isGhost = currentUser.visibilityMode === 'GHOST';
  const seedCount = MockService.getCandidates().length;

  const handleResetFilters = () => {
    resetToDefaults();
    onActionComplete();
  };

  const handleSetVerified = () => {
    MockService.updateCurrentUser({
      ...currentUser,
      verificationStatus: 'VERIFIED'
    });
    onActionComplete();
  };

  const handleSeed10 = () => {
    MockService.ensureSeed();
    onActionComplete();
  };

  const handleTurnGhostOff = () => {
    if (isGhost) {
      MockService.toggleGhostMode(currentUser.uid);
      onActionComplete();
    }
  };

  return (
    <div className="bg-zinc-900 border border-red-500/30 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-widest text-red-400">Matching Diagnose</h3>
        <span className="text-[10px] font-bold px-2 py-1 bg-zinc-800 rounded text-zinc-400">
          {CONFIG.DATA_MODE.toUpperCase()}
        </span>
      </div>

      <div className="space-y-2 text-[10px] font-mono text-zinc-400">
        <div className="flex justify-between">
          <span>Restricted:</span>
          <span className={isRestricted ? "text-red-400 font-bold" : "text-green-400"}>{isRestricted ? "TRUE" : "FALSE"}</span>
        </div>
        <div className="flex justify-between">
          <span>Ghost Mode:</span>
          <span className={isGhost ? "text-yellow-400 font-bold" : "text-zinc-500"}>{isGhost ? "ON" : "OFF"}</span>
        </div>
        <div className="flex justify-between">
          <span>Candidates Seeded:</span>
          <span>~{seedCount}</span>
        </div>
        <div className="pt-2 border-t border-white/5">
          <span className="text-zinc-500 block mb-1">Filters:</span>
          <div className="pl-2 space-y-1">
            <div>Looking For: {filters.lookingFor?.length ? filters.lookingFor.join(', ') : 'Any'}</div>
            <div>Couple Type: {filters.coupleType?.length ? filters.coupleType.join(', ') : 'Any'}</div>
            <div>Genders: {filters.gendersOpenTo?.length ? filters.gendersOpenTo.join(', ') : 'Any'}</div>
            <div>Distance: {filters.maxDistance}km</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2">
        <button 
          onClick={handleResetFilters}
          className="flex items-center justify-center gap-2 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-[10px] font-bold text-white transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Reset Filters
        </button>
        <button 
          onClick={handleSetVerified}
          disabled={!isRestricted}
          className={`flex items-center justify-center gap-2 py-2 rounded text-[10px] font-bold transition-colors ${isRestricted ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-600'}`}
        >
          <ShieldCheck className="w-3 h-3" />
          Set Verified
        </button>
        <button 
          onClick={handleSeed10}
          className="flex items-center justify-center gap-2 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-[10px] font-bold text-white transition-colors"
        >
          <Users className="w-3 h-3" />
          Seed +10
        </button>
        <button 
          onClick={handleTurnGhostOff}
          disabled={!isGhost}
          className={`flex items-center justify-center gap-2 py-2 rounded text-[10px] font-bold transition-colors ${isGhost ? 'bg-yellow-600 hover:bg-yellow-500 text-white' : 'bg-zinc-800 text-zinc-600'}`}
        >
          <EyeOff className="w-3 h-3" />
          Ghost OFF
        </button>
      </div>
    </div>
  );
};
