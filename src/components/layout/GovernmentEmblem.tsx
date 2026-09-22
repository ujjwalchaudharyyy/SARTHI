import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const GovernmentEmblem: React.FC<{ size?: 'sm' | 'md' | 'lg'; showTagline?: boolean }> = ({
  size = 'md',
  showTagline = true,
}) => {
  const { language } = useLanguage();

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  return (
    <div className="flex items-center gap-3 select-none">
      {/* State / National Emblem Vector */}
      <div className={`relative flex ${iconSizes[size]} items-center justify-center shrink-0`}>
        <svg
          viewBox="0 0 100 120"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ashok Pillar Base */}
          <path
            d="M20 110 H80 V102 C80 98 70 96 50 96 C30 96 20 98 20 102 Z"
            fill="#d97706"
          />
          {/* Wheel / Chakra Base */}
          <circle cx="50" cy="85" r="9" stroke="#1e3a8a" strokeWidth="2.5" fill="#ffffff" />
          <circle cx="50" cy="85" r="2.5" fill="#1e3a8a" />
          {/* Radiating Spokes */}
          <line x1="50" y1="76" x2="50" y2="94" stroke="#1e3a8a" strokeWidth="1" />
          <line x1="41" y1="85" x2="59" y2="85" stroke="#1e3a8a" strokeWidth="1" />
          <line x1="43.6" y1="78.6" x2="56.4" y2="91.4" stroke="#1e3a8a" strokeWidth="1" />
          <line x1="43.6" y1="91.4" x2="56.4" y2="78.6" stroke="#1e3a8a" strokeWidth="1" />
          {/* Lions / Pillar Capital Silhouette */}
          <path
            d="M32 75 C30 55 35 30 50 20 C65 30 70 55 68 75 Z"
            fill="#d97706"
          />
          {/* Left & Right Lion Faces */}
          <path
            d="M28 50 C20 40 18 25 32 20 C38 25 38 40 32 50 Z"
            fill="#b45309"
          />
          <path
            d="M72 50 C80 40 82 25 68 20 C62 25 62 40 68 50 Z"
            fill="#b45309"
          />
          {/* Crown / Crest */}
          <path
            d="M44 14 C44 10 56 10 56 14 L53 19 H47 Z"
            fill="#f59e0b"
          />
        </svg>
      </div>

      {/* Official Government Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-mono text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
            SARTHI
          </span>
          <span className="font-hindi text-sm font-bold text-amber-600 dark:text-amber-400">
            सारथी
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 rounded bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800/60 px-1.5 py-0.5 text-[9px] font-mono font-bold text-amber-900 dark:text-amber-300 uppercase">
            Govt. Portal
          </span>
        </div>

        {showTagline && (
          <div className="flex items-center gap-1 text-[10px] text-slate-600 dark:text-slate-400 leading-tight font-medium">
            <span>{language === 'hi' ? 'सत्यमेव जयते' : 'Satyameva Jayate'}</span>
            <span>•</span>
            <span className="text-slate-700 dark:text-slate-300 font-semibold">
              {language === 'hi' ? 'भारत सरकार' : 'Government of India'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
