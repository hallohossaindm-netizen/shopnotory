import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  X,
  Truck
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartPage: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    deliveryCharge,
    discountAmount,
    cartGrandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    updateQuantity,
    removeFromCart,
    clearCart,
    settings
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const navigate = useNavigate();
  const money = (n: number) => '৳' + Math.round(n).toLocaleString('en-BD');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  const isFreeDelivery = cartSubtotal >= settings.freeDeliveryThreshold;

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4 font-bengali">
        <div className="w-16 h-16 rounded-full bg-[#e3ecda] text-[#1b4332] flex items-center justify-center mx-auto shadow-xs">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-[#143d2b]">আপনার শপিং ব্যাগ খালি</h2>
        <p className="text-xs text-[#666b60] max-w-sm mx-auto">
          পছন্দের আকর্ষণীয় পণ্যগুলো ব্যাগে যুক্ত করে কেনাকাটা শুরু করুন।
        </p>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-7 py-3 rounded-full text-xs font-bold transition shadow-xs"
          >
            কালেকশন ব্রাউজ করুন <ArrowRight className="w-4 h-4 text-[#b8d56d]" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-sans space-y-8 font-bengali">
      
      {/* Title */}
      <div className="border-b border-[#ede9de] pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#143d2b]">শপিং ব্যাগ</h1>
          <p className="text-xs text-stone-500 mt-0.5">মোট {cartCount} টি পণ্য আপনার ব্যাগে রয়েছে</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-stone-400 hover:text-rose-600 transition font-bold"
        >
          সব মুছুন
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Line Items List */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Free Shipping Progress */}
          <div className="bg-white p-4 rounded-2xl border border-[#ede9de] space-y-2 text-xs">
            <div className="flex justify-between items-center font-bold">
              <span className="flex items-center gap-1.5 text-[#143d2b]">
                <Truck className="w-4 h-4 text-[#387c53]" />
                ফ্রি ডেলিভারি মাইলস্টোন (৳{settings.freeDeliveryThreshold})
              </span>
              <span className={isFreeDelivery ? 'text-emerald-700' : 'text-stone-500'}>
                {isFreeDelivery ? 'ফ্রি ডেলিভারি প্রযোজ্য!' : `আর ${money(settings.freeDeliveryThreshold - cartSubtotal)} প্রয়োজন`}
              </span>
            </div>
            <div className="w-full bg-[#f3efe6] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#387c53] h-full transition-all duration-500"
                style={{ width: `${Math.min(100, (cartSubtotal / settings.freeDeliveryThreshold) * 100)}%` }}
              />
            </div>
          </div>

          {/* Line items */}
          <div className="bg-white rounded-3xl border border-[#ede9de] overflow-hidden divide-y divide-stone-100 shadow-2xs">
            {cart.map(line => (
              <div key={line.product.id} className="p-4 sm:p-5 flex items-center gap-4 justify-between">
                <div className="flex items-center gap-3.5 min-w-0">
                  <Link to={`/product/${line.product.id}`} className="shrink-0">
                    <img
                      src={line.product.image}
                      alt={line.product.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-stone-100"
                    />
                  </Link>
                  <div className="min-w-0">
                    <Link
                      to={`/product/${line.product.id}`}
                      className="font-bold text-xs sm:text-sm text-[#143d2b] hover:text-[#387c53] truncate block"
                    >
                      {line.product.name}
                    </Link>
                    <p className="text-xs font-black text-[#1b4332] mt-0.5">{money(line.product.price)}</p>
                    
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(line.product.id, -1)}
                        className="w-7 h-7 rounded-lg bg-[#f4f2ea] hover:bg-[#e8e4d8] flex items-center justify-center text-xs font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-black">{line.qty}</span>
                      <button
                        onClick={() => updateQuantity(line.product.id, 1)}
                        className="w-7 h-7 rounded-lg bg-[#f4f2ea] hover:bg-[#e8e4d8] flex items-center justify-center text-xs font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between gap-3 shrink-0">
                  <span className="font-black text-sm sm:text-base text-[#143d2b]">
                    {money(line.product.price * line.qty)}
                  </span>
                  <button
                    onClick={() => removeFromCart(line.product.id)}
                    className="text-stone-400 hover:text-rose-600 p-1"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/shop"
              className="text-xs font-bold text-[#1b4332] hover:underline"
            >
              ← আরও পণ্য যোগ করুন
            </Link>
          </div>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-[#ede9de] p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-[#143d2b] border-b border-[#f2efe6] pb-3">
              অর্ডার সামারি
            </h3>

            {/* Subtotal & calculations */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>পণ্যের মোট মূল্য</span>
                <span className="font-bold text-stone-900">{money(cartSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>কুপন ছাড় ({appliedCoupon?.code})</span>
                  <span>-{money(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span>ডেলিভারি চার্জ</span>
                <span>
                  {isFreeDelivery ? (
                    <strong className="text-emerald-700">ফ্রি (৳০)</strong>
                  ) : (
                    <strong className="text-stone-800">{money(deliveryCharge)} (ঢাকা সিটি)</strong>
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-[#f2efe6] flex justify-between text-base font-black text-[#143d2b]">
                <span>সর্বমোট প্রদেয়</span>
                <span>{money(cartGrandTotal)}</span>
              </div>
            </div>

            {/* Coupon Box */}
            <div className="pt-2">
              {appliedCoupon ? (
                <div className="p-2.5 rounded-xl bg-[#eef4ea] border border-[#cde0c4] flex items-center justify-between text-xs font-bold text-[#1b4332]">
                  <span>কুপন কোড: {appliedCoupon.code} প্রযোজ্য</span>
                  <button onClick={removeCoupon} className="text-rose-600 hover:underline">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="কুপন কোড (যেমন: SHOPNO10)"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value)}
                      className="flex-1 bg-[#fbfaf7] border border-[#d8d3c5] rounded-xl px-3 py-2 text-xs text-[#1c211a] focus:outline-none focus:border-[#1b4332]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#1b4332] text-white text-xs font-bold rounded-xl hover:bg-[#2d6a4f] transition"
                    >
                      প্রয়োগ
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-rose-600 font-bold">{couponError}</p>}
                </form>
              )}
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-[#1b4332] hover:bg-[#2d6a4f] text-white py-3.5 px-4 rounded-xl text-xs font-bold shadow-md transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>চেকআউট করুন ({money(cartGrandTotal)})</span>
              <ArrowRight className="w-4 h-4 text-[#b8d56d]" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#525a4c] pt-1">
              <ShieldCheck className="w-4 h-4 text-[#387c53]" />
              <span>নিরাপদ ও নির্ভরযোগ্য অর্ডার প্রক্রিয়া</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
