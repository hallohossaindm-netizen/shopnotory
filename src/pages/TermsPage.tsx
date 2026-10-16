import React from 'react';
import { Scale, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans font-bengali space-y-8">
      <div className="bg-[#f5f2e8] rounded-3xl p-6 sm:p-8 border border-[#e8e4d8] text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-[#e3ecda] text-[#1b4332] flex items-center justify-center mx-auto mb-2">
          <Scale className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#143d2b]">শর্তাবলী ও নিয়মাবলী (Terms & Conditions)</h1>
        <p className="text-xs text-[#666b60]">ShopnoTory-তে কেনাকাটা করার সাধারণ নিয়মাবলি</p>
      </div>

      <div className="bg-white rounded-3xl border border-[#ede9de] p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-[#4d5648] leading-relaxed shadow-xs">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#143d2b] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#387c53]" /> ১. অর্ডার প্রক্রিয়া ও নিশ্চয়তা
          </h2>
          <p>
            অর্ডার করার পর আমাদের প্রতিনিধি আপনার নম্বরে ফোন করে অর্ডার ও ঠিকানা ভেরিফাই করবেন। কনফার্মেশনের পর পণ্যটি ডেলিভারি পার্টনারের কাছে হস্তান্তর করা হবে।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#143d2b] flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-[#387c53]" /> ২. রিটার্ন ও রিপ্লেসমেন্ট পলিসি
          </h2>
          <p>
            ডেলিভারি ম্যানের উপস্থিতিতে পণ্য দেখে নিতে অনুরোধ করা হচ্ছে। পণ্য ক্ষতিগ্রস্ত বা ভুল সাইজ হলে ৭ দিনের মধ্যে ছবিসহ আমাদের হেল্পলাইনে জানালে ফ্রিতে রিপ্লেসমেন্ট প্রদান করা হবে।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#143d2b] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#387c53]" /> ৩. মূল্য ও স্টক পরিবর্তন
          </h2>
          <p>
            পণ্য প্রাপ্তি সাপেক্ষে মূল্য ও স্টক পরিবর্তনের অধিকার ShopnoTory সংরক্ষণ করে। কোনো অর্ডার গ্রহণের পর স্টক সংকট দেখা দিলে দ্রুত গ্রাহককে অবহিত করা হবে।
          </p>
        </section>
      </div>
    </div>
  );
};
