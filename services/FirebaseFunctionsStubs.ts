export const FirebaseFunctionsStubs = {
  blockEntity: async (uid: string, entityId: string) => {
    // console.log(`[FirebaseFunctionsStubs] blockEntity: ${uid} blocked ${entityId}`);
  },
  reportEntity: async (uid: string, entityId: string, reason: string, details?: string) => {
    // console.log(`[FirebaseFunctionsStubs] reportEntity: ${uid} reported ${entityId} for ${reason}`);
  },
  decrementCredits: async (uid: string, amount: number, reason: string, idempotencyKey: string) => {
    // console.log(`[FirebaseFunctionsStubs] decrementCredits: ${uid} decremented ${amount} for ${reason}`);
    return true;
  },
  getEntitlements: async (uid: string) => {
    // console.log(`[FirebaseFunctionsStubs] getEntitlements: ${uid}`);
    return {
      plan: 'FREE' as const,
      imCredits: 0,
      ghostMode: false,
      privatePhotos: false
    };
  }
};
