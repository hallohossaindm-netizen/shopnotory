import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Sparkles,
  Star,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/common/ProductCard';
import { categoryList } from '../data/mockData';

export const HomePage: React.FC = () => {
  const { products, setSelectedCategory } = useShop();
  const navigate = useNavigate();

  const featuredProducts = products.filter(p => p.featured && p.active).slice(0, 8);
  const newArrivals = products.filter(p => p.active).slice(0, 4);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    navigate(`/shop?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-12 font-sans">
      
      {/* 1. HERO SECTION (Exact reproduction of Reference Image Top-Left Screen) */}
      <section className="bg-gradient-to-b from-[#f4f1ea] via-[#fbfaf7] to-[#fbfaf7] pt-8 sm:pt-14 pb-12 sm:pb-16 border-b border-[#ece8df]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-6 space-y-5 font-bengali">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e3ecda] border border-[#c6dcb4] text-xs font-bold text-[#1b4332]">
                <Sparkles className="w-3.5 h-3.5 text-[#387c53]" />
                <span>স্বপ্নের কেনাকাটা, এখন আরও সহজ</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black tracking-tight text-[#143d2b] leading-[1.2]">
                আপনার স্বপ্নের পণ্য <br />
                এখন <span className="text-[#387c53]">এক ক্লিকে!</span>
              </h1>

              <p className="text-sm sm:text-base text-[#525a4c] max-w-lg leading-relaxed">
                ShopnoTory — যেখানে মান, আস্থা ও স্টাইল একসাথে মিলে আপনার জন্য।
                সেরা মানের পোশাক, জুতো, ব্যাগ ও ঘর সাজানোর নান্দনিক সব আইটেম ক্যাশ অন ডেলিভারিতে সংগ্রহ করুন।
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2.5 bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-7 py-3.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition active:scale-95"
                >
                  <span>শপ কালেকশন দেখুন</span>
                  <ArrowRight className="w-4 h-4 text-[#b8d56d]" />
                </Link>

                <Link
                  to="/our-story"
                  className="inline-flex items-center gap-2 bg-white hover:bg-[#f3efe6] text-[#1b4332] border border-[#d8d3c5] px-6 py-3.5 rounded-full text-sm font-bold transition active:scale-95"
                >
                  <span>আমাদের গল্প</span>
                </Link>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-4 flex items-center gap-6 text-xs text-[#525a4c]">
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#387c53]" /> ১০০% অথেনটিক
                </span>
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#387c53]" /> সারা দেশে ক্যাশ অন ডেলিভারি
                </span>
              </div>
            </div>

            {/* Hero Right Visual: Editorial Arch & Lifestyle Aesthetic */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-md sm:max-w-lg">
                
                {/* Main Arch Frame */}
                <div className="rounded-[40px] sm:rounded-[48px] overflow-hidden shadow-2xl border-4 sm:border-8 border-white bg-white aspect-[4/3] sm:aspect-[16/12] relative group">
                  <img
                    src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85"
                    alt="ShopnoTory Lifestyle Collection"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Floating Hand-lettered Aesthetic Tag */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-md border border-[#ebe7dc] text-right font-serif-brand">
                    <p className="text-xs italic font-bold text-[#143d2b]">Shop Smart,</p>
                    <p className="text-[10px] text-[#387c53] font-semibold">Live Better ♡</p>
                  </div>

                  {/* Bottom Brand Stamp */}
                  <div className="absolute bottom-5 left-5 right-5 text-white flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-[#b8d56d] font-bold uppercase tracking-widest">
                        CURATED PREMIUM EDIT
                      </p>
                      <p className="text-base sm:text-lg font-bold font-bengali">
                        ছোট ছোট পছন্দে, বড় সুখের গল্প
                      </p>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-[#1b4332]/90 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-center shadow-lg">
                      <span className="font-serif-brand text-lg font-bold text-[#b8d56d]">S</span>
                      <span className="text-[6px] tracking-widest uppercase text-white -mt-1">ShopnoTory</span>
                    </div>
                  </div>
                </div>

                {/* Floating mini card: 2400+ satisfied */}
                <div className="absolute -bottom-4 -left-3 sm:-bottom-6 sm:-left-6 bg-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-[#ede9de] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#e3ecda] text-[#1b4332] flex items-center justify-center font-bold">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#143d2b] font-bengali">২,৪০০+ গ্রাহক</p>
                    <p className="text-[10px] text-[#666b60] font-bengali">সন্তুষ্ট ও নিয়মিত ক্রেতা</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICE BENEFITS ROW (Exact reproduction of 4 Cards from Reference Image) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#ede9de] p-4 sm:p-6 shadow-xs">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 font-bengali">
            
            {/* Benefit 1 */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-[#fbfaf7] transition">
              <div className="w-11 h-11 rounded-2xl bg-[#eef4ea] text-[#1b4332] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#143d2b]">সারা দেশে ডেলিভারি</h4>
                <p className="text-[11px] text-[#666b60] mt-0.5">দ্রুত ও নিরাপদ হোম ডেলিভারি</p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-[#fbfaf7] transition">
              <div className="w-11 h-11 rounded-2xl bg-[#eef4ea] text-[#1b4332] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#143d2b]">নির্ভরযোগ্য পেমেন্ট</h4>
                <p className="text-[11px] text-[#666b60] mt-0.5">COD ও নিরাপদ অনলাইন পেমেন্ট</p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-[#fbfaf7] transition">
              <div className="w-11 h-11 rounded-2xl bg-[#eef4ea] text-[#1b4332] flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#143d2b]">সহজ রিটার্ন</h4>
                <p className="text-[11px] text-[#666b60] mt-0.5">নির্দিষ্ট সময়ের মধ্যে ঝামেলাহীন</p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-[#fbfaf7] transition">
              <div className="w-11 h-11 rounded-2xl bg-[#eef4ea] text-[#1b4332] flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#143d2b]">২৪/৭ সাপোর্ট</h4>
                <p className="text-[11px] text-[#666b60] mt-0.5">আপনাদের পাশে সব সময়</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. POPULAR CATEGORIES (Exact reproduction of Reference Image Screen 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-bengali">
        <div className="flex items-center justify-between pb-6 border-b border-[#ede9de]">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#143d2b]">জনপ্রিয় ক্যাটাগরি</h2>
            <p className="text-xs text-[#666b60] mt-0.5">আপনার পছন্দের বিভাগটি বেছে নিন</p>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-bold text-[#1b4332] hover:text-[#387c53] flex items-center gap-1 transition"
          >
            <span>সব ক্যাটাগরি দেখুন</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-6 pt-6">
          {categoryList.map(cat => (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className="group flex flex-col items-center text-center space-y-2.5 p-2 rounded-2xl hover:bg-white hover:shadow-md transition duration-300"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[#d8d3c5] group-hover:border-[#1b4332] shadow-xs group-hover:scale-105 transition-all duration-300 bg-stone-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#143d2b] group-hover:text-[#387c53] transition">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-[#787f73]">{cat.count}+ পণ্য</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. PROMOTIONAL DISCOUNT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#143d2b] to-[#245e3f] text-white p-6 sm:p-10 shadow-xl relative overflow-hidden font-bengali">
          <div className="relative z-10 max-w-xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#b8d56d] text-[#10271b] text-xs font-black">
              <Tag className="w-3.5 h-3.5" /> স্পেশাল প্রমো কোড: SHOPNO10
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug">
              নতুন সিজনের কেনাকাটায় <br />
              <span className="text-[#b8d56d]">১০% নিশ্চিত ছাড়!</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#c8d9ce] leading-relaxed">
              আপনার পছন্দের যেকোনো পণ্য অর্ডারে প্রোমোকোড ব্যবহার করে তাৎক্ষণিক ছাড় উপভোগ করুন। সীমিত সময়ের অফার!
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-[#b8d56d] hover:bg-[#c9e879] text-[#10271b] px-6 py-2.5 rounded-full text-xs font-black shadow-md transition active:scale-95"
              >
                এখনই কেনাকাটা করুন <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute right-[-40px] bottom-[-40px] w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute right-20 top-4 text-9xl font-serif-brand font-bold text-white/5 pointer-events-none select-none">
            S
          </div>
        </div>
      </section>

      {/* 5. FEATURED PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-bengali">
        <div className="flex items-center justify-between pb-6 border-b border-[#ede9de]">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#143d2b]">সেরা কালেকশন ও নতুন পণ্য</h2>
            <p className="text-xs text-[#666b60] mt-0.5">সবচেয়ে বেশি বিক্রিত ও জনপ্রিয় সব আইটেম</p>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-bold text-[#1b4332] hover:text-[#387c53] flex items-center gap-1 transition"
          >
            <span>সব পণ্য দেখুন</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 pt-6">
          {featuredProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 6. CUSTOMER TESTIMONIALS / REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-bengali">
        <div className="bg-[#f5f2e8] rounded-3xl p-6 sm:p-10 border border-[#e8e4d8]">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
            <span className="text-xs font-bold text-[#387c53] uppercase tracking-wider">
              গ্রাহকদের আস্থা
            </span>
            <h3 className="text-2xl font-black text-[#143d2b]">আমাদের সন্তুষ্ট ক্রেতাদের মতামত</h3>
            <p className="text-xs text-[#666b60]">
              দেশজুড়ে হাজারো সন্তুষ্ট গ্রাহকের ভালোবাসা আমাদের এগিয়ে চলার শক্তি
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white p-5 rounded-2xl border border-[#ebe7db] shadow-2xs space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#444c3f] leading-relaxed italic">
                "কটন শাড়িটি হাতে পেয়ে মুগ্ধ হয়েছি! ছবির চেয়ে বাস্তবে কাপড় আরও বেশি নরম ও মার্জিত। ডেলিভারিও পেয়েছি মাত্র ২ দিনে।"
              </p>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#143d2b]">নুসরাত জাহান</h4>
                  <p className="text-[10px] text-[#787f73]">উত্তরা, ঢাকা</p>
                </div>
                <span className="text-[10px] bg-[#eef4ea] text-[#1b4332] px-2 py-0.5 rounded-full font-bold">ভেরিফাইড ক্রেতা</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#ebe7db] shadow-2xs space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#444c3f] leading-relaxed italic">
                "পাঞ্জাবি সেটের কাটিং ও স্টিচিং নিখুঁত। কাস্টমার কেয়ার টিমও খুব সহযোগী ছিল। পরবর্তীতে আবার অর্ডার করবো ইনশাআল্লাহ।"
              </p>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#143d2b]">সাইফুল ইসলাম</h4>
                  <p className="text-[10px] text-[#787f73]">জিইসি, চট্টগ্রাম</p>
                </div>
                <span className="text-[10px] bg-[#eef4ea] text-[#1b4332] px-2 py-0.5 rounded-full font-bold">ভেরিফাইড ক্রেতা</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#ebe7db] shadow-2xs space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#444c3f] leading-relaxed italic">
                "লেডিজ শোল্ডার ব্যাগটি দারুণ আকর্ষণীয়। ক্যাশ অন ডেলিভারিতে চেক করে মূল্য দিতে পারায় খুব নিরাপদ লেগেছে।"
              </p>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#143d2b]">ফারহানা রহমান</h4>
                  <p className="text-[10px] text-[#787f73]">সিলেট সদর</p>
                </div>
                <span className="text-[10px] bg-[#eef4ea] text-[#1b4332] px-2 py-0.5 rounded-full font-bold">ভেরিফাইড ক্রেতা</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. NEWSLETTER SECTION */}
      <section className="max-w-3xl mx-auto px-4 text-center space-y-3 font-bengali">
        <h3 className="text-2xl font-black text-[#143d2b]">ভালো কিছুর খবর আগে পান</h3>
        <p className="text-xs text-[#666b60] max-w-md mx-auto">
          নতুন কালেকশন, ছোট সারপ্রাইজ আর এক্সক্লুসিভ অফারের আপডেট সরাসরি আপনার ইনবক্সে।
        </p>

        <form
          onSubmit={e => {
            e.preventDefault();
            alert('ধন্যবাদ! আপনি সফলভাবে সাবস্ক্রাইব করেছেন ✨');
          }}
          className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2"
        >
          <input
            type="email"
            required
            placeholder="আপনার ইমেইল অ্যাড্রেস লিখুন"
            className="flex-1 bg-white border border-[#d8d3c5] rounded-full px-4 py-2.5 text-xs text-[#1c211a] focus:outline-none focus:border-[#1b4332]"
          />
          <button
            type="submit"
            className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-6 py-2.5 rounded-full text-xs font-bold transition shadow-xs active:scale-95"
          >
            সাবস্ক্রাইব ↗
          </button>
        </form>
      </section>
    </div>
  );
};
