import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ContactPage: React.FC = () => {
  const { settings, showToast } = useShop();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim() || (!form.email.trim() && !form.phone.trim())) {
      showToast('অনুগ্রহ করে নাম, বার্তা এবং ইমেইল অথবা ফোন নম্বর প্রদান করুন');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      showToast('ধন্যবাদ! আপনার বার্তা সফলভাবে পাঠানো হয়েছে ✨');
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-sans space-y-12">
      
      {/* 1. Header Banner (Reference Image Screen 5 Style) */}
      <div className="bg-[#f5f2e8] rounded-3xl p-6 sm:p-12 border border-[#e8e4d8] font-bengali text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e3ecda] text-[#1b4332] text-xs font-bold mx-auto">
          <MessageCircle className="w-3.5 h-3.5 text-[#387c53]" /> আমরা সবসময় পাশে আছি
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#143d2b] tracking-tight">
          যোগাযোগ করুন
        </h1>
        <p className="text-sm sm:text-base text-[#525a4c] max-w-md mx-auto">
          আপনার যেকোনো জিজ্ঞাসা, পরামর্শ কিংবা অর্ডারের বিষয়ে আমরা শুনতে প্রস্তুত।
        </p>
      </div>

      {/* 2. Contact Information & Message Form Grid */}
      <div className="grid lg:grid-cols-12 gap-8 sm:gap-10 font-bengali">
        
        {/* Left Side: Contact Information Cards */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl border border-[#ede9de] p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-[#143d2b] border-b border-[#f2efe6] pb-3">
              যোগাযোগের মাধ্যম
            </h2>

            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#eef4ea] text-[#1b4332] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wide">আমাদের ঠিকানা</h3>
                  <p className="text-xs sm:text-sm font-semibold text-[#143d2b] mt-0.5">
                    {settings.businessAddress}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#eef4ea] text-[#1b4332] flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wide">ইমেইল</h3>
                  <a
                    href={`mailto:${settings.supportEmail}`}
                    className="text-xs sm:text-sm font-semibold text-[#143d2b] hover:text-[#387c53] mt-0.5 block"
                  >
                    {settings.supportEmail}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#eef4ea] text-[#1b4332] flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wide">হটলাইন ও ফোন</h3>
                  <a
                    href={`tel:${settings.supportPhone}`}
                    className="text-xs sm:text-sm font-semibold text-[#143d2b] hover:text-[#387c53] mt-0.5 block"
                  >
                    {settings.supportPhone}
                  </a>
                  <p className="text-[10px] text-stone-400 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {settings.supportHours}
                  </p>
                </div>
              </div>
            </div>

            {/* Simulated Interactive Map Pin Card */}
            <div className="rounded-2xl overflow-hidden border border-[#e8e4d8] bg-[#f5f2e8] p-4 text-center space-y-2">
              <div className="w-12 h-12 bg-white text-[#1b4332] rounded-full flex items-center justify-center mx-auto shadow-xs">
                <MapPin className="w-6 h-6 text-[#387c53] animate-bounce" />
              </div>
              <p className="text-xs font-bold text-[#143d2b]">ধানমন্ডি আউটলেট ও ডিসপ্যাচ সেন্টার</p>
              <p className="text-[11px] text-[#666b60]">ঢাকা ও সারা বাংলাদেশের পার্সেল প্রস্তুতকরণ কেন্দ্র</p>
            </div>
          </div>
        </div>

        {/* Right Side: Message Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-[#ede9de] p-6 sm:p-8 shadow-xs">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#eef4ea] text-[#1b4332] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-[#387c53]" />
                </div>
                <h3 className="text-xl font-bold text-[#143d2b]">বার্তা পাঠানো হয়েছে!</h3>
                <p className="text-xs sm:text-sm text-[#525a4c] max-w-md mx-auto">
                  ধন্যবাদ, {form.name}। আমাদের প্রতিনিধি দ্রুততম সময়ের মধ্যে আপনার সাথে যোগাযোগ করবে।
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
                  }}
                  className="px-6 py-2.5 bg-[#1b4332] text-white rounded-full text-xs font-bold hover:bg-[#2d6a4f] transition"
                >
                  আরেকটি বার্তা পাঠান
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-lg font-bold text-[#143d2b] border-b border-[#f2efe6] pb-3">
                  বার্তা পাঠান
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#444c3f] mb-1">
                      আপনার নাম *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="যেমন: তানজিলা হক"
                      className="w-full bg-[#fbfaf7] border border-[#d8d3c5] rounded-xl px-3.5 py-2.5 text-xs text-[#1c211a] focus:outline-none focus:border-[#1b4332]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#444c3f] mb-1">
                      ইমেইল ঠিকানা
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full bg-[#fbfaf7] border border-[#d8d3c5] rounded-xl px-3.5 py-2.5 text-xs text-[#1c211a] focus:outline-none focus:border-[#1b4332]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#444c3f] mb-1">
                      মোবাইল নম্বর
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="01XXXXXXXXX"
                      className="w-full bg-[#fbfaf7] border border-[#d8d3c5] rounded-xl px-3.5 py-2.5 text-xs text-[#1c211a] focus:outline-none focus:border-[#1b4332]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#444c3f] mb-1">
                      বিষয়
                    </label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      placeholder="যেমন: পণ্য বা ডেলিভারি সংক্রান্ত"
                      className="w-full bg-[#fbfaf7] border border-[#d8d3c5] rounded-xl px-3.5 py-2.5 text-xs text-[#1c211a] focus:outline-none focus:border-[#1b4332]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#444c3f] mb-1">
                    আপনার বার্তা *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="আপনার বার্তা বা প্রশ্নটি বিস্তারিত লিখুন..."
                    className="w-full bg-[#fbfaf7] border border-[#d8d3c5] rounded-xl px-3.5 py-2.5 text-xs text-[#1c211a] focus:outline-none focus:border-[#1b4332]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-7 py-3 rounded-full text-xs font-bold shadow-md transition active:scale-95 disabled:opacity-70"
                >
                  <Send className="w-3.5 h-3.5 text-[#b8d56d]" />
                  <span>{loading ? 'বার্তা পাঠানো হচ্ছে...' : 'বার্তা পাঠান →'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
