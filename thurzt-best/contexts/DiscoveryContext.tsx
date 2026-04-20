import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '../types';
import { MockService, INITIAL_CANDIDATES } from '../services/mockData';
import { MatchingService } from '../services/matchingService';
import { useFilters } from '../hooks/useFilters';
import { CONFIG } from '../config';
import { collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

interface DiscoveryContextType {
  discoveryStack: User[];
  setDiscoveryStack: React.Dispatch<React.SetStateAction<User[]>>;
  passedUsers: User[];
  loading: boolean;
  error: string | null;
  likesCount: number;
  remainingImCredits: number;
  isUnlimitedLikes: boolean;
  showMatchModal: boolean;
  matchedUser: User | null;
  closeMatchModal: () => void;
  refreshDiscovery: () => Promise<void>;
  handleRecover: (profileId: string) => void;
  handleLike: (profile: User) => boolean;
  handlePass: (profile: User) => void;
  handleInstantMessage: (profile: User, message: string) => boolean;
}

const DiscoveryContext = createContext<DiscoveryContextType | undefined>(undefined);

export const DiscoveryProvider = ({ children, currentUser }: { children: ReactNode, currentUser: User }) => {
  const USE_MOCK_DATA = CONFIG.DATA_MODE !== 'firebase';
  const isMockOrTester = USE_MOCK_DATA || currentUser.uid === 'apple-tester-123';

  // Initialize discoveryStack synchronously if in mock mode
  const [discoveryStack, setDiscoveryStack] = useState<User[]>(() => {
    if (isMockOrTester) {
      return JSON.parse(JSON.stringify(INITIAL_CANDIDATES));
    }
    return [];
  });
  const [passedUsers, setPassedUsers] = useState<User[]>(isMockOrTester ? MockService.getPassed() : []);
  const [loading, setLoading] = useState(!isMockOrTester);
  const [error, setError] = useState<string | null>(null);
  const [likesCount, setLikesCount] = useState(0);
  const [usedImCredits, setUsedImCredits] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);

  const { filters } = useFilters();

  // Tier logic
  const plan = currentUser.entitlements?.plan || 'FREE';
  const isUnlimitedLikes = plan === 'PLUS' || plan === 'PRO';
  const imCreditsTotal = plan === 'PRO' ? 5 : plan === 'PLUS' ? 3 : 0;
  const remainingImCredits = Math.max(0, imCreditsTotal - usedImCredits);

  // Initialize discovery stack synchronously for mock mode if possible
  useEffect(() => {
    if (USE_MOCK_DATA || currentUser.uid === 'apple-tester-123') {
      setDiscoveryStack(JSON.parse(JSON.stringify(INITIAL_CANDIDATES)));
      setLoading(false);
      return;
    }
    if (discoveryStack.length === 0) {
      MatchingService.getSmartStack(filters, currentUser).then(stack => {
        setDiscoveryStack(stack);
      });
    }
  }, [USE_MOCK_DATA, filters, currentUser]);

  const refreshDiscovery = useCallback(async () => {
    if (USE_MOCK_DATA || currentUser.uid === 'apple-tester-123') {
      setDiscoveryStack(JSON.parse(JSON.stringify(INITIAL_CANDIDATES)));
      setPassedUsers(MockService.getPassed());
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      // Query Firebase Firestore directly
      const querySnapshot = await getDocs(collection(db, 'users'));
      const profiles: User[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as User;
        // Ensure we don't show the current user
        if (data.uid && data.uid !== currentUser.uid) {
          // Apply basic age filter client-side to avoid complex Firestore indexes
          const age = data.age || 25;
          if (age >= filters.ageRange[0] && age <= filters.ageRange[1]) {
            profiles.push(data);
          }
        }
      });
      
      setDiscoveryStack(profiles);
    } catch (err) {
      console.error("Error fetching profiles:", err);
      setError('Failed to load profiles. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters, currentUser, USE_MOCK_DATA]);

  useEffect(() => {
    refreshDiscovery();
  }, [refreshDiscovery]);

  const handleRecover = useCallback((profileId: string) => {
    if (USE_MOCK_DATA || currentUser.uid === 'apple-tester-123') {
      const recoveredUser = MockService.recoverPassedUser(profileId);
      if (recoveredUser) {
        setPassedUsers(MockService.getPassed());
        setDiscoveryStack(prev => [recoveredUser, ...prev]);
      }
    } else {
      // Real API logic would go here
      if (currentUser.uid) {
        // console.log('Recovering user in Firebase not fully implemented in prototype');
      }
    }
  }, [USE_MOCK_DATA, currentUser.uid]);

  const handleLike = useCallback((profile: User): boolean => {
    if (!isUnlimitedLikes && likesCount >= 20) {
      return false; // Trigger paywall
    }
    setLikesCount(prev => prev + 1);
    
    const wasMatch = MockService.getMatches().some(u => u.uid === profile.uid);
    
    if (USE_MOCK_DATA || currentUser.uid === 'apple-tester-123') {
      MockService.swipeRight(profile);
    } else {
      // Keep local mock state in sync for prototype UI
      MockService.swipeRight(profile);
      
      // Real API logic
      if (currentUser.uid && profile.uid) {
        setDoc(doc(db, 'users', currentUser.uid, 'likes', profile.uid), {
          timestamp: serverTimestamp(),
          profileId: profile.uid
        }, { merge: true }).catch(console.error);
        
        // In a real app, a Cloud Function would detect the mutual match and remove from likesMe.
        // For the prototype, we simulate this by deleting the local mock state above.
      }
    }

    const isMatchNow = MockService.getMatches().some(u => u.uid === profile.uid);

    if (isMatchNow && !wasMatch) {
      setMatchedUser(profile);
      setShowMatchModal(true);
    }

    return true;
  }, [isUnlimitedLikes, likesCount, USE_MOCK_DATA, currentUser.uid]);

  const handlePass = useCallback((profile: User) => {
    if (USE_MOCK_DATA || currentUser.uid === 'apple-tester-123') {
      MockService.swipeLeft(profile);
      setPassedUsers(MockService.getPassed());
    } else {
      // Real API logic
      if (currentUser.uid && profile.uid) {
        setDoc(doc(db, 'users', currentUser.uid, 'passes', profile.uid), {
          timestamp: serverTimestamp(),
          profileId: profile.uid
        }, { merge: true }).catch(console.error);
      }
    }
  }, [USE_MOCK_DATA, currentUser.uid]);

  const handleInstantMessage = useCallback((profile: User, message: string): boolean => {
    if (remainingImCredits <= 0) return false;
    
    setUsedImCredits(prev => prev + 1);
    
    if (USE_MOCK_DATA || currentUser.uid === 'apple-tester-123') {
      // Start chat with pending status
      MockService.startChat(profile, message, false);
    } else {
      // Real API logic
      if (currentUser.uid && profile.uid) {
        setDoc(doc(db, 'users', currentUser.uid, 'instantMessages', profile.uid), {
          timestamp: serverTimestamp(),
          profileId: profile.uid,
          message: message
        }, { merge: true }).catch(console.error);
      }
    }
    return true;
  }, [remainingImCredits, USE_MOCK_DATA, currentUser.uid]);

  const closeMatchModal = useCallback(() => {
    setShowMatchModal(false);
    setMatchedUser(null);
  }, []);

  return (
    <DiscoveryContext.Provider value={{
      discoveryStack,
      setDiscoveryStack,
      passedUsers,
      loading,
      error,
      refreshDiscovery,
      handleRecover,
      handleLike,
      handlePass,
      handleInstantMessage,
      remainingImCredits,
      isUnlimitedLikes,
      likesCount,
      showMatchModal,
      matchedUser,
      closeMatchModal
    }}>
      {children}
    </DiscoveryContext.Provider>
  );
};

export const useDiscoveryContext = () => {
  const context = useContext(DiscoveryContext);
  if (context === undefined) {
    throw new Error('useDiscoveryContext must be used within a DiscoveryProvider');
  }
  return context;
};
