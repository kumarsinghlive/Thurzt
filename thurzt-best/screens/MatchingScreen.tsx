
import React, { useState, useEffect } from 'react';
import { FirebaseBridge } from '../services/FirebaseBridge';
import { SwipeCard } from '../components/SwipeCard';
import { Filters } from '../components/Filters';
import { Paywall } from '../components/Paywall';
import { BoostTimer } from '../components/BoostTimer';
import { ProfileDetails } from '../components/ProfileDetails';
import { ReportModal } from '../components/ReportModal';
import { DAILY_SWIPE_LIMIT } from '../constants';
import { useFilters } from '../hooks/useFilters';
import { useDiscoveryContext } from '../contexts/DiscoveryContext';
import { User } from '../types';
import { MockService } from '../services/mockData';
import { billingService } from '../services/BillingService';
import { RehearsalHarness } from '../services/RehearsalHarness';
import { CONFIG } from '../config';
import { X, Heart, RotateCcw, Users, SlidersHorizontal, Loader2, Zap, Lock, MessageCircle, Send, Flag, ShieldAlert } from 'lucide-react';

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

interface MatchingScreenProps {
  currentUser: User;
  onUpdateUser?: (user: User) => void;
}

export const MatchingScreen: React.FC<MatchingScreenProps> = ({ currentUser, onUpdateUser }) => {
  const { 
    discoveryStack: candidates, 
    loading, 
    error, 
    refreshDiscovery, 
    handleLike, 
    handlePass, 
    handleInstantMessage,
    remainingImCredits,
    isUnlimitedLikes,
    likesCount
  } = useDiscoveryContext();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState<string | null>(null);
  const [paywallFeature, setPaywallFeature] = useState<{title: string, desc: string, icon: any, color: string, type?: 'subscription' | 'consumable_im'} | null>(null);
  const [showComposer, setShowComposer] = useState(false);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [showIMModal, setShowIMModal] = useState(false);  const [messageText, setMessageText] = useState('');
  const [reportingUser, setReportingUser] = useState<User | null>(null);
  
  const [dragStart, setDragStart] = useState<{ x: number, y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const { height } = useWindowDimensions();
  const isSmallDevice = height < 700;
  const cardMaxHeight = isSmallDevice ? '60vh' : '65vh';

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };
  
  const isRestricted = currentUser.verificationRequired && currentUser.verificationStatus !== 'VERIFIED';
  
  const { filters, updateFilter } = useFilters();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const useHarness = CONFIG.DATA_MODE === 'firebase';
  const callHarness = async <T,>(name: string, fn: () => Promise<T> | T): Promise<T> => {
    return useHarness ? RehearsalHarness.call(name, fn) : fn();
  };

  const handleSafetyAction = async (action: string, user: User) => {
    if (action === 'Report') {
      setReportingUser(user);
    } else if (action === 'Block') {
      try {
        await callHarness('blockEntity', async () => {
          MockService.blockEntity(user.uid);
          refreshDiscovery();
        });
      } catch (error) {
        showToast("Failed to block entity. Please try again.");
      }
    }
  };

  const SWIPE_THRESHOLD = 100; // pixels
  const V_DEADZONE = 16; // pixels

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isRestricted || isAnimating) return;
    // Don't start drag if clicking on a button inside the card
    if ((e.target as HTMLElement).tagName.toLowerCase() === 'button') return;
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (!dragStart) return;

    let isScrolling = false;
    let hasMoved = false;

    const handlePointerMove = (e: PointerEvent) => {
      if (isRestricted || isAnimating || isScrolling) return;
      
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;

      if (!hasMoved) {
        if (Math.abs(dy) > V_DEADZONE && Math.abs(dy) > Math.abs(dx)) {
          isScrolling = true;
          setDragOffset({ x: 0, y: 0 }); // reset any horizontal translation
          setDragStart(null);
          return;
        }
        if (Math.abs(dx) > 10) {
          hasMoved = true;
        }
      }

      if (hasMoved) {
        setDragOffset({ x: dx, y: 0 }); // Horizontal only
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (isRestricted || isAnimating || isScrolling) return;
      
      const finalOffsetX = e.clientX - dragStart.x;
      
      if (finalOffsetX > SWIPE_THRESHOLD) {
        // Swipe Right
        setIsAnimating(true);
        setDragOffset({ x: window.innerWidth, y: 0 });
        handleSwipe('right');
      } else if (finalOffsetX < -SWIPE_THRESHOLD) {
        // Swipe Left
        setIsAnimating(true);
        setDragOffset({ x: -window.innerWidth, y: 0 });
        handleSwipe('left');
      } else {
        // Snap back
        setDragOffset({ x: 0, y: 0 });
      }
      setDragStart(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [dragStart, isRestricted, isAnimating]);

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (isRestricted || (isAnimating && dragOffset.x === 0)) return; // Prevent double triggers from buttons if already animating
    
    const currentProfile = candidates[currentIndex];
    if (!currentProfile) return;

    try {
      if (direction === 'right') {
        const success = handleLike(currentProfile);
        if (!success) {
          setPaywallFeature({
            title: "Out of Likes",
            desc: "You've reached your rolling 24h limit of 20 likes. Upgrade to Thurzt+ for unlimited matching.",
            icon: Heart,
            color: "bg-rose-500"
          });
          // Snap back if triggered by drag
          setDragOffset({ x: 0, y: 0 });
          setIsAnimating(false);
          return;
        }
      } else {
        handlePass(currentProfile);
      }
      
      setLastDirection(direction);
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setLastDirection(null);
        setDragOffset({ x: 0, y: 0 });
        setIsAnimating(false);
        const contentArea = document.querySelector('.overflow-y-auto');
        if (contentArea) contentArea.scrollTo({ top: 0, behavior: 'instant' as any });
      }, 300);
    } catch (error) {
      showToast("Failed to process action. Please try again.");
    }
  };

  const handleInstantMessageClick = () => {
    if (remainingImCredits <= 0) {
      setShowIMModal(true);
    } else {
      setShowComposer(true);
    }
  };

  const sendInstantMessage = async () => {
    if (!messageText.trim()) return;
    
    try {
      const currentProfile = candidates[currentIndex];
      
      const success = handleInstantMessage(currentProfile, messageText);
      
      if (!success) {
        setShowComposer(false);
        setShowIMModal(true);
        return;
      }

      // Reset and close
      setMessageText('');
      setShowComposer(false);
      
      // Advance card (this will also record the like and swipe right)
      handleSwipe('right');
    } catch (error) {
      showToast("Failed to send Instant Message. Please try again.");
    }
  };

  const currentProfile = candidates[currentIndex];

  if (isFilterOpen) {
    return (
      <Filters 
        preferences={filters} 
        onUpdate={updateFilter} 
        onClose={() => setIsFilterOpen(false)} 
      />
    );
  }

  // ... loading and empty states ...

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-white animate-spin opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          </div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mt-6">Searching...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 text-center">
        <ShieldAlert className="w-12 h-12 text-zinc-600 mb-6" />
        <h2 className="text-xl font-black uppercase tracking-tighter mb-4 italic text-zinc-300">{error}</h2>
        <button 
          onClick={refreshDiscovery}
          className="px-8 py-4 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl"
        >
          Try Again
        </button>
      </div>
    );
  }

  const isFree = currentUser.entitlements?.plan === 'FREE';
  const canLike = isUnlimitedLikes || likesCount < 20;

  if (!canLike && !currentProfile) {
    const limit = 20;
    const used = likesCount;
    const windowStart = Date.now();
    const resetTime = windowStart + 24 * 60 * 60 * 1000;
    const remainingMs = Math.max(0, resetTime - Date.now());
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center">
        <RotateCcw className="w-12 h-12 text-zinc-800 mb-6" />
        <h2 className="text-3xl font-black uppercase tracking-tight mb-4 italic">Unlimited likes</h2>
        <p className="text-zinc-400 text-sm leading-relaxed mb-2 font-medium">You’ve reached your rolling 24h limit.</p>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-8">
          Resets in {hours}h {minutes}m
        </p>
        <button 
          onClick={() => {
            setPaywallFeature({
              title: "Unlimited Likes",
              desc: "Keep matching without limits.",
              icon: Heart,
              color: "bg-rose-500"
            });
          }}
          className="bg-white text-black px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest w-full mb-4"
        >
          Upgrade for unlimited likes
        </button>
        <button 
          className="text-zinc-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors py-2"
        >
          OK
        </button>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 text-center relative">
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="absolute top-6 right-6 p-3 bg-zinc-900 rounded-full text-zinc-400 border border-white/5 hover:text-white transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>

        <div className="mb-10">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">No more profiles right now.</h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Check back later — new people appear regularly.</p>
        </div>
        
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="px-10 py-5 bg-white text-black rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-xl"
        >
          Reset filters
        </button>
      </div>
    );
  }

  const limit = 20;
  const used = likesCount;
  const windowStart = Date.now();
  const resetTime = windowStart + 24 * 60 * 60 * 1000;
  const remainingMs = Math.max(0, resetTime - Date.now());
  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  
  const totalIMs = remainingImCredits;

  return (
    <div 
      className="h-full bg-black overflow-y-auto no-scrollbar relative touch-pan-y"
      style={{ 
        paddingBottom: 'calc(var(--safe-area-inset-bottom, 0px) + 66px + 8px)',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {paywallFeature && (
        <Paywall 
          title={paywallFeature.title} 
          description={paywallFeature.desc} 
          icon={paywallFeature.icon} 
          color={paywallFeature.color}
          currentPlan={currentUser?.entitlements?.plan}
          type={paywallFeature.type}
          onClose={() => setPaywallFeature(null)}
          onUpgrade={async (plan) => {
            try {
              await callHarness('upgradeAction', async () => {
                if (plan) {
                  MockService.purchaseProduct(plan);
                  showToast(`Purchase successful.`);
                  if (onUpdateUser) onUpdateUser(MockService.getCurrentUser());
                } else {
                  showToast("Payments coming soon.");
                }
                setPaywallFeature(null);
              });
            } catch (e) {
              showToast("Upgrade failed. Please try again.");
            }
          }}
        />
      )}

      {showComposer && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
          <div className="flex-1 flex flex-col p-6">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black uppercase tracking-tight italic">Instant Message</h3>
              <button 
                onClick={() => setShowComposer(false)}
                className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-4 mb-6">
              <img src={currentProfile.photos[0]} className="w-12 h-12 rounded-full object-cover border border-white/10" alt="" />
              <div>
                <p className="text-sm font-bold text-white">To: {currentProfile.name}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">1 Credit will be used</p>
              </div>
            </div>

            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Say something interesting..."
              className="w-full h-40 bg-zinc-900/50 border border-white/10 rounded-2xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
              autoFocus
            />
            
            <div className="mt-auto">
              <button 
                onClick={sendInstantMessage}
                disabled={!messageText.trim()}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}



      {showIMModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-white/10 rounded-[2rem] p-6 w-full max-w-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <MessageCircle className="w-24 h-24" />
            </div>
            
            <button 
              onClick={() => setShowIMModal(false)}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-zinc-400 hover:text-white z-50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10">
              <div className="w-12 h-12 bg-[#00D2FF]/20 rounded-full flex items-center justify-center mb-4 border border-[#00D2FF]/30">
                <MessageCircle className="w-6 h-6 text-[#00D2FF] fill-current" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">Instant Message</h3>
              <p className="text-zinc-400 text-sm mb-6">Skip the wait and send a message directly. They'll see it before they swipe.</p>
              
              <div className="space-y-3">
                <button 
                  onClick={async () => {
                    try {
                      await callHarness('purchaseIMCredit', async () => {
                        MockService.setCredits(1);
                      });
                      if (onUpdateUser) onUpdateUser(MockService.getCurrentUser());
                      showToast("Purchased 1 IM Credit");
                      setShowIMModal(false);
                      setShowComposer(true);
                    } catch (error) {
                      showToast("Failed to purchase credit. Please try again.");
                    }
                  }}
                  className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-colors flex justify-between px-6 items-center"
                >
                  <span>1 Credit</span>
                  <span className="text-[#00D2FF]">$1.99</span>
                </button>
                <button 
                  onClick={async () => {
                    try {
                      await callHarness('purchaseIMCredits', async () => {
                        MockService.setCredits(3);
                      });
                      if (onUpdateUser) onUpdateUser(MockService.getCurrentUser());
                      showToast("Purchased 3 IM Credits");
                      setShowIMModal(false);
                      setShowComposer(true);
                    } catch (error) {
                      showToast("Failed to purchase credits. Please try again.");
                    }
                  }}
                  className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-colors flex justify-between px-6 items-center"
                >
                  <span>3 Credits</span>
                  <span className="text-[#00D2FF]">$3.99</span>
                </button>
                <button 
                  onClick={async () => {
                    try {
                      await callHarness('purchaseIMCredits', async () => {
                        MockService.setCredits(5);
                      });
                      if (onUpdateUser) onUpdateUser(MockService.getCurrentUser());
                      showToast("Purchased 5 IM Credits");
                      setShowIMModal(false);
                      setShowComposer(true);
                    } catch (error) {
                      showToast("Failed to purchase credits. Please try again.");
                    }
                  }}
                  className="w-full py-4 bg-[#00D2FF] hover:bg-[#00D2FF]/80 rounded-xl text-xs font-black uppercase tracking-widest text-black transition-colors flex justify-between px-6 items-center shadow-[0_0_20px_rgba(0,210,255,0.4)]"
                >
                  <span>5 Credits</span>
                  <span className="text-black/90">$4.99</span>
                </button>
              </div>
              
              <button 
                onClick={() => {
                  setShowIMModal(false);
                  setPaywallFeature({
                    title: "Thurzt+",
                    desc: "Get 3 Instant Messages every month, plus unlimited likes and more.",
                    icon: MessageCircle,
                    color: "bg-blue-500",
                    type: 'subscription'
                  });
                }}
                className="w-full text-[10px] text-zinc-500 hover:text-white text-center mt-6 uppercase tracking-widest transition-colors"
              >
                Plus members get 3 free credits/month
              </button>
            </div>
          </div>
        </div>
      )}

      {showBoostModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-white/10 rounded-[2rem] p-6 w-full max-w-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Zap className="w-24 h-24" />
            </div>
            
            <button 
              onClick={() => setShowBoostModal(false)}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-zinc-400 hover:text-white z-50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10">
              <div className="w-12 h-12 bg-[#FF2D7D]/20 rounded-full flex items-center justify-center mb-4 border border-[#FF2D7D]/30">
                <Zap className="w-6 h-6 text-[#FF2D7D] fill-current" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">Boost Profile</h3>
              <p className="text-zinc-400 text-sm mb-6">Be seen by up to 10x more people in your area.</p>
              
              <div className="space-y-3">
                <button 
                  onClick={async () => {
                    try {
                      if ((currentUser?.entitlements?.balances?.boosts_1h || 0) > 0) {
                        await callHarness('activateBoost', async () => {
                          billingService.activateBoost(1);
                        });
                        if (onUpdateUser) onUpdateUser(MockService.getCurrentUser());
                        showToast("Boost activated!");
                        setShowBoostModal(false);
                      } else {
                        await callHarness('purchaseAndActivateBoost', async () => {
                          MockService.addBoosts('1h', 1);
                          billingService.activateBoost(1);
                        });
                        if (onUpdateUser) onUpdateUser(MockService.getCurrentUser());
                        showToast("Purchased and activated 1h Boost");
                        setShowBoostModal(false);
                      }
                    } catch (error) {
                      showToast("Failed to process boost. Please try again.");
                    }
                  }}
                  className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-colors flex justify-between px-6 items-center ${(currentUser?.entitlements?.balances?.boosts_1h || 0) > 0 ? 'bg-[#FF2D7D] hover:bg-[#FF2D7D]/80' : 'bg-zinc-800 hover:bg-zinc-700'}`}
                >
                  <span>1 Hour</span>
                  <span className={(currentUser?.entitlements?.balances?.boosts_1h || 0) > 0 ? 'text-white/90' : 'text-[#FF2D7D]'}>
                    {(currentUser?.entitlements?.balances?.boosts_1h || 0) > 0 ? 'Activate' : '$4.99'}
                  </span>
                </button>
                <button 
                  onClick={async () => {
                    try {
                      if ((currentUser?.entitlements?.balances?.boosts_12h || 0) > 0) {
                        await callHarness('activateBoost', async () => {
                          billingService.activateBoost(12);
                        });
                        if (onUpdateUser) onUpdateUser(MockService.getCurrentUser());
                        showToast("Boost activated!");
                        setShowBoostModal(false);
                      } else {
                        await callHarness('purchaseAndActivateBoost', async () => {
                          MockService.addBoosts('12h', 1);
                          billingService.activateBoost(12);
                        });
                        if (onUpdateUser) onUpdateUser(MockService.getCurrentUser());
                        showToast("Purchased and activated 12h Boost");
                        setShowBoostModal(false);
                      }
                    } catch (error) {
                      showToast("Failed to process boost. Please try again.");
                    }
                  }}
                  className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-colors flex justify-between px-6 items-center ${(currentUser?.entitlements?.balances?.boosts_12h || 0) > 0 ? 'bg-[#FF2D7D] hover:bg-[#FF2D7D]/80' : 'bg-zinc-800 hover:bg-zinc-700'}`}
                >
                  <span>12 Hours</span>
                  <span className={(currentUser?.entitlements?.balances?.boosts_12h || 0) > 0 ? 'text-white/90' : 'text-[#FF2D7D]'}>
                    {(currentUser?.entitlements?.balances?.boosts_12h || 0) > 0 ? 'Activate' : '$14.99'}
                  </span>
                </button>
                <button 
                  onClick={async () => {
                    try {
                      if ((currentUser?.entitlements?.balances?.boosts_24h || 0) > 0) {
                        await callHarness('activateBoost', async () => {
                          billingService.activateBoost(24);
                        });
                        if (onUpdateUser) onUpdateUser(MockService.getCurrentUser());
                        showToast("Boost activated!");
                        setShowBoostModal(false);
                      } else {
                        await callHarness('purchaseAndActivateBoost', async () => {
                          MockService.addBoosts('24h', 1);
                          billingService.activateBoost(24);
                        });
                        if (onUpdateUser) onUpdateUser(MockService.getCurrentUser());
                        showToast("Purchased and activated 24h Boost");
                        setShowBoostModal(false);
                      }
                    } catch (error) {
                      showToast("Failed to process boost. Please try again.");
                    }
                  }}
                  className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-colors flex justify-between px-6 items-center ${(currentUser?.entitlements?.balances?.boosts_24h || 0) > 0 ? 'bg-[#FF2D7D] hover:bg-[#FF2D7D]/80' : 'bg-zinc-800 hover:bg-zinc-700'}`}
                >
                  <span>24 Hours</span>
                  <span className={(currentUser?.entitlements?.balances?.boosts_24h || 0) > 0 ? 'text-white/90' : 'text-[#FF2D7D]'}>
                    {(currentUser?.entitlements?.balances?.boosts_24h || 0) > 0 ? 'Activate' : '$24.99'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="sticky top-0 w-full flex justify-between items-center px-8 pt-[max(env(safe-area-inset-top),16px)] pb-4 z-30 bg-gradient-to-b from-black to-transparent">
        {currentUser?.entitlements?.plan === 'PRO' ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 backdrop-blur rounded-full border border-purple-500/20">
            <Zap className="w-3.5 h-3.5 text-purple-400 fill-purple-400/20" />
            <span className="text-[11px] font-bold text-purple-400 uppercase tracking-widest">
              PRO
            </span>
          </div>
        ) : currentUser?.entitlements?.activeBoostUntil && currentUser.entitlements.activeBoostUntil > Date.now() ? (
          <BoostTimer activeUntil={currentUser.entitlements.activeBoostUntil} />
        ) : (
          <button 
            onClick={() => setShowBoostModal(true)}
            className="p-3 bg-zinc-900/50 backdrop-blur rounded-full border border-white/5 hover:bg-zinc-800 transition-colors flex items-center justify-center"
          >
            <Zap className="w-5 h-5 text-purple-400" />
          </button>
        )}
        
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="p-3 bg-zinc-900/50 backdrop-blur rounded-full text-zinc-400 border border-white/5 hover:text-white transition-colors flex items-center justify-center"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 max-w-md mx-auto space-y-4">
        <div className="relative">
          {/* Next Card (Background) */}
          {candidates[currentIndex + 1] && (
            <div 
              className="absolute inset-0 z-0 transition-all duration-300 pointer-events-none"
              style={{
                transform: `scale(${isAnimating ? 1 : 0.95}) translateY(${isAnimating ? 0 : 16}px)`,
                opacity: isAnimating ? 1 : 0.5,
                maxHeight: cardMaxHeight
              }}
            >
              <SwipeCard user={candidates[currentIndex + 1]} />
            </div>
          )}

          {/* Current Card (Foreground) */}
          <div 
            className="relative z-10 group touch-pan-x"
            onPointerDown={handlePointerDown}
            style={{
              transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.05}deg)`,
              transition: dragStart ? 'none' : 'transform 0.3s ease-out',
              maxHeight: cardMaxHeight
            }}
          >
            <SwipeCard key={currentProfile.uid} user={currentProfile} />
            
            {/* Drag Overlays */}
          {dragOffset.x > 20 && (
            <div 
              className="absolute top-8 left-8 border-4 border-green-500 text-green-500 px-4 py-1 rounded-xl transform -rotate-12 text-3xl font-black uppercase tracking-widest z-50 bg-black/40 backdrop-blur-sm"
              style={{ opacity: Math.min(dragOffset.x / SWIPE_THRESHOLD, 1) }}
            >
              LIKE
            </div>
          )}
          {dragOffset.x < -20 && (
            <div 
              className="absolute top-8 right-8 border-4 border-red-500 text-red-500 px-4 py-1 rounded-xl transform rotate-12 text-3xl font-black uppercase tracking-widest z-50 bg-black/40 backdrop-blur-sm"
              style={{ opacity: Math.min(Math.abs(dragOffset.x) / SWIPE_THRESHOLD, 1) }}
            >
              NOPE
            </div>
          )}

          {/* Button Overlays (existing) */}
          {lastDirection === 'right' && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-8 border-green-500 text-green-500 px-10 py-5 rounded-[2rem] transform -rotate-12 text-6xl font-black uppercase tracking-widest z-50 bg-black/60 backdrop-blur-xl animate-in fade-in zoom-in duration-150">
              LIKE
            </div>
          )}
          {lastDirection === 'left' && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-8 border-red-500 text-red-500 px-10 py-5 rounded-[2rem] transform rotate-12 text-6xl font-black uppercase tracking-widest z-50 bg-black/60 backdrop-blur-xl animate-in fade-in zoom-in duration-150">
              PASS
            </div>
          )}
          </div>
        </div>

        {/* Action Buttons: Positioned up to sit neatly in the void space above navigation */}
        <div className="flex justify-center items-center gap-7 py-4 px-4 relative z-40 -mt-10 mb-2">
          <div className="flex flex-col items-center gap-2">
            <button 
              onClick={() => handleSwipe('left')}
              disabled={isRestricted || isAnimating || !!dragStart}
              className="w-16 h-16 bg-transparent rounded-full flex items-center justify-center border border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4),inset_0_0_10px_rgba(239,68,68,0.2)] active:scale-90 transition-all hover:bg-red-500/10 hover:shadow-[0_0_25px_rgba(239,68,68,0.6),inset_0_0_15px_rgba(239,68,68,0.4)] disabled:opacity-50"
            >
              <X className="w-8 h-8" />
            </button>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <button 
              onClick={handleInstantMessageClick}
              disabled={isRestricted || isAnimating || !!dragStart}
              className="w-12 h-12 bg-transparent rounded-full flex items-center justify-center border border-[#00D2FF] text-[#00D2FF] shadow-[0_0_15px_rgba(0,210,255,0.4),inset_0_0_10px_rgba(0,210,255,0.2)] active:scale-90 transition-all hover:bg-[#00D2FF]/10 hover:shadow-[0_0_25px_rgba(0,210,255,0.6),inset_0_0_15px_rgba(0,210,255,0.4)] disabled:opacity-50"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
            </button>
          </div>

          <div className="flex flex-col items-center gap-2">
            <button 
              onClick={() => handleSwipe('right')}
              disabled={isRestricted || isAnimating || !!dragStart || (isFree && !canLike)}
              className="w-16 h-16 bg-transparent rounded-full flex items-center justify-center border border-[#FF2D7D] text-[#FF2D7D] shadow-[0_0_15px_rgba(255,45,125,0.4),inset_0_0_10px_rgba(255,45,125,0.2)] active:scale-90 transition-all hover:bg-[#FF2D7D]/10 hover:shadow-[0_0_25px_rgba(255,45,125,0.6),inset_0_0_15px_rgba(255,45,125,0.4)] disabled:opacity-50"
            >
              <Heart className="w-8 h-8 fill-current" />
            </button>
          </div>
        </div>

        <div className="mt-[5vh]">
          <ProfileDetails 
            user={currentProfile} 
            currentUser={currentUser} 
            showSafetyActions={true}
            onReport={() => handleSafetyAction('Report', currentProfile)}
            onBlock={() => handleSafetyAction('Block', currentProfile)}
          />
        </div>

        <div className="h-10" />
      </div>

      {reportingUser && (
        <ReportModal 
          entityId={reportingUser.uid} 
          entityName={reportingUser.name} 
          onClose={() => {
            setReportingUser(null);
            refreshDiscovery();
          }} 
        />
      )}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 bg-zinc-900 border border-white/10 rounded-full text-white text-[10px] font-bold uppercase tracking-widest shadow-2xl z-50 animate-in slide-in-from-bottom-4">
          {toast}
        </div>
      )}
    </div>
  );
};
