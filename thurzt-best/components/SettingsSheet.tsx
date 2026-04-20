import React, { useState } from 'react';
import { User } from '../types';
import { X, Ghost, SlidersHorizontal, Settings, HelpCircle, FileText, LogOut, User as UserIcon, Bell, ShieldAlert, ShieldCheck, Flag, Lock } from 'lucide-react';
import { CONFIG } from '../config';
import { MOCK_CURRENT_USER, MockService } from '../services/mockData';
import { MatchingDiagnoseCard } from './MatchingDiagnoseCard';
import { useFilters } from '../hooks/useFilters';
import SettingsImg from '../assets/Settings.png';
import { TermsOfService } from './TermsOfService';
import { PrivacyPolicy } from './PrivacyPolicy';

interface SettingsSheetProps {
  user: User;
  onClose: () => void;
  onUpdate: (updatedUser: User) => void;
  showToast: (msg: string) => void;
  handleUnavailable: (name: string) => void;
  handleLockedFeature: (title: string, desc: string) => void;
  setPaywallFeature: (feature: {title: string, desc: string}) => void;
  setShowPaywall: (show: boolean) => void;
}

const MenuItem = ({ 
  icon: Icon, 
  label, 
  value, 
  onClick, 
  isDestructive = false,
  isLocked = false 
}: { 
  icon: any, 
  label: string, 
  value?: string, 
  onClick: () => void, 
  isDestructive?: boolean,
  isLocked?: boolean
}) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-colors group"
  >
    <div className="flex items-center gap-4">
      <div className={`p-2.5 rounded-xl ${isDestructive ? 'bg-red-500/10 text-red-500' : 'bg-zinc-900 text-zinc-400 group-hover:text-white'} transition-colors`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className={`text-sm font-bold ${isDestructive ? 'text-red-500' : 'text-zinc-200'}`}>
        {label}
      </span>
    </div>
    <div className="flex items-center gap-3">
      {value && <span className="text-xs font-medium text-zinc-500">{value}</span>}
      {isLocked && <Lock className="w-3.5 h-3.5 text-zinc-600" />}
    </div>
  </button>
);

