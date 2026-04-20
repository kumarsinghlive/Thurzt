
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { MockService } from '../services/mockData';
import { RehearsalHarness } from '../services/RehearsalHarness';
import { CONFIG } from '../config';
import { 
  Heart, 
  RotateCcw, 
  MessageCircle, 
  ShieldAlert, 
  Zap,
  Trash2,
  Undo2,
  X,
  ShieldCheck,
  MapPin,
  Flag,
  Loader2
} from 'lucide-react';

import { Paywall } from '../components/Paywall';
import { ProfileTitle } from '../components/ProfileTitle';
import LikesImg from '../assets/Likes.png';
import { Images } from '../brandAssets';
import { PrivateGallerySection } from '../components/PrivateGallerySection';
import { ReportModal } from '../components/ReportModal';
import { useDiscoveryContext } from '../contexts/DiscoveryContext';

type LikesSubTab = 'MATCHES' | 'LIKES_ME' | 'LIKED' | 'PASSED';

interface LikesTabProps {
  onOpenChat?: (uid: string) => void;
}

export const LikesTab: React.FC<LikesTabProps> = ({ onOpenChat }) => {
  const { handleRecover, passedUsers, handleInstantMessage, remainingImCredits } = useDiscoveryContext();
  const [activeTab, setActiveTab] = useState<LikesSubTab>('MATCHES');
  const [isPro, setIsPro] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<'FREE' | 'PLUS' | 'PRO'>('FREE');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [reportingUser, setReportingUser] = useState<User | null>(null);
  const [matches, setMatches] = useState<User[]>(CONFIG.DATA_MODE === 'mock' ? MockService.getMatches() : []);
  const [likesYou, setLikesYou] = useState<User[]>(CONFIG.DATA_MODE === 'mock' ? MockService.getLikesYou() : []);
  const [liked, setLiked] = useState<User[]>(CONFIG.DATA_MODE === 'mock' ? MockService.getLiked() : []);
  const [passed, setPassed] = useState<User[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(CONFIG.DATA_MODE === 'firebase');
  const [error, setError] = useState<string | null>(null);
  const [showIMModal, setShowIMModal] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [imTargetUser, setImTargetUser] = useState<User | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState<{title: string, desc: string, type?: 'subscription' | 'consumable_im'}>({ title: '', desc: '' });

  const useHarness = CONFIG.DATA_MODE === 'firebase';
  const callHarness = async <T,>(name: string, fn: () => Promise<T> | T): Promise<T> => {
    return useHarness ? RehearsalHarness.call(name, fn) : fn();
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const refreshData = async () => {
    if (useHarness) setLoading(true);
    setError(null);
    try {
      const [m, ly, l] = await Promise.all([
        callHarness('getMatches', async () => MockService.getMatches()),
        callHarness('getLikesYou', async () => MockService.getLikesYou()),
        callHarness('getLiked', async () => MockService.getLiked())
      ]);
      setMatches(m);
      setLikesYou(ly);
      setLiked(l);
      setPassed(passedUsers); // Use passedUsers from context
      
      const currentUser = await callHarness('getCurrentUser', async () => MockService.getCurrentUser());
      if (currentUser) {
        const plan = currentUser.entitlements?.plan || 'FREE';
        setIsPro(plan === 'PRO' || plan === 'PLUS');
        setCurrentPlan(plan);
      }
    } catch (err) {
      setError('Failed to load data. Please try again.');
    } finally {
      if (useHarness) setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [activeTab, passedUsers]);

  const openChat = (uid: string) => {
    if (onOpenChat) {
      onOpenChat(uid);
    }
  };

  const handleSafetyAction = async (action: string, user: User) => {
    if (action === 'Report') {
      setReportingUser(user);
    } else if (action === 'Block') {
      try {
        await callHarness('blockEntity', async () => {
          MockService.blockEntity(user.uid);
          refreshData();
          setSelectedUser(null);
        });
      } catch (error) {
        console.error("Failed to block entity", error);
      }
    }
  };

  const sendInstantMessage = async () => {
    if (!messageText.trim() || !imTargetUser) return;
    
    try {
      await callHarness('sendInstantMessage', async () => {
        if (remainingImCredits <= 0) {
          throw new Error("No credits");
        }
        
        handleInstantMessage(imTargetUser, messageText);
      });
      
      showToast("Instant Message Sent!");
      setShowComposer(false);
      setMessageText('');
      setImTargetUser(null);
      refreshData();
    } catch (error) {
      if (error instanceof Error && error.message === "No credits") {
        setShowComposer(false);
        setShowIMModal(true);
      } else {
        showToast("Failed to send Instant Message. Please try again.");
      }
    }
  };

  const FullProfileOverlay = ({ user, onClose }: { user: User, onClose: () => void }) => {
    const { handleLike, handlePass } = useDiscoveryContext();
    
    const onLike = () => {
      handleLike(user);
      onClose();
      refreshData();
    };

    const onPass = () => {
      handlePass(user);
      onClose();
      refreshData();
    };

    const allPhotos = (user.photos || []).map(p => {
      if (typeof p === 'string') {
        return { url: p, isPrivate: false, isBlurred: false };
      }
      return {
        url: p.url,
        isPrivate: !!p.isPrivate,
        isBlurred: !!p.isPrivate // No access in LikesTab
      };
    });
    const firstPhoto = allPhotos[0] || { url: '', isPrivate: false, isBlurred: false };

    return (
    <div className="fixed inset-0 z-[130] bg-black animate-in fade-in slide-in-from-bottom duration-300 overflow-y-auto no-scrollbar pb-[calc(80px+env(safe-area-inset-bottom))]">
      <div className="relative min-h-screen pb-32">
        <div className="sticky top-0 w-full flex justify-between items-center px-6 py-6 z-50 bg-gradient-to-b from-black/80 to-transparent">
          <button onClick={onClose} className="p-3 bg-zinc-900/50 backdrop-blur rounded-full text-white border border-white/5">
            <X className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <button onClick={() => handleSafetyAction('Report', user)} className="p-3 bg-zinc-900/50 backdrop-blur rounded-full text-zinc-500 hover:text-red-500 border border-white/5">
              <Flag className="w-5 h-5" />
            </button>
            <button onClick={() => handleSafetyAction('Block', user)} className="p-3 bg-zinc-900/50 backdrop-blur rounded-full text-zinc-500 border border-white/5">
              <ShieldAlert className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-4 space-y-4">
          <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
            <img 
              src={firstPhoto.url} 
              className={`w-full h-full object-cover ${firstPhoto.isBlurred ? 'blur-[20px] scale-110' : ''}`} 
              alt="" 
            />
            {firstPhoto.isBlurred && (
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
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/20 to-transparent">
              <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
                <ProfileTitle 
                  user={user} 
                  nameClassName="text-3xl font-black tracking-tighter text-white uppercase" 
                  ageClassName="text-2xl font-light text-white/70"
                  separatorClassName="text-3xl font-black tracking-tighter text-white/50 uppercase"
                />
                {user.isVerified && <ShieldCheck className="w-5 h-5 text-blue-400" />}
              </div>
              <div className="flex items-center text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-1">
                <MapPin className="w-3 h-3 mr-1" />
                {user.distance ? `${user.distance} miles away` : 'Nearby'}
              </div>
            </div>
          </div>

          <div className="px-4 space-y-10 pt-6">
            <div className="bg-zinc-900/30 p-8 rounded-[2rem] border border-white/5">
              <p className="text-zinc-300 text-lg leading-relaxed">{user.bio}</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">Basics</h4>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set([
                  ...(user.members?.flatMap(m => m.genderIdentity ? [m.genderIdentity] : []) || [])
                ])).map(g => (
                  <span key={g} className="bg-zinc-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 border border-white/5">{g}</span>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">Heritage and Background</h4>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set([
                  ...(user.members?.flatMap(m => m.heritage || []) || [])
                ])).map(h => (
                  <span key={h} className="bg-zinc-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 border border-white/5">{h}</span>
                ))}
              </div>
            </div>
            
            {user.privateGallery && user.privateGallery.photos.length > 0 && (
              <div className="mt-8">
                <PrivateGallerySection profile={user} currentUser={MockService.getCurrentUser()} />
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-10 left-0 right-0 px-8 flex justify-center gap-4 z-50 mt-8">
          {activeTab === 'LIKES_ME' ? (
            <>
              <button 
                onClick={onPass}
                className="w-16 h-16 bg-zinc-900 text-white rounded-full shadow-2xl active:scale-95 transition-all flex items-center justify-center border border-white/10"
              >
                <X className="w-6 h-6" />
              </button>
              <button 
                onClick={onLike}
                className="flex-1 max-w-[200px] py-5 bg-[#ff00ff] text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(255,0,255,0.4)] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <Heart className="w-5 h-5 fill-current" />
                Like
              </button>
            </>
          ) : (
            <button 
              onClick={() => {
                onClose();
                openChat(user.uid);
              }}
              className="w-full max-w-sm py-5 bg-white text-black rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              Send Message
            </button>
          )}
        </div>
      </div>
    </div>
  )};

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-10 min-h-[400px]">
          <Loader2 className="w-8 h-8 text-zinc-500 animate-spin mb-4" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Loading...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-10 min-h-[400px]">
          <ShieldAlert className="w-12 h-12 text-zinc-600 mb-6" />
          <h2 className="text-xl font-black uppercase tracking-tighter mb-4 italic text-zinc-300">{error}</h2>
          <button 
            onClick={refreshData}
            className="px-8 py-4 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl"
          >
            Try Again
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'MATCHES':
        return (
          <div className="p-6 space-y-6">
            <p className="text-zinc-600 text-xs uppercase font-black tracking-widest">Mutual Connections</p>
            <div className="space-y-0">
              {matches.map((user) => (
                <div key={user.uid} className="flex items-center space-x-5 p-5 border-b border-white/5 hover:bg-white/5 transition-all group">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0 cursor-pointer" onClick={() => setSelectedUser(user)}>
                    <img src={(typeof user.photos[0] === 'string' ? user.photos[0] : user.photos[0]?.url)} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div onClick={() => setSelectedUser(user)} className="cursor-pointer">
                        <div className="flex items-center flex-wrap gap-x-1">
                          <ProfileTitle 
                            user={user} 
                            nameClassName="font-black uppercase tracking-tight text-xl leading-none" 
                            ageClassName="text-lg font-light text-white/70 leading-none"
                            separatorClassName="font-black uppercase tracking-tight text-xl leading-none text-white/50"
                          />
                        </div>
                        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Mutual Match</p>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); openChat(user.uid); }}
                      className="w-full py-3 bg-white text-black rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                      <MessageCircle className="w-3 h-3 fill-current" />
                      Message
                    </button>
                  </div>
                </div>
              ))}
              {matches.length === 0 && (
                <div className="flex flex-col items-center justify-center p-10 text-center mt-10">
                  <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-white/5 mb-6">
                    <Heart className="w-6 h-6 text-zinc-700" />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">No matches yet</h2>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Keep swiping to find your match</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'LIKES_ME':
        return (
          <div className="relative h-full min-h-[500px]">
            <div className="p-6">
              <p className="text-zinc-600 text-xs uppercase font-black tracking-widest">Profiles that like you</p>
            </div>
            {isPro && (
              <div className="space-y-0 p-0 -mt-6">
                {likesYou.map((user) => (
                  <div key={user.uid} className="flex items-center space-x-5 p-5 border-b border-white/5 hover:bg-white/5 transition-all group">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0 cursor-pointer" onClick={() => setSelectedUser(user)}>
                      <img src={(typeof user.photos[0] === 'string' ? user.photos[0] : user.photos[0]?.url)} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-x-1 cursor-pointer" onClick={() => setSelectedUser(user)}>
                        <ProfileTitle 
                          user={user} 
                          nameClassName="font-black uppercase tracking-tight text-xl leading-none" 
                          ageClassName="text-lg font-light text-white/70 leading-none"
                          separatorClassName="font-black uppercase tracking-tight text-xl leading-none text-white/50"
                        />
                      </div>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Liked you recently</p>
                    </div>
                  </div>
                ))}
                {likesYou.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-10 text-center mt-10">
                    <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-white/5 mb-6">
                      <Heart className="w-6 h-6 text-zinc-700" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">No new likes yet.</h2>
                  </div>
                )}
              </div>
            )}
            {!isPro && (
              <Paywall 
                title="Incoming Interest" 
                description="See who liked you before you match." 
                icon={Heart} 
                color="bg-gradient-to-br from-pink-500 to-rose-600"
                currentPlan={currentPlan}
                onClose={() => setActiveTab('MATCHES')}
                onUpgrade={async (plan) => {
                  try {
                    await callHarness('upgradeToPro', async () => {
                      if (plan) {
                        MockService.purchaseProduct(plan);
                        refreshData();
                      }
                    });
                  } catch (e) {
                    console.error("Upgrade failed", e);
                  }
                }}
              />
            )}
          </div>
        );
      case 'LIKED':
        return (
          <div className="p-0 space-y-0">
            <p className="px-6 py-4 text-zinc-600 text-xs uppercase font-black tracking-widest">Profiles that you have liked</p>
            <div className="space-y-0">
              {liked.map((user) => (
                <div key={user.uid} className="flex items-center space-x-5 p-5 border-b border-white/5 hover:bg-white/5 transition-all">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0 cursor-pointer" onClick={() => setSelectedUser(user)}>
                    <img src={(typeof user.photos[0] === 'string' ? user.photos[0] : user.photos[0]?.url)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div onClick={() => setSelectedUser(user)} className="cursor-pointer">
                        <div className="flex items-center flex-wrap gap-x-1">
                          <ProfileTitle 
                            user={user} 
                            nameClassName="font-black uppercase tracking-tight text-xl leading-none" 
                            ageClassName="text-lg font-light text-white/70 leading-none"
                            separatorClassName="font-black uppercase tracking-tight text-xl leading-none text-white/50"
                          />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">Pending Approval</p>
                      </div>
                      <button className="p-2 text-zinc-700 hover:text-white">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setImTargetUser(user);
                        if (remainingImCredits > 0) {
                          setShowComposer(true);
                        } else {
                          setShowIMModal(true);
                        }
                      }}
                      className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-xl text-[9px] font-black uppercase tracking-widest border border-blue-500/20 active:scale-95 transition-all"
                    >
                      <Zap className="w-3 h-3 fill-current" />
                      Insta-Message
                    </button>
                  </div>
                </div>
              ))}
              {liked.length === 0 && (
                <div className="flex flex-col items-center justify-center p-10 text-center mt-10">
                  <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-white/5 mb-6">
                    <Heart className="w-6 h-6 text-zinc-700" />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">No likes yet</h2>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Profiles you like will appear here</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'PASSED':
        return (
          <div className="relative h-full min-h-[500px]">
            <div className="p-6">
              <p className="text-zinc-600 text-xs uppercase font-black tracking-widest">Profiles that you have passed on</p>
            </div>
            {isPro && (
              <div className="p-0 space-y-0 -mt-6">
                <div className="space-y-0">
                  {passed.map((user) => (
                    <div key={user.uid} className="flex items-center justify-between p-6 border-b border-white/5 hover:bg-white/5 transition-colors">
                      <div className="flex items-center space-x-4">
                        <img src={(typeof user.photos[0] === 'string' ? user.photos[0] : user.photos[0]?.url)} className="w-16 h-16 rounded-2xl object-cover grayscale" alt="" />
                        <div>
                          <div className="flex items-center flex-wrap gap-x-1">
                            <ProfileTitle 
                              user={user} 
                              nameClassName="font-black uppercase tracking-tight text-white" 
                              ageClassName="font-light text-white/70"
                              separatorClassName="font-black uppercase tracking-tight text-white/50"
                            />
                          </div>
                          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest italic">Passed recently</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRecover(user.uid)}
                        className="p-4 bg-white text-black rounded-full shadow-lg active:scale-90 transition-all"
                      >
                        <Undo2 className="w-6 h-6" />
                      </button>
                    </div>
                  ))}
                  {passed.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-10 text-center mt-10">
                      <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-white/5 mb-6">
                        <X className="w-6 h-6 text-zinc-700" />
                      </div>
                      <h2 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">Profiles you pass will appear here.</h2>
                    </div>
                  )}
                </div>
              </div>
            )}
            {!isPro && (
              <Paywall 
                title="Accidental Pass?" 
                description="Recover profiles you passed on." 
                icon={RotateCcw} 
                color="bg-zinc-900"
                currentPlan={currentPlan}
                onClose={() => setActiveTab('MATCHES')}
                onUpgrade={async (plan) => {
                  try {
                    await callHarness('upgradeToPro', async () => {
                      if (plan) {
                        MockService.purchaseProduct(plan);
                        refreshData();
                      }
                    });
                  } catch (e) {
                    console.error("Upgrade failed", e);
                  }
                }}
              />
            )}
          </div>
        );
    }
  };

  const TabButton = ({ tab, label }: { tab: LikesSubTab, label: string }) => {
    const isActive = activeTab === tab;
    return (
      <button 
        onClick={() => setActiveTab(tab)}
        className={`flex-1 flex flex-col items-center justify-center py-5 transition-all duration-300 relative ${isActive ? 'text-white' : 'text-zinc-600'}`}
      >
        <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{label}</span>
        {isActive && <div className="absolute bottom-0 w-full h-[2px] bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />}
      </button>
    );
  };

  return (
    <div className="h-full flex flex-col bg-black">
      <header className="px-8 pt-[max(env(safe-area-inset-top),16px)] pb-4 bg-black/50 backdrop-blur-md sticky top-0 z-40 border-b border-white/5 relative">
        <div className="flex justify-between items-center h-11 mb-4" style={{ flex: 1, alignItems: 'center', display: 'flex', justifyContent: 'flex-start' }}>
          <img 
            src={LikesImg} 
            alt="Likes" 
            style={{ width: '60%', height: 40, objectFit: 'contain', objectPosition: 'left', alignSelf: 'center' }} 
          />
        </div>
        <div className="flex overflow-x-auto no-scrollbar">
           <TabButton tab="MATCHES" label="Matches" />
           <TabButton tab="LIKES_ME" label="Likes Me" />
           <TabButton tab="LIKED" label="Liked" />
           <TabButton tab="PASSED" label="Passed" />
        </div>
      </header>
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {renderTabContent()}
      </div>
      {selectedUser && <FullProfileOverlay user={selectedUser} onClose={() => setSelectedUser(null)} />}
      {reportingUser && (
        <ReportModal 
          entityId={reportingUser.uid} 
          entityName={reportingUser.name} 
          onClose={() => {
            setReportingUser(null);
            setSelectedUser(null);
            refreshData();
          }} 
        />
      )}
      {paywallFeature.title && (
        <Paywall 
          title={paywallFeature.title} 
          description={paywallFeature.desc} 
          icon={MessageCircle} 
          color="bg-blue-500"
          currentPlan={currentPlan}
          type={paywallFeature.type}
          onClose={() => setPaywallFeature({ title: '', desc: '' })}
          onUpgrade={async (plan) => {
            try {
              await callHarness('upgradeAction', async () => {
                if (plan) {
                  MockService.purchaseProduct(plan);
                  showToast(`Purchase successful.`);
                  refreshData();
                } else {
                  showToast("Payments coming soon.");
                }
                setPaywallFeature({ title: '', desc: '' });
              });
            } catch (e) {
              showToast("Upgrade failed. Please try again.");
            }
          }}
        />
      )}

      {showComposer && imTargetUser && (
        <div className="absolute inset-0 z-[140] bg-black/90 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
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
              <img src={typeof imTargetUser.photos[0] === 'string' ? imTargetUser.photos[0] : imTargetUser.photos[0]?.url} className="w-12 h-12 rounded-full object-cover border border-white/10" alt="" />
              <div>
                <p className="text-sm font-bold text-white">To: {imTargetUser.name}</p>
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
                <Zap className="w-4 h-4 fill-current" />
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {showIMModal && (
        <div className="absolute inset-0 z-[140] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
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
                      refreshData();
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
                      refreshData();
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
                      refreshData();
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

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 bg-zinc-900 border border-white/10 rounded-full text-white text-[10px] font-bold uppercase tracking-widest shadow-2xl z-50 animate-in slide-in-from-bottom-4">
          {toast}
        </div>
      )}
    </div>
  );
};
