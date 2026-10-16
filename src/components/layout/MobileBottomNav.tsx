import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, Heart, ShoppingBag, User, ShieldCheck } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const MobileBottomNav: React.FC = () => {
  const { cartCount, wishlist, isAdmin, activeUser } = useShop();

  return (
    <nav
      aria-label="মোবাইল নেভিগেশন"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#e2ded2] safe-bottom shadow-lg font-bengali"
    >
      <div className="grid grid-cols-5 h-14 items-center text-center">
        {/* 1. Home */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 transition active:scale-90 ${
              isActive ? 'text-[#1b4332] font-bold' : 'text-stone-500'
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">হোম</span>
        </NavLink>

        {/* 2. Shop */}
        <NavLink
          to="/shop"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 transition active:scale-90 ${
              isActive ? 'text-[#1b4332] font-bold' : 'text-stone-500'
            }`
          }
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px]">শপ</span>
        </NavLink>

        {/* 3. Wishlist */}
        <NavLink
          to="/shop?filter=wishlist"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 relative transition active:scale-90 ${
              isActive ? 'text-[#1b4332] font-bold' : 'text-stone-500'
            }`
          }
        >
          <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span className="text-[10px]">পছন্দ</span>
          {wishlist.length > 0 && (
            <span className="absolute top-1 right-4 w-3.5 h-3.5 bg-rose-500 text-white rounded-full text-[8px] font-bold flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </NavLink>

        {/* 4. Cart */}
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 relative transition active:scale-90 ${
              isActive ? 'text-[#1b4332] font-bold' : 'text-stone-500'
            }`
          }
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px]">ব্যাগ</span>
          {cartCount > 0 && (
            <span className="absolute top-1 right-4 min-w-[16px] h-3.5 bg-[#1b4332] text-[#b8d56d] rounded-full text-[8px] font-bold flex items-center justify-center px-1">
              {cartCount}
            </span>
          )}
        </NavLink>

        {/* 5. Account / Admin */}
        <NavLink
          to={isAdmin ? '/admin' : '/account'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 transition active:scale-90 ${
              isActive ? 'text-[#1b4332] font-bold' : 'text-stone-500'
            }`
          }
        >
          {isAdmin ? <ShieldCheck className="w-5 h-5 text-[#387c53]" /> : <User className="w-5 h-5" />}
          <span className="text-[10px]">{isAdmin ? 'অ্যাডমিন' : activeUser ? 'অ্যাকাউন্ট' : 'লগইন'}</span>
        </NavLink>
      </div>
    </nav>
  );
};
