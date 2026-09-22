import React from 'react';
import { University, Mail, Phone, Users } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-6 px-4 sm:px-8 text-xs text-slate-600 dark:text-slate-400 transition-colors z-10 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Project Branding & College */}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-blue-700 dark:text-sky-400 text-sm">
              SARTHI (सारथी)
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              {t('app.tagline')}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <University className="w-3.5 h-3.5 text-slate-400" />
            Graphic Era Hill University, Bhimtal Campus • Team Tech4ALL (5 Student Developers)
          </p>
        </div>

        {/* Contact info */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1 text-slate-800 dark:text-slate-300">
            <Users className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
            Lead: <strong>Ujjwal Chaudhary</strong>
          </span>
          <a
            href="mailto:ujjwalchaudhary2007@gmail.com"
            className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-sky-300 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            ujjwalchaudhary2007@gmail.com
          </a>
          <span className="flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            +91 88680 59861
          </span>
        </div>
      </div>

      {/* Mandatory Statutory Notice */}
      <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 leading-relaxed font-mono">
        <strong className="text-amber-600 dark:text-amber-400 font-bold">STATUTORY NOTICE:</strong> SARTHI is an innovation prototype utilizing synthetically simulated telemetry data. Actual deployment with VAHAN, eChallan, and ERSS 112 requires appropriate statutory authorization, secure NIC APIs, and state cybersecurity protocols.
      </div>
    </footer>
  );
};
