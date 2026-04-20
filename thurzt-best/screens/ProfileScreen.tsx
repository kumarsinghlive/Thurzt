
import React, { useState } from 'react';
import { User } from '../types';
import { CONFIG } from '../config';
import { FirebaseBridge } from '../services/FirebaseBridge';
import { MockService } from '../services/mockData';
import { RehearsalHarness } from '../services/RehearsalHarness';
import { Paywall } from '../components/Paywall';
import { UnavailableModal } from '../components/UnavailableModal';
import { EditProfileScreen } from './EditProfileScreen';
import { EditMembersScreen } from './EditMembersScreen';
import { ProfilePreviewScreen } from './ProfilePreviewScreen';
import { ProfileTitle } from '../components/ProfileTitle';
import { MatchingDiagnoseCard } from '../components/MatchingDiagnoseCard';
import ProfileImg from '../assets/Profile.png';
import { 
  Settings, 
  Lock, 
  Edit2, 
  User as UserIcon, 
  Users, 
  ShieldCheck, 
  ChevronRight, 
  ChevronDown, 
  Ghost, 
  Eye, 
  EyeOff, 
  FileText, 
  HelpCircle, 
  LogOut, 
  Bell, 
  ShieldAlert, 
  Flag,
  Check,
  X
} from 'lucide-react';
import { billingService } from '../services/BillingService';

interface ProfileScreenProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

import { SettingsSheet } from '../components/SettingsSheet';

// --- Helper Components ---

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
      <ChevronRight className="w-4 h-4 text-zinc-700" />
    </div>
  </button>
);

