import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Sparkles, Award, ArrowRight, CheckCircle2 } from 'lucide-react';

export const OurStoryPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-sans space-y-12">
      
      {/* 1. Brand Story Hero Banner (Reference Image Style) */}
      <div className="bg-[#f5f2e8] rounded-3xl p-6 sm:p-12 border border-[#e8e4d8] font-bengali relative overflow-hidden">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e3ecda] text-[#1b4332] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#387c53]" /> আমাদের পরিচয় ও দর্শন
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-[#143d2b] tracking-tight">
              আমাদের গল্প
            </h1>
            <p className="text-sm sm:text-lg text-[#525a4c] font-medium leading-relaxed">
              একটি স্বপ্ন থেকে শুরু, আজ হাজারো মানুষের আস্থার ঠিকানা।
            </p>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-[#1b4332] text-[#b8d56d] flex flex-col items-center justify-center p-4 shadow-xl border-4 border-white rotate-2 hover:rotate-0 transition-transform">
              <span className="font-serif-brand text-5xl font-bold">S</span>
              <span className="text-xs uppercase tracking-widest text-white font-bold mt-1">ShopnoTory</span>
              <span className="text-[9px] text-[#b8d56d] font-bengali">স্বপ্নের কেনাকাটা</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Story Narrative & Visual Polaroid */}
      <div className="grid lg:grid-cols-12 gap-10 items-center font-bengali">
        
        {/* Story Text */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ede9de] shadow-2xs space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#143d2b] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#387c53]" />
              স্বপ্নটা কিভাবে শুরু?
            </h2>
            <p className="text-sm text-[#4d5648] leading-relaxed">
              ShopnoTory শুরু হয়েছিল একটি ছোট স্বপ্ন থেকে — ভালো মানের পণ্য, ন্যায্য দাম এবং বিশ্বস্ত সেবা যেন দেশের প্রতিটি মানুষ সহজে পায়। আমরা বিশ্বাস করি, কেনাকাটা কেবল লেনদেন নয়, এটি একটি আস্থা ও আনন্দের অভিজ্ঞতা।
            </p>
            <p className="text-sm text-[#4d5648] leading-relaxed">
              অনলাইন শপিং নিয়ে ক্রেতাদের নানা দ্বিধাদ্বন্দ্ব দূর করতে আমরা নিয়ে এসেছি সরাসরি ক্যাশ অন ডেলিভারি, পণ্য হাতে পেয়ে যাচাইয়ের সুবিধা এবং বন্ধুত্বপূর্ণ কাস্টমার সাপোর্ট।
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ede9de] shadow-2xs space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#143d2b] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#387c53]" />
              আমাদের লক্ষ্য ও প্রতিশ্রুতি
            </h2>
            <p className="text-sm text-[#4d5648] leading-relaxed">
              সবার কাছে নির্ভরযোগ্য ও পরিপাটি ফ্যাশন ও লাইফস্টাইল পণ্য পৌঁছে দেওয়া, যাতে প্রত্যেকেই তাঁর পছন্দের জিনিসটি সহজে খুঁজে পান। প্রতিটি পার্সেল যেন ক্রেতার মুখে একটুখানি হাসি ফুটিয়ে তোলে — এটাই ShopnoTory-এর আসল সার্থকতা।
            </p>
          </div>
        </div>

        {/* Visual Polaroid / Lifestyle Art */}
        <div className="lg:col-span-5">
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#ede9de] shadow-xl rotate-1 hover:rotate-0 transition-transform">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 relative">
              <img
                src="https://images.unsplash.com/photo-1514228742587-6b1558f8402d?auto=format&fit=crop&w=900&q=85"
                alt="Our Journey"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5">
                <div className="text-white font-serif-brand">
                  <p className="text-lg italic font-bold">Dreams, Shop,</p>
                  <p className="text-sm text-[#b8d56d]">Grow Together ♡</p>
                </div>
              </div>
            </div>
            <p className="text-center text-xs font-bold text-[#143d2b] mt-3 font-bengali">
              ShopnoTory — ভালোবাসা ও যত্নে গড়া প্রতিটি পণ্য
            </p>
          </div>
        </div>
      </div>

      {/* 3. Four Value Pillars (Matching Reference Image) */}
      <div className="bg-white rounded-3xl border border-[#ede9de] p-6 sm:p-10 shadow-xs font-bengali">
        <h3 className="text-center text-xl font-bold text-[#143d2b] mb-8">
          যে ৪টি নীতিতে আমরা বিশ্বাস করি
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          
          <div className="space-y-2 p-4 rounded-2xl bg-[#fbfaf7] border border-[#ede9de]">
            <div className="w-12 h-12 rounded-full bg-[#e3ecda] text-[#1b4332] flex items-center justify-center mx-auto font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-[#143d2b]">উন্নত মান</h4>
            <p className="text-xs text-[#666b60]">সেরা ফ্যাব্রিক ও নিখুঁত ফিনিশিংয়ের নিশ্চয়তা</p>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-[#fbfaf7] border border-[#ede9de]">
            <div className="w-12 h-12 rounded-full bg-[#e3ecda] text-[#1b4332] flex items-center justify-center mx-auto font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-[#143d2b]">বিশ্বাস</h4>
            <p className="text-xs text-[#666b60]">ক্যাশ অন ডেলিভারি ও শতভাগ স্বচ্ছতা</p>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-[#fbfaf7] border border-[#ede9de]">
            <div className="w-12 h-12 rounded-full bg-[#e3ecda] text-[#1b4332] flex items-center justify-center mx-auto font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-[#143d2b]">সন্তুষ্টি</h4>
            <p className="text-xs text-[#666b60]">ক্রেতার সর্বোচ্চ সন্তুষ্টিই মূল লক্ষ্য</p>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-[#fbfaf7] border border-[#ede9de]">
            <div className="w-12 h-12 rounded-full bg-[#e3ecda] text-[#1b4332] flex items-center justify-center mx-auto font-bold">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            </div>
            <h4 className="font-bold text-sm text-[#143d2b]">ভালোবাসা</h4>
            <p className="text-xs text-[#666b60]">হাতে গোনা প্রতিটি পণ্য পরম যত্নে প্যাক করা</p>
          </div>
        </div>

        {/* CTA to Shop */}
        <div className="text-center pt-10">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold shadow-md transition active:scale-95"
          >
            <span>আমাদের শপ কালেকশন দেখুন</span>
            <ArrowRight className="w-4 h-4 text-[#b8d56d]" />
          </Link>
        </div>
      </div>
    </div>
  );
};
