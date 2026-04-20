import React from 'react';
import { X } from 'lucide-react';

interface TermsOfServiceProps {
  onClose: () => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[120] flex flex-col bg-zinc-950 text-white animate-in slide-in-from-bottom duration-300 pb-[calc(80px+env(safe-area-inset-bottom))]">
      <header className="flex items-center justify-between p-6 bg-black/80 backdrop-blur-md sticky top-0 z-40 border-b border-zinc-800">
        <h1 className="text-xl font-black uppercase tracking-widest italic leading-none m-0 text-white">Terms of Service</h1>
        <button 
          onClick={onClose} 
          className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center"
        >
          <X className="w-7 h-7" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar text-sm text-zinc-300 leading-relaxed">
        <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Last Updated: April 2026</p>
        
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Acceptance of Terms</h2>
          <p>By accessing or using Thurzt (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service. You must be at least 18 years old to use Thurzt.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. Virtual Goods License</h2>
          <p>The Service may offer the opportunity to purchase or earn virtual currency, subscriptions, or virtual items, including but not limited to "Instant Messages" and "Boosts" (collectively, "Virtual Goods").</p>
          <p><strong>No Cash Value:</strong> Virtual Goods are licensed, not sold, to you. You do not own the Virtual Goods. They have no monetary value, do not accrue interest, and cannot be redeemed for fiat currency, real-world goods, or services from us or any third party.</p>
          <p><strong>Non-Refundable:</strong> All purchases of Virtual Goods are final and non-refundable, except as required by applicable law. We reserve the right to manage, regulate, control, modify, or eliminate Virtual Goods at any time, with or without notice to you, and we will have no liability to you or any third party if we exercise such rights.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Termination and Account Deletion</h2>
          <p>We reserve the right to suspend, disable, or terminate your account and your access to the Service at any time, for any reason, or no reason, without notice or liability to you.</p>
          <p><strong>Effect of Termination:</strong> Upon termination of your account, all licenses granted to you in these Terms will immediately cease. You will lose all access to your account, including any Virtual Goods associated with it. We are under no obligation to compensate you for any Virtual Goods, subscriptions, or other items lost due to account termination, regardless of the reason for termination.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. Limitation of Liability and "As-Is" Clause</h2>
          <p><strong>"As-Is" Service:</strong> THURZT IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. WE EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
          <p><strong>Service Interruptions:</strong> We do not guarantee that the Service will be uninterrupted, secure, or error-free. We are not responsible for any damages or losses resulting from service outages, data loss, or technical malfunctions.</p>
          <p><strong>User Interactions:</strong> WE ARE NOT RESPONSIBLE FOR THE CONDUCT OF ANY USER ON OR OFF THE SERVICE. YOU AGREE TO USE CAUTION IN ALL INTERACTIONS WITH OTHER USERS. WE EXPRESSLY DISCLAIM ANY LIABILITY FOR ANY LOSS OR DAMAGE ARISING FROM YOUR INTERACTIONS WITH OTHER USERS, INCLUDING BUT NOT LIMITED TO EMOTIONAL DISTRESS, PHYSICAL HARM, OR PROPERTY DAMAGE.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">5. Mandatory Arbitration and Class-Action Waiver</h2>
          <p><strong>Arbitration Agreement:</strong> ANY DISPUTE, CLAIM, OR CONTROVERSY ARISING OUT OF OR RELATING TO THESE TERMS OR THE BREACH, TERMINATION, ENFORCEMENT, INTERPRETATION, OR VALIDITY THEREOF, INCLUDING THE DETERMINATION OF THE SCOPE OR APPLICABILITY OF THIS AGREEMENT TO ARBITRATE, SHALL BE DETERMINED BY BINDING ARBITRATION RATHER THAN IN COURT.</p>
          <p><strong>Class-Action Waiver:</strong> YOU AND THURZT AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING. The arbitrator may not consolidate more than one person's claims and may not otherwise preside over any form of a representative or class proceeding.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">6. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Thurzt operates, without regard to its conflict of law provisions.</p>
        </section>
      </div>
    </div>
  );
};
