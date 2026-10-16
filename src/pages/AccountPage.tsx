import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, LogOut, Package, ArrowRight, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AccountPage: React.FC = () => {
  const { activeUser, customerLogin, customerLogout, orders } = useShop();
  const navigate = useNavigate();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    customerLogin(email, name || email.split('@')[0]);
  };

  if (activeUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 font-bengali space-y-8">
        <div className="bg-white rounded-3xl border border-[#ede9de] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#e3ecda] text-[#1b4332] flex items-center justify-center font-bold text-2xl font-serif-brand">
              {activeUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#143d2b]">{activeUser.name}</h1>
              <p className="text-xs text-stone-500">{activeUser.email}</p>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full mt-1 inline-block">
                রেজিস্টার্ড মেম্বার
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/orders"
              className="px-4 py-2 bg-[#1b4332] text-white rounded-xl text-xs font-bold hover:bg-[#2d6a4f] transition flex items-center gap-1.5 shadow-xs"
            >
              <Package className="w-4 h-4 text-[#b8d56d]" /> আমার অর্ডারসমূহ ({orders.length})
            </Link>
            <button
              onClick={customerLogout}
              className="px-4 py-2 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-50 transition"
            >
              লগআউট
            </button>
          </div>
        </div>

        {/* Account Details Box */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#ede9de] space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-400">ব্যক্তিগত তথ্য</h3>
            <p className="text-sm font-bold text-[#143d2b]">{activeUser.name}</p>
            <p className="text-xs text-stone-600">{activeUser.email}</p>
            <p className="text-[11px] text-stone-400">যোগদানের তারিখ: {new Date(activeUser.joinedAt).toLocaleDateString('bn-BD')}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#ede9de] space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-400">নিরাপত্তা ও সহায়তা</h3>
            <p className="text-xs text-stone-600">আপনার একাউন্ট সম্পূর্ণ সুরক্ষিত। যেকোনো সহায়তায় আমাদের সাপোর্ট টিমে যোগাযোগ করুন।</p>
            <Link to="/contact" className="text-xs font-bold text-[#387c53] hover:underline inline-block pt-1">
              সাপোর্টে যোগাযোগ করুন →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 font-bengali space-y-6">
      <div className="bg-white rounded-3xl border border-[#ede9de] p-6 sm:p-8 shadow-md space-y-5">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-full bg-[#e3ecda] text-[#1b4332] flex items-center justify-center mx-auto mb-2">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-[#143d2b]">
            {isLoginTab ? 'কাস্টমার লগইন' : 'নতুন অ্যাকাউন্ট তৈরি'}
          </h1>
          <p className="text-xs text-stone-500">
            {isLoginTab ? 'আপনার পূর্ববর্তী অর্ডার দেখতে লগইন করুন' : 'সহজে অর্ডার ও ট্র্যাকিং করতে যুক্ত হোন'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#f4f1ea] rounded-xl text-xs font-bold">
          <button
            onClick={() => setIsLoginTab(true)}
            className={`py-2 rounded-lg transition ${
              isLoginTab ? 'bg-white text-[#143d2b] shadow-xs' : 'text-stone-500'
            }`}
          >
            লগইন
          </button>
          <button
            onClick={() => setIsLoginTab(false)}
            className={`py-2 rounded-lg transition ${
              !isLoginTab ? 'bg-white text-[#143d2b] shadow-xs' : 'text-stone-500'
            }`}
          >
            রেজিস্টার
          </button>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-3.5">
          {!isLoginTab && (
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">পূর্ণ নাম *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="যেমন: তানজিলা হক"
                className="w-full bg-[#fbfaf7] border border-[#d8d3c5] rounded-xl px-3.5 py-2.5 text-xs text-[#1c211a] focus:outline-none focus:border-[#1b4332]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">ইমেইল ঠিকানা *</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="customer@example.com"
              className="w-full bg-[#fbfaf7] border border-[#d8d3c5] rounded-xl px-3.5 py-2.5 text-xs text-[#1c211a] focus:outline-none focus:border-[#1b4332]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">পাসওয়ার্ড *</label>
            <input
              type="password"
              required
              defaultValue="123456"
              placeholder="••••••••"
              className="w-full bg-[#fbfaf7] border border-[#d8d3c5] rounded-xl px-3.5 py-2.5 text-xs text-[#1c211a] focus:outline-none focus:border-[#1b4332]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1b4332] hover:bg-[#2d6a4f] text-white py-3 rounded-xl text-xs font-bold transition shadow-xs active:scale-95 mt-2"
          >
            {isLoginTab ? 'লগইন করুন →' : 'অ্যাকাউন্ট তৈরি করুন →'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-stone-500">
          <span>এডমিন হিসেবে প্রবেশ করতে চান? </span>
          <Link to="/admin/login" className="text-[#1b4332] font-bold hover:underline">
            এডমিন লগইন
          </Link>
        </div>
      </div>
    </div>
  );
};
