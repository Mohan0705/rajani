import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { getGeneralWhatsAppUrl } from '../lib/whatsapp';

export const WhatsAppStickyCTA: React.FC<{ onOpenModal?: () => void }> = ({ onOpenModal }) => {
  const { settings } = useSettings();
  const waUrl = getGeneralWhatsAppUrl(settings);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-[#F9F7F2]/95 border-t border-[#E5E1D8] backdrop-blur-md sm:hidden shadow-md">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-[#1A1A1A] active:bg-[#C5A059] text-white font-bold py-3 px-4 rounded-sm flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest shadow-2xs transition-all"
        >
          <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>WhatsApp Consultation</span>
        </a>

        {onOpenModal && (
          <button
            onClick={onOpenModal}
            className="bg-[#C5A059] text-white font-bold py-3 px-4 rounded-sm text-[10px] uppercase tracking-widest border border-[#C5A059] shrink-0"
          >
            Form
          </button>
        )}
      </div>
    </div>
  );
};
