
export interface UserPreferences {
  ageRange: [number, number];
  maxDistance: number;
  heritage: string[];
  prioritizeBackground: boolean;
  dynamics: string[];
  interests: string[];
  lookingFor?: string[];
  coupleType?: string[];
  gendersOpenTo?: string[];
}

export interface ProfileMember {
  name: string;
  age: number;
  genderIdentity?: string;
  heritage?: string[];
  dynamics?: string[];
  interests?: string[];
}

export interface Entitlements {
  plan: 'FREE' | 'PLUS' | 'PRO';
  imCredits: number;
  ghostMode: boolean;
  privatePhotos: boolean;
  activeBoostUntil?: number;
  balances?: any;
}

export interface ProfileImage {
  url: string;
  isPrivate?: boolean;
}

export interface User {
  __schemaVersion?: number;
  uid: string;
  name: string;
  age: number;
  members?: ProfileMember[];
  bio: string;
  isVerified: boolean;
  heritage?: string[];
  orientations: string[];
  datingStyles: string[];
  goals: string[];
  photos: (string | ProfileImage)[];
  privateGallery?: {
    photos: string[];
    access: {
      [viewerEntityId: string]: "LOCKED" | "REQUESTED" | "APPROVED" | "REVOKED";
    };
  };
  partnerId?: string;
  partnerName?: string;
  distance?: number;
  lat?: number;
  lng?: number;
  geohash?: string;
  entitlements?: Entitlements;
  monthlyIMUsed?: number;
  monthlyResetAt?: any;
  visibilityMode?: 'PUBLIC' | 'GHOST';
  visibleToIds?: string[];
  type?: 'single' | 'couple' | 'group';
  coupleType?: string;
  verificationRequired?: boolean;
  verificationStatus?: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'FAILED_UNCERTAIN' | 'FAILED_UNDERAGE';
  regionCountryCode?: string;
  mockRegionOverride?: 'OFF' | 'GB' | 'AU' | 'OTHER';
  onboardingComplete?: boolean;
  blockedEntityIds?: string[];
  likeQuotaLimit?: number | null;
  likeQuotaUsed?: number;
  likeQuotaWindowStart?: number | null;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: any;
  status: 'sent' | 'delivered' | 'read' | 'ACTIVE' | 'EXPIRED';
  type?: 'USER' | 'SYSTEM' | 'PHOTO' | 'VOICE';
  photoUrl?: string;
  audioUrl?: string;
  duration?: number;
  expiresAt?: number;
  expiryMode?: '3s' | '10s' | '30s';
  viewOnce?: boolean;
  viewedBy?: string[];
}

export interface ChatSession {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastTimestamp?: any;
  typing?: Record<string, boolean>;
  unreadCount?: Record<string, number>;
  galleryAccess?: Record<string, boolean>; // e.g., { [userId]: true } means userId has granted access to their private photos
}

export interface Match {
  id: string;
  userId: string;
  timestamp: number;
  lastMessage?: string;
}

export type AppTab = 'MATCHING' | 'ACTIVITY' | 'LIKES' | 'CHAT' | 'PROFILE';

export interface ActivityItem {
  id: string;
  type: 'MATCH' | 'LIKE' | 'UPDATE';
  text: string;
  timestamp: string;
}

export interface ChatConversation {
  id: string;
  user: User;
  lastMessage: string;
  time: string;
  unread: boolean;
  status?: 'ACTIVE' | 'PENDING_INTRO';
  messages?: Message[];
  galleryAccess?: Record<string, boolean>;
}
