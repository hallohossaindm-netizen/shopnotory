import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const AdminLoginPage: React.FC = () => {
  const { adminLogin, isAdmin } = useShop();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // If already admin, redirect to /admin
  React.useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('ইমেইল ও পাসওয়ার্ড প্রদান করুন');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    const res = await adminLogin(email.trim(), password.trim());
    setLoading(false);

    if (res.success) {
      navigate('/admin');
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleDemoAdmin = async () => {
    setEmail('admin@shopnotory.com');
    setPassword('admin123');
    setLoading(true);
    const res = await adminLogin('admin@shopnotory.com', 'admin123');
    setLoading(false);
    if (res.success) {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] flex flex-col justify-between items-center p-4 font-sans selection:bg-[#b8d56d] selection:text-[#143d2b]">
      
      {/* Top Bar with back to store link */}
      <div className="w-full max-w-md pt-4 flex items-center justify-between font-bengali text-xs">
        <Link
          to="/"
          className="text-stone-600 hover:text-[#1b4332] font-semibold flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" /> শপে ফিরে যান
        </Link>
        <div className="flex items-center gap-1.5 text-stone-500 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> সুরক্ষিত সার্ভার
        </div>
      </div>

      {/* Admin Login Card (Exact reproduction of Reference Image Screen 6) */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#ded9ce] shadow-xl p-6 sm:p-8 my-auto font-bengali space-y-6">
        
        {/* Shield Icon Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-[#e3ecda] text-[#1b4332] flex items-center justify-center mx-auto shadow-2xs">
            <ShieldCheck className="w-9 h-9 text-[#1b4332]" />
          </div>
          <h1 className="text-2xl font-black text-[#143d2b] tracking-tight">
            এডমিন লগইন
          </h1>
          <p className="text-xs text-[#666b60]">
            শুধুমাত্র অনুমোদিত কর্মকর্তাদের জন্য
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-bold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#444c3f] mb-1">
              ইমেইল / ইউজারনেম
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@shopnotory.com"
                className="w-full bg-[#fbfaf7] border border-[#d8d3c5] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#1c211a] focus:outline-none focus:border-[#1b4332]"
              />
              <Mail className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#444c3f] mb-1">
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#fbfaf7] border border-[#d8d3c5] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#1c211a] focus:outline-none focus:border-[#1b4332]"
              />
              <Lock className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-stone-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="rounded accent-[#1b4332]"
              />
              <span>আমাকে মনে রাখুন</span>
            </label>
            <a
              href="#forgot"
              onClick={e => {
                e.preventDefault();
                alert('পাসওয়ার্ড পরিবর্তনের জন্য সুপার এডমিনের সাথে যোগাযোগ করুন।');
              }}
              className="text-[#387c53] hover:underline font-semibold"
            >
              পাসওয়ার্ড ভুলে গেছেন?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1b4332] hover:bg-[#2d6a4f] text-white py-3 rounded-xl text-xs font-bold transition shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
          >
            <span>{loading ? 'লগইন হচ্ছে...' : 'লগইন →'}</span>
          </button>
        </form>

        {/* 1-Click Demo Login Button for convenient testing */}
        <div className="pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={handleDemoAdmin}
            className="w-full py-2.5 px-3 rounded-xl bg-[#e3ecda] hover:bg-[#d5e4ca] text-[#1b4332] text-xs font-bold border border-[#c3dbb1] transition active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span>১-ক্লিকে ডেমো এডমিন মোডে প্রবেশ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <p className="text-[10px] text-stone-400 text-center mt-1.5">
            টেস্টিং ক্রেডেনশিয়াল: admin@shopnotory.com / admin123
          </p>
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="w-full max-w-md pb-4 text-center text-xs text-stone-400 font-sans">
        ShopnoTory Admin Panel v1.0 · Secured Environment
      </footer>
    </div>
  );
};
