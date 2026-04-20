import React, { useState } from 'react';
import { User, ProfileMember } from '../types';
import { X, Plus, Trash2, Check, Loader2 } from 'lucide-react';
import { CULTURE_LIST, DYNAMICS_LIST, INTERESTS_LIST, GENDER_IDENTITY_LIST } from '../constants';

interface EditMembersScreenProps {
  user: User;
  onSave: (updatedUser: User) => void | Promise<void>;
  onClose: () => void;
}

export const EditMembersScreen: React.FC<EditMembersScreenProps> = ({ user, onSave, onClose }) => {
  const [members, setMembers] = useState<ProfileMember[]>([...(user.members || [])]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedUser = {
        ...user,
        members,
      };
      if (members.length > 0) {
        updatedUser.name = members.map(m => m.name).join(' & ');
        updatedUser.age = members[0].age;
      }
      await onSave(updatedUser);
    } finally {
      setIsSaving(false);
    }
  };

  const addMember = () => {
    setMembers([...members, { name: 'New Member', age: 25, heritage: [], dynamics: [], interests: [] }]);
    setEditingIndex(members.length);
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  const updateMember = (index: number, key: keyof ProfileMember, value: any) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [key]: value };
    setMembers(newMembers);
  };

  const toggleArrayItem = (index: number, key: 'heritage' | 'dynamics' | 'interests', item: string) => {
    const currentArray = members[index][key] || [];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updateMember(index, key, newArray);
  };

  if (editingIndex !== null) {
    const member = members[editingIndex];
    return (
      <div className="fixed inset-0 z-[110] flex flex-col bg-zinc-950 text-white animate-in slide-in-from-right duration-300 pb-[calc(80px+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-xl font-black uppercase tracking-widest text-white italic">Edit Member</h2>
          <button onClick={() => setEditingIndex(null)} className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
          
          {/* Basic Info */}
          <section className="space-y-4">
            <div>
              <label className="text-zinc-500 text-xs uppercase font-black tracking-widest block mb-2">Name</label>
              <input 
                type="text"
                value={member.name}
                onChange={e => updateMember(editingIndex, 'name', e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-zinc-500 text-xs uppercase font-black tracking-widest block mb-2">Age</label>
                <input 
                  type="number"
                  value={member.age}
                  onChange={e => updateMember(editingIndex, 'age', parseInt(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20"
                />
              </div>
              <div className="flex-1">
                <label className="text-zinc-500 text-xs uppercase font-black tracking-widest block mb-2">Gender Identity</label>
                <div className="flex flex-col gap-2">
                  {GENDER_IDENTITY_LIST.map(gender => {
                    const isActive = member.genderIdentity === gender;
                    return (
                      <button
                        key={gender}
                        onClick={() => updateMember(editingIndex, 'genderIdentity', isActive ? undefined : gender)}
                        className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${
                          isActive 
                          ? 'bg-white text-black border-white' 
                          : 'bg-zinc-900/50 text-zinc-500 border-white/5 hover:border-white/20'
                        }`}
                      >
                        {isActive && <Check className="w-3 h-3" />}
                        {gender}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Heritage / Background */}
          <section>
            <label className="text-zinc-500 text-xs uppercase font-black tracking-widest block mb-4">Heritage / Background</label>
            <div className="flex flex-wrap gap-2">
              {CULTURE_LIST.map((item) => {
                const isActive = (member.heritage || []).includes(item.label);
                return (
                  <button
                    key={`culture-${item.id}`}
                    onClick={() => toggleArrayItem(editingIndex, 'heritage', item.label)}
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

          {/* Dynamics */}
          <section>
            <label className="text-zinc-500 text-xs uppercase font-black tracking-widest block mb-4">Dynamics</label>
            <div className="flex flex-wrap gap-2">
              {DYNAMICS_LIST.map((item) => {
                const isActive = (member.dynamics || []).includes(item.label);
                return (
                  <button
                    key={`dynamic-${item.id}`}
                    onClick={() => toggleArrayItem(editingIndex, 'dynamics', item.label)}
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

          {/* Interests */}
          <section>
            <label className="text-zinc-500 text-xs uppercase font-black tracking-widest block mb-4">Hobbies & Interests</label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS_LIST.map((item) => {
                const isActive = (member.interests || []).includes(item.label);
                return (
                  <button
                    key={`interest-${item.id}`}
                    onClick={() => toggleArrayItem(editingIndex, 'interests', item.label)}
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

        <div className="p-8 border-t border-zinc-800 bg-zinc-950">
          <button 
            onClick={() => setEditingIndex(null)}
            className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-zinc-200 transition-colors shadow-xl"
          >
            Done Editing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[110] flex flex-col bg-zinc-950 text-white animate-in slide-in-from-right duration-300 pb-[calc(80px+env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between p-6 border-b border-zinc-800">
        <h2 className="text-xl font-black uppercase tracking-widest text-white italic">Members</h2>
        <button onClick={onClose} className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors">
          <X className="w-7 h-7" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
        {members.map((member, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl border border-white/5">
            <div className="flex-1" onClick={() => setEditingIndex(index)}>
              <p className="text-sm font-bold text-white">{member.name}, {member.age}</p>
              <p className="text-xs text-zinc-500">{member.genderIdentity || 'No gender specified'}</p>
            </div>
            <button 
              onClick={() => removeMember(index)}
              className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}

        <button 
          onClick={addMember}
          className="w-full flex items-center justify-center gap-2 p-4 border border-dashed border-zinc-700 rounded-2xl text-zinc-500 hover:text-white hover:border-zinc-500 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="text-xs font-black uppercase tracking-widest">Add Member</span>
        </button>
      </div>

      <div className="p-8 border-t border-zinc-800 bg-zinc-950">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-zinc-200 transition-colors shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Members'
          )}
        </button>
      </div>
    </div>
  );
};
