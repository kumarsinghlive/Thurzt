import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { CULTURE_LIST, GENDER_IDENTITY_LIST } from '../constants';
import { Images } from '../brandAssets';
import { Check, ChevronRight, Camera, X } from 'lucide-react';
import { GeoQueryHelper } from '../services/GeoQueryHelper';
import { THEME, CONFIG } from '../config';
import { mediaStorageService } from '../services/MediaStorageService';
import { VerificationService } from '../services/VerificationService';
import { TermsOfService } from '../components/TermsOfService';
import { PrivacyPolicy } from '../components/PrivacyPolicy';

interface OnboardingScreenProps {
  onComplete: (user: User) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  // Onboarding state
  const [dob, setDob] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [type, setType] = useState<'single' | 'couple' | 'group'>('single');
  
  // Member 1 state
  const [name, setName] = useState('');
  const [genderIdentity, setGenderIdentity] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [heritage, setCulturalIdentities] = useState<string[]>([]);
  
  // Verification state
  const [regionCountryCode, setRegionCountryCode] = useState('OTHER');
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'FAILED_UNCERTAIN' | 'FAILED_UNDERAGE'>('UNVERIFIED');
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');

  // Step 1: Auth
  const handleAuth = async (providerType: 'google' | 'apple' | 'email') => {
    if (providerType === 'email') {
      if (!showEmailInput) {
        setShowEmailInput(true);
        return;
      }
      if (email.trim().toLowerCase() === 'apple_tester@thurzt.app') {
        // Reviewer Bypass
        localStorage.setItem('apple_tester_bypass', 'true');
        const mockUser: User = {
          uid: 'apple-tester-123',
          name: 'Apple Reviewer',
          age: 30,
          type: 'single',
          members: [{
            name: 'Apple Reviewer',
            age: 30,
          }],
          bio: 'Testing the app for review.',
          isVerified: true,
          orientations: [],
          datingStyles: [],
          goals: [],
          photos: ['https://picsum.photos/seed/reviewer/400/600'],
          privateGallery: { photos: [], access: {} },
          entitlements: { plan: 'PRO', imCredits: 10, ghostMode: true, privatePhotos: true },
          visibilityMode: 'PUBLIC',
          verificationRequired: false,
          verificationStatus: 'VERIFIED',
          regionCountryCode: 'US',
          onboardingComplete: true
        };
        onComplete(mockUser);
        return;
      }
      // Standard email flow (mocked for now)
      setStep(2);
      return;
    }

    if (CONFIG.DATA_MODE === 'firebase') {
      try {
        const { signInWithPopup } = await import('firebase/auth');
        const { auth, googleProvider, appleProvider } = await import('../firebase');
        const provider = providerType === 'google' ? googleProvider : appleProvider;
        await signInWithPopup(auth, provider);
        setStep(2);
      } catch (err: any) {
        if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/user-cancelled' || err.message?.includes('auth/user-cancelled') || err.message?.includes('auth/popup-closed-by-user')) {
          // Authentication cancelled by user
          return;
        }
        console.error("Auth error:", err);
        setError(err.message || 'Authentication failed');
      }
    } else {
      setStep(2);
    }
  };

  // Step 2: Age
  const handleAgeSubmit = () => {
    if (!dob) {
      setError('Please enter your date of birth.');
      return;
    }
    const birthDate = new Date(dob);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }

    if (calculatedAge < 18) {
      setError('Thurzt is only available to users 18 and over.');
      return;
    }

    setAge(calculatedAge);
    setError('');
    setStep(3);
  };

  // Step 3: Type
  const handleTypeSelect = (selectedType: 'single' | 'couple' | 'group') => {
    setType(selectedType);
    setStep(4);
  };

  // Step 4: You
  const handleYouSubmit = () => {
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (photos.length === 0) {
      setError('Please add at least one photo.');
      return;
    }
    setError('');
    
    // Detect region (mock implementation)
    detectRegion();
    setStep(5);
  };

  const toggleCulture = (label: string) => {
    if (heritage.includes(label)) {
      setCulturalIdentities(heritage.filter(c => c !== label));
    } else {
      setCulturalIdentities([...heritage, label]);
    }
  };

  // Step 5: Verification & Matching
  const detectRegion = () => {
    let detectedRegion = 'OTHER';
    const override = localStorage.getItem('thurzt_region_override');
    
    if (override && override !== 'OFF') {
      detectedRegion = override;
    } else {
      try {
        const locale = navigator.language;
        if (locale.includes('GB')) detectedRegion = 'GB';
        else if (locale.includes('AU')) detectedRegion = 'AU';
      } catch (e) {
        // ignore
      }
    }

    setRegionCountryCode(detectedRegion);
    if (detectedRegion === 'GB' || detectedRegion === 'AU') {
      setVerificationRequired(true);
    } else {
      setVerificationRequired(false);
    }
  };

  const handleVerify = (status: 'VERIFIED' | 'FAILED_UNCERTAIN' | 'FAILED_UNDERAGE') => {
    setVerificationStatus(status);
    if (status === 'FAILED_UNCERTAIN') {
      setError('Verification failed. Please try again.');
    } else if (status === 'FAILED_UNDERAGE') {
      setError('Thurzt is only available to users 18 and over.');
    } else {
      setError('');
    }
  };

  const signUp = () => {
    // Robust validation before saving
    if (!dob) {
      setError('Please enter your date of birth.');
      setStep(2);
      return;
    }
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) {
      setError('Please enter a valid date of birth.');
      setStep(2);
      return;
    }
    const today = new Date();
    if (birthDate > today) {
      setError('Birthdate cannot be in the future.');
      setStep(2);
      return;
    }
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    if (calculatedAge < 18) {
      setError('Thurzt is only available to users 18 and over.');
      setStep(2);
      return;
    }
    
    if (!name || !name.trim()) {
      setError('Please enter your name.');
      setStep(4);
      return;
    }
    if (!photos || photos.length === 0) {
      setError('Please add at least one photo.');
      setStep(4);
      return;
    }
    if (photos.some(p => !p || !p.trim())) {
      setError('One or more photos are invalid.');
      setStep(4);
      return;
    }

    if (verificationRequired && verificationStatus !== 'VERIFIED') {
      // Enter restricted state
      // We will still complete onboarding but mark as unverified
    }

    const completeOnboarding = (lat?: number, lng?: number) => {
      const newUser: User = {
        uid: 'current-user-123',
        name: name,
        age: age || 18,
        type: type,
        members: [{
          name: name,
          age: age || 18,
          genderIdentity: genderIdentity || undefined,
          heritage: heritage.length > 0 ? heritage : undefined,
        }],
        bio: '',
        isVerified: verificationStatus === 'VERIFIED',
        orientations: [],
        datingStyles: [],
        goals: [],
        photos: photos,
        privateGallery: { photos: [], access: {} },
        entitlements: { plan: 'FREE', imCredits: 0, ghostMode: false, privatePhotos: false },
        visibilityMode: 'PUBLIC',
        verificationRequired,
        verificationStatus,
        regionCountryCode,
        mockRegionOverride: (localStorage.getItem('thurzt_region_override') as any) || 'OFF',
        lat,
        lng,
        geohash: (lat && lng) ? GeoQueryHelper.encodeGeohash(lat, lng) : undefined,
        onboardingComplete: true
      };

      onComplete(newUser);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          completeOnboarding(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Geolocation denied or failed", error);
          if (CONFIG.DATA_MODE === 'firebase') {
            // In firebase mode, we might want to enforce location, but for now fallback or show error
            // Let's fallback to a mock center if permission denied, or just undefined
            completeOnboarding(37.7749, -122.4194); // San Francisco fallback
          } else {
            completeOnboarding(37.7749, -122.4194);
          }
        }
      );
    } else {
      completeOnboarding(37.7749, -122.4194);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans ${step === 1 ? 'bg-[#0a0510] text-white' : 'bg-black text-white'}`}>
      {/* Header - hide on step 1 */}
      {step > 1 && (
        <div className="px-6 pt-[max(env(safe-area-inset-top),16px)] pb-4 flex items-center justify-between border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-40">
          <img src={Images.AppIcon} alt="Thurzt" style={{ width: THEME.iconSizes.nav.width, height: THEME.iconSizes.nav.height }} className="object-contain" />
          <div className="text-xs font-black uppercase tracking-widest text-zinc-500 leading-none">
            Step {step - 1} of 4
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col">
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col h-full items-center justify-center">
            <div className="flex-1 flex flex-col items-center justify-center w-full">
              <div className="relative z-10 mb-8 animate-flame flex items-center justify-center" style={{ width: THEME.iconSizes.splash.width, height: THEME.iconSizes.splash.height, maxWidth: '40vw', maxHeight: '40vw' }}>
                <img 
                  src={Images.AppIcon} 
                  alt="Thurzt Icon" 
                  className="w-full h-full object-contain" 
                />
              </div>

              <div className="relative z-10 flex flex-col items-center mb-12">
                <img 
                  src={Images.LogoText} 
                  alt="Thurzt" 
                  className="h-12 object-contain mb-4" 
                />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 text-center">
                  where curiosity meets connection.
                </p>
              </div>
            </div>
            
            <div className="w-full space-y-4 max-w-sm mx-auto pb-8">
              <button onClick={() => handleAuth('apple')} className="w-full py-4 bg-white text-black rounded-xl font-black uppercase tracking-widest text-sm active:scale-95 transition-all">
                Continue with Apple
              </button>
              <button onClick={() => handleAuth('google')} className="w-full py-4 bg-white text-black rounded-xl font-black uppercase tracking-widest text-sm active:scale-95 transition-all">
                Continue with Google
              </button>
              {showEmailInput ? (
                <div className="space-y-4">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white transition-colors"
                    autoFocus
                  />
                  <button onClick={() => handleAuth('email')} className="w-full py-4 bg-white text-black rounded-xl font-black uppercase tracking-widest text-sm active:scale-95 transition-all">
                    Continue
                  </button>
                </div>
              ) : (
                <button onClick={() => handleAuth('email')} className="w-full py-4 bg-transparent text-white border border-white/20 rounded-xl font-black uppercase tracking-widest text-sm active:scale-95 transition-all hover:bg-white/5">
                  Continue with Email
                </button>
              )}
              
              <p className="text-center text-[10px] text-zinc-500 mt-6 px-4">
                By continuing, you agree to our <button onClick={() => window.open('https://thurzt.com/terms', '_blank')} className="underline hover:text-zinc-300">Terms</button> & <button onClick={() => window.open('https://thurzt.com/privacy', '_blank')} className="underline hover:text-zinc-300">Privacy Policy</button> and confirm you are 18+.<br/>
                <span className="font-bold text-red-400/80 block mt-2">Abusive content or behavior is not tolerated.</span>
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Confirm your age</h2>
              <p className="text-zinc-400 text-sm">You must be 18 or older to use Thurzt.</p>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Date of Birth</label>
              <input 
                type="date" 
                value={dob}
                onChange={(e) => { setDob(e.target.value); setError(''); }}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <button 
              onClick={handleAgeSubmit}
              className="w-full py-4 bg-white text-black rounded-xl font-black uppercase tracking-widest text-sm active:scale-95 transition-all mt-8"
            >
              Continue
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-2">How are you using Thurzt?</h2>
              <p className="text-zinc-400 text-sm">You can edit members later.</p>
            </div>

            <div className="space-y-4">
              {(['single', 'couple', 'group'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => handleTypeSelect(t)}
                  className="w-full p-6 bg-zinc-900 border border-white/10 rounded-xl flex items-center justify-between hover:border-white/30 transition-all text-left"
                >
                  <span className="font-black uppercase tracking-widest text-lg">{t}</span>
                  <ChevronRight className="w-5 h-5 text-zinc-500" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 pb-20">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-2">About You</h2>
              <p className="text-zinc-400 text-sm">Let's set up your profile.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(''); }}
                  placeholder="Your name"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Age</label>
                <input 
                  type="text" 
                  value={age || ''}
                  disabled
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-4 text-zinc-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Gender Identity (Optional)</label>
                <select 
                  value={genderIdentity}
                  onChange={(e) => setGenderIdentity(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white transition-colors appearance-none"
                >
                  <option value="">Prefer not to say</option>
                  {GENDER_IDENTITY_LIST.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Photos (Required)</label>
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((photo, idx) => (
                    <div key={idx} className="aspect-[3/4] rounded-xl overflow-hidden relative group">
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                        className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {photos.length < 6 && (
                    <button 
                      onClick={async () => {
                        const uri = await mediaStorageService.pickImage();
                        if (uri) {
                          setPhotos([...photos, uri]);
                          setError('');
                        }
                      }}
                      className="aspect-[3/4] rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-zinc-500 hover:text-white hover:border-white/50 transition-all"
                    >
                      <Camera className="w-6 h-6 mb-2" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Add</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-zinc-500 block">Heritage / Background (Optional)</label>
                      <p className="text-[10px] text-zinc-600 mt-1">Share this if it's important to you — it won't limit who you see.</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-500 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {CULTURE_LIST.map((item) => {
                      const isActive = heritage.includes(item.label);
                      return (
                        <button
                          key={`culture-${item.id}`}
                          onClick={() => toggleCulture(item.label)}
                          className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${
                            isActive 
                            ? 'bg-white text-black border-white' 
                            : 'bg-zinc-900/50 text-zinc-500 border-white/5 hover:border-white/20'
                          }`}
                        >
                            {isActive && <Check className="w-3 h-3" />}
                            {item.label}
                        </button>
                      );
                    })}
                  </div>
                </details>
              </div>
            </div>

            <button 
              onClick={handleYouSubmit}
              className="w-full py-4 bg-white text-black rounded-xl font-black uppercase tracking-widest text-sm active:scale-95 transition-all mt-8"
            >
              Continue
            </button>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-8 h-full flex flex-col">
            <div className="flex-1">
              {verificationRequired ? (
                <div className="space-y-4">
                  <h2 className="text-2xl font-black uppercase tracking-tight">Verification required to continue</h2>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Due to local regulations, we need to verify your age before you can use Thurzt in your region.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-2xl font-black uppercase tracking-tight">Verify your profile (optional)</h2>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Verified profiles get more matches and build trust in the community.
                  </p>
                </div>
              )}

              <div className="mt-8 p-6 bg-zinc-900 border border-white/10 rounded-2xl flex flex-col items-center justify-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center">
                  <Camera className="w-10 h-10 text-zinc-500" />
                </div>
                <div className="text-center">
                  <p className="font-black uppercase tracking-widest text-sm">Selfie Verification</p>
                  <p className="text-xs text-zinc-500 mt-1">Take a quick video selfie</p>
                </div>
                
                {verificationStatus === 'VERIFIED' ? (
                  <div className="w-full py-3 bg-green-900/30 text-green-400 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Verified
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex gap-2 w-full">
                      <button 
                        onClick={() => handleVerify('VERIFIED')}
                        className="flex-1 py-3 bg-zinc-800 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-zinc-700 transition-colors"
                      >
                        Simulate Success
                      </button>
                      <button 
                        onClick={() => handleVerify('FAILED_UNCERTAIN')}
                        className="flex-1 py-3 bg-zinc-800 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-zinc-700 transition-colors"
                      >
                        Simulate Fail
                      </button>
                    </div>
                    <button 
                      onClick={() => handleVerify('FAILED_UNDERAGE')}
                      className="w-full py-3 bg-red-900/30 text-red-400 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-red-900/50 transition-colors"
                    >
                      Simulate Underage
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-8 space-y-2">
                <h3 className="font-black uppercase tracking-widest text-sm">Location Access</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  We use your location to show you matches within your preferred distance and to calculate proximity.
                </p>
              </div>
            </div>

            <div className="space-y-4 pb-6">
              <button 
                onClick={signUp}
                disabled={verificationRequired && verificationStatus !== 'VERIFIED'}
                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all ${
                  verificationRequired && verificationStatus !== 'VERIFIED'
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-white text-black active:scale-95'
                }`}
              >
                Start Exploring
              </button>
              
              {!verificationRequired && verificationStatus !== 'VERIFIED' && (
                <button 
                  onClick={signUp}
                  className="w-full py-4 bg-transparent text-zinc-500 rounded-xl font-black uppercase tracking-widest text-xs active:scale-95 transition-all"
                >
                  Skip for now
                </button>
              )}

              {verificationRequired && verificationStatus !== 'VERIFIED' && (
                <button 
                  onClick={() => {
                    // Enter restricted state
                    signUp();
                  }}
                  className="w-full py-4 bg-transparent text-zinc-500 rounded-xl font-black uppercase tracking-widest text-xs active:scale-95 transition-all"
                >
                  Exit or Sign out
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {showTerms && <TermsOfService onClose={() => setShowTerms(false)} />}
      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
    </div>
  );
};
