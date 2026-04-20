import React from 'react';
import { Zap, X } from 'lucide-react';
import { User } from '../types';
import { billingService } from '../services/BillingService';
import { MockService } from '../services/mockData';
import { CONFIG } from '../config';
import { RehearsalHarness } from '../services/RehearsalHarness';

interface BoostModalProps {
  currentUser: User | null;
  onClose: () => void;
  onUpdateUser?: (user: User) => void;
  showToast: (msg: string) => void;
}

export const BoostModal: React.FC<BoostModalProps> = ({ currentUser, onClose, onUpdateUser, showToast }) => {
  const useHarness = CONFIG.DATA_MODE === 'firebase';
  const callHarness = async <T,>(name: string, fn: () => Promise<T> | T): Promise<T> => {
    return useHarness ? RehearsalHarness.call(name, fn) : fn();
  };

  return (
    <div className="fixed inset-0 z-[130] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-white/10 rounded-[2rem] p-6 w-full max-w-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Zap className="w-24 h-24" />
        </div>
        
        <button 
          onClick={onClose}
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
                    onClose();
                  } else {
                    await callHarness('purchaseAndActivateBoost', async () => {
                      MockService.addBoosts('1h', 1);
                      billingService.activateBoost(1);
                    });
                    if (onUpdateUser) onUpdateUser(MockService.getCurrentUser());
                    showToast("Purchased and activated 1h Boost");
                    onClose();
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
                    onClose();
                  } else {
                    await callHarness('purchaseAndActivateBoost', async () => {
                      MockService.addBoosts('12h', 1);
                      billingService.activateBoost(12);
                    });
                    if (onUpdateUser) onUpdateUser(MockService.getCurrentUser());
                    showToast("Purchased and activated 12h Boost");
                    onClose();
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
                    onClose();
                  } else {
                    await callHarness('purchaseAndActivateBoost', async () => {
                      MockService.addBoosts('24h', 1);
                      billingService.activateBoost(24);
                    });
                    if (onUpdateUser) onUpdateUser(MockService.getCurrentUser());
                    showToast("Purchased and activated 24h Boost");
                    onClose();
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
  );
};
