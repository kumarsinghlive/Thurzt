import React from 'react';
import { X } from 'lucide-react';

interface PrivacyPolicyProps {
  onClose: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[120] flex flex-col bg-zinc-950 text-white animate-in slide-in-from-bottom duration-300 pb-[calc(80px+env(safe-area-inset-bottom))]">
      <header className="flex items-center justify-between p-6 bg-black/80 backdrop-blur-md sticky top-0 z-40 border-b border-zinc-800">
        <h1 className="text-xl font-black uppercase tracking-widest italic leading-none m-0 text-white">Privacy Policy</h1>
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
          <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, update your profile, upload photos, or communicate with other users. This includes your name, email address, date of birth, gender, sexual orientation, and any other information you choose to provide in your bio or profile.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. Biometric Privacy and Identity Verification</h2>
          <p>To ensure the safety and authenticity of our community, Thurzt may offer or require identity verification features.</p>
          <p><strong>Verification Process:</strong> When you choose to verify your profile, we may collect facial recognition data, video selfies, or photo IDs. This process involves comparing the facial features in your video selfie to the photos on your profile to confirm your identity.</p>
          <p><strong>Handling of Biometric Data:</strong> Any facial geometry or biometric data extracted during this process is used solely for the purpose of identity verification and fraud prevention. We do not sell, lease, trade, or otherwise profit from your biometric data.</p>
          <p><strong>Retention and Deletion:</strong> Biometric data is retained only for as long as necessary to complete the verification process and maintain your verified status. If your account is deleted, or if the verification process is complete and the data is no longer needed for ongoing security purposes, your biometric data will be permanently destroyed in accordance with applicable laws (such as BIPA or CCPA), typically within 3 years of your last interaction with the Service.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our Service. This includes matching you with other users, personalizing your experience, processing transactions, and communicating with you about updates, security alerts, and support messages.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. Sharing of Information</h2>
          <p>We may share your information with third-party service providers who perform services on our behalf, such as hosting, data analysis, payment processing, and customer service. We may also share information if required by law, to protect our rights or the safety of our users, or in connection with a corporate transaction such as a merger or sale of assets.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">5. Data Security</h2>
          <p>We implement reasonable security measures designed to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">6. Your Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, or delete your data. You can manage most of your information directly within the app's settings. For other requests, please contact our support team.</p>
        </section>
      </div>
    </div>
  );
};
