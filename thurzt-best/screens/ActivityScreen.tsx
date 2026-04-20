
import React, { useState, useEffect } from 'react';
import { ActivityItem, User } from '../types';
import { MockService } from '../services/mockData';
import { RehearsalHarness } from '../services/RehearsalHarness';
import { CONFIG } from '../config';
import { ProfileTitle } from '../components/ProfileTitle';
import ActivityImg from '../assets/Activity.png';
import { 
  Zap, 
  Clock, 
  Camera, 
  Edit3, 
  ShieldCheck, 
  MessageCircle,
  Loader2,
  ShieldAlert
} from 'lucide-react';

interface MatchActivity extends ActivityItem {
  matchUser: User;
  contentSnippet?: string;
}

export const ActivityScreen: React.FC = () => {
  const [matchActivities, setMatchActivities] = useState<MatchActivity[]>([]);
  const [loading, setLoading] = useState(CONFIG.DATA_MODE === 'firebase');
  const [error, setError] = useState<string | null>(null);

  const useHarness = CONFIG.DATA_MODE === 'firebase';
  const callHarness = async <T,>(name: string, fn: () => Promise<T> | T): Promise<T> => {
    return useHarness ? RehearsalHarness.call(name, fn) : fn();
  };

  const fetchActivity = async () => {
    if (useHarness) setLoading(true);
    setError(null);
    try {
      const matches = await callHarness('fetchActivity', async () => MockService.getMatches());
      const activities: MatchActivity[] = [];

      if (matches.length > 0) {
        activities.push({ 
          id: 'a1', 
          type: 'UPDATE', 
          text: 'updated their bio.', 
          timestamp: 'Just now',
          matchUser: matches[0],
          contentSnippet: "Looking for someone who appreciates brutalist architecture..."
        });
      }

      if (matches.length > 1) {
        activities.push({ 
          id: 'a2', 
          type: 'UPDATE', 
          text: 'added 2 new photos.', 
          timestamp: '45m ago',
          matchUser: matches[1],
        });
      }

      if (matches.length > 2) {
        activities.push({ 
          id: 'a4', 
          type: 'MATCH', 
          text: 'New Mutual Match!', 
          timestamp: '5h ago',
          matchUser: matches[2],
        });
      }
      setMatchActivities(activities);
    } catch (err) {
      setError('Failed to load activity. Please try again.');
    } finally {
      if (useHarness) setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  const getActivityIcon = (type: string, text: string) => {
    if (text.includes('photo')) return <Camera className="w-3.5 h-3.5 text-blue-400" />;
    if (text.includes('bio')) return <Edit3 className="w-3.5 h-3.5 text-orange-400" />;
    if (text.includes('Verified')) return <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />;
    return <Zap className="w-3.5 h-3.5 text-zinc-500" />;
  };

  return (
    <div className="h-full flex flex-col bg-black text-white">
      {/* Uniform Header Structure */}
      <header className="px-8 pt-[max(env(safe-area-inset-top),16px)] pb-4 bg-black/80 backdrop-blur-md sticky top-0 z-40 border-b border-white/5 relative">
        <div className="flex items-center h-11" style={{ flex: 1, alignItems: 'center', display: 'flex', justifyContent: 'flex-start' }}>
          <img 
            src={ActivityImg} 
            alt="Activity" 
            style={{ width: '60%', height: 40, objectFit: 'contain', objectPosition: 'left', alignSelf: 'center' }} 
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-10">
            <Loader2 className="w-8 h-8 text-zinc-500 animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Loading Activity...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-10">
            <ShieldAlert className="w-12 h-12 text-zinc-600 mb-6" />
            <h2 className="text-xl font-black uppercase tracking-tighter mb-4 italic text-zinc-300">{error}</h2>
            <button 
              onClick={fetchActivity}
              className="px-8 py-4 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl"
            >
              Try Again
            </button>
          </div>
        ) : matchActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-10">
            <Zap className="w-12 h-12 text-zinc-800 mb-6" />
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">No activity yet</h2>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Match updates appear here</p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <p className="text-zinc-600 text-xs uppercase font-black tracking-widest leading-none mb-2">Recent Updates</p>
            {matchActivities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-center gap-5 p-5 border-b border-white/5 hover:bg-white/5 transition-colors"
            >
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10">
                <img src={activity.matchUser.photos[0]} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 bg-black rounded-full border border-white/10 shadow-lg">
                {getActivityIcon(activity.type, activity.text)}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <div className="flex items-center flex-wrap gap-x-1 truncate pr-2">
                  <ProfileTitle 
                    user={activity.matchUser} 
                    nameClassName="font-black uppercase tracking-tight text-sm" 
                    ageClassName="text-xs font-light text-white/70"
                    separatorClassName="font-black uppercase tracking-tight text-sm text-white/50"
                  />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600 whitespace-nowrap ml-2">
                  {activity.timestamp}
                </span>
              </div>
              <p className="text-[11px] font-bold text-zinc-400 mt-0.5 leading-tight">
                {activity.text}
              </p>
              
              {activity.contentSnippet && (
                <p className="text-[10px] text-zinc-600 italic mt-2 line-clamp-1 border-l border-zinc-800 pl-3">
                  "{activity.contentSnippet}"
                </p>
              )}
            </div>
          </div>
        ))}
        </div>
      )}
      </div>
    </div>
  );
};
