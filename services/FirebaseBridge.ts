
import { auth } from '../firebase';
import { MOCK_CURRENT_USER } from './mockData';
import { CONFIG } from '../config';
import { RehearsalHarness } from './RehearsalHarness';

const useHarness = CONFIG.DATA_MODE === 'firebase';
const listenHarness = <T,>(name: string, subscribeFn: (callback: (data: T) => void) => () => void, callback: (data: T) => void): () => void => {
  return useHarness ? RehearsalHarness.listen(name, subscribeFn, callback) : subscribeFn(callback);
};

// Mock implementation of FirebaseBridge to prevent offline errors in prototype
export const FirebaseBridge = {
  
  /**
   * Compresses an image client-side before upload.
   * Stub implementation for prototype.
   */
  compressImage: async (file: File): Promise<File> => {
    // console.log(`[FirebaseBridge] Compressing image: ${file.name}`);
    return file; // In a real app, use a library like browser-image-compression
  },

  // Photo Management
  uploadProfilePhoto: async (uid: string, file: File) => {
    if (CONFIG.DATA_MODE === 'firebase') {
      // console.log(`[FirebaseBridge] Firebase mode: Uploading photo for ${uid} to /entities/${uid}/photos/${file.name}`);
      const compressedFile = await FirebaseBridge.compressImage(file);
      // In a real app, this would use Firebase Storage:
      // const storageRef = ref(storage, `/entities/${uid}/photos/${compressedFile.name}`);
      // await uploadBytes(storageRef, compressedFile);
      // return await getDownloadURL(storageRef);
      return URL.createObjectURL(compressedFile);
    } else {
      // console.log(`[FirebaseBridge] Mock uploading photo for ${uid}: ${file.name}`);
      // Return a fake URL
      return URL.createObjectURL(file);
    }
  },

  saveUserProfile: async (uid: string, data: any) => {
    // console.log(`[FirebaseBridge] Mock saving profile for ${uid}:`, data);
    // In a real app, this would update Firestore
  },

  // Messaging Core
  sendMessage: async (chatId: string, text: string, idempotencyKey?: string) => {
    // console.log(`[FirebaseBridge] Mock sending message to ${chatId}: ${text} (key: ${idempotencyKey})`);
    // In a real app, this would add to the messages collection
  },

  subscribeToMessages: (chatId: string, callback: (messages: any[]) => void): (() => void) => {
    return listenHarness(`messages-${chatId}`, (cb) => {
      // console.log(`[FirebaseBridge] Subscribing to messages for ${chatId}`);
      // In a real app, this would be an onSnapshot listener on the messages subcollection
      // Returning a dummy unsubscribe function
      return () => {
        // console.log(`[FirebaseBridge] Unsubscribing from messages for ${chatId}`);
      };
    }, callback);
  },

  setTypingIndicator: async (chatId: string, isTyping: boolean) => {
    // console.log(`[FirebaseBridge] Mock typing indicator for ${chatId}: ${isTyping}`);
  },

  markAsRead: async (chatId: string) => {
    // console.log(`[FirebaseBridge] Mock marking messages in ${chatId} as read`);
  },

  // Like Gating
  checkDailyLikeLimit: async (uid: string): Promise<boolean> => {
    // Always return true for prototype unless testing limits
    return true;
  },

  recordLike: async (uid: string, targetId: string) => {
    // console.log(`[FirebaseBridge] LIKE recorded: ${uid} -> ${targetId}`);
  },

  logInteraction: async (userId: string, targetId: string, action: 'PASS') => {
    // console.log(`[FirebaseBridge] PASS recorded: ${userId} -> ${targetId}`);
  },

  reportEntity: async (reporterId: string, reportedId: string, reason: string, details?: string) => {
    // console.log(`[FirebaseBridge] REPORT recorded: ${reporterId} reported ${reportedId} for ${reason}`);
    // In a real app, this would write to a 'reports' collection in Firestore
  },

  blockEntity: async (blockerId: string, blockedId: string) => {
    // console.log(`[FirebaseBridge] BLOCK recorded: ${blockerId} blocked ${blockedId}`);
    // In a real app, this would update the user's 'blockedUsers' array in Firestore
  }
};
