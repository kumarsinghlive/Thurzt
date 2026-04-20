import React, { useState } from 'react';

interface BioBlockProps {
  bio: string;
}

export const BioBlock: React.FC<BioBlockProps> = ({ bio }) => {
  const [expanded, setExpanded] = useState(false);

  if (!bio) return null;

  const maxLength = 120;
  const isLong = bio.length > maxLength;
  const displayBio = !expanded && isLong ? `${bio.substring(0, maxLength).trim()}... ` : `${bio} `;

  return (
    <div className="px-2">
      <p className="text-zinc-200 text-sm leading-relaxed font-medium">
        {displayBio}
        {isLong && (
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-zinc-400 text-xs font-bold uppercase tracking-widest hover:text-zinc-200 transition-colors inline-block ml-1"
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </p>
    </div>
  );
};
