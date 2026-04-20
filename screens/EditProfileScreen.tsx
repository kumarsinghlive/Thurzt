import React, { useState } from 'react';
import { User, ProfileImage } from '../types';
import { X, Plus, Trash2, Users, Loader2, Lock, Unlock, GripHorizontal } from 'lucide-react';
import { RELATIONSHIP_STYLES } from '../constants';
import { mediaStorageService } from '../services/MediaStorageService';
import EditProfileImg from '../assets/Edit Profile.png';

interface EditProfileScreenProps {
  user: User;
  onSave: (updatedUser: User) => void | Promise<void>;
  onClose: () => void;
  onOpenMembers: () => void;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ user, onSave, onClose, onOpenMembers }) => {
  const [bio, setBio] = useState(user.bio);
  const [photos, setPhotos] = useState<ProfileImage[]>(
    user.photos.map(p => typeof p === 'string' ? { url: p, isPrivate: false } : { url: p.url, isPrivate: p.isPrivate || false })
  );
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const [datingStyles, setDatingStyles] = useState<string[]>([...user.datingStyles]);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        ...user,
        bio,
        photos,
        datingStyles
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addPhoto = async () => {
    const uri = await mediaStorageService.pickImage();
    if (uri) {
      setPhotos([...photos, { url: uri, isPrivate: false }]);
    }
  };

  const removePhoto = (url: string) => {
    setPhotos(photos.filter(p => p.url !== url));
  };

  const togglePrivate = (url: string) => {
    setPhotos(photos.map(p => p.url === url ? { ...p, isPrivate: !p.isPrivate } : p));
  };

  const toggleDatingStyle = (style: string) => {
    if (datingStyles.includes(style)) {
      setDatingStyles(datingStyles.filter(s => s !== style));
    } else {
      setDatingStyles([...datingStyles, style]);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex flex-col bg-zinc-950 text-white animate-in slide-in-from-bottom duration-300 pb-[calc(80px+env(safe-area-inset-bottom))]">
      <header className="flex items-center p-6 bg-black/80 backdrop-blur-md sticky top-0 z-40 border-b border-zinc-800 relative">
        <div style={{ flex: 1, alignItems: 'center', display: 'flex', justifyContent: 'flex-start' }}>
          <img 
            src={EditProfileImg} 
            alt="Edit Profile" 
            style={{ width: '60%', height: 40, objectFit: 'contain', objectPosition: 'left', alignSelf: 'center' }} 
          />
        </div>
        <button 
          onClick={onClose} 
          className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center absolute right-6"
        >
          <X className="w-7 h-7" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
        
        {/* Members Button */}
        <section>
          <button 
            onClick={onOpenMembers}
            className="w-full flex items-center justify-between p-4 bg-zinc-900 rounded-2xl hover:bg-zinc-800 transition-colors border border-white/5"
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-400" />
              <div className="text-left">
                <p className="text-sm font-bold text-white uppercase tracking-widest">Edit Members</p>
                <p className="text-xs text-zinc-500">{user.members?.length || 0} Member(s)</p>
              </div>
            </div>
            <div className="text-xs font-black uppercase tracking-widest text-zinc-400">Manage</div>
          </button>
        </section>

        {/* Bio */}
        <section>
          <label className="text-zinc-500 text-xs uppercase font-black tracking-widest block mb-4">Bio</label>
          <textarea 
            value={bio}
            onChange={e => setBio(e.target.value)}
            className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 resize-none"
            placeholder="Tell them about yourself..."
          />
        </section>

        {/* Photos */}
        <section className="bg-zinc-900/30 p-6 rounded-3xl border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <label className="text-white text-sm uppercase font-black tracking-widest">Gallery</label>
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{photos.length} / 6 Photos</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {photos.map((photo, index) => (
              <div 
                key={photo.url} 
                onClick={() => setSelectedPhotoUrl(selectedPhotoUrl === photo.url ? null : photo.url)}
                className={`relative aspect-[3/4] rounded-xl overflow-hidden group cursor-pointer ${selectedPhotoUrl === photo.url ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black' : ''}`}
              >
                <img src={photo.url} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                {photo.isPrivate && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                    <Lock className="w-8 h-8 text-white/50" />
                  </div>
                )}
                <div className={`absolute inset-0 bg-black/60 transition-opacity flex flex-col items-center justify-center gap-3 ${selectedPhotoUrl === photo.url ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  {selectedPhotoUrl === photo.url && (
                    <div className="absolute top-2 left-0 right-0 text-center px-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-white drop-shadow-md leading-tight block">Manage Gallery Settings</span>
                    </div>
                  )}
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePrivate(photo.url);
                      }}
                      className={`p-2.5 rounded-full transition-colors ${photo.isPrivate ? 'bg-blue-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                      title={photo.isPrivate ? "Unlock Photo" : "Lock Photo"}
                    >
                      {photo.isPrivate ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removePhoto(photo.url);
                      }}
                      className="p-2.5 bg-red-500/80 rounded-full text-white hover:bg-red-500 transition-colors"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {index > 0 && selectedPhotoUrl === photo.url && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const newPhotos = [...photos];
                        const temp = newPhotos[index - 1];
                        newPhotos[index - 1] = newPhotos[index];
                        newPhotos[index] = temp;
                        setPhotos(newPhotos);
                      }}
                      className="absolute left-1 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/80"
                    >
                      <span className="text-[10px] font-black">&lt;</span>
                    </button>
                  )}
                  {index < photos.length - 1 && selectedPhotoUrl === photo.url && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const newPhotos = [...photos];
                        const temp = newPhotos[index + 1];
                        newPhotos[index + 1] = newPhotos[index];
                        newPhotos[index] = temp;
                        setPhotos(newPhotos);
                      }}
                      className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/80"
                    >
                      <span className="text-[10px] font-black">&gt;</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
            {photos.length < 6 && (
              <button 
                onClick={addPhoto}
                className="aspect-[3/4] rounded-xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-600 hover:text-white hover:border-zinc-600 transition-colors bg-black/20"
              >
                <Plus className="w-8 h-8 mb-2" />
                <span className="text-[9px] font-black uppercase tracking-widest">Add Photo</span>
              </button>
            )}
          </div>
        </section>

        {/* Relationship Style */}
        <section>
          <label className="text-zinc-500 text-xs uppercase font-black tracking-widest block mb-4">Relationship Style</label>
          <div className="flex flex-wrap gap-2">
            {RELATIONSHIP_STYLES.map(style => {
              const isActive = datingStyles.includes(style);
              return (
                <button
                  key={style}
                  onClick={() => toggleDatingStyle(style)}
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                    isActive 
                    ? 'bg-white text-black border-white' 
                    : 'bg-zinc-900/50 text-zinc-500 border-white/5 hover:border-white/20'
                  }`}
                >
                  {style}
                </button>
              );
            })}
          </div>
        </section>

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
            'Save Profile'
          )}
        </button>
      </div>
    </div>
  );
};
