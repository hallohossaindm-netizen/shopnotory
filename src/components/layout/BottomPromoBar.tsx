import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, ArrowRight, X } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const BottomPromoBar: React.FC = () => {
  const { settings, updateSettings } = useShop();
  const [dismissed, setDismissed] = useState(false);

  if (!settings.adEnabled || dismissed || !settings.adText) {
    return null;
  }

  return (
    <aside
      aria-label="বিজ্ঞাপন ও বিশেষ অফার"
      className="fixed bottom-14 md:bottom-0 inset-x-0 z-30 bg-[#143d2b] text-white border-t border-[#295c43] px-4 py-2.5 shadow-2xl backdrop-blur-md font-bengali transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="bg-[#b8d56d] text-[#10271b] text-[10px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 shadow-2xs">
            <Megaphone className="w-3 h-3 text-[#10271b]" /> বিশেষ অফার
          </span>
          <p className="font-medium truncate text-[#f2f7f4] text-xs sm:text-sm">
            {settings.adText}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to={settings.adLink || '/shop'}
            className="bg-[#b8d56d] hover:bg-[#c9e879] text-[#10271b] px-3.5 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 shadow-2xs active:scale-95"
          >
            কালেকশন দেখুন <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="text-[#a3b6ab] hover:text-white p-1 rounded-full hover:bg-white/10 transition"
            aria-label="বিজ্ঞাপন বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