export const SettingsSheet: React.FC<SettingsSheetProps> = ({ 
  user, 
  onClose, 
  onUpdate, 
  showToast, 
  handleUnavailable,
  handleLockedFeature,
  setPaywallFeature,
  setShowPaywall
}) => {
  const { resetToDefaults } = useFilters();
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div className="fixed inset-0 z-[130] flex flex-col bg-black text-white animate-in slide-in-from-bottom duration-300 overflow-y-auto no-scrollbar pb-[calc(80px+env(safe-area-inset-bottom))]">
      <header className="flex items-center p-6 bg-black/80 backdrop-blur-md sticky top-0 z-40 border-b border-zinc-800 relative">
        <div style={{ flex: 1, alignItems: 'center', display: 'flex', justifyContent: 'flex-start' }}>
          <img 
            src={SettingsImg} 
            alt="Settings" 
            style={{ width: '60%', height: 40, objectFit: 'contain', objectPosition: 'left', alignSelf: 'center' }} 
          />
        </div>
        <button 
          onClick={onClose}
          className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center absolute right-6"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      <div className="px-4 max-w-md mx-auto space-y-6 w-full mt-4">
        
        {/* PRIVACY & SAFETY */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-[2rem] overflow-hidden p-2">
          <div className="px-4 py-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Privacy & Safety</h3>
          </div>
          <MenuItem 
            icon={Ghost} 
            label="Ghost Mode" 
            value={!user.entitlements?.ghostMode ? "Off" : (user.visibilityMode === 'GHOST' ? "On" : "Off")}
            isLocked={!user.entitlements?.ghostMode}
            onClick={async () => {
              if (!user.entitlements?.ghostMode) {
                handleLockedFeature("Ghost Mode", "Go invisible. Only show your profile to people you've already liked.");
              } else {
                try {
                  MockService.toggleGhostMode(user.uid);
                  onUpdate(MockService.getCurrentUser());
                  showToast(`Ghost Mode ${user.visibilityMode === 'GHOST' ? 'Off' : 'On'}`);
                } catch (error) {
                  showToast("Failed to toggle Ghost Mode. Please try again.");
                }
              }
            }} 
          />
          <MenuItem 
            icon={ShieldAlert} 
            label="Blocked Profiles" 
            onClick={() => handleUnavailable("Blocked List")} 
          />
          <MenuItem 
            icon={ShieldCheck} 
            label="Verification Center" 
            value={user.isVerified ? "Verified" : "Pending"}
            onClick={() => handleUnavailable("Verification")} 
          />
          <MenuItem 
            icon={Flag} 
            label="Safety Center" 
            onClick={() => handleUnavailable("Safety Center")} 
          />
        </div>

        {/* APP */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-[2rem] overflow-hidden p-2">
          <div className="px-4 py-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">App</h3>
          </div>
          <MenuItem 
            icon={SlidersHorizontal} 
            label="Reset Filters" 
            onClick={() => {
              resetToDefaults();
              showToast("Filters reset to default.");
            }} 
          />
          <MenuItem 
            icon={Bell} 
            label="Notifications" 
            onClick={() => handleUnavailable("Notifications")} 
          />
        </div>

        {/* ACCOUNT */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-[2rem] overflow-hidden p-2">
          <div className="px-4 py-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Account</h3>
          </div>
          <MenuItem 
            icon={LogOut} 
            label="Sign Out" 
            onClick={async () => {
              showToast("Signing out...");
              if (CONFIG.DATA_MODE === 'firebase') {
                try {
                  const { auth } = await import('../firebase');
                  await auth.signOut();
                } catch (error) {
                  console.error("Error signing out:", error);
                }
              }
              localStorage.clear();
              onUpdate({ ...MOCK_CURRENT_USER, onboardingComplete: false });
              onClose();
            }} 
          />
          <MenuItem 
            icon={UserIcon} 
            label="Delete Account" 
            isDestructive 
            onClick={async () => {
              if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                if (CONFIG.DATA_MODE === 'firebase') {
                  try {
                    const { auth, db } = await import('../firebase');
                    const { deleteDoc, doc } = await import('firebase/firestore');
                    const userAuth = auth.currentUser;
                    if (userAuth) {
                      await deleteDoc(doc(db, 'users', userAuth.uid));
                      await userAuth.delete();
                    }
                  } catch (error) {
                    console.error("Error deleting account:", error);
                    alert("Failed to delete account. You may need to sign in again to perform this action.");
                    return;
                  }
                }
                localStorage.clear();
                showToast("Account successfully deleted.");
                onUpdate({ ...user, onboardingComplete: false });
              }
            }} 
          />
        </div>

        {/* SUPPORT & LEGAL */}
        <div className="p-4 flex flex-col items-center gap-4">
          <button onClick={() => handleUnavailable("Help Center")} className="text-xs font-bold text-zinc-500 hover:text-white transition-colors">Help & Support</button>
          <div className="flex gap-6">
            <button onClick={() => window.open('https://thurzt.com/terms', '_blank')} className="text-[10px] font-medium text-zinc-600 hover:text-zinc-400">Terms of Service</button>
            <button onClick={() => window.open('https://thurzt.com/privacy', '_blank')} className="text-[10px] font-medium text-zinc-600 hover:text-zinc-400">Privacy Policy</button>
          </div>
          <p className="text-[10px] text-zinc-700 mt-2">Thurzt v0.1.0 (Prototype)</p>
        </div>

        {/* DEVELOPER TOOLS */}
        {(CONFIG.DATA_MODE === 'mock' || localStorage.getItem('dev_force_tools') === '1') && !CONFIG.REHEARSAL_MODE && (
          <div className="bg-zinc-900/30 border border-white/5 rounded-[2rem] overflow-hidden p-2">
            <div className="px-4 py-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Developer Tools</h3>
            </div>
            <div className="p-4 space-y-4">
              <MatchingDiagnoseCard 
                currentUser={user} 
                onActionComplete={() => {
                  onUpdate(MockService.getCurrentUser());
                  showToast('Done');
                }} 
              />

              <div className="space-y-2">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Session Presets</p>
                <div className="flex gap-2">
                  {['FREE', 'PLUS', 'PRO'].map(plan => (
                    <button 
                      key={plan}
                      onClick={() => {
                        MockService.setSessionPreset(plan as 'FREE' | 'PLUS' | 'PRO');
                        onUpdate(MockService.getCurrentUser());
                        showToast(`Preset set to ${plan}`);
                      }}
                      className={`flex-1 py-2 border rounded-lg text-[10px] font-bold ${user.entitlements?.plan === plan ? 'bg-white text-black border-white' : 'bg-zinc-900 border-white/10 text-white hover:bg-zinc-800'}`}
                    >
                      Set {plan}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Quick Fixes</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      MockService.seedProfiles(10);
                      onUpdate(MockService.getCurrentUser());
                      showToast("Seeded +10 profiles");
                    }}
                    className="flex-1 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white text-[10px] font-bold hover:bg-zinc-800"
                  >
                    Seed +10 Profiles
                  </button>
                  <button 
                    onClick={() => {
                      MockService.factoryReset();
                      window.location.reload();
                    }}
                    className="flex-1 py-2 bg-red-900/20 border border-red-500/20 rounded-lg text-red-400 text-[10px] font-bold hover:bg-red-900/40"
                  >
                    Factory Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showTerms && <TermsOfService onClose={() => setShowTerms(false)} />}
      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
    </div>
  );
};
