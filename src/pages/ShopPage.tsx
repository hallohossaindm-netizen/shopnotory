import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  SlidersHorizontal,
  Search,
  X,
  Filter,
  Check,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/common/ProductCard';

export const ShopPage: React.FC = () => {
  const { products, wishlist } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state sync
  const initialCategory = searchParams.get('category') || 'সব';
  const initialSearch = searchParams.get('search') || '';
  const initialFilter = searchParams.get('filter') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchInput, setSearchInput] = useState<string>(initialSearch);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [sortOption, setSortOption] = useState<'popular' | 'price-low' | 'price-high' | 'newest'>('popular');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
    if (initialSearch) setSearchInput(initialSearch);
  }, [initialCategory, initialSearch]);

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return [
      { name: 'সব', count: products.length },
      { name: 'নারী পোশাক', count: counts['নারী পোশাক'] || 24 },
      { name: 'পুরুষ পোশাক', count: counts['পুরুষ পোশাক'] || 18 },
      { name: 'জুতো', count: counts['জুতো'] || 12 },
      { name: 'ব্যাগ', count: counts['ব্যাগ'] || 10 },
      { name: 'অ্যাক্সেসরিজ', count: counts['অ্যাক্সেসরিজ'] || 15 },
      { name: 'ঘর সাজানো', count: counts['ঘর সাজানো'] || 8 },
    ];
  }, [products]);

  const brands = ['ShopnoTory', 'Fashion Hub', 'Style Zone'];

  const toggleBrand = (b: string) => {
    setSelectedBrands(prev =>
      prev.includes(b) ? prev.filter(item => item !== b) : [...prev, b]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('সব');
    setSearchInput('');
    setSelectedBrands([]);
    setMaxPrice(5000);
    setSearchParams({});
  };

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        if (!p.active) return false;

        // Wishlist filter
        if (initialFilter === 'wishlist' && !wishlist.includes(p.id)) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'সব' && p.category !== selectedCategory) {
          return false;
        }

        // Brand filter
        if (selectedBrands.length > 0 && p.brand && !selectedBrands.includes(p.brand)) {
          return false;
        }

        // Price filter
        if (p.price > maxPrice) {
          return false;
        }

        // Search filter
        if (searchInput.trim()) {
          const query = searchInput.toLowerCase().trim();
          const match =
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            (p.tags && p.tags.some(t => t.toLowerCase().includes(query)));
          if (!match) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'price-low') return a.price - b.price;
        if (sortOption === 'price-high') return b.price - a.price;
        if (sortOption === 'newest') return (b.id > a.id ? 1 : -1);
        // Popular
        return (b.rating || 4.5) - (a.rating || 4.5);
      });
  }, [products, selectedCategory, selectedBrands, maxPrice, searchInput, sortOption, initialFilter, wishlist]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 font-sans space-y-6">
      
      {/* 1. Header Banner & Breadcrumbs (Reference Image Style) */}
      <div className="bg-[#f5f2e8] rounded-3xl p-6 sm:p-8 border border-[#e8e4d8] font-bengali flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-[#787f73] mb-1.5">
            <Link to="/" className="hover:text-[#1b4332]">হোম</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#143d2b] font-bold">শপ কালেকশন</span>
            {selectedCategory !== 'সব' && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-[#387c53] font-bold">{selectedCategory}</span>
              </>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#143d2b]">
            শপ কালেকশন
          </h1>
          <p className="text-xs sm:text-sm text-[#525a4c] mt-0.5">
            আপনার পছন্দের সব খাঁটি ও প্রিমিয়াম পণ্য এক জায়গায়
          </p>
        </div>

        {/* Mini Promotional Pill on Banner */}
        <div className="bg-white/80 backdrop-blur-xs px-4 py-2 rounded-2xl border border-[#ded9ce] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1b4332] text-[#b8d56d] font-serif-brand font-bold flex items-center justify-center text-sm">
            S
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#143d2b]">সারাদেশে ক্যাশ অন ডেলিভারি</p>
            <p className="text-[10px] text-[#787f73]">অর্ডার করুন ঘরে বসেই</p>
          </div>
        </div>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid lg:grid-cols-12 gap-8 font-bengali">
        
        {/* Left Filter Sidebar (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="bg-white rounded-3xl border border-[#ede9de] p-5 space-y-6 shadow-2xs">
            
            {/* Header of Sidebar */}
            <div className="flex items-center justify-between pb-3 border-b border-[#f2efe6]">
              <span className="font-bold text-sm text-[#143d2b] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#387c53]" /> ফিল্টার
              </span>
              {(selectedCategory !== 'সব' || selectedBrands.length > 0 || searchInput || maxPrice < 5000) && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-rose-600 hover:underline font-bold"
                >
                  রিসেট
                </button>
              )}
            </div>

            {/* Category Filter Checkboxes */}
            <div className="space-y-2.5">
              <h3 className="font-bold text-xs text-[#143d2b] uppercase tracking-wide">ক্যাটাগরি</h3>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {categories.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedCategory(c.name)}
                    className={`w-full flex items-center justify-between text-xs py-1.5 px-2 rounded-xl transition text-left ${
                      selectedCategory === c.name
                        ? 'bg-[#1b4332] text-white font-bold'
                        : 'text-stone-700 hover:bg-[#f5f2e8]'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className={`text-[10px] ${selectedCategory === c.name ? 'text-[#b8d56d]' : 'text-stone-400'}`}>
                      ({c.count})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-2.5 pt-4 border-t border-[#f2efe6]">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-[#143d2b] uppercase tracking-wide">দাম পরিসর</h3>
                <span className="text-xs font-bold text-[#387c53]">৳০ - ৳{maxPrice}</span>
              </div>
              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#1b4332] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>৳৫০০</span>
                <span>৳৫,০০০</span>
              </div>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2.5 pt-4 border-t border-[#f2efe6]">
              <h3 className="font-bold text-xs text-[#143d2b] uppercase tracking-wide">ব্র্যান্ড</h3>
              <div className="space-y-2">
                {brands.map(b => (
                  <label key={b} className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(b)}
                      onChange={() => toggleBrand(b)}
                      className="rounded accent-[#1b4332] text-[#1b4332] focus:ring-0 cursor-pointer"
                    />
                    <span>{b}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Main Grid */}
        <main className="lg:col-span-9 space-y-4">
          
          {/* Top Bar: Search, Count & Sort */}
          <div className="bg-white rounded-2xl border border-[#ede9de] p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            
            {/* Search within shop */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="পণ্য খুঁজুন..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="w-full bg-[#f3efe6] border border-[#d8d3c5] rounded-full pl-8 pr-8 py-1.5 text-xs text-[#1c211a] focus:outline-none focus:border-[#1b4332]"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-stone-400" />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Results count & Sort dropdown */}
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto text-xs">
              
              {/* Mobile Filter Trigger */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-[#d8d3c5] bg-[#f5f2e8] text-[#143d2b] font-bold"
              >
                <Filter className="w-3.5 h-3.5" /> ফিল্টার
              </button>

              <span className="text-[#666b60] text-xs">
                মোট <strong className="text-[#143d2b]">{filteredProducts.length}</strong> টি পণ্য
              </span>

              <div className="flex items-center gap-1.5">
                <span className="text-stone-400 hidden sm:inline">সাজান:</span>
                <select
                  value={sortOption}
                  onChange={e => setSortOption(e.target.value as any)}
                  className="bg-[#f5f2e8] border border-[#d8d3c5] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#143d2b] focus:outline-none focus:border-[#1b4332] cursor-pointer"
                >
                  <option value="popular">সর্বাধিক জনপ্রিয়</option>
                  <option value="price-low">দাম: কম থেকে বেশি</option>
                  <option value="price-high">দাম: বেশি থেকে কম</option>
                  <option value="newest">নতুন পণ্য</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {(selectedCategory !== 'সব' || selectedBrands.length > 0 || initialFilter === 'wishlist') && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-stone-400 text-[11px]">সক্রিয় ফিল্টার:</span>
              {selectedCategory !== 'সব' && (
                <span className="bg-[#e3ecda] text-[#1b4332] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                  ক্যাটাগরি: {selectedCategory}
                  <button onClick={() => setSelectedCategory('সব')} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedBrands.map(b => (
                <span key={b} className="bg-[#e3ecda] text-[#1b4332] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                  ব্র্যান্ড: {b}
                  <button onClick={() => toggleBrand(b)} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {initialFilter === 'wishlist' && (
                <span className="bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                  পছন্দের তালিকা
                  <button onClick={() => setSearchParams({})} className="hover:text-rose-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-[#d8d3c5] p-12 text-center space-y-3 my-4">
              <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="text-base font-bold text-[#143d2b]">কোনো পণ্য পাওয়া যায়নি</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                আপনার দেওয়া শর্তের সাথে মিলে এমন কোনো পণ্য পাওয়া যায়নি। অনুগ্রহ করে ফিল্টার পরিবর্তন করুন।
              </p>
              <button
                onClick={clearFilters}
                className="mt-2 px-5 py-2 bg-[#1b4332] text-white rounded-full text-xs font-bold hover:bg-[#2d6a4f] transition"
              >
                সব পণ্য দেখুন
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Bottom Sheet */}
      {mobileFilterOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs lg:hidden flex items-end"
          onClick={() => setMobileFilterOpen(false)}
        >
          <div
            className="w-full bg-white rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto space-y-5 font-bengali safe-bottom animate-in slide-in-from-bottom duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-bold text-base text-[#143d2b]">ফিল্টারসমূহ</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 rounded-full text-stone-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category */}
            <div>
              <h4 className="font-bold text-xs text-stone-700 mb-2">ক্যাটাগরি</h4>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(c => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setSelectedCategory(c.name);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border text-left flex justify-between ${
                      selectedCategory === c.name
                        ? 'bg-[#1b4332] text-white border-[#1b4332]'
                        : 'bg-[#fbfaf7] text-stone-700 border-[#ede9de]'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] opacity-70">({c.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>সর্বোচ্চ মূল্য</span>
                <span className="text-[#387c53]">৳{maxPrice}</span>
              </div>
              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#1b4332]"
              />
            </div>

            {/* Action */}
            <div className="pt-2 flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700"
              >
                রিসেট
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#1b4332] text-white text-xs font-bold"
              >
                প্রয়োগ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
