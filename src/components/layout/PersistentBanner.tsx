import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const PersistentBanner: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="w-full bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/40 px-3 py-1.5 text-center text-[11px] font-mono text-amber-900 dark:text-amber-300 shadow-2xs flex items-center justify-center gap-2 transition-colors">
      <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
      <span>
        {language === 'hi' ? (
          <>
            <strong className="font-bold text-amber-800 dark:text-amber-200">प्रदर्शनात्मक वातावरण — सिम्युलेटेड डेटा</strong> |
            समस्त वाहन टेलीमेट्री एवं मार्ग साक्ष्य शैक्षणिक एवं विभागीय मूल्यांकन हेतु कृत्रिम रूप से उत्पन्न हैं |
            <span className="font-semibold underline ml-1">
              प्रस्तावित सरकारी सहयोग — वैधानिक अनुमोदन के अधीन
            </span>
          </>
        ) : (
          <>
            <strong className="font-bold text-amber-800 dark:text-amber-200">DEMONSTRATION PROTOTYPE — SIMULATED DATA</strong> |
            All vehicle telemetry & routes are synthetically simulated for academic & departmental evaluation |
            <span className="font-semibold underline ml-1">
              PROPOSED GOVT INTEGRATION — SUBJECT TO STATUTORY AUTHORIZATION
            </span>
          </>
        )}
      </span>
    </div>
  );
};
