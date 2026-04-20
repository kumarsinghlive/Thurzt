
import React, { useState, useEffect, useRef } from 'react';
import { FirebaseBridge } from '../services/FirebaseBridge';
import { auth } from '../firebase';
import { Message, ChatSession, User } from '../types';
import { MockService } from '../services/mockData';
import { RehearsalHarness } from '../services/RehearsalHarness';
import { ProfileTitle } from '../components/ProfileTitle';
import MessagesImg from '../assets/Messages.png';
import { Images } from '../brandAssets';
import { ReportModal } from '../components/ReportModal';
import { 
  Send, 
  Check, 
  CheckCheck, 
  MoreVertical, 
  Camera, 
  ShieldAlert, 
  Flag, 
  UserX,
  ChevronLeft,
  Zap,
  X,
  ShieldCheck,
  MapPin,
  MessageCircle,
  Lock,
  Unlock,
  Mic,
  Square,
  Play,
  Pause
} from 'lucide-react';

import { CONFIG } from '../config';

interface ChatScreenProps {
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ activeChatId, setActiveChatId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMeta, setChatMeta] = useState<ChatSession | null>(null);
  const [showSafetyMenu, setShowSafetyMenu] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [viewingPhoto, setViewingPhoto] = useState<Message | null>(null);
  const [viewingProfile, setViewingProfile] = useState<User | null>(null);
  const [reportingUser, setReportingUser] = useState<User | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [newMatches, setNewMatches] = useState<User[]>(CONFIG.DATA_MODE === 'mock' ? MockService.getNewMatches() : []);
  const [activeConversations, setActiveConversations] = useState<ChatSession[]>(CONFIG.DATA_MODE === 'mock' ? MockService.getChats() : []);
  const [listLoading, setListLoading] = useState(CONFIG.DATA_MODE === 'firebase');
  const [listError, setListError] = useState<string | null>(null);

  const useHarness = CONFIG.DATA_MODE === 'firebase';
  const callHarness = async <T,>(name: string, fn: () => Promise<T> | T): Promise<T> => {
    return useHarness ? RehearsalHarness.call(name, fn) : fn();
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchChatLists = async () => {
    if (activeChatId) return; // Don't fetch list if we are in a chat
    if (useHarness) setListLoading(true);
    setListError(null);
    try {
      const [matches, chats] = await Promise.all([
        callHarness('getNewMatches', async () => MockService.getNewMatches()),
        callHarness('getChats', async () => MockService.getChats())
      ]);
      setNewMatches(matches);
      setActiveConversations(chats);
    } catch (err) {
      setListError('Failed to load messages. Please try again.');
    } finally {
      if (useHarness) setListLoading(false);
    }
  };

  useEffect(() => {
    fetchChatLists();
  }, [activeChatId]);

  const handleSafetyAction = async (action: string, user: User) => {
    if (action === 'Report') {
      setReportingUser(user);
    } else if (action === 'Block') {
      try {
        await callHarness('blockEntity', async () => {
          MockService.blockEntity(user.uid);
        });
        setViewingProfile(null);
        setActiveChatId(null);
        showToast('User blocked.');
      } catch (e) {
        showToast('Failed to block user. Try again.');
      }
    } else if (action === 'Unmatch') {
      if (window.confirm('Are you sure you want to unmatch?')) {
        try {
          await callHarness('unmatch', async () => {
            MockService.blockEntity(user.uid); // Mock removal
          });
          setViewingProfile(null);
          setActiveChatId(null);
          showToast('Unmatched. Conversation archived.');
        } catch (e) {
          showToast('Failed to unmatch. Try again.');
        }
      }
    }
  };

  useEffect(() => {
    if (!activeChatId) return;

    let unsubscribe: (() => void) | undefined;
    let interval: NodeJS.Timeout | undefined;

    if (CONFIG.DATA_MODE === 'firebase') {
      // Use real-time listener in Firebase mode
      if (activeChatId.startsWith('chat-')) {
        unsubscribe = FirebaseBridge.subscribeToMessages(activeChatId, (newMessages) => {
          setMessages(prev => {
            // Guard against duplicate messages
            const existingIds = new Set(prev.map(m => m.id));
            const uniqueNew = newMessages.filter(m => !existingIds.has(m.id));
            if (uniqueNew.length === 0 && prev.length === newMessages.length) {
              return prev; // No changes
            }
            // In a real app, we'd merge and sort. For mock, we just replace if there are changes.
            // To handle out-of-order, we should sort by timestamp.
            const merged = [...prev, ...uniqueNew];
            return merged.sort((a, b) => a.timestamp - b.timestamp);
          });
        });
      } else {
        setMessages([]);
      }
    } else {
      // Mock message loading
      const loadMessages = () => {
        if (activeChatId.startsWith('chat-')) {
          const currentMessages = MockService.getChatMessages(activeChatId);
          setMessages(prev => {
            if (prev.length !== currentMessages.length) {
              return [...currentMessages];
            }
            return prev;
          });
        } else if (activeChatId.startsWith('new-')) {
          setMessages(prev => prev.length === 0 ? prev : []);
        }
      };

      loadMessages();
      
      // Poll for mock replies
      interval = setInterval(() => {
        loadMessages();
      }, 1000);
    }
    
    // Simulate reading
    FirebaseBridge.markAsRead(activeChatId);

    return () => {
      if (interval) clearInterval(interval);
      if (unsubscribe) unsubscribe();
    };
  }, [activeChatId, viewingProfile]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !activeChatId) return;
    
    const messageText = text;
    setText(''); // Optimistic clear
    FirebaseBridge.setTypingIndicator(activeChatId, false);

    try {
      await callHarness('sendMessage', async () => {
        // In a real app, if activeChatId starts with 'new-', 
        // we would create a new Firestore chat document first.
        await FirebaseBridge.sendMessage(activeChatId, messageText);

        // Mock: If it's a new chat, add it to MOCK_CHATS so it appears in the list
        if (activeChatId.startsWith('new-')) {
          const uid = activeChatId.replace('new-', '');
          const user = MockService.getUserById(uid);
          if (user) {
            const existingChat = activeConversations.find(c => c.user.uid === uid);
            if (!existingChat) {
              MockService.startChat(user, messageText);
              // Switch active ID to the new real chat ID
              setActiveChatId(`chat-${uid}`);
            }
          }
        } else {
          // Update existing chat last message
          const newMessage = MockService.appendMessage(activeChatId, messageText, 'current-user');
          if (newMessage) {
            setMessages(prev => [...prev, newMessage]);
          }
        }
      });
      
      // Simulate other person typing
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // The auto-reply will be loaded by the polling interval
      }, 2000);
    } catch (error) {
      showToast("Failed to send message. Please try again.");
      setText(messageText); // Restore text on failure
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingDuration(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
  };

  const cancelRecording = () => {
    setIsRecording(false);
    setRecordingDuration(0);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
    
    if (recordingDuration < 1 || !activeChatId) {
      setRecordingDuration(0);
      return;
    }

    const audioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'; // Mock audio URL
    const duration = recordingDuration;
    setRecordingDuration(0);

    try {
      await callHarness('sendVoice', async () => {
        let actualChatId = activeChatId;
        if (activeChatId.startsWith('new-')) {
          const uid = activeChatId.replace('new-', '');
          const user = MockService.getUserById(uid);
          if (user) {
            const existingChat = activeConversations.find(c => c.user.uid === uid);
            if (!existingChat) {
              MockService.startChat(user, 'Voice message', true);
              actualChatId = `chat-${uid}`;
              setActiveChatId(actualChatId);
            }
          }
        }

        const newMessage = MockService.appendVoiceMessage(actualChatId, audioUrl, duration, auth.currentUser?.uid || 'current-user');
        if (newMessage) {
          setMessages(prev => [...prev, newMessage]);
        }
      });
    } catch (error) {
      showToast("Failed to send voice message. Please try again.");
    }
  };

  const handleSendPhoto = async (expiryMode: '3s' | '10s' | '30s') => {
    setShowPhotoOptions(false);
    if (!activeChatId) return;
    
    const photoUrl = 'https://picsum.photos/seed/disappearing/400/600';
    
    try {
      await callHarness('sendPhoto', async () => {
        let actualChatId = activeChatId;
        if (activeChatId.startsWith('new-')) {
          const uid = activeChatId.replace('new-', '');
          const user = MockService.getUserById(uid);
          if (user) {
            const existingChat = activeConversations.find(c => c.user.uid === uid);
            if (!existingChat) {
              MockService.startChat(user, 'Disappearing photo', true);
              actualChatId = `chat-${uid}`;
              setActiveChatId(actualChatId);
            }
          }
        }

        const newMessage = MockService.appendPhotoMessage(actualChatId, photoUrl, expiryMode, auth.currentUser?.uid || 'current-user');
        if (newMessage) {
          setMessages(prev => [...prev, newMessage]);
        }
      });
    } catch (error) {
      showToast("Failed to send photo. Please try again.");
    }
  };

  const handleViewPhoto = async (msg: Message) => {
    if (msg.status === 'EXPIRED') return;
    
    const viewerId = auth.currentUser?.uid || 'current-user';
    const isMe = msg.senderId === viewerId;

    try {
      await callHarness('viewPhoto', async () => {
        if (!isMe && msg.status === 'ACTIVE') {
          const updatedMsg = MockService.markPhotoViewed(activeChatId!, msg.id, viewerId);
          if (updatedMsg) {
            setMessages(prev => prev.map(m => m.id === updatedMsg.id ? updatedMsg : m));
            setViewingPhoto(updatedMsg);
          } else {
            setViewingPhoto(msg);
          }
        } else {
          setViewingPhoto(msg);
        }
      });
    } catch (error) {
      showToast("Failed to view photo. Please try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (activeChatId && !activeChatId.startsWith('new-')) {
      FirebaseBridge.setTypingIndicator(activeChatId, true);
    }
  };

  // Fixed targeting logic to resolve TypeScript union property errors
  const conversation = activeConversations.find(c => c.id === activeChatId);
  const targetUser = conversation ? conversation.user : (activeChatId?.startsWith('new-') ? MockService.getUserById(activeChatId.replace('new-', '')) : undefined);

  // Full Profile Overlay (Reusable)
  const FullProfileOverlay = ({ user, onClose }: { user: User, onClose: () => void }) => {
    const hasGalleryAccess = conversation?.galleryAccess?.[user.uid] || false;
    const isApproved = hasGalleryAccess;
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
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">Heritage and Background</h4>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set([
                  ...(user.members?.flatMap(m => m.heritage || []) || [])
                ])).map(h => (
                  <span key={h} className="bg-zinc-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 border border-white/5">{h}</span>
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
                ])).map(d => (
                  <span key={d} className="bg-zinc-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 border border-white/5">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

  const handlePhotoExpired = (messageId: string) => {
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, status: 'EXPIRED' } : m));
    setViewingPhoto(null);
  };

  const PhotoViewerOverlay = ({ message, onClose, onExpire }: { message: Message, onClose: () => void, onExpire: (id: string) => void }) => {
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    useEffect(() => {
      if (message.expiresAt) {
        const updateTimer = () => {
          const remaining = Math.max(0, Math.ceil((message.expiresAt! - Date.now()) / 1000));
          setTimeLeft(remaining);
          if (remaining === 0) {
            onExpire(message.id);
          }
        };
        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
      }
    }, [message.expiresAt, onExpire, message.id]);

    return (
      <div className="absolute inset-0 z-[120] bg-black flex flex-col animate-in fade-in duration-200">
        <div className="flex justify-between items-center p-6 bg-gradient-to-b from-black/80 to-transparent absolute top-0 w-full z-10">
          <button onClick={onClose} className="p-3 bg-zinc-900/50 backdrop-blur rounded-full text-white border border-white/5">
            <X className="w-5 h-5" />
          </button>
          {timeLeft !== null && (
            <div className="px-4 py-2 bg-zinc-900/80 backdrop-blur rounded-full text-white font-mono font-bold text-sm">
              {timeLeft}s
            </div>
          )}
        </div>
        <div className="flex-1 flex items-center justify-center">
          <img src={message.photoUrl} alt="Disappearing photo" className="max-w-full max-h-full object-contain" />
        </div>
        <div className="p-6 text-center text-zinc-500 text-xs font-medium absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent">
          Screenshots may be detected on supported devices.
        </div>
      </div>
    );
  };

  // Main List View
  if (!activeChatId) {
    return (
      <div className="flex flex-col h-full bg-black text-white">
        <header className="px-8 pt-[max(env(safe-area-inset-top),16px)] pb-4 bg-black/80 backdrop-blur-md sticky top-0 z-40 border-b border-white/5 relative">
          <div className="flex items-center h-11" style={{ flex: 1, alignItems: 'center', display: 'flex', justifyContent: 'flex-start' }}>
            <img 
              src={MessagesImg} 
              alt="Messages" 
              style={{ width: '60%', height: 40, objectFit: 'contain', objectPosition: 'left', alignSelf: 'center' }} 
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {listLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-10 min-h-[400px]">
              <div className="w-8 h-8 border-2 border-zinc-500 border-t-white rounded-full animate-spin mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Loading Messages...</p>
            </div>
          ) : listError ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-10 min-h-[400px]">
              <ShieldAlert className="w-12 h-12 text-zinc-600 mb-6" />
              <h2 className="text-xl font-black uppercase tracking-tighter mb-4 italic text-zinc-300">{listError}</h2>
              <button 
                onClick={fetchChatLists}
                className="px-8 py-4 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* New Matches Horizontal Scroll */}
              <section className="pt-8 pb-4">
                <h3 className="px-8 text-zinc-600 text-xs uppercase font-black tracking-widest mb-6">New Matches</h3>
                <div className="flex overflow-x-auto no-scrollbar px-6 space-x-6">
                  {newMatches.map((user) => (
                    <button 
                      key={user.uid}
                      onClick={() => setActiveChatId(`new-${user.uid}`)}
                      className="flex flex-col items-center flex-shrink-0 group w-20"
                    >
                      <div className="relative p-1 rounded-full border-2 border-blue-500 transition-transform group-active:scale-95">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-800 border border-black">
                          <img src={(typeof user.photos[0] === 'string' ? user.photos[0] : user.photos[0]?.url)} alt="" className="w-full h-full object-cover" />
                        </div>
                        {user.isInstaMsg && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-black">
                            <Zap className="w-3 h-3 text-white fill-current" />
                          </div>
                        )}
                      </div>
                      <div className="mt-3 px-1 w-full text-center line-clamp-2 leading-tight">
                        <ProfileTitle 
                          user={user} 
                          nameClassName="text-[10px] font-black uppercase tracking-tight text-zinc-400 group-hover:text-white transition-colors mr-1" 
                          ageClassName="text-[10px] font-light text-zinc-500 mr-1"
                          separatorClassName="text-[10px] font-black uppercase tracking-tight text-zinc-600 mr-1"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Messages Vertical List */}
              <section className="px-4 mt-4 pb-32">
                <h3 className="px-4 text-zinc-600 text-xs uppercase font-black tracking-widest mb-6 mt-4">Chats</h3>
                <div className="space-y-2">
                  {activeConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-10 text-center mt-10">
                      <MessageCircle className="w-12 h-12 text-zinc-800 mb-6" />
                      <h2 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">No conversations yet.</h2>
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Matches will appear here once you start chatting.</p>
                    </div>
                  ) : (
                    activeConversations.map(chat => (
                  <button 
                    key={chat.id}
                    onClick={() => setActiveChatId(chat.id)}
                    className="w-full flex items-center space-x-4 p-4 rounded-3xl hover:bg-zinc-900/40 transition-all border border-transparent hover:border-white/5 group"
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-zinc-800 overflow-hidden border border-white/5">
                        <img src={typeof chat.user.photos[0] === 'string' ? chat.user.photos[0] : chat.user.photos[0]?.url} alt="" className="w-full h-full object-cover" />
                      </div>
                      {chat.unread && (
                        <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-600 border-2 border-black rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center flex-wrap gap-x-1 truncate pr-2">
                          <ProfileTitle 
                            user={chat.user} 
                            nameClassName="font-black uppercase tracking-tight text-sm text-white" 
                            ageClassName="text-xs font-light text-white/70"
                            separatorClassName="font-black uppercase tracking-tight text-sm text-white/50"
                          />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 flex-shrink-0">{chat.time}</span>
                      </div>
                      <p className={`text-[11px] truncate ${chat.unread ? 'text-zinc-200 font-bold' : 'text-zinc-500 font-medium'}`}>
                        {chat.lastMessage}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </section>
          </>
          )}
        </div>
      </div>
    );
  }

  // Conversation View
  const typingUser = chatMeta?.typing && Object.entries(chatMeta.typing).find(([uid, typ]) => typ && uid !== auth.currentUser?.uid);

  return (
    <div className="flex flex-col h-full bg-black text-white relative">
      <header className="px-6 pt-[max(env(safe-area-inset-top),16px)] pb-4 border-b border-white/5 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex justify-between items-center h-11">
          <div className="flex items-center space-x-4">
            <button onClick={() => setActiveChatId(null)} className="p-3 -ml-3 bg-transparent hover:bg-zinc-900/50 backdrop-blur rounded-full text-zinc-500 hover:text-white transition-colors flex items-center justify-center">
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div 
              className="flex items-center space-x-3 cursor-pointer group" 
              onClick={() => targetUser && setViewingProfile(targetUser)}
            >
              <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden border border-white/10 group-active:scale-95 transition-transform">
                <img src={typeof targetUser?.photos?.[0] === 'string' ? targetUser?.photos?.[0] : targetUser?.photos?.[0]?.url} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center flex-wrap gap-x-1 mb-1 group-hover:underline underline-offset-4">
                  {targetUser && (
                    <ProfileTitle 
                      user={targetUser} 
                      nameClassName="font-black uppercase tracking-tight text-white leading-none" 
                      ageClassName="text-sm font-light text-white/70 leading-none"
                      separatorClassName="font-black uppercase tracking-tight text-white/50 leading-none"
                    />
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                   <span className="text-[8px] font-black uppercase tracking-widest text-green-500/80">Active Now</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowSafetyMenu(!showSafetyMenu)}
              className={`p-3 -mr-3 rounded-full transition-colors flex items-center justify-center ${showSafetyMenu ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'}`}
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          {showSafetyMenu && (
            <div className="absolute top-12 right-0 w-64 bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-100 z-50">
              {targetUser && (
                <button 
                  onClick={async () => {
                    try {
                      await callHarness('toggleGalleryAccess', async () => {
                        const currentAccess = conversation?.galleryAccess?.[targetUser.uid] || false;
                        MockService.toggleGalleryAccess(activeChatId, targetUser.uid, !currentAccess);
                        fetchChatLists(); // Trigger re-render
                      });
                      showToast("Gallery access updated.");
                    } catch (error) {
                      showToast("Failed to update access.");
                    }
                    setShowSafetyMenu(false);
                  }}
                  className="w-full px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-900 flex items-center justify-between transition-colors border-b border-white/5"
                >
                  <div className="flex items-center gap-3">
                    {conversation?.galleryAccess?.[targetUser.uid] ? <Unlock className="w-3.5 h-3.5 text-green-500" /> : <Lock className="w-3.5 h-3.5" />}
                    <span>Gallery Access</span>
                  </div>
                  <span className={conversation?.galleryAccess?.[targetUser.uid] ? "text-green-500" : "text-zinc-600"}>
                    {conversation?.galleryAccess?.[targetUser.uid] ? "Granted" : "Revoked"}
                  </span>
                </button>
              )}
              <button onClick={() => handleSafetyAction('Unmatch', targetUser!)} className="w-full px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-900 flex items-center gap-3 transition-colors"><UserX className="w-3.5 h-3.5" />Unmatch</button>
              <button onClick={() => handleSafetyAction('Block', targetUser!)} className="w-full px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest text-red-500/70 hover:bg-red-500/10 flex items-center gap-3 transition-colors"><ShieldAlert className="w-3.5 h-3.5" />Block</button>
              <button onClick={() => handleSafetyAction('Report', targetUser!)} className="w-full px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-900 flex items-center gap-3 transition-colors border-t border-white/5"><Flag className="w-3.5 h-3.5" />Report</button>
            </div>
          )}
        </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center p-10 text-center space-y-4">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-white/5">
               <Zap className="w-6 h-6 text-zinc-700" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
               {activeChatId.startsWith('new-') ? `Break the ice with ${targetUser?.name}` : 'No messages yet'}
            </p>
          </div>
        )}
        {messages.map((msg, idx) => {
          if (msg.type === 'SYSTEM') {
            return (
              <div key={msg.id} className="flex justify-center my-4">
                <div className="bg-zinc-900/50 border border-white/5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  {msg.text}
                </div>
              </div>
            );
          }

          const isMe = msg.senderId === auth.currentUser?.uid;
          
          if (msg.type === 'PHOTO') {
            let isExpired = msg.status === 'EXPIRED';
            if (msg.expiresAt && Date.now() > msg.expiresAt) {
              isExpired = true;
            }

            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div 
                  onClick={() => !isExpired && handleViewPhoto(msg)}
                  className={`max-w-[80%] w-48 aspect-[3/4] rounded-[1.8rem] overflow-hidden relative ${!isExpired ? 'cursor-pointer' : ''} ${isMe ? 'rounded-tr-sm' : 'rounded-tl-sm'} ${isExpired ? 'bg-zinc-900 border border-white/5' : 'bg-zinc-800'}`}
                >
                  {isExpired ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 space-y-2">
                      <Camera className="w-8 h-8 opacity-50" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Photo expired</span>
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-10 flex flex-col items-center justify-center text-white space-y-2">
                        <Camera className="w-8 h-8" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Tap to view</span>
                      </div>
                      <img src={msg.photoUrl} alt="" className="w-full h-full object-cover blur-sm" />
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-1.5 mt-2 px-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">
                    {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMe && (msg.status === 'read' ? <CheckCheck className="w-3 h-3 text-blue-500" /> : <Check className="w-3 h-3 text-zinc-700" />)}
                </div>
              </div>
            );
          }

          if (msg.type === 'VOICE') {
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[80%] rounded-[1.8rem] px-5 py-3.5 ${isMe ? 'bg-[#FF2D7D] text-white rounded-tr-sm' : 'bg-zinc-900 border border-white/5 text-zinc-100 rounded-tl-sm'}`}>
                  <div className="flex items-center space-x-3">
                    <button className={`p-2 rounded-full ${isMe ? 'bg-white/20 hover:bg-white/30' : 'bg-white/10 hover:bg-white/20'} transition-colors`}>
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                    <div className="flex-1 flex items-center space-x-1 h-8">
                      {/* Mock waveform */}
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className={`w-1 rounded-full ${isMe ? 'bg-white/60' : 'bg-zinc-600'}`} style={{ height: `${Math.max(20, Math.random() * 100)}%` }} />
                      ))}
                    </div>
                    <span className="text-xs font-medium opacity-80">
                      {Math.floor((msg.duration || 0) / 60)}:{((msg.duration || 0) % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 mt-2 px-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">
                    {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMe && (msg.status === 'read' ? <CheckCheck className="w-3 h-3 text-blue-500" /> : <Check className="w-3 h-3 text-zinc-700" />)}
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[80%] px-5 py-3.5 rounded-[1.8rem] text-[13px] font-medium leading-relaxed shadow-sm ${isMe ? 'bg-white text-black rounded-tr-sm' : 'bg-zinc-900 text-zinc-200 rounded-tl-sm border border-white/5'}`}>
                {msg.text}
              </div>
              <div className="flex items-center space-x-1.5 mt-2 px-1">
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">
                  {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {isMe && (msg.status === 'read' ? <CheckCheck className="w-3 h-3 text-blue-500" /> : <Check className="w-3 h-3 text-zinc-700" />)}
              </div>
            </div>
          );
        })}
        {typingUser && (
          <div className="flex items-center space-x-3 text-zinc-600">
            <div className="flex space-x-1"><div className="w-1.5 h-1.5 bg-zinc-700 rounded-full animate-bounce" /><div className="w-1.5 h-1.5 bg-zinc-700 rounded-full animate-bounce delay-75" /><div className="w-1.5 h-1.5 bg-zinc-700 rounded-full animate-bounce delay-150" /></div>
            <span className="text-[8px] font-black uppercase tracking-widest">Typing</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-6 border-t border-white/5 bg-black/50 backdrop-blur-xl relative">
        {showPhotoOptions && (
          <div className="absolute bottom-full left-6 mb-4 w-64 bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="px-5 py-3 border-b border-white/5">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Send disappearing photo</span>
            </div>
            <button onClick={() => handleSendPhoto('3s')} className="w-full px-5 py-4 text-left text-xs font-bold text-white hover:bg-zinc-900 transition-colors">3 seconds</button>
            <button onClick={() => handleSendPhoto('10s')} className="w-full px-5 py-4 text-left text-xs font-bold text-white hover:bg-zinc-900 transition-colors border-t border-white/5">10 seconds</button>
            <button onClick={() => handleSendPhoto('30s')} className="w-full px-5 py-4 text-left text-xs font-bold text-white hover:bg-zinc-900 transition-colors border-t border-white/5">30 seconds</button>
          </div>
        )}
        {isRecording ? (
          <div className="relative flex items-center bg-zinc-900 border border-white/5 rounded-[2rem] py-3 px-4">
            <div className="flex-1 flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-medium text-white">
                {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                type="button" 
                onClick={cancelRecording}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <button 
                type="button" 
                onClick={stopRecording}
                className="bg-white text-black p-2 rounded-full transition-all shadow-lg active:scale-95"
              >
                <Send className="w-4 h-4 fill-current" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSend} className="relative flex items-center">
            <button 
              type="button" 
              onClick={() => setShowPhotoOptions(!showPhotoOptions)}
              className={`absolute left-4 p-2 transition-all active:scale-90 ${showPhotoOptions ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
            >
              <Camera className="w-5 h-5" />
            </button>
            <input 
              type="text" 
              value={text}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="w-full bg-zinc-900 border border-white/5 rounded-[2rem] py-4.5 pl-14 pr-24 text-sm font-medium focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-700"
            />
            <div className="absolute right-2 flex items-center space-x-1">
              {!text.trim() ? (
                <button 
                  type="button" 
                  onClick={startRecording}
                  className="p-3 text-zinc-400 hover:text-white transition-colors active:scale-90"
                >
                  <Mic className="w-5 h-5" />
                </button>
              ) : (
                <button type="submit" className="bg-white text-black p-3 rounded-full transition-all shadow-lg active:scale-95">
                  <Send className="w-4 h-4 fill-current" />
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      {viewingProfile && (
        <FullProfileOverlay user={viewingProfile} onClose={() => setViewingProfile(null)} />
      )}
      {viewingPhoto && (
        <PhotoViewerOverlay message={viewingPhoto} onClose={() => setViewingPhoto(null)} onExpire={handlePhotoExpired} />
      )}
      {reportingUser && (
        <ReportModal 
          entityId={reportingUser.uid} 
          entityName={reportingUser.name} 
          onClose={() => {
            setReportingUser(null);
            setViewingProfile(null);
            setActiveChatId(null);
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
