
import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { CULTURE_LIST, DYNAMICS_LIST, INTERESTS_LIST } from '../constants';
import FiltersImg from '../assets/Filters.png';
import { X, Check, ChevronDown } from 'lucide-react';

interface FiltersProps {
  preferences: UserPreferences;
  onUpdate: (key: keyof UserPreferences, value: any) => void;
  onClose: () => void;
}

export const Filters: React.FC<FiltersProps> = ({ preferences, onUpdate, onClose }) => {
  const [showMore, setShowMore] = useState(false);

  const handleCultureToggle = (cultureLabel: string) => {
    const current = preferences.heritage || [];
    const isSelected = current.includes(cultureLabel);
    const newCultures = isSelected 
      ? current.filter(c => c !== cultureLabel)
      : [...current, cultureLabel];
    onUpdate('heritage', newCultures);
  };

  const handleDynamicsToggle = (dynamicLabel: string) => {
    const current = preferences.dynamics || [];
    const isSelected = current.includes(dynamicLabel);
    const newDynamics = isSelected 
      ? current.filter(d => d !== dynamicLabel)
      : [...current, dynamicLabel];
    onUpdate('dynamics', newDynamics);
  };

  const handleInterestsToggle = (interestLabel: string) => {
    const current = preferences.interests || [];
    const isSelected = current.includes(interestLabel);
    const newInterests = isSelected 
      ? current.filter(i => i !== interestLabel)
      : [...current, interestLabel];
    onUpdate('interests', newInterests);
  };

  const handleLookingForToggle = (label: string) => {
    const current = preferences.lookingFor || [];
    const isSelected = current.includes(label);
    const newLookingFor = isSelected 
      ? current.filter(i => i !== label)
      : [...current, label];
    onUpdate('lookingFor', newLookingFor);
  };

  const handleCoupleTypeToggle = (label: string) => {
    const current = preferences.coupleType || [];
    const isSelected = current.includes(label);
    const newCoupleType = isSelected 
      ? current.filter(i => i !== label)
      : [...current, label];
    onUpdate('coupleType', newCoupleType);
  };

  const handleGendersOpenToToggle = (label: string) => {
    const current = preferences.gendersOpenTo || [];
    const isSelected = current.includes(label);
    const newGenders = isSelected 
      ? current.filter(i => i !== label)
      : [...current, label];
    onUpdate('gendersOpenTo', newGenders);
  };

  const updateRange = (index: 0 | 1, value: number) => {
    const newRange = [...preferences.ageRange] as [number, number];
    newRange[index] = value;
    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[1] = newRange[0];
    } else if (index === 1 && newRange[1] < newRange[0]) {
      newRange[0] = newRange[1];
    }
    onUpdate('ageRange', newRange);
  };

  return (
    <div className="fixed inset-0 z-[110] flex flex-col bg-zinc-950 text-white animate-in slide-in-from-bottom duration-300 pb-[calc(80px+env(safe-area-inset-bottom))]">
      {/* Header */}
      <div className="flex items-center p-6 border-b border-zinc-800 relative">
        <div style={{ flex: 1, alignItems: 'center', display: 'flex', justifyContent: 'flex-start' }}>
          <img 
            src={FiltersImg} 
            alt="Filters" 
            style={{ width: '60%', height: 40, objectFit: 'contain', objectPosition: 'left', alignSelf: 'center' }} 
          />
        </div>
        <button onClick={onClose} className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors absolute right-6">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto max-h-[80vh] p-6 space-y-10 no-scrollbar">
        
        {/* Looking For Filter */}
        <section>
          <label className="text-zinc-500 text-xs uppercase font-black tracking-widest block mb-4">Looking for</label>
          <div className="flex flex-wrap gap-2">
            {['Singles', 'Couples', 'Groups'].map((label) => {
              const isActive = (preferences.lookingFor || []).includes(label);
              return (
                <button
                  key={`lookingFor-${label}`}
                  onClick={() => handleLookingForToggle(label)}
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${
                    isActive 
                    ? 'bg-white text-black border-white' 
                    : 'bg-zinc-900/50 text-zinc-500 border-white/5 hover:border-white/20'
                  }`}
                >
                    {isActive && <Check className="w-3 h-3" />}
                    {label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Couple Type Filter */}
        {(preferences.lookingFor || []).includes('Couples') && (
          <section>
            <label className="text-zinc-500 text-xs uppercase font-black tracking-widest block mb-4">Couple type</label>
            <div className="flex flex-wrap gap-2">
              {['Male + Female', 'Female + Female', 'Male + Male', 'Non-binary included', 'Any couple'].map((label) => {
                const isActive = (preferences.coupleType || []).includes(label);
                return (
                  <button
                    key={`coupleType-${label}`}
                    onClick={() => handleCoupleTypeToggle(label)}
                    className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${
                      isActive 
                      ? 'bg-white text-black border-white' 
                      : 'bg-zinc-900/50 text-zinc-500 border-white/5 hover:border-white/20'
                    }`}
                  >
                      {isActive && <Check className="w-3 h-3" />}
                      {label}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Gender Filter */}
        {(preferences.lookingFor || []).includes('Singles') && (
          <section>
            <label className="text-zinc-500 text-xs uppercase font-black tracking-widest block mb-4">Gender</label>
            <div className="flex flex-wrap gap-2">
              {['Man', 'Woman', 'Non-Binary', 'Prefer not to say'].map((label) => {
                const isActive = (preferences.gendersOpenTo || []).includes(label);
                return (
                  <button
                    key={`gendersOpenTo-${label}`}
                    onClick={() => handleGendersOpenToToggle(label)}
                    className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${
                      isActive 
                      ? 'bg-white text-black border-white' 
                      : 'bg-zinc-900/50 text-zinc-500 border-white/5 hover:border-white/20'
                    }`}
                  >
                      {isActive && <Check className="w-3 h-3" />}
                      {label}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Distance Filter */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <label className="text-zinc-500 text-xs uppercase font-black tracking-widest">Maximum Distance</label>
            <span className="text-sm font-bold">{preferences.maxDistance} miles</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={preferences.maxDistance}
            onChange={(e) => onUpdate('maxDistance', parseInt(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </section>

        {/* Age Filter */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <label className="text-zinc-500 text-xs uppercase font-black tracking-widest">Age Range</label>
            <span className="text-sm font-bold">{preferences.ageRange[0]} - {preferences.ageRange[1]}</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-zinc-500 w-8">Min</span>
              <input 
                type="range" 
                min="18" 
                max="99" 
                value={preferences.ageRange[0]}
                onChange={(e) => updateRange(0, parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <span className="text-sm font-bold w-6 text-right">{preferences.ageRange[0]}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-zinc-500 w-8">Max</span>
              <input 
                type="range" 
                min="18" 
                max="99" 
                value={preferences.ageRange[1]}
                onChange={(e) => updateRange(1, parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <span className="text-sm font-bold w-6 text-right">{preferences.ageRange[1]}</span>
            </div>
          </div>
        </section>

        {/* More Preferences Toggle */}
        <button 
          onClick={() => setShowMore(!showMore)}
          className="w-full flex items-center justify-between py-4 border-t border-zinc-800/50"
        >
          <span className="text-xs font-black uppercase tracking-widest text-zinc-400">More preferences</span>
          <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${showMore ? 'rotate-180' : ''}`} />
        </button>

        {/* Collapsible Section */}
        <div className={`space-y-10 overflow-hidden transition-all duration-300 ease-in-out ${showMore ? 'max-h-[2000px] opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
          {/* Dynamics Filter */}
          <section>
            <label className="text-zinc-500 text-xs uppercase font-black tracking-widest block mb-4">Dynamics</label>
            <div className="flex flex-wrap gap-2">
              {DYNAMICS_LIST.map((item) => {
                const isActive = (preferences.dynamics || []).includes(item.label);
                return (
                  <button
                    key={`dynamic-${item.id}`}
                    onClick={() => handleDynamicsToggle(item.label)}
                    className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${
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
          </section>

          {/* Hobbies & Interests Filter */}
          <section>
            <label className="text-zinc-500 text-xs uppercase font-black tracking-widest block mb-4">Hobbies & Interests</label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS_LIST.map((item) => {
                const isActive = (preferences.interests || []).includes(item.label);
                return (
                  <button
                    key={`interest-${item.id}`}
                    onClick={() => handleInterestsToggle(item.label)}
                    className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${
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
          </section>

          {/* Heritage / Background Filter */}
          <section>
            <label className="text-zinc-500 text-xs uppercase font-black tracking-widest block mb-4">Heritage / Background</label>
            <div className="flex flex-wrap gap-2">
              {CULTURE_LIST.map((item) => {
                const isActive = (preferences.heritage || []).includes(item.label);
                return (
                  <button
                    key={`culture-${item.id}`}
                    onClick={() => handleCultureToggle(item.label)}
                    className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${
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
          </section>
        </div>

      </div>
      
      {/* Footer */}
      <div className="p-8 border-t border-zinc-800 bg-zinc-950">
        <button 
          onClick={onClose}
          className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-zinc-200 transition-colors shadow-xl"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};
