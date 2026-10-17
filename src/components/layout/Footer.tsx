import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Clock, MapPin, ShieldCheck, Heart, MessageCircle } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const Footer: React.FC = () => {
  const { settings } = useShop();

  return (
    <footer className="bg-[#10271b] text-[#ded9cb] pt-14 pb-20 md:pb-14 border-t border-[#1d4430] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-[#214a36]">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[#b8d56d] rounded-xl flex items-center justify-center font-serif-brand font-bold text-xl text-[#10271b]">
                S
              </div>
              <div>
                <span className="font-black text-xl text-white tracking-tight">
                  Shopno<span className="text-[#b8d56d]">Tory</span>
                </span>
                <span className="text-[10px] block text-[#8ea496] font-semibold tracking-widest uppercase">
                  Dreams in Every Purchase
                </span>
              </div>
            </Link>

            <p className="text-xs text-[#a3b6ab] leading-relaxed font-bengali">
              ShopnoTory — যেখানে মান, আস্থা ও স্টাইল একসাথে মিলে আপনার জন্য। আপনার প্রতিটি পছন্দে সেরা অভিজ্ঞতা দেওয়াই আমাদের ব্রত।
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs text-[#b8d56d] font-bengali">
              <ShieldCheck className="w-4 h-4" /> ১০০% অরিজিনাল ও ভেরিফাইড পণ্য
            </div>
          </div>

          {/* Quick Links */}
          <div className="font-bengali">
            <h4 className="text-white font-bold text-sm mb-3.5 tracking-wide">কুইক লিংকস</h4>
            <ul className="space-y-2 text-xs text-[#a3b6ab]">
              <li>
                <Link to="/" className="hover:text-[#b8d56d] transition">হোম পেজ</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#b8d56d] transition">শপ কালেকশন</Link>
              </li>
              <li>
                <Link to="/our-story" className="hover:text-[#b8d56d] transition">আমাদের গল্প</Link>
              </li>
              <li>
                <Link to="/why-shoptory" className="hover:text-[#b8d56d] transition">কেন ShopnoTory</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#b8d56d] transition">যোগাযোগ করুন</Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-[#b8d56d] transition">অ্যাডমিন লগইন</Link>
              </li>
            </ul>
          </div>

          {/* Policies & Assistance */}
          <div className="font-bengali">
            <h4 className="text-white font-bold text-sm mb-3.5 tracking-wide">পলিসি ও সহায়তা</h4>
            <ul className="space-y-2 text-xs text-[#a3b6ab]">
              <li>
                <Link to="/orders" className="hover:text-[#b8d56d] transition">অর্ডার ট্র্যাকিং</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#b8d56d] transition">শপিং ব্যাগ</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-[#b8d56d] transition">গোপনীয়তা নীতি</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#b8d56d] transition">শর্তাবলী ও নিয়মাবলী</Link>
              </li>
              <li>
                <Link to="/why-shoptory" className="hover:text-[#b8d56d] transition">সহজ রিটার্ন পলিসি</Link>
              </li>
            </ul>
          </div>

          {/* Customer Care & Address */}
          <div className="font-bengali">
            <h4 className="text-white font-bold text-sm mb-3.5 tracking-wide">কাস্টমার সাপোর্ট</h4>
            <ul className="space-y-2.5 text-xs text-[#a3b6ab]">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#b8d56d] shrink-0 mt-0.5" />
                <div>
                  <a href={`tel:${settings.supportPhone || '01845805713'}`} className="text-white font-bold hover:text-[#b8d56d]">
                    {settings.supportPhone || '01845805713'}
                  </a>
                  <p className="text-[10px] text-[#8ea496]">{settings.supportHours}</p>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <a
                  href={`https://wa.me/8801845805713?text=${encodeURIComponent('আসসালামু আলাইকুম, ShopnoTory থেকে সাহায্য চাই।')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#25D366] font-semibold text-white"
                >
                  WhatsApp: 01845805713
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#b8d56d] shrink-0" />
                <a href={`mailto:${settings.supportEmail}`} className="hover:text-[#b8d56d]">
                  {settings.supportEmail}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#b8d56d] shrink-0 mt-0.5" />
                <span>{settings.businessAddress}</span>
              </li>
            </ul>

            <div className="pt-3">
              <p className="text-[11px] text-[#8ea496] mb-1.5 font-bold">নিরাপদ পেমেন্ট মেথড</p>
              <div className="flex flex-wrap gap-1.5 text-[9px] font-bold">
                <span className="bg-[#1a3827] text-white px-2 py-0.5 rounded">ক্যাশ অন ডেলিভারি</span>
                <span className="bg-pink-900/70 text-pink-200 px-2 py-0.5 rounded">bKash</span>
                <span className="bg-amber-900/70 text-amber-200 px-2 py-0.5 rounded">Nagad</span>
                <span className="bg-emerald-900/70 text-emerald-200 px-2 py-0.5 rounded">Cards</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8ea496] font-bengali">
          <p>© {new Date().getFullYear()} ShopnoTory (স্বপ্নতরি). সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> in Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
};
