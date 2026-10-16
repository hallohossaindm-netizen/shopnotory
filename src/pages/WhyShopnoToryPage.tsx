import React from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  CircleDollarSign,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const WhyShopnoToryPage: React.FC = () => {
  const benefits = [
    {
      title: 'প্রিমিয়াম কোয়ালিটি',
      desc: 'আমরা সরাসরি বিশ্বস্ত প্রস্তুতকারক থেকে প্রতিটি পণ্য সংগ্রহ করি এবং নিজস্ব কোয়ালিটি কন্ট্রোল টিম দ্বারা প্রতিটি পণ্যের মান ১০০% নিশ্চিত করি।',
      icon: Award,
      badge: '১০০% আসল'
    },
    {
      title: 'সাশ্রয়ী দাম',
      desc: 'কোনো মধ্যস্বত্বভোগী ছাড়া সরাসরি সেরা দামে সেরা পণ্য পৌঁছে দেওয়া আমাদের প্রধান লক্ষ্য, যাতে আপনার বাজেটের মধ্যে সেরা জিনিস পান।',
      icon: CircleDollarSign,
      badge: 'ন্যায্য মূল্য'
    },
    {
      title: 'নিরাপদ পেমেন্ট',
      desc: 'ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে মূল্য পরিশোধ) ছাড়াও বিকাশ ও নগদ মাধ্যমে সম্পূর্ণ নিরাপদ ও ঝামেলাহীন লেনদেনের সুবিধা।',
      icon: ShieldCheck,
      badge: 'COD সুবিধা'
    },
    {
      title: 'দ্রুত ডেলিভারি',
      desc: 'সারা বাংলাদেশের ৬৪টি জেলায় নির্ভরযোগ্য কুরিয়ার নেটওয়ার্কের মাধ্যমে ৪৮ থেকে ৭২ ঘণ্টার মধ্যে আপনার ঠিকানায় পার্সেল পৌঁছে দেওয়া হয়।',
      icon: Truck,
      badge: 'দেশজুড়ে হোম ডেলিভারি'
    },
    {
      title: 'সহজ রিটার্ন নীতি',
      desc: 'পণ্য পছন্দ না হলে বা কোনো সমস্যা থাকলে ডেলিভারি ম্যানের উপস্থিতিতেই সরাসরি রিটার্ন কিংবা ৭ দিনের ভেতরে সহজ রিপ্লেসমেন্ট সাপোর্ট।',
      icon: RotateCcw,
      badge: 'ঝামেলাহীন রিটার্ন'
    },
    {
      title: '২৪/৭ কাস্টমার সাপোর্ট',
      desc: 'অর্ডার ট্র্যাকিং, সাইজ নির্বাচন কিংবা যেকোনো জিজ্ঞাসা — আমাদের আন্তরিক সাপোর্ট টিম সকাল থেকে রাত পর্যন্ত আপনার সহায়তায় সদা প্রস্তুত।',
      icon: Headphones,
      badge: 'বন্ধুত্বপূর্ণ সেবা'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-sans space-y-12">
      
      {/* 1. Header Banner (Reference Image Screen 4 Style) */}
      <div className="bg-[#f5f2e8] rounded-3xl p-6 sm:p-12 border border-[#e8e4d8] font-bengali text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e3ecda] text-[#1b4332] text-xs font-bold mx-auto">
          <Sparkles className="w-3.5 h-3.5 text-[#387c53]" /> আমাদের স্বাতন্ত্র্য ও বিশেষত্ব
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#143d2b] tracking-tight">
          কেন ShopnoTory?
        </h1>
        <p className="text-sm sm:text-base text-[#525a4c] max-w-lg mx-auto">
          আপনার প্রতিটি কেনাকাটার সঠিক, নির্ভরযোগ্য ও আনন্দের সঙ্গী
        </p>
      </div>

      {/* 2. Six Benefit Cards Grid (Exact 3x2 Grid from Reference Image) */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 font-bengali">
        {benefits.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-[#ede9de] p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#eef4ea] text-[#1b4332] group-hover:bg-[#1b4332] group-hover:text-[#b8d56d] transition-colors flex items-center justify-center font-bold">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold bg-[#f5f2e8] text-[#143d2b] px-2.5 py-1 rounded-full border border-[#ede9de]">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#143d2b] group-hover:text-[#387c53] transition">
                  {item.title}
                </h3>

                <p className="text-xs text-[#525a4c] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-[#f5f2e8] flex items-center gap-1 text-[11px] font-bold text-[#387c53]">
                <CheckCircle2 className="w-3.5 h-3.5" /> শতভাগ প্রতিশ্রুত মান
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Bottom Trust Summary & CTA */}
      <div className="bg-[#143d2b] text-white rounded-3xl p-8 sm:p-12 text-center space-y-4 font-bengali shadow-xl">
        <h3 className="text-2xl sm:text-3xl font-black">
          আপনার কেনাকাটায় আনুন স্বস্তি ও নতুনত্ব
        </h3>
        <p className="text-xs sm:text-sm text-[#b8ccbf] max-w-xl mx-auto leading-relaxed">
          কোনো অগ্রিম পেমেন্ট ছাড়াই সারা দেশে ক্যাশ অন ডেলিভারি অর্ডারের সুবিধা।
          পণ্য পছন্দ হলে তবেই মূল্য পরিশোধ করুন।
        </p>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#b8d56d] hover:bg-[#c9e879] text-[#10271b] px-8 py-3.5 rounded-full text-xs sm:text-sm font-black shadow-md transition active:scale-95"
          >
            <span>এখনই শপ কালেকশন দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
