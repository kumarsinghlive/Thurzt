
import React, { useState, useEffect } from 'react';
import { AppTab, User } from './types';
import { MOCK_CURRENT_USER, MockService } from './services/mockData';
import { RehearsalHarness } from './services/RehearsalHarness';
import { Images } from './brandAssets';
import { CONFIG, UI_FLAGS, THEME } from './config';
import { auth, db, messagingPromise } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getToken } from 'firebase/messaging';

// Screens
import { MatchingScreen } from './screens/MatchingScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ChatScreen } from './screens/ChatScreen';
import { LikesTab } from './screens/LikesTab';
import { ActivityScreen } from './screens/ActivityScreen';
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';

// Icons
import { Eye, Zap, MessageCircle, User as UserIcon } from 'lucide-react';

import { DiscoveryProvider, useDiscoveryContext } from './contexts/DiscoveryContext';
import { MatchModal } from './components/MatchModal';

const MatchModalContainer = ({ currentUser, onOpenChat }: { currentUser: User, onOpenChat: (uid: string) => void }) => {
  const { showMatchModal, matchedUser, closeMatchModal } = useDiscoveryContext();
  if (!showMatchModal || !matchedUser) return null;
  return (
    <MatchModal
      currentUser={currentUser}
      matchedUser={matchedUser}
      onClose={closeMatchModal}
      onSendMessage={() => {
        closeMatchModal();
        onOpenChat(matchedUser.uid);
      }}
    />
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('MATCHING');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  
  // LIFTED STATE: Source of truth for the profile
  const [currentUser, setCurrentUser] = useState<User>(MOCK_CURRENT_USER);

  const useHarness = CONFIG.DATA_MODE === 'firebase';
  const callHarness = async <T,>(name: string, fn: () => Promise<T> | T): Promise<T> => {
    return useHarness ? RehearsalHarness.call(name, fn) : fn();
  };

  useEffect(() => {
    if (CONFIG.DATA_MODE === 'mock') {
      setIsAuthReady(true);
      setCurrentUser(MOCK_CURRENT_USER);
      return;
    }

    if (localStorage.getItem('apple_tester_bypass') === 'true') {
      setIsAuthReady(true);
      const mockUser: User = {
        uid: 'apple-tester-123',
        name: 'Apple Reviewer',
        age: 30,
        type: 'single',
        members: [{
          name: 'Apple Reviewer',
          age: 30,
        }],
        bio: 'Testing the app for review.',
        isVerified: true,
        orientations: [],
        datingStyles: [],
        goals: [],
        photos: ['https://picsum.photos/seed/reviewer/400/600'],
        privateGallery: { photos: [], access: {} },
        entitlements: { plan: 'PRO', imCredits: 10, ghostMode: true, privatePhotos: true },
        visibilityMode: 'PUBLIC',
        verificationRequired: false,
        verificationStatus: 'VERIFIED',
        regionCountryCode: 'US',
        onboardingComplete: true
      };
      setCurrentUser(mockUser);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsAuthReady(true);
      if (user) {
        if (CONFIG.DATA_MODE === 'firebase') {
          try {
            // Fetch the user profile from Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              setCurrentUser(userDoc.data() as User);
            } else {
              // New user, just set the uid on the mock user so onboarding can complete
              setCurrentUser(prev => ({ ...prev, uid: user.uid }));
            }
            
            const messaging = await messagingPromise;
            if (messaging) {
              const currentToken = await getToken(messaging, { vapidKey: 'YOUR_PUBLIC_VAPID_KEY_HERE' });
              if (currentToken) {
                await setDoc(doc(db, 'users_private', user.uid), { fcmToken: currentToken }, { merge: true });
              }
            }
          } catch (err: any) {
            if (err?.code === 'messaging/permission-blocked' || (err?.message && err.message.includes('permission-blocked'))) {
              // console.log('Notification permission blocked by user or browser.');
            } else {
              console.error('An error occurred while retrieving token or user profile. ', err);
            }
          }
        } else {
          setCurrentUser(prev => ({ ...prev, uid: user.uid }));
        }
      } else {
        // If user is logged out, reset to mock user with onboardingComplete: false
        setCurrentUser(MOCK_CURRENT_USER);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;

    callHarness('refreshEntitlementsAsync', async () => {
      await MockService.refreshEntitlementsAsync();
      return MockService.getCurrentUser();
    }).then((user) => {
      if (user) {
        // Merge the auth uid with the mock user data
        setCurrentUser(prev => ({ ...user, uid: auth.currentUser?.uid || user.uid }));
      }
    }).catch(err => {
      console.error("Failed to load entitlements", err);
    });
  }, [isAuthReady]);

  const handleProfileUpdate = async (updatedUser: User) => {
    MockService.updateCurrentUser(updatedUser);
    setCurrentUser(updatedUser);
    
    if (CONFIG.DATA_MODE === 'firebase' && updatedUser.uid && updatedUser.uid !== 'apple-tester-123') {
      try {
        await setDoc(doc(db, 'users', updatedUser.uid), updatedUser, { merge: true });
      } catch (err) {
        console.error("Error saving profile to Firebase:", err);
      }
    }
  };

  const handleOpenChat = (uid: string) => {
    // Check if chat exists
    const existingChat = MockService.getChats().find(c => c.user.uid === uid);
    if (existingChat) {
      setActiveChatId(existingChat.id);
    } else {
      setActiveChatId(`new-${uid}`);
    }
    setActiveTab('CHAT');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'MATCHING': return <MatchingScreen currentUser={currentUser} onUpdateUser={handleProfileUpdate} />;
      case 'ACTIVITY': return <ActivityScreen />;
      case 'LIKES': return <LikesTab onOpenChat={handleOpenChat} />;
      case 'CHAT': return <ChatScreen activeChatId={activeChatId} setActiveChatId={setActiveChatId} />;
      case 'PROFILE': return (
        <ProfileScreen 
          user={currentUser} 
          onUpdate={handleProfileUpdate} 
        />
      );
      default: return null;
    }
  };

  // Custom Icon Component for the App Icon (replacing HeartIcon)
  const AppIconNav = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
    <img 
      src={Images.AppIcon} 
      alt="Matches" 
      className={className} 
      style={style}
    />
  );

  const NavItem = ({ tab, icon: Icon, label }: { tab: AppTab, icon: any, label: string }) => {
    const isActive = activeTab === tab;
    const isCenter = tab === 'LIKES';
    
    // Chat badge logic
    const unreadCount = tab === 'CHAT' ? MockService.getChats().filter(c => c.unread).length : 0;
    const showBadge = false; // No red dot on Chat

    if (UI_FLAGS.fancyNav) {
      return (
        <button 
          role="tab"
          aria-selected={isActive}
          aria-label={`${label} tab`}
          onClick={() => {
            if (tab === 'CHAT' && activeTab !== 'CHAT') {
              setActiveChatId(null);
            }
            setActiveTab(tab);
          }}
          className={`flex flex-col items-center justify-center relative min-w-[44px] min-h-[44px] transition-all duration-300 ${isActive ? 'text-white' : 'text-white/60 hover:text-white/80'}`}
        >
          <div className="relative flex items-center justify-center">
            <Icon 
              className={`
                ${isCenter ? 'w-[45px] h-[45px] object-contain -translate-y-[2px]' : 'w-[28px] h-[28px]'} 
                transition-all duration-300
                ${isActive ? 'opacity-100' : 'opacity-60 grayscale'}
              `} 
              style={isActive ? { filter: 'drop-shadow(0 0 6px rgba(91,211,255,.35)) drop-shadow(0 0 10px rgba(255,90,190,.25))' } : {}}
            />
            {isActive && !isCenter && (
              <div className="absolute -bottom-3 w-1 h-1 rounded-full bg-[#FF2D7D] shadow-[0_0_8px_#FF2D7D]" />
            )}
            {showBadge && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black" />
            )}
          </div>
        </button>
      );
    }

    // Fallback
    return (
      <button 
        role="tab"
        aria-selected={isActive}
        aria-label={`${label} tab`}
        onClick={() => {
          if (tab === 'CHAT' && activeTab !== 'CHAT') {
            setActiveChatId(null);
          }
          setActiveTab(tab);
        }}
        className={`flex flex-col items-center justify-center relative w-full h-full min-w-[44px] min-h-[44px] transition-all duration-500 ${isActive ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
      >
        {isActive && (
          <div className="absolute top-0 w-8 h-[2px] bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
        )}
        <Icon className={`${isCenter ? 'w-[45px] h-[45px] object-contain -translate-y-[2px]' : 'w-[28px] h-[28px]'} ${isActive ? 'opacity-100' : 'opacity-50 grayscale'}`} />
      </button>
    );
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!currentUser.onboardingComplete && localStorage.getItem('dev_skip_onboarding') !== 'true') {
    return <OnboardingScreen onComplete={handleProfileUpdate} />;
  }

  if (currentUser.verificationStatus === 'FAILED_UNDERAGE') {
    return (
      <div className="bg-black h-screen flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-4">
          <Eye className="w-8 h-8 text-red-500 opacity-50" />
        </div>
        <h2 className="text-xl font-black uppercase tracking-widest text-zinc-500">Account Locked</h2>
        <p className="text-sm text-zinc-600">Thurzt is only available to users 18 and over.</p>
        <div className="flex flex-col gap-4 mt-8">
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white text-black rounded-xl font-black uppercase tracking-widest text-xs"
          >
            Reload
          </button>
          <a 
            href="mailto:support@thurzt.com"
            className="px-6 py-3 bg-zinc-900 text-white border border-white/10 rounded-xl font-black uppercase tracking-widest text-xs"
          >
            Contact support
          </a>
        </div>
      </div>
    );
  }

  const isRestricted = currentUser.verificationRequired && currentUser.verificationStatus !== 'VERIFIED';

  return (
    <DiscoveryProvider currentUser={currentUser}>
      <div className="bg-black h-screen flex flex-col text-white font-sans overflow-hidden relative">
        
        {/* Persistent Global Branding Overlay - Top Center */}
        {!(activeTab === 'CHAT' && activeChatId) && (
          <div className="absolute top-[max(env(safe-area-inset-top),16px)] left-1/2 -translate-x-1/2 z-[100] pointer-events-none flex items-center justify-center">
            <img 
              src={Images.AppIcon} 
              alt="Thurzt Logo" 
              style={{ width: THEME.iconSizes.nav.width, height: THEME.iconSizes.nav.height }}
              className="object-contain animate-flame"
            />
          </div>
        )}

        {isRestricted && (
          <div className="bg-red-900/50 border-b border-red-500/50 text-red-200 p-3 text-center text-xs font-black uppercase tracking-widest z-50">
            Verification required to continue
          </div>
        )}

        {/* Content Area with smooth transitions */}
        <div className={`flex-1 relative ${activeTab === 'CHAT' ? 'overflow-hidden' : 'overflow-y-auto no-scrollbar scroll-smooth'}`}>
          {isRestricted && (activeTab === 'CHAT' || activeTab === 'MATCHING') ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <Eye className="w-8 h-8 text-red-500 opacity-50" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-widest text-zinc-500">Access Restricted</h2>
              <p className="text-sm text-zinc-600">Please verify your profile to access this feature.</p>
              <button 
                onClick={() => setActiveTab('PROFILE')}
                className="mt-8 px-6 py-3 bg-white text-black rounded-xl font-black uppercase tracking-widest text-xs"
              >
                Go to Profile
              </button>
            </div>
          ) : (
            renderContent()
          )}
        </div>

        {/* Minimized Ultra-Thin High-End Navigation */}
        {UI_FLAGS.fancyNav ? (
          <nav 
            role="tablist"
            className="flex-none absolute bottom-0 left-0 right-0 z-[120] pb-[max(env(safe-area-inset-bottom),16px)] pt-4 bg-black border-t border-white/10"
          >
            <div className="flex justify-between items-center max-w-xl mx-auto px-6">
              <NavItem tab="MATCHING" icon={Eye} label="Matching" />
              <NavItem tab="ACTIVITY" icon={Zap} label="Activity" />
              <NavItem tab="LIKES" icon={AppIconNav} label="Matches" />
              <NavItem tab="CHAT" icon={MessageCircle} label="Chat" />
              <NavItem tab="PROFILE" icon={UserIcon} label="Profile" />
            </div>
          </nav>
        ) : (
          <nav role="tablist" className="flex-none bg-black border-t border-white/5 pb-safe-bottom relative z-[120]">
            <div className="flex justify-around items-center h-20 px-4 max-w-xl mx-auto">
              <NavItem tab="MATCHING" icon={Eye} label="Matching" />
              <NavItem tab="ACTIVITY" icon={Zap} label="Activity" />
              <NavItem tab="LIKES" icon={AppIconNav} label="Matches" />
              <NavItem tab="CHAT" icon={MessageCircle} label="Chat" />
              <NavItem tab="PROFILE" icon={UserIcon} label="Profile" />
            </div>
          </nav>
        )}
        
        <MatchModalContainer currentUser={currentUser} onOpenChat={handleOpenChat} />
      </div>
    </DiscoveryProvider>
  );
}
