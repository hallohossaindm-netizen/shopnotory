import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowLeft, KeyRound, AlertTriangle, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { sendAdminPasswordReset } from '../../services/adminAuth';

export const AdminLoginPage: React.FC = () => {
  const { adminLogin, isAdmin, firebaseConfigured } = useShop();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // If already logged in with admin privileges, redirect to /admin
  useEffect(() => {
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

    if (!firebaseConfigured) {
      setErrorMsg('Firebase Authentication কনফিগার করা হয়নি। অ্যাডমিন সিস্টেমে প্রবেশের জন্য প্রথমে Firebase সেটআপ সম্পন্ন করুন।');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    const res = await adminLogin(email.trim(), password.trim());
    setLoading(false);

    if (res.success) {
      navigate('/admin');
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setForgotMsg({ type: 'error', text: 'অনুগ্রহ করে আপনার অ্যাডমিন ইমেইল প্রদান করুন।' });
      return;
    }

    if (!firebaseConfigured) {
      setForgotMsg({
        type: 'error',
        text: 'Firebase Authentication সক্রিয় নয়। পাসওয়ার্ড রিসেট ইমেইল পাঠানোর জন্য Firebase কনফিগারেশন প্রয়োজন।'
      });
      return;
    }

    setForgotLoading(true);
    setForgotMsg(null);
    const res = await sendAdminPasswordReset(forgotEmail.trim());
    setForgotLoading(false);

    if (res.success) {
      setForgotMsg({ type: 'success', text: res.message });
      setTimeout(() => {
        setForgotEmail('');
      }, 4000);
    } else {
      setForgotMsg({ type: 'error', text: res.message });
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
        <div className="flex items-center gap-1.5 text-stone-600 font-bold">
          <span className={`w-2 h-2 rounded-full ${firebaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span>{firebaseConfigured ? 'সুরক্ষিত Firebase সার্ভার' : 'Firebase সেটআপ প্রয়োজন'}</span>
        </div>
      </div>

      {/* Admin Login Card */}
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
            শুধুমাত্র অনুমোদিত সুপার অ্যাডমিনের জন্য
          </p>
        </div>

        {/* Firebase Not Configured Notice (Requirement 8) */}
        {!firebaseConfigured && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2.5">
            <div className="flex items-start gap-2.5 font-bold">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-900">Firebase Auth সক্রিয় করা হয়নি</p>
                <p className="text-[11px] font-normal text-amber-800 mt-0.5">
                  নিরাপত্তা বিধিমালার স্বার্থে ডেমো ক্রেডেনশিয়াল নিষ্ক্রিয় করা হয়েছে। অ্যাডমিন লগইনের জন্য নিচের ধাপসমূহ সম্পন্ন করুন:
                </p>
              </div>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-amber-800 pl-1 border-t border-amber-200/60 pt-2 font-mono text-left">
              <li>Firebase Console-এ Email/Password Provider সক্রিয় করুন</li>
              <li><code>.env</code> ফাইলে Firebase Project Credentials যুক্ত করুন</li>
              <li>Admin SDK দিয়ে অ্যাকাউন্টে <code>admin: true</code> কাস্টম ক্লেইম সেট করুন</li>
            </ol>
          </div>
        )}

        {/* Error or Success Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-bold">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center font-bold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#444c3f] mb-1">
              অ্যাডমিন ইমেইল
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@yourstore.com"
                className="w-full bg-[#fbfaf7] border border-[#d8d3c5] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#1c211a] focus:outline-none focus:border-[#1b4332]"
              />
              <Mail className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#444c3f] mb-1">
              গোপন পাসওয়ার্ড
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
            <button
              type="button"
              onClick={() => {
                setShowForgotModal(true);
                setForgotMsg(null);
                setForgotEmail(email);
              }}
              className="text-[#387c53] hover:underline font-semibold flex items-center gap-1"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>পাসওয়ার্ড ভুলে গেছেন?</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || !firebaseConfigured}
            className="w-full bg-[#1b4332] hover:bg-[#2d6a4f] text-white py-3 rounded-xl text-xs font-bold transition shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span>{loading ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন →'}</span>
          </button>
        </form>

        <div className="pt-3 border-t border-stone-100 text-center">
          <p className="text-[11px] text-stone-500">
            নিরাপত্তা নির্দেশিকা: Firebase Custom Claims (admin: true) ব্যতীত কোনো ব্যবহারকারী কন্ট্রোল সেন্টারে প্রবেশাধিকার পাবে না।
          </p>
        </div>
      </div>

      {/* Forgot Password Modal (Requirement 3 & 4) */}
      {showForgotModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-bengali"
          onClick={() => setShowForgotModal(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 text-stone-800 space-y-4 animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#e3ecda] text-[#1b4332] flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-[#1b4332]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#143d2b]">পাসওয়ার্ড রিসেট করুন</h3>
                  <p className="text-xs text-stone-500">অফিসিয়াল Firebase পাসওয়ার্ড রিসেট লিংক</p>
                </div>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              আপনার নিবন্ধিত অ্যাডমিন ইমেইল ঠিকানা প্রদান করুন। আমরা আপনার ইমেইলে একটি সুরক্ষিত পাসওয়ার্ড পরিবর্তনের লিংক পাঠিয়ে দেব।
            </p>

            {forgotMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-bold ${
                  forgotMsg.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border border-rose-200 text-rose-700'
                }`}
              >
                {forgotMsg.text}
              </div>
            )}

            <form onSubmit={handleSendResetEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">
                  অ্যাডমিন ইমেইল ঠিকানা
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="admin@yourstore.com"
                    className="w-full bg-[#fbfaf7] border border-[#d8d3c5] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#1c211a] focus:outline-none focus:border-[#1b4332]"
                  />
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-5 py-2 rounded-xl bg-[#1b4332] text-white text-xs font-bold hover:bg-[#2d6a4f] transition shadow-xs disabled:opacity-60 flex items-center gap-1.5"
                >
                  <span>{forgotLoading ? 'পাঠানো হচ্ছে...' : 'রিসেট লিংক পাঠান'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="w-full max-w-md pb-4 text-center text-xs text-stone-400 font-sans">
        ShopnoTory Admin Panel · Powered by Firebase Authentication
      </footer>
    </div>
  );
};
