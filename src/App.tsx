import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { BottomPromoBar } from './components/layout/BottomPromoBar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { useOnlineStatus } from './useOnlineStatus';
import { usePWAInstall } from './usePWAInstall';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { OurStoryPage } from './pages/OurStoryPage';
import { WhyShopnoToryPage } from './pages/WhyShopnoToryPage';
import { ContactPage } from './pages/ContactPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AccountPage } from './pages/AccountPage';
import { OrdersPage } from './pages/OrdersPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

// Lucide icons
import { WifiOff, Smartphone, Download, Share2, X, Sparkles } from 'lucide-react';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Public Storefront Layout
function PublicLayout() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();
  const [showIOSGuide, setShowIOSGuide] = React.useState(false);
  const [installDismissed, setInstallDismissed] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#1c211a] flex flex-col font-sans selection:bg-[#b8d56d] selection:text-[#143d2b] pb-16 md:pb-0">
      
      {/* Offline Alert */}
      {!isOnline && (
        <aside aria-label="নেটওয়ার্ক স্থিতি" className="bg-amber-600 text-white text-xs py-1.5 px-4 text-center font-bold flex items-center justify-center gap-2 sticky top-0 z-50 shadow-md font-bengali">
          <WifiOff className="w-3.5 h-3.5 animate-pulse" />
          <span>ইন্টারনেট সংযোগ নেই — অফলাইনে সংরক্ষিত তথ্য প্রদর্শিত হচ্ছে</span>
        </aside>
      )}

      {/* PWA In-App Install Prompt Banner */}
      {!isInstalled && !installDismissed && (isInstallable || isIOS) && (
        <aside aria-label="অ্যাপ ইনস্টলেশন" className="bg-[#e3ecda] border-b border-[#c8deba] px-4 py-2 text-xs text-[#143d2b] font-bengali transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#1b4332] text-[#b8d56d] flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-xs text-[#143d2b]">ShopnoTory অ্যাপ ফোনে চালান</p>
                <p className="text-[10px] text-[#525a4c]">দ্রুত ব্রাউজিং ও হোম স্ক্রিন থেকে সহজ কেনাকাটা</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isInstallable && (
                <button
                  onClick={install}
                  className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-xs active:scale-95 transition"
                >
                  <Download className="w-3 h-3 text-[#b8d56d]" /> ইনস্টল করুন
                </button>
              )}

              {isIOS && (
                <button
                  onClick={() => setShowIOSGuide(true)}
                  className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-xs active:scale-95 transition"
                >
                  <Share2 className="w-3 h-3 text-[#b8d56d]" /> ইনস্টল গাইড
                </button>
              )}

              <button
                onClick={() => setInstallDismissed(true)}
                className="p-1 text-stone-500 hover:text-stone-800"
                aria-label="বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* iOS Installation Instruction Modal */}
      {showIOSGuide && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 safe-bottom animate-in zoom-in-95 duration-200 text-center space-y-4 font-bengali"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-[#e3ecda] text-[#1b4332] flex items-center justify-center mx-auto">
              <Share2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-[#143d2b]">iPhone / iPad-এ অ্যাপ হিসেবে সেভ করুন</h3>
              <p className="text-xs text-stone-500 mt-1">
                Safari ব্রাউজার থেকে সহজ দুই ধাপে হোম স্ক্রিনে যুক্ত করুন:
              </p>
            </div>

            <div className="bg-[#fbfaf7] p-4 rounded-2xl border border-[#ede9de] text-left text-xs space-y-2.5">
              <p className="text-[#143d2b]">
                ১. নিচে Safari টুলবারের <strong>Share</strong> বাটনে ট্যাপ করুন।
              </p>
              <p className="text-[#143d2b]">
                ২. মেনু স্ক্রোল করে <strong>"Add to Home Screen"</strong> বেছে নিন।
              </p>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 bg-[#1b4332] text-white rounded-xl text-xs font-bold"
            >
              বুঝেছি, ধন্যবাদ
            </button>
          </div>
        </div>
      )}

      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <BottomPromoBar />
      <MobileBottomNav />
    </div>
  );
}

// Global Toast Renderer
function ToastAlert() {
  const { toast } = useShop();
  if (!toast) return null;

  return (
    <div className="fixed bottom-16 md:bottom-12 left-1/2 -translate-x-1/2 z-50 bg-[#143d2b] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 border border-[#2b5840] max-w-[90vw] truncate font-bengali animate-in fade-in slide-in-from-bottom-2 duration-150">
      <Sparkles className="w-4 h-4 text-[#b8d56d] shrink-0" />
      <span className="truncate">{toast}</span>
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Storefront Routes with Common Header & Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/our-story" element={<OurStoryPage />} />
            <Route path="/why-shoptory" element={<WhyShopnoToryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
          </Route>

          {/* Admin Routes with Clean Dedicated Layout */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Routes>
        <ToastAlert />
      </BrowserRouter>
    </ShopProvider>
  );
}
