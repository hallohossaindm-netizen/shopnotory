import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  Phone,
  Truck,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  LogOut,
  SlidersHorizontal
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const Header: React.FC = () => {
  const {
    cartCount,
    wishlist,
    settings,
    searchQuery,
    setSearchQuery,
    activeUser,
    customerLogout,
    isAdmin
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [userDropdown, setUserDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      navigate(`/shop?search=${encodeURIComponent(searchInput.trim())}`);
    } else {
      setSearchQuery('');
      navigate('/shop');
    }
  };

  const navItems = [
    { name: 'হোম', path: '/' },
    { name: 'শপ কালেকশন', path: '/shop' },
    { name: 'আমাদের গল্প', path: '/our-story' },
    { name: 'কেন ShopnoTory', path: '/why-shoptory' },
    { name: 'যোগাযোগ', path: '/contact' },
    { name: isAdmin ? 'অ্যাডমিন ড্যাশবোর্ড' : 'অ্যাডমিন লগইন', path: isAdmin ? '/admin' : '/admin/login' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#fbfaf7] border-b border-[#e9e6dd] shadow-2xs">
      {/* 1. Slim Announcement Bar */}
      <div className="bg-[#122e20] text-[#f4f7f2] py-2 px-4 text-xs font-medium relative flex items-center justify-between border-b border-[#214a36]">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-[11px] sm:text-xs">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <Sparkles className="w-3.5 h-3.5 text-[#b8d56d] animate-pulse" />
            <span className="font-bengali">{settings.announcement}</span>
          </div>

          <div className="hidden md:flex items-center gap-5 text-[#b2c4ba]">
            <span className="flex items-center gap-1.5 font-bengali">
              <Truck className="w-3.5 h-3.5 text-[#b8d56d]" /> সারা দেশে ৪৮-৭২ ঘণ্টায় ডেলিভারি
            </span>
            <span className="text-[#325844]">|</span>
            <a
              href={`tel:${settings.supportPhone || '01845805713'}`}
              className="flex items-center gap-1 hover:text-white transition font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-[#b8d56d]" /> {settings.supportPhone || '01845805713'}
            </a>
            <span className="text-[#325844]">|</span>
            <a
              href={`https://wa.me/8801845805713?text=${encodeURIComponent('আসসালামু আলাইকুম, ShopnoTory থেকে তথ্য জানতে চাই।')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#b8d56d] hover:text-white transition font-bold"
            >
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Branding & Search Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -ml-1 text-[#1b4332] rounded-xl hover:bg-[#eae6db] transition active:scale-95"
            aria-label="মেনু"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo & Brand Identity (Reproducing Reference Image Style) */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#1b4332] rounded-xl flex items-center justify-center font-serif-brand text-2xl text-[#b8d56d] font-bold shadow-xs group-hover:scale-105 transition-transform border border-[#2d6a4f]/40">
              S
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#143d2b]">
                  Shopno<span className="text-[#387c53]">Tory</span>
                </span>
                <span className="text-xs font-bengali font-bold text-[#52796f] hidden sm:inline">
                  (স্বপ্নতরি)
                </span>
              </div>
              <p className="text-[8px] sm:text-[9px] tracking-[1.8px] font-semibold text-[#666b60] uppercase -mt-0.5">
                Dreams in Every Purchase
              </p>
            </div>
          </Link>

          {/* Center Search Bar (Exact Style from Reference Image) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xl mx-6 relative items-center"
          >
            <input
              type="text"
              placeholder="আপনি কি খুঁজছেন? (যেমন: শাড়ি, পাঞ্জাবি, ব্যাগ, জুতো)..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full bg-[#f3efe6] border border-[#d8d3c5] rounded-full pl-5 pr-14 py-2.5 text-xs text-[#1c211a] placeholder:text-[#83897b] focus:outline-none focus:border-[#1b4332] focus:bg-white focus:ring-1 focus:ring-[#1b4332] transition"
            />
            <button
              type="submit"
              className="absolute right-1.5 bg-[#1b4332] hover:bg-[#2d6a4f] text-white p-2 rounded-full transition shadow-xs active:scale-95 flex items-center justify-center"
              aria-label="অনুসন্ধান"
            >
              <Search className="w-4 h-4 text-[#b8d56d]" />
            </button>
          </form>

          {/* Right Controls: Wishlist, Cart, Login/Register */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Wishlist Icon */}
            <Link
              to="/shop?filter=wishlist"
              className="p-2 sm:p-2.5 text-[#1b4332] hover:bg-[#ede9de] rounded-full relative transition active:scale-95"
              title="পছন্দের তালিকা"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 min-w-[16px] h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart Button */}
            <Link
              to="/cart"
              className="flex items-center gap-2 bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-3 sm:px-4 py-2 rounded-full text-xs font-bold transition shadow-xs active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-[#b8d56d]" />
              <span className="hidden sm:inline font-bengali">ব্যাগ</span>
              <span className="bg-[#b8d56d] text-[#122e20] text-[10px] font-black rounded-full min-w-[18px] h-4 px-1 flex items-center justify-center">
                {cartCount}
              </span>
            </Link>

            {/* Account / Login Button */}
            <div className="relative">
              {activeUser ? (
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-full border border-[#d8d3c5] bg-white hover:bg-[#f3efe6] text-xs font-semibold text-[#1b4332] transition"
                >
                  <UserIcon className="w-4 h-4 text-[#387c53]" />
                  <span className="max-w-[70px] truncate">{activeUser.name}</span>
                  <ChevronDown className="w-3 h-3 text-[#666b60]" />
                </button>
              ) : (
                <Link
                  to="/account"
                  className="hidden sm:flex items-center gap-1.5 py-2 px-3.5 rounded-full border border-[#d8d3c5] bg-white hover:bg-[#f3efe6] text-xs font-semibold text-[#1b4332] transition active:scale-95"
                >
                  <UserIcon className="w-4 h-4 text-[#387c53]" />
                  <span className="font-bengali">লগইন/রেজিস্টার</span>
                </Link>
              )}

              {/* User Dropdown */}
              {userDropdown && activeUser && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#e2ded2] py-2 text-xs z-50 animate-in fade-in zoom-in-95"
                  onClick={() => setUserDropdown(false)}
                >
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="font-bold text-[#143d2b] truncate">{activeUser.name}</p>
                    <p className="text-[10px] text-stone-500 truncate">{activeUser.email}</p>
                  </div>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-[#f3efe6] text-stone-700 font-bengali">
                    আমার অর্ডারসমূহ
                  </Link>
                  <Link to="/account" className="block px-4 py-2 hover:bg-[#f3efe6] text-stone-700 font-bengali">
                    প্রোফাইল সেটিংস
                  </Link>
                  <button
                    onClick={customerLogout}
                    className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 font-bengali flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" /> লগআউট
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Input */}
        <form onSubmit={handleSearchSubmit} className="md:hidden mt-2.5 relative flex items-center">
          <input
            type="text"
            placeholder="আপনি কি খুঁজছেন? (শাড়ি, পাঞ্জাবি, ব্যাগ...)"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="w-full bg-[#f3efe6] border border-[#d8d3c5] rounded-full pl-4 pr-11 py-2 text-xs text-[#1c211a] focus:outline-none focus:border-[#1b4332]"
          />
          <button
            type="submit"
            className="absolute right-1 bg-[#1b4332] text-white p-1.5 rounded-full"
            aria-label="অনুসন্ধান"
          >
            <Search className="w-3.5 h-3.5 text-[#b8d56d]" />
          </button>
        </form>
      </div>

      {/* 3. Secondary Navigation Bar (Exact Style from Reference Image) */}
      <nav className="hidden md:block bg-white border-t border-[#ede9de]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-8 text-sm font-semibold text-[#3a4435] font-bengali">
            {navItems.map(item => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `py-3 block relative transition hover:text-[#1b4332] ${
                      isActive
                        ? 'text-[#1b4332] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.75 after:bg-[#1b4332] after:rounded-full'
                        : 'text-[#4d5648]'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs md:hidden flex"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-80 max-w-[85%] bg-[#fbfaf7] h-full shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-left duration-250 font-bengali"
            onClick={e => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#e5e1d4]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#1b4332] rounded-lg flex items-center justify-center font-serif-brand text-lg text-[#b8d56d] font-bold">
                    S
                  </div>
                  <div>
                    <span className="font-bold text-base text-[#143d2b] block">ShopnoTory</span>
                    <span className="text-[10px] text-[#666b60] block -mt-1">স্বপ্নতরি</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full text-stone-500 hover:bg-stone-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-5 space-y-1">
                {navItems.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                        isActive
                          ? 'bg-[#1b4332] text-white shadow-xs'
                          : 'text-stone-700 hover:bg-[#ede9de]'
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
                <NavLink
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-stone-700 hover:bg-[#ede9de]"
                >
                  শপিং ব্যাগ ({cartCount})
                </NavLink>
                <NavLink
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-stone-700 hover:bg-[#ede9de]"
                >
                  অর্ডার হিস্টোরি
                </NavLink>
              </div>
            </div>

            <div className="pt-4 border-t border-[#e5e1d4] text-xs text-stone-600 space-y-2">
              <p className="font-bold text-[#143d2b]">সহায়তা ও অর্ডার হটলাইন</p>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${settings.supportPhone || '01845805713'}`}
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white border border-[#d8d3c5] text-[#1b4332] font-bold text-xs"
                >
                  <Phone className="w-3.5 h-3.5 text-[#387c53]" /> {settings.supportPhone || '01845805713'}
                </a>
                <a
                  href={`https://wa.me/8801845805713?text=${encodeURIComponent('আসসালামু আলাইকুম, ShopnoTory থেকে সাহায্য চাই।')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#25D366] text-white font-bold text-xs"
                >
                  <span>হোয়াটসঅ্যাপ</span>
                </a>
              </div>
              <p className="text-[10px] text-stone-400 text-center">
                Dreams in Every Purchase · ShopnoTory
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
