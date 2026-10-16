import React from 'react';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans font-bengali space-y-8">
      <div className="bg-[#f5f2e8] rounded-3xl p-6 sm:p-8 border border-[#e8e4d8] text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-[#e3ecda] text-[#1b4332] flex items-center justify-center mx-auto mb-2">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#143d2b]">গোপনীয়তা নীতি (Privacy Policy)</h1>
        <p className="text-xs text-[#666b60]">আপনার তথ্যের সুরক্ষা ও গোপনীয়তা আমাদের সর্বোচ্চ অগ্রাধিকার</p>
      </div>

      <div className="bg-white rounded-3xl border border-[#ede9de] p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-[#4d5648] leading-relaxed shadow-xs">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#143d2b] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#387c53]" /> ১. সংগৃহীত তথ্য
          </h2>
          <p>
            ShopnoTory ওয়েবসাইট ব্যবহারের সময় অর্ডার ডেলিভারির সুবিধার্থে আমরা আপনার নাম, ফোন নম্বর, ডেলিভারি ঠিকানা ও ইমেইল সংরক্ষণ করি। আমরা কখনো কোনো অপ্রয়োজনীয় ব্যক্তিগত তথ্য সংগ্রহ করি না।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#143d2b] flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#387c53]" /> ২. তথ্যের ব্যবহার
          </h2>
          <p>
            সংগৃহীত তথ্য কেবল আপনার অর্ডার নিশ্চিতকরণ, ডেলিভারি সম্পন্নকরণ এবং কাস্টমার সাপোর্ট প্রদানের জন্য ব্যবহৃত হয়। কোনো তৃতীয় পক্ষের কাছে আমরা আপনার তথ্য বিক্রয় বা প্রচার করি না।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#143d2b] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#387c53]" /> ৩. পেমেন্ট নিরাপত্তা
          </h2>
          <p>
            ক্যাশ অন ডেলিভারি এবং মোবাইল ব্যাংকিংয়ের ক্ষেত্রে সমস্ত লেনদেন অত্যন্ত সুরক্ষিতভাবে সম্পন্ন হয়। আমরা কোনো কার্ড পিন বা ব্যক্তিগত পাসওয়ার্ড সংরক্ষণ করি না।
          </p>
        </section>
      </div>
    </div>
  );
};