const ExpandableSection = ({ 
  title, 
  icon: Icon, 
  children, 
  defaultExpanded = false 
}: { 
  title: string, 
  icon: any, 
  children: React.ReactNode, 
  defaultExpanded?: boolean 
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-zinc-900/30 border border-white/5 rounded-[2rem] overflow-hidden mb-4">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-zinc-500" />
          <span className="text-xs font-black uppercase tracking-widest text-zinc-300">{title}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-zinc-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 pt-0">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onUpdate }) => {
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState<{title: string, desc: string, type?: 'subscription' | 'consumable_im'}>({ title: '', desc: '' });
  const [unavailableFeature, setUnavailableFeature] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingMembers, setIsEditingMembers] = useState(false);
  const [isPreviewingProfile, setIsPreviewingProfile] = useState(false);
  const [showSettingsSheet, setShowSettingsSheet] = useState(false);
  const [showUpgradeSection, setShowUpgradeSection] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [toast, setToast] = useState<string | null>(null);

  const useHarness = CONFIG.DATA_MODE === 'firebase';
  const callHarness = async <T,>(name: string, fn: () => Promise<T> | T): Promise<T> => {
    return useHarness ? RehearsalHarness.call(name, fn) : fn();
  };

  if (!MockService.mockReady || !user) {
    return (
      <div className="bg-black min-h-full pb-32 p-4 pt-20">
        <div className="animate-pulse space-y-8">
          <div className="w-32 h-32 bg-zinc-900 rounded-full mx-auto" />
          <div className="space-y-4">
            <div className="h-8 bg-zinc-900 rounded-xl w-3/4 mx-auto" />
            <div className="h-4 bg-zinc-900 rounded-xl w-1/2 mx-auto" />
          </div>
          <div className="flex gap-2 justify-center">
            <div className="h-8 w-20 bg-zinc-900 rounded-full" />
            <div className="h-8 w-24 bg-zinc-900 rounded-full" />
            <div className="h-8 w-16 bg-zinc-900 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLockedFeature = (title: string, desc: string) => {
    if (user.entitlements?.plan === 'FREE') {
      setPaywallFeature({ title, desc });
      setShowPaywall(true);
    } else {
      // If plan is not free, feature might be available or unfinished
      // For this prototype, we'll assume "Private Vault" is the only functional locked feature logic we might simulate, 
      // but per instructions "Locked items open Paywall", so we just show paywall if free.
      // If they are PRO, we might show the unavailable modal if it's not built yet.
      setUnavailableFeature(title);
    }
  };

  const handleUnavailable = (name: string) => {
    setUnavailableFeature(name);
  };

  const handlePurchase = async (planId: 'FREE' | 'PLUS' | 'PRO') => {
    try {
      if (planId === 'FREE') {
        await callHarness('downgradeToFree', async () => {
          MockService.setPlan('FREE');
          onUpdate(MockService.getCurrentUser());
        });
        showToast("Switched to Free plan");
        return;
      }
      
      const productId = planId === 'PLUS' ? 'sub_plus' : 'sub_pro';
      await callHarness(`purchase_${productId}`, async () => {
        await billingService.purchase(productId);
        onUpdate(MockService.getCurrentUser());
      });
      showToast(`Upgraded to ${planId === 'PLUS' ? 'Thurzt+' : 'Thurzt Pro'}`);
    } catch (e) {
      showToast("Failed to update membership. Please try again.");
    }
  };

  const handleSaveProfile = async (updatedUser: User) => {
    try {
      await callHarness('saveProfile', async () => {
        MockService.updateCurrentUser(updatedUser);
        onUpdate(updatedUser);
        setIsEditingProfile(false);
      });
      showToast("Profile saved successfully.");
    } catch (error) {
      showToast("Failed to save profile. Please try again.");
    }
  };

  const handleSaveMembers = async (updatedUser: User) => {
    try {
      await callHarness('saveMembers', async () => {
        MockService.updateCurrentUser(updatedUser);
        onUpdate(updatedUser);
        setIsEditingMembers(false);
      });
      showToast("Members saved successfully.");
    } catch (error) {
      showToast("Failed to save members. Please try again.");
    }
  };

  if (isPreviewingProfile) {
    return (
      <ProfilePreviewScreen
        user={user}
        onClose={() => setIsPreviewingProfile(false)}
      />
    );
  }

  if (isEditingMembers) {
    return (
      <EditMembersScreen
        user={user}
        onSave={handleSaveMembers}
        onClose={() => {
          setIsEditingMembers(false);
          setIsEditingProfile(true);
        }}
      />
    );
  }

  if (isEditingProfile) {
    return (
      <EditProfileScreen
        user={user}
        onSave={handleSaveProfile}
        onClose={() => setIsEditingProfile(false)}
        onOpenMembers={() => {
          setIsEditingProfile(false);
          setIsEditingMembers(true);
        }}
      />
    );
  }

  return (
    <div className="bg-black min-h-full pb-32">
      {/* Modals */}
      
      {showPaywall && (
        <Paywall 
          title={paywallFeature.title}
          description={paywallFeature.desc}
          icon={Lock}
          color="bg-zinc-800"
          currentPlan={user?.entitlements?.plan}
          type={paywallFeature.type}
          onClose={() => setShowPaywall(false)}
          onUpgrade={async (plan) => {
            try {
              await callHarness('upgradeToPlus', async () => {
                if (plan) {
                  MockService.purchaseProduct(plan);
                  onUpdate(MockService.getCurrentUser());
                }
              });
              showToast("Purchase successful.");
              setShowPaywall(false);
            } catch (e) {
              showToast("Purchase failed. Please try again.");
            }
          }}
        />
      )}
      
      {unavailableFeature && (
        <UnavailableModal 
          featureName={unavailableFeature} 
          onClose={() => setUnavailableFeature(null)} 
        />
      )}

      {/* Header */}
      <header className="px-8 pt-[max(env(safe-area-inset-top),16px)] pb-4 bg-black/80 backdrop-blur-md sticky top-0 z-40 border-b border-white/5 relative">
        <div className="flex items-center justify-between h-11">
          <div style={{ flex: 1, alignItems: 'center', display: 'flex', justifyContent: 'flex-start' }}>
            <img 
              src={ProfileImg} 
              alt="Profile" 
              style={{ width: '60%', height: 40, objectFit: 'contain', objectPosition: 'left', alignSelf: 'center' }} 
            />
          </div>
          <div className="flex items-center gap-2 absolute right-8">
            {/* Hidden admin button to trigger Instant Messages paywall for screenshots */}
            <button 
              onClick={() => {
                setPaywallFeature({
                  title: "Instant Messages",
                  desc: "Send messages instantly to get noticed faster.",
                  type: 'consumable_im'
                });
                setShowPaywall(true);
              }}
              className="w-8 h-8 opacity-0"
              aria-hidden="true"
            />
            <button 
              onClick={() => setShowSettingsSheet(true)}
              className="p-3 bg-zinc-900/50 backdrop-blur rounded-full text-zinc-400 border border-white/5 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4">
        
        {/* 1. Profile Preview Card */}
        <div className="relative aspect-[3/4] w-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group">
          <img src={user.photos?.[0] || ''} className="w-full h-full object-cover" alt={user.name || 'User'} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-2">
              <ProfileTitle 
                user={user} 
                nameClassName="text-3xl font-black tracking-tighter text-white uppercase" 
                ageClassName="text-2xl font-light text-white/70"
                separatorClassName="text-3xl font-black tracking-tighter text-white/50 uppercase"
              />
              {user.isVerified && <ShieldCheck className="w-6 h-6 text-blue-400" />}
            </div>
            <p className="text-zinc-300 font-medium line-clamp-2 mb-6">{user.bio || ''}</p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setIsEditingProfile(true)}
                className="flex-1 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Edit2 className="w-3 h-3" /> Edit Profile
              </button>
              <button 
                onClick={() => setIsPreviewingProfile(true)}
                className="px-4 py-3 bg-zinc-800/80 backdrop-blur text-white rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
              >
                <Eye className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* 1.5 Subscriptions */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-[2rem] overflow-hidden p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Current Plan</h3>
              <p className="text-lg font-bold text-white uppercase tracking-widest mt-1">{user.entitlements?.plan || 'FREE'}</p>
            </div>
            {showUpgradeSection ? (
              <button 
                onClick={() => setShowUpgradeSection(false)}
                className="p-2 bg-white/10 text-white rounded-full active:scale-95 transition-all hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={() => setShowUpgradeSection(true)}
                className="px-4 py-2 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
              >
                Upgrade Membership
              </button>
            )}
          </div>
        </div>

        {showUpgradeSection && (
          <div className="bg-zinc-900/30 border border-white/5 rounded-[2rem] overflow-hidden p-4 space-y-6 mb-4">
            <div className="flex justify-center">
              <div className="bg-black/50 p-1 rounded-full flex">
                <button 
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${billingCycle === 'monthly' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
                >
                  Monthly
                </button>
                <button 
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${billingCycle === 'yearly' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
                >
                  Yearly
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* FREE Card */}
              <div 
                onClick={() => handlePurchase('FREE')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${user.entitlements?.plan === 'FREE' ? 'border-white bg-white/5' : 'border-white/5 bg-black/20 hover:border-white/20'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-black uppercase tracking-widest text-white">Free</h4>
                    <div className="text-2xl font-bold mt-1">$0</div>
                  </div>
                  {user.entitlements?.plan === 'FREE' && <div className="px-2 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full">Active</div>}
                </div>
                <ul className="space-y-2 text-xs text-zinc-400">
                  <li className="flex items-start gap-2"><Check className="w-3 h-3 text-white shrink-0 mt-0.5" /> Limited Likes per day</li>
                  <li className="flex items-start gap-2"><Check className="w-3 h-3 text-white shrink-0 mt-0.5" /> Standard Visibility</li>
                  <li className="flex items-start gap-2"><Check className="w-3 h-3 text-white shrink-0 mt-0.5" /> Private Photos Included</li>
                </ul>
              </div>

              {/* THURZT+ Card */}
              <div 
                onClick={() => handlePurchase('PLUS')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${user.entitlements?.plan === 'PLUS' ? 'border-[#00D2FF] bg-[#00D2FF]/5 shadow-[0_0_15px_rgba(0,210,255,0.1)]' : 'border-white/5 bg-black/20 hover:border-[#00D2FF]/30'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-black uppercase tracking-widest text-[#00D2FF]">Thurzt+</h4>
                    <div className="text-2xl font-bold mt-1">
                      {billingCycle === 'monthly' ? '$14.99' : '$99.99'}
                      <span className="text-xs text-zinc-500 font-normal">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                    </div>
                  </div>
                  {user.entitlements?.plan === 'PLUS' && <div className="px-2 py-1 bg-[#00D2FF] text-black text-[10px] font-bold uppercase tracking-widest rounded-full">Active</div>}
                </div>
                <ul className="space-y-2 text-xs text-zinc-400">
                  <li className="flex items-start gap-2"><Check className="w-3 h-3 text-[#00D2FF] shrink-0 mt-0.5" /> Infinite Reach (Unlimited Daily Likes)</li>
                  <li className="flex items-start gap-2"><Check className="w-3 h-3 text-[#00D2FF] shrink-0 mt-0.5" /> Reveal Admirers: See who already liked your profile</li>
                  <li className="flex items-start gap-2"><Check className="w-3 h-3 text-[#00D2FF] shrink-0 mt-0.5" /> 3 Instant Messages per month</li>
                </ul>
              </div>

              {/* THURZT PRO Card */}
              <div 
                onClick={() => handlePurchase('PRO')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${user.entitlements?.plan === 'PRO' ? 'border-[#FF2D7D] bg-[#FF2D7D]/5 shadow-[0_0_15px_rgba(255,45,125,0.1)]' : 'border-white/5 bg-black/20 hover:border-[#FF2D7D]/30'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black uppercase tracking-widest text-[#FF2D7D]">Thurzt Pro</h4>
                      {billingCycle === 'yearly' && (
                        <span className="px-1.5 py-0.5 bg-[#FF2D7D]/20 text-[#FF2D7D] text-[8px] font-black uppercase tracking-widest rounded-sm">Best Value</span>
                      )}
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {billingCycle === 'monthly' ? '$24.99' : '$179.99'}
                      <span className="text-xs text-zinc-500 font-normal">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                    </div>
                  </div>
                  {user.entitlements?.plan === 'PRO' && <div className="px-2 py-1 bg-[#FF2D7D] text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Active</div>}
                </div>
                <ul className="space-y-2 text-xs text-zinc-400">
                  <li className="flex items-start gap-2"><Check className="w-3 h-3 text-[#FF2D7D] shrink-0 mt-0.5" /> Everything in Plus, plus...</li>
                  <li className="flex items-start gap-2"><Check className="w-3 h-3 text-[#FF2D7D] shrink-0 mt-0.5" /> Ghost Mode: Browse 100% Invisibly</li>
                  <li className="flex items-start gap-2"><Check className="w-3 h-3 text-[#FF2D7D] shrink-0 mt-0.5" /> Priority Stack: Be seen by top profiles first</li>
                  <li className="flex items-start gap-2"><Check className="w-3 h-3 text-[#FF2D7D] shrink-0 mt-0.5" /> 5 Instant Messages per month</li>
                </ul>
              </div>
            </div>

            <button 
              onClick={async () => {
                if (user.uid === 'apple-tester-123') {
                  showToast("Purchases successfully restored.");
                  return;
                }
                try {
                  await callHarness('restorePurchases', async () => {
                    await billingService.restorePurchases();
                    onUpdate(MockService.getCurrentUser());
                  });
                  showToast("Purchases restored");
                } catch (e) {
                  showToast("Failed to restore purchases.");
                }
              }}
              className="w-full py-2 text-[10px] font-bold text-zinc-500 hover:text-white transition-colors mt-4"
            >
              Restore Purchases
            </button>
          </div>
        )}

        {/* 2. Settings Sheet */}
        {showSettingsSheet && (
          <SettingsSheet 
            user={user}
            onClose={() => setShowSettingsSheet(false)}
            onUpdate={onUpdate}
            showToast={showToast}
            handleUnavailable={handleUnavailable}
            handleLockedFeature={handleLockedFeature}
            setPaywallFeature={setPaywallFeature}
            setShowPaywall={setShowPaywall}
          />
        )}
      </div>
    </div>
  );
};
