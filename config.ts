export const CONFIG = {
  DATA_MODE: 'mock' as 'mock' | 'firebase',
  PAYMENTS_MODE: 'mock' as 'mock' | 'live',
  get REHEARSAL_MODE() {
    return this.DATA_MODE === 'firebase' || (import.meta as any).env?.VITE_REHEARSAL_MODE === 'true';
  },
  DEBUG_REHEARSAL: (import.meta as any).env?.VITE_DEBUG_REHEARSAL === 'true' || true, // default true for now
};

export const UI_FLAGS = {
  fancyNav: true,
  showNavLabels: false,   // default: icon-only per user’s reference
  showChatBadge: false,   // default off (no red dot)
};

export const THEME = {
  iconSizes: {
    nav: { width: 50, height: 50 },
    splash: { width: 512, height: 512 },
    watermark: { width: 300, height: 300 },
  }
};
