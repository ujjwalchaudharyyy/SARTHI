import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Branding & Header
    'app.title': 'SARTHI',
    'app.subtitle': 'State Automated Response & Traffic Highway Infrastructure',
    'app.govt': 'Government of India',
    'app.morth': 'Ministry of Road Transport & Highways, Govt. of India',
    'app.tagline': 'Detect Faster. Respond Smarter. Save Lives.',
    'app.emblem_caption': 'National Integrated Traffic Command Portal',
    'app.sector': 'Nainital / Bhimtal Sector',
    'app.slogan': 'Satyameva Jayate',

    // Nav Menu Items
    'nav.overview': 'Command Overview',
    'nav.map': 'Live Traffic GIS',
    'nav.surveillance': 'Target Tracing Radar',
    'nav.challans': 'e-Challan Enforcement',
    'nav.rc_lookup': 'Parivahan RC Lookup',
    'nav.register_vehicle': 'Vehicle Enrollment',
    'nav.speed': 'Speed Intelligence',
    'nav.disputes': 'Challan Disputes & Waivers',
    'nav.repeat': 'Repeat Violations',
    'nav.stolen': 'Stolen Vehicles',
    'nav.emergency': 'Emergency Green Corridor',
    'nav.incidents': 'Incident Command',
    'nav.risk': 'Road Risk Intelligence',
    'nav.ai': 'AI Safety Analytics',
    'nav.reports': 'Government Reports',
    'nav.executive': 'Senior Officer Overview',
    'nav.architecture': 'NIC Gov Integration',
    'nav.security': 'Security & Audit Trail',
    'nav.future': 'Vision 2030',
    'nav.team': 'Team Tech4ALL',

    // Common Controls & Status
    'btn.login': 'Sign In to Portal',
    'btn.logout': 'Sign Out',
    'btn.issue_challan': 'Issue e-Challan',
    'btn.inspect_rc': 'Inspect Parivahan RC',
    'btn.track_gis': 'Track on GIS Map',
    'btn.radar_lock': 'Lock Radar Surveillance',
    'btn.print': 'Print Notice',
    'btn.export_csv': 'Export CSV Data',
    'btn.settle_fine': 'Settle Fine',
    'btn.approve': 'Approve Exemption',
    'btn.reject': 'Reject Dispute',
    'btn.filter_all': 'All',
    'btn.filter_unpaid': 'Unpaid',
    'btn.filter_paid': 'Paid',
    'btn.filter_dispute': 'In Dispute',
    'btn.filter_waived': 'Waived',
    'btn.close': 'Close',
    'btn.submit': 'Submit',
    'btn.search': 'Search',
    'btn.dispatch_intercept': 'Dispatch Police Intercept',

    // Status Badges
    'status.normal': 'Normal Compliance',
    'status.overspeed': 'Overspeeding',
    'status.emergency': 'Priority Emergency',
    'status.stolen': 'Under Investigation',
    'status.paid': 'PAID',
    'status.unpaid': 'UNPAID',
    'status.in_dispute': 'IN DISPUTE',
    'status.waived': 'WAIVED (₹0)',

    // e-Challan Desk
    'challan.title': 'Electronic Challan (e-Challan) Enforcement Desk',
    'challan.subtitle': 'Statutory Powers under Section 133 / 200 Motor Vehicles Act, 1988',
    'challan.form_title': 'Issue Direct Electronic Challan',
    'challan.plate_label': 'Vehicle Registration Number',
    'challan.offense_label': 'Statutory Offense (Motor Vehicles Act)',
    'challan.penalty_label': 'Penalty Amount (INR ₹)',
    'challan.corridor_label': 'Highway Road Corridor',
    'challan.location_label': 'Exact Checkpoint Location',
    'challan.camera_label': 'Radar / Camera Source',
    'challan.remarks_label': 'Officer Enforcement Remarks',
    'challan.submit_btn': 'Generate & Dispatch e-Challan (SMS Notice)',
    'challan.ledger_title': 'State e-Challan Enforcement Ledger',

    // Parivahan RC
    'rc.title': 'Vehicle Registration Certificate (RC) & Pedigree Lookup',
    'rc.subtitle': 'Parivahan Vahan 4.0 National Vehicle Registry & Smart Card Database',
    'rc.owner_info': 'Registered Owner Information',
    'rc.owner_name': 'Owner Full Name',
    'rc.father_name': 'Father / Husband Name',
    'rc.address': 'Registered Address',
    'rc.mobile': 'Registered Mobile',
    'rc.tech_specs': 'Vehicle Technical Specifications',
    'rc.make_model': 'Make & Model',
    'rc.maker': 'Maker Description',
    'rc.class': 'Vehicle Class',
    'rc.fuel': 'Fuel Type',
    'rc.norms': 'Emission Norms',
    'rc.chassis': 'Chassis Number',
    'rc.engine': 'Engine Number',
    'rc.validity': 'Statutory Compliance & Validities',
    'rc.fitness': 'Fitness Valid Upto',
    'rc.insurance': 'Insurance Cover',
    'rc.pucc': 'PUCC (Emission)',
    'rc.challans_summary': 'Lifetime Challan Ledger on this Vehicle',

    // Target Surveillance Radar
    'surveillance.title': 'Live Vehicle Target Tracing & Intercept HUD',
    'surveillance.subtitle': 'Real-Time Highway Telemetry Intercept & Checkpoint Forecasting',
    'surveillance.radar_locked': 'RADAR LOCKED ON TARGET',
    'surveillance.live_speed': 'Live Velocity',
    'surveillance.heading': 'Heading Vector',
    'surveillance.checkpoint_prediction': 'Checkpoint Intercept Prediction',
    'surveillance.next_checkpoint': 'Next Estimated Junction Checkpoint',
    'surveillance.recommended_unit': 'Recommended Patrol Unit',

    // Theme & Lang
    'theme.toggle': 'Toggle Light/Dark Theme',
    'lang.toggle': 'भाषा बदलें (Hindi/English)',
  },
  hi: {
    // Branding & Header
    'app.title': 'सारथी (SARTHI)',
    'app.subtitle': 'राज्य स्वचालित प्रतिक्रिया एवं यातायात राजमार्ग अवसंरचना',
    'app.govt': 'भारत सरकार',
    'app.morth': 'सड़क परिवहन एवं राजमार्ग मंत्रालय, भारत सरकार',
    'app.tagline': 'शीघ्र पहचानें। समझदारी से प्रतिक्रिया दें। जीवन बचाएं।',
    'app.emblem_caption': 'राष्ट्रीय एकीकृत यातायात कमान पोर्टल',
    'app.sector': 'नैनीताल / भीमताल सेक्टर',
    'app.slogan': 'सत्यमेव जयते',

    // Nav Menu Items
    'nav.overview': 'कमान केंद्र अवलोकन',
    'nav.map': 'लाइव ट्रैफिक जीआईएस मानचित्र',
    'nav.surveillance': 'वाहन निगरानी एवं ट्रैकिंग रडार',
    'nav.challans': 'ई-चालान प्रवर्तन डेस्क',
    'nav.rc_lookup': 'परिवहन वाहन आरसी खोज',
    'nav.register_vehicle': 'वाहन पंजीकरण एवं नामांकन',
    'nav.speed': 'गति आसूचना एवं साक्ष्य',
    'nav.disputes': 'चालान विवाद एवं चिकित्सा छूट',
    'nav.repeat': 'बारंबार उल्लंघनकर्ता',
    'nav.stolen': 'चोरी/संदिग्ध वाहन',
    'nav.emergency': 'आपातकालीन ग्रीन कॉरिडोर (108)',
    'nav.incidents': 'घटना कमान एवं नियंत्रण',
    'nav.risk': 'सड़क जोखिम विश्लेषण',
    'nav.ai': 'एआई सुरक्षा पूर्वानुमान',
    'nav.reports': 'सरकारी लेखा परीक्षा रिपोर्ट',
    'nav.executive': 'वरिष्ठ अधिकारी डैशबोर्ड',
    'nav.architecture': 'एनआईसी एकीकरण संरचना',
    'nav.security': 'सुरक्षा एवं ऑडिट ट्रेल',
    'nav.future': 'भविष्य दृष्टि 2030',
    'nav.team': 'टीम Tech4ALL',

    // Common Controls & Status
    'btn.login': 'पोर्टल में लॉगिन करें',
    'btn.logout': 'लॉग आउट',
    'btn.issue_challan': 'ई-चालान जारी करें',
    'btn.inspect_rc': 'आरसी विवरण देखें',
    'btn.track_gis': 'मानचित्र पर ट्रैक करें',
    'btn.radar_lock': 'रडार सर्विलांस लॉक करें',
    'btn.print': 'रसीद प्रिंट करें',
    'btn.export_csv': 'सीएसवी निर्यात करें',
    'btn.settle_fine': 'जुर्माना जमा करें',
    'btn.approve': 'छूट स्वीकृत करें',
    'btn.reject': 'विवाद अस्वीकृत करें',
    'btn.filter_all': 'सभी',
    'btn.filter_unpaid': 'बकाया',
    'btn.filter_paid': 'भुगतान किया गया',
    'btn.filter_dispute': 'विचाराधीन विवाद',
    'btn.filter_waived': 'माफ किया गया',
    'btn.close': 'बंद करें',
    'btn.submit': 'जमा करें',
    'btn.search': 'खोजें',
    'btn.dispatch_intercept': 'पुलिस गश्ती दल भेजें',

    // Status Badges
    'status.normal': 'सामान्य नियम पालन',
    'status.overspeed': 'अति-गति उल्लंघन',
    'status.emergency': 'प्राथमिकता आपातकालीन',
    'status.stolen': 'जांच अधीन वाहन',
    'status.paid': 'भुगतान पूर्ण',
    'status.unpaid': 'भुगतान शेष',
    'status.in_dispute': 'विवाद दर्ज',
    'status.waived': 'माफ किया गया (₹0)',

    // e-Challan Desk
    'challan.title': 'इलेक्ट्रॉनिक चालान (ई-चालान) प्रवर्तन एवं पंजीयन डेस्क',
    'challan.subtitle': 'मोटर वाहन अधिनियम 1988/2019 की धारा 133 / 200 के अंतर्गत वैधानिक शक्तियां',
    'challan.form_title': 'सीधा ई-चालान जारी करें (अधिकारी प्रवर्तन)',
    'challan.plate_label': 'वाहन पंजीकरण संख्या (गाड़ी नंबर)',
    'challan.offense_label': 'वैधानिक अपराध धारा (मोटर वाहन अधिनियम)',
    'challan.penalty_label': 'जुर्माना राशि (रुपये ₹)',
    'challan.corridor_label': 'राजमार्ग सड़क कॉरिडोर',
    'challan.location_label': 'सटीक चेकपॉइंट स्थान',
    'challan.camera_label': 'रडार / कैमरा साक्ष्य स्रोत',
    'challan.remarks_label': 'प्रवर्तन अधिकारी टिप्पणी',
    'challan.submit_btn': 'ई-चालान बनाएं एवं एसएमएस सूचना भेजें',
    'challan.ledger_title': 'राज्य ई-चालान प्रवर्तन बहीखाता',

    // Parivahan RC
    'rc.title': 'वाहन पंजीकरण प्रमाण पत्र (RC) एवं पूर्ण विवरण खोज',
    'rc.subtitle': 'परिवहन वाहन 4.0 राष्ट्रीय वाहन डेटाबेस एवं डिजिटल स्मार्ट कार्ड',
    'rc.owner_info': 'पंजीकृत वाहन स्वामी विवरण',
    'rc.owner_name': 'स्वामी का पूरा नाम',
    'rc.father_name': 'पिता / पति का नाम',
    'rc.address': 'पंजीकृत स्थायी पता',
    'rc.mobile': 'पंजीकृत मोबाइल नंबर',
    'rc.tech_specs': 'वाहन की तकनीकी विशेषताएं',
    'rc.make_model': 'ब्रांड एवं मॉडल',
    'rc.maker': 'निर्माता कंपनी',
    'rc.class': 'वाहन श्रेणी',
    'rc.fuel': 'ईंधन प्रकार',
    'rc.norms': 'उत्सर्जन मानक',
    'rc.chassis': 'चेसिस नंबर',
    'rc.engine': 'इंजन नंबर',
    'rc.validity': 'वैधानिक दस्तावेज एवं वैधता',
    'rc.fitness': 'फिटनेस प्रमाण पत्र वैधता',
    'rc.insurance': 'बीमा कंपनी एवं पॉलिसी',
    'rc.pucc': 'प्रदूषण नियंत्रण (PUCC)',
    'rc.challans_summary': 'इस वाहन पर कुल दर्ज चालानों का इतिहास',

    // Target Surveillance Radar
    'surveillance.title': 'लाइव वाहन ट्रैकिंग एवं इंटरसेप्ट रडार एचयूडी',
    'surveillance.subtitle': 'वास्तविक समय राजमार्ग टेलीमेट्री एवं चेकपॉइंट पूर्वानुमान',
    'surveillance.radar_locked': 'रडार द्वारा वाहन ट्रैक किया जा रहा है',
    'surveillance.live_speed': 'वर्तमान गति',
    'surveillance.heading': 'दिशा कोण',
    'surveillance.checkpoint_prediction': 'आगामी चेकपॉइंट इंटरसेप्ट पूर्वानुमान',
    'surveillance.next_checkpoint': 'अनुमानित अगला जंक्शन चेकपॉइंट',
    'surveillance.recommended_unit': 'संबंधित गश्ती वाहन यूनिट',

    // Theme & Lang
    'theme.toggle': 'थीम बदलें (लाइट / डार्क)',
    'lang.toggle': 'Change Language (English/हिन्दी)',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('sarthi_lang');
    return saved === 'hi' ? 'hi' : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sarthi_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
