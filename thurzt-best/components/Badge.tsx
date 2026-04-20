import React from 'react';

interface BadgeProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  variant?: 'outline' | 'solid';
}

export const Badge: React.FC<BadgeProps> = ({ label, active = false, onClick, variant = 'outline' }) => {
  const baseClasses = "px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border transition-all cursor-pointer select-none mr-2 mb-2";
  
  const activeClasses = active 
    ? "bg-white text-black border-white" 
    : "bg-transparent text-zinc-500 border-zinc-700 hover:border-zinc-500";
    
  const solidClasses = "bg-zinc-800 text-zinc-200 border-zinc-800";

  return (
    <span 
      onClick={onClick}
      className={`${baseClasses} ${variant === 'solid' ? solidClasses : activeClasses}`}
    >
      {label}
    </span>
  );
};