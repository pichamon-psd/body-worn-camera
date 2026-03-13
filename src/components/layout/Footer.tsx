import { Camera } from 'lucide-react';
import { translations, type Language } from '../../data/translations';

interface FooterProps {
  language: Language;
  darkMode: boolean;
}

export function Footer({ language, darkMode }: FooterProps) {
  const t = translations[language];

  return (
    <footer className={`mt-12 border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-[#0c274b] to-blue-800 rounded-lg flex items-center justify-center shadow-md">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-[#0c274b]'}`}>
                Body Worn Camera Control System
              </p>
            </div>
          </div>
          
          <div className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>Powered by {t.copyright}</p>
          </div>

        </div>
      </div>
    </footer>
  );
}