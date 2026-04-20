import React, { useState, useEffect } from 'react';
import { Loader2, Check, X, ChevronLeft, Send } from 'lucide-react';
import { MockService } from '../services/mockData';

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

interface PaywallProps {
  title?: string;
  description?: string;
  icon?: any;
  color?: string;
  currentPlan?: 'FREE' | 'PLUS' | 'PRO';
  type?: 'subscription' | 'consumable_im';
  onClose?: () => void;
  onUpgrade?: (plan?: string) => void | Promise<void>;
}

export const Paywall: React.FC<PaywallProps> = ({ title, description, icon: Icon, color, currentPlan, type = 'subscription', onClose, onUpgrade }) => {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { height } = useWindowDimensions();

  const isSmallDevice = height < 700;
  const isLargeDevice = height > 850;

  const cardMinHeight = isSmallDevice ? 'auto' : isLargeDevice ? '18vh' : '15vh';
  const cardSpacing = isLargeDevice ? 'space-y-6' : 'space-y-4';
  const containerPadding = isSmallDevice ? 'pb-6' : 'pb-12';

  const handleUpgrade = async (plan: string) => {
    if (!onUpgrade) return;
    setIsUpgrading(true);
    try {
      await onUpgrade(plan);
    } finally {
      setIsUpgrading(false);
    }
  };

  const DisplayIcon = type === 'consumable_im' ? Send : Icon;

  return (
    <div className="fixed inset-0 z-[130] flex flex-col bg-black text-white animate-in slide-in-from-bottom duration-300 overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-white/5">
        <div className="w-10" />
        <h1 className="text-lg font-black uppercase tracking-widest italic"></h1>
        {onClose ? (
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>

      <div className={`px-6 pt-4 max-w-md mx-auto w-full space-y-8 ${containerPadding} flex-1 flex flex-col`}>
        <div className="text-center space-y-2">
          {DisplayIcon && (
            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-6">
              <DisplayIcon className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
          )}
          <h2 className="text-3xl font-bold tracking-tight">{title || 'Upgrade Your Experience'}</h2>
          <p className="text-zinc-400 text-sm">{description || 'Unlock premium features and find connections faster'}</p>
        </div>

        <div className="bg-zinc-900/30 border border-white/5 rounded-[2rem] overflow-hidden p-4 space-y-6 flex-1 flex flex-col">
          {/* Toggle - Only show for subscriptions */}
          {type === 'subscription' && (
            <div className="flex justify-center">
              <div className="bg-black/50 p-1 rounded-full flex">
                <button 
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${billingCycle === 'monthly' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
                >
                  Monthly
                </button>
                <button 
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${billingCycle === 'yearly' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
                >
                  Yearly
                </button>
              </div>
            </div>
          )}

          {/* Cards */}
          <div className={`${cardSpacing} flex-1`}>
            <>
              {/* FREE Card */}
              <div 
                style={{ minHeight: cardMinHeight }}
                onClick={() => handleUpgrade('FREE')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${currentPlan === 'FREE' ? 'border-white bg-white/5' : 'border-white/5 bg-black/20 hover:border-white/20'}`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-black uppercase tracking-widest text-white">Free</h4>
                        <div className="text-2xl font-bold mt-1">$0</div>
                      </div>
                      {currentPlan === 'FREE' && <div className="px-2 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full">Active</div>}
                    </div>
                    <ul className="space-y-2 text-xs text-zinc-400">
                      <li className="flex items-start gap-2"><Check className="w-3 h-3 text-white shrink-0 mt-0.5" /> Limited Likes per day</li>
                      <li className="flex items-start gap-2"><Check className="w-3 h-3 text-white shrink-0 mt-0.5" /> Standard Visibility</li>
                      <li className="flex items-start gap-2"><Check className="w-3 h-3 text-white shrink-0 mt-0.5" /> Private Photos Included</li>
                    </ul>
                  </div>
                </div>

                {/* THURZT+ Card */}
                <div 
                  style={{ minHeight: cardMinHeight }}
                  onClick={() => handleUpgrade(billingCycle === 'monthly' ? 'com.thurzt.plus.monthly' : 'com.thurzt.plus.yearly')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${currentPlan === 'PLUS' ? 'border-[#00D2FF] bg-[#00D2FF]/5 shadow-[0_0_15px_rgba(0,210,255,0.1)]' : 'border-white/5 bg-black/20 hover:border-[#00D2FF]/30'}`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-black uppercase tracking-widest text-[#00D2FF]">Thurzt+</h4>
                        <div className="text-2xl font-bold mt-1">
                          {billingCycle === 'monthly' ? '$14.99' : '$99.99'}
                          <span className="text-xs text-zinc-500 font-normal">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                        </div>
                      </div>
                      {currentPlan === 'PLUS' && <div className="px-2 py-1 bg-[#00D2FF] text-black text-[10px] font-bold uppercase tracking-widest rounded-full">Active</div>}
                    </div>
                    <ul className="space-y-2 text-xs text-zinc-400 mb-6">
                      <li className="flex items-start gap-2"><Check className="w-3 h-3 text-[#00D2FF] shrink-0 mt-0.5" /> Infinite Reach (Unlimited Daily Likes)</li>
                      <li className="flex items-start gap-2"><Check className="w-3 h-3 text-[#00D2FF] shrink-0 mt-0.5" /> Reveal Admirers: See who already liked your profile</li>
                      <li className="flex items-start gap-2"><Check className="w-3 h-3 text-[#00D2FF] shrink-0 mt-0.5" /> 3 Instant Messages per month</li>
                    </ul>
                  </div>
                  <button 
                    disabled={isUpgrading}
                    className="w-full py-4 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-auto"
                  >
                    {isUpgrading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Get Plus'}
                  </button>
                </div>

                {/* THURZT PRO Card */}
                <div 
                  style={{ minHeight: cardMinHeight }}
                  onClick={() => handleUpgrade(billingCycle === 'monthly' ? 'com.thurzt.pro.monthly' : 'com.thurzt.pro.yearly')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${currentPlan === 'PRO' ? 'border-[#FF2D7D] bg-[#FF2D7D]/5 shadow-[0_0_15px_rgba(255,45,125,0.1)]' : 'border-white/5 bg-black/20 hover:border-[#FF2D7D]/30'}`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black uppercase tracking-widest text-[#FF2D7D]">Thurzt Pro</h4>
                          {billingCycle === 'yearly' && (
                            <span className="px-1.5 py-0.5 bg-[#FF2D7D]/20 text-[#FF2D7D] text-[8px] font-black uppercase tracking-widest rounded-sm">Best Value</span>
                          )}
                        </div>
                        <div className="text-2xl font-bold mt-1">
                          {billingCycle === 'monthly' ? '$24.99' : '$179.99'}
                          <span className="text-xs text-zinc-500 font-normal">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                        </div>
                      </div>
                      {currentPlan === 'PRO' && <div className="px-2 py-1 bg-[#FF2D7D] text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Active</div>}
                    </div>
                    <ul className="space-y-2 text-xs text-zinc-400 mb-6">
                      <li className="flex items-start gap-2"><Check className="w-3 h-3 text-[#FF2D7D] shrink-0 mt-0.5" /> Everything in Plus, plus...</li>
                      <li className="flex items-start gap-2"><Check className="w-3 h-3 text-[#FF2D7D] shrink-0 mt-0.5" /> Ghost Mode: Browse 100% Invisibly</li>
                      <li className="flex items-start gap-2"><Check className="w-3 h-3 text-[#FF2D7D] shrink-0 mt-0.5" /> Priority Stack: Be seen by top profiles first</li>
                      <li className="flex items-start gap-2"><Check className="w-3 h-3 text-[#FF2D7D] shrink-0 mt-0.5" /> 5 Instant Messages per month</li>
                    </ul>
                  </div>
                  <button 
                    disabled={isUpgrading}
                    className="w-full py-4 bg-white text-black rounded-xl font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-auto"
                  >
                    {isUpgrading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Get Pro'}
                  </button>
                </div>
              </>
          </div>
          
          {/* Restore Purchases Button */}
          <div className="pt-4 border-t border-white/5">
            <button 
              className="w-full py-3 text-xs font-bold text-zinc-500 hover:text-white transition-colors"
              onClick={() => {
                const user = MockService.getCurrentUser();
                if (user?.uid === 'apple-tester-123') {
                  alert("Purchases successfully restored.");
                } else {
                  alert("Restore Purchases not implemented in prototype");
                }
              }}
            >
              Restore Purchases
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
