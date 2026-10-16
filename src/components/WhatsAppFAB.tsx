import React from 'react';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_URL = 'https://wa.me/201019396921';

export function WhatsAppFAB() {
  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 z-40">
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-3 rounded-full shadow-lg shadow-[#25D366]/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer font-bold text-sm sm:text-base"
        aria-label="تواصل مع الأخصائي عبر واتساب"
      >
        <span className="absolute -inset-0.5 rounded-full bg-[#25D366] opacity-75 blur-sm animate-ping group-hover:opacity-100" />
        <span className="relative flex items-center gap-2">
          <MessageCircle className="w-5 h-5 fill-current" />
          <span>تواصل مع الأخصائي</span>
        </span>
      </a>
    </div>
  );
}
