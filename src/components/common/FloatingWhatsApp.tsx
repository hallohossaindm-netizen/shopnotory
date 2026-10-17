import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useShop();
  const phone = settings.supportPhone || '01845805713';
  const cleanNumber = phone.replace(/[^0-9]/g, '');
  const waNumber = cleanNumber.startsWith('880') ? cleanNumber : cleanNumber.startsWith('0') ? '88' + cleanNumber : cleanNumber;

  return (
    <aside aria-label="হোয়াটসঅ্যাপে যোগাযোগ">
      <a
        href={`https://wa.me/${waNumber}?text=${encodeURIComponent('আসসালামু আলাইকুম, ShopnoTory থেকে পণ্য অর্ডার বা সহায়তা পেতে চাই।')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 md:bottom-6 right-4 z-40 flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-3.5 py-2.5 rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group font-bengali text-xs font-bold"
        title="হোয়াটসঅ্যাপে সরাসরি যোগাযোগ করুন"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
        </div>
        <span className="hidden sm:inline-block font-semibold">হোয়াটসঅ্যাপ চ্যাট</span>
      </a>
    </aside>
  );
};
