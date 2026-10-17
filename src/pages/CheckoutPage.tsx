import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  ArrowLeft,
  Printer
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import type { CustomerInfo, Order } from '../types';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    discountAmount,
    settings,
    createOrder,
    showToast
  } = useShop();

  const navigate = useNavigate();
  const money = (n: number) => '৳' + Math.round(n).toLocaleString('en-BD');

  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    district: 'ঢাকা',
    city: 'dhaka',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('cod');
  const [transactionId, setTransactionId] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const deliveryFee =
    cartSubtotal >= settings.freeDeliveryThreshold
      ? 0
      : customer.city === 'dhaka'
      ? settings.deliveryFeeInsideDhaka
      : settings.deliveryFeeOutsideDhaka;

  const totalPayable = Math.max(0, cartSubtotal - discountAmount) + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) {
      showToast('অনুগ্রহ করে নাম, ফোন নম্বর ও পূর্ণ ঠিকানা পূরণ করুন');
      return;
    }

    // Phone validation
    const bdPhoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
    if (!bdPhoneRegex.test(customer.phone.replace(/[\s-]/g, ''))) {
      showToast('অনুগ্রহ করে সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর প্রদান করুন');
      return;
    }

    if (paymentMethod === 'bkash' || paymentMethod === 'nagad') {
      if (!transactionId.trim()) {
        showToast('অনলাইন পেমেন্টের TrxID বা লেনদেন নম্বর দিন');
        return;
      }
    }

    setBusy(true);
    try {
      const order = await createOrder(customer, paymentMethod, transactionId);
      setConfirmedOrder(order);
    } catch {
      showToast('অর্ডারে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setBusy(false);
    }
  };

  if (cart.length === 0 && !confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4 font-bengali">
        <h2 className="text-2xl font-black text-[#143d2b]">আপনার চেকআউট ব্যাগ খালি</h2>
        <p className="text-xs text-stone-500">অর্ডার করার পূর্বে অনুগ্রহ করে পণ্য ব্যাগে যোগ করুন।</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-[#1b4332] text-white px-6 py-2.5 rounded-full text-xs font-bold"
        >
          শপ কালেকশনে যান
        </Link>
      </div>
    );
  }

  // Order Confirmed Success Screen
  if (confirmedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 font-bengali space-y-6">
        <div className="bg-white rounded-3xl border border-[#ede9de] p-6 sm:p-10 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#e3ecda] text-[#1b4332] flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10 text-[#387c53]" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#387c53]">
              অর্ডার কনফার্ম হয়েছে!
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#143d2b] mt-1">
              ধন্যবাদ, {confirmedOrder.customer.name}!
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              আপনার অর্ডার নম্বর: <strong className="text-[#143d2b]">#{confirmedOrder.id}</strong>
            </p>
          </div>

          <div className="bg-[#fbfaf7] p-5 rounded-2xl border border-[#ede9de] text-left text-xs space-y-2.5">
            <div className="flex justify-between text-stone-600">
              <span>প্রাপকের মোবাইল:</span>
              <span className="font-bold text-stone-900">{confirmedOrder.customer.phone}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>ডেলিভারি ঠিকানা:</span>
              <span className="font-bold text-stone-900 truncate max-w-[220px]">{confirmedOrder.customer.address}, {confirmedOrder.customer.district}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>পেমেন্ট পদ্ধতি:</span>
              <span className="font-bold text-[#1b4332] uppercase">{confirmedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>ডেলিভারি চার্জ:</span>
              <span className="font-bold text-stone-900">{money(confirmedOrder.deliveryCharge)}</span>
            </div>
            <div className="border-t border-stone-200 pt-2 flex justify-between text-sm font-black text-[#143d2b]">
              <span>সর্বমোট প্রদেয়:</span>
              <span>{money(confirmedOrder.grandTotal)}</span>
            </div>
          </div>

          <p className="text-xs text-[#525a4c] leading-relaxed">
            খুব দ্রুত আমাদের প্রতিনিধি আপনার সাথে ফোন করে অর্ডারটি ভেরিফাই করবেন এবং পার্সেলটি ডিসপ্যাচ করা হবে।
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="flex-1 py-3 px-4 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-[#fbfaf7] transition flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" /> স্লিপ প্রিন্ট করুন
            </button>
            <Link
              to="/shop"
              className="flex-1 py-3 px-4 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
            >
              আরও কেনাকাটা করুন <ArrowRight className="w-4 h-4 text-[#b8d56d]" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-sans space-y-8 font-bengali">
      
      {/* Checkout Header */}
      <div className="border-b border-[#ede9de] pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#143d2b]">চেকআউট ও পেমেন্ট</h1>
          <p className="text-xs text-stone-500 mt-0.5">নিরাপদ সংযোগের মাধ্যমে তথ্য পূরণ করুন</p>
        </div>
        <Link to="/cart" className="text-xs font-bold text-[#1b4332] hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> ব্যাগে ফিরে যান
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Customer Info & Payment Methods */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Customer Information Card */}
          <div className="bg-white rounded-3xl border border-[#ede9de] p-6 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-[#143d2b] flex items-center gap-2 border-b border-[#f2efe6] pb-3">
              <Truck className="w-4 h-4 text-[#387c53]" /> ডেলিভারির তথ্য
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">আপনার নাম *</label>
                <input
                  type="text"
                  required
                  value={customer.name}
                  onChange={e => setCustomer({ ...customer, name: e.target.value })}
                  placeholder="আপনার পুরো নাম"
                  className="w-full bg-[#fbfaf7] border border-[#d8d3c5] rounded-xl px-3.5 py-2.5 text-xs text-[#1c211a] focus:outline-none focus:border-[#1b4332]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">মোবাইল নম্বর *</label>
                <input
                  type="tel"
                  required
                  value={customer.phone}
                  onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-[#fbfaf7] border border-[#d8d3c5] rounded-xl px-3.5 py-2.5 text-xs text-[#1c211a] focus:outline-none focus:border-[#1b4332]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">ইমেইল (ঐচ্ছিক)</label>
              <input
                type="email"
                value={customer.email}
                onChange={e => setCustomer({ ...customer, email: e.target.value })}
                placeholder="name@example.com (অর্ডার রসিদের জন্য)"
                className="w-full bg-[#fbfaf7] border border-[#d8d3c5] rounded-xl px-3.5 py-2.5 text-xs text-[#1c211a] focus:outline-none focus:border-[#1b4332]"
              />
            </div>

            {/* City Area Selection */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">ডেলিভারি অঞ্চল *</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCustomer({ ...customer, city: 'dhaka', district: 'ঢাকা' })}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition text-left flex justify-between items-center ${
                    customer.city === 'dhaka'
                      ? 'bg-[#1b4332] text-white border-[#1b4332]'
                      : 'bg-[#fbfaf7] text-stone-700 border-stone-200'
                  }`}
                >
                  <span>ঢাকা সিটির ভেতরে</span>
                  <span className="text-[10px]">৳{settings.deliveryFeeInsideDhaka}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCustomer({ ...customer, city: 'outside' })}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition text-left flex justify-between items-center ${
                    customer.city === 'outside'
                      ? 'bg-[#1b4332] text-white border-[#1b4332]'
                      : 'bg-[#fbfaf7] text-stone-700 border-stone-200'
                  }`}
                >
                  <span>ঢাকার বাইরে (অন্যান্য জেলা)</span>
                  <span className="text-[10px]">৳{settings.deliveryFeeOutsideDhaka}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">পূর্ণ ডেলিভারি ঠিকানা *</label>
              <textarea
                required
                rows={2}
                value={customer.address}
                onChange={e => setCustomer({ ...customer, address: e.target.value })}
                placeholder="বাসা নম্বর, রোড নম্বর, এলাকা, থানা, জেলা"
                className="w-full bg-[#fbfaf7] border border-[#d8d3c5] rounded-xl px-3.5 py-2.5 text-xs text-[#1c211a] focus:outline-none focus:border-[#1b4332]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">অর্ডার সংক্রান্ত বিশেষ নির্দেশনা (ঐচ্ছিক)</label>
              <input
                type="text"
                value={customer.notes}
                onChange={e => setCustomer({ ...customer, notes: e.target.value })}
                placeholder="যেমন: বিকেলে ৩টার পরে ডেলিভারি দিন"
                className="w-full bg-[#fbfaf7] border border-[#d8d3c5] rounded-xl px-3.5 py-2.5 text-xs text-[#1c211a] focus:outline-none focus:border-[#1b4332]"
              />
            </div>
          </div>

          {/* Payment Method Selector Card */}
          <div className="bg-white rounded-3xl border border-[#ede9de] p-6 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-[#143d2b] flex items-center gap-2 border-b border-[#f2efe6] pb-3">
              <CreditCard className="w-4 h-4 text-[#387c53]" /> পেমেন্ট পদ্ধতি বেছে নিন
            </h3>

            {/* COD Option */}
            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-stone-200 cursor-pointer hover:bg-[#fbfaf7] transition">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                className="mt-1 accent-[#1b4332]"
              />
              <div className="flex-1">
                <p className="text-xs font-bold text-[#143d2b]">ক্যাশ অন ডেলিভারি (COD)</p>
                <p className="text-[11px] text-stone-500">পণ্য হাতে পেয়ে দেখে ডেলিভারি ম্যানের কাছে মূল্য পরিশোধ করুন</p>
              </div>
            </label>

            {/* bKash Option */}
            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-stone-200 cursor-pointer hover:bg-[#fbfaf7] transition">
              <input
                type="radio"
                name="paymentMethod"
                value="bkash"
                checked={paymentMethod === 'bkash'}
                onChange={() => setPaymentMethod('bkash')}
                className="mt-1 accent-[#1b4332]"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-[#143d2b]">বিকাশ (bKash) পেমেন্ট</p>
                  <span className="text-[9px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-bold">অনলাইন</span>
                </div>
                <p className="text-[11px] text-stone-500">বিকাশ মার্চেন্ট কিংবা সেন্ড মানি করুন: <strong className="text-[#143d2b] font-bold">{settings.supportPhone || '01845805713'}</strong></p>
              </div>
            </label>

            {/* Nagad Option */}
            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-stone-200 cursor-pointer hover:bg-[#fbfaf7] transition">
              <input
                type="radio"
                name="paymentMethod"
                value="nagad"
                checked={paymentMethod === 'nagad'}
                onChange={() => setPaymentMethod('nagad')}
                className="mt-1 accent-[#1b4332]"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-[#143d2b]">নগদ (Nagad) পেমেন্ট</p>
                  <span className="text-[9px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">অনলাইন</span>
                </div>
                <p className="text-[11px] text-stone-500">নগদ একাউন্ট থেকে পরিশোধ করুন: <strong className="text-[#143d2b] font-bold">{settings.supportPhone || '01845805713'}</strong></p>
              </div>
            </label>

            {/* TrxID input when online payment is chosen */}
            {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
              <div className="p-3.5 bg-[#f5f2e8] rounded-2xl border border-[#ded9ce] space-y-2">
                <label className="block text-xs font-bold text-[#143d2b]">
                  পেমেন্ট সম্পন্ন করে TrxID বা লেনদেন নম্বর দিন *
                </label>
                <input
                  type="text"
                  required
                  value={transactionId}
                  onChange={e => setTransactionId(e.target.value)}
                  placeholder="যেমন: 9J87AK62"
                  className="w-full bg-white border border-[#d8d3c5] rounded-xl px-3 py-2 text-xs text-[#1c211a]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right: Order Summary Breakdown & Confirmation */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-[#ede9de] p-6 shadow-xs space-y-4 sticky top-28">
            <h3 className="font-bold text-base text-[#143d2b] border-b border-[#f2efe6] pb-3">
              অর্ডার তালিকা ({cart.length}টি পণ্য)
            </h3>

            {/* Item Mini list */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {cart.map(line => (
                <div key={line.product.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={line.product.image} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0 bg-stone-100" />
                    <div className="min-w-0">
                      <p className="font-bold text-[#143d2b] truncate">{line.product.name}</p>
                      <p className="text-[11px] text-stone-500">{money(line.product.price)} × {line.qty}</p>
                    </div>
                  </div>
                  <span className="font-bold text-stone-900 shrink-0">
                    {money(line.product.price * line.qty)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-3 border-t border-[#f2efe6] space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>সাবটোটাল</span>
                <span className="font-bold text-stone-900">{money(cartSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>ডিসকাউন্ট</span>
                  <span>-{money(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span>ডেলিভারি চার্জ</span>
                <span>
                  {deliveryFee === 0 ? (
                    <strong className="text-emerald-700">ফ্রি</strong>
                  ) : (
                    <strong>{money(deliveryFee)}</strong>
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-[#f2efe6] flex justify-between text-base font-black text-[#143d2b]">
                <span>মোট প্রদেয়</span>
                <span>{money(totalPayable)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-[#1b4332] hover:bg-[#2d6a4f] text-white py-4 rounded-xl text-xs font-bold transition shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-[#b8d56d]" />
              <span>{busy ? 'অর্ডার প্রস্তুত হচ্ছে...' : `অর্ডার নিশ্চিত করুন (${money(totalPayable)})`}</span>
            </button>

            <p className="text-[11px] text-center text-stone-400">
              অর্ডার কনফার্ম করার মাধ্যমে আপনি ShopnoTory এর শর্তাবলী মেনে নিচ্ছেন।
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
