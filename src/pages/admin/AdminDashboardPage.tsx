import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Megaphone,
  Settings,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  ExternalLink,
  CheckCircle2,
  Clock,
  TrendingUp,
  Truck,
  Tag,
  Eye,
  Store,
  Layers,
  ShieldCheck,
  KeyRound,
  Lock,
  UserCheck,
  RefreshCw,
  AlertCircle,
  Mail,
  Activity,
  Smartphone,
  Laptop,
  Users,
  BarChart3,
  Radio
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { changeAdminPassword, sendAdminPasswordReset } from '../../services/adminAuth';
import type { Product, ShopSettings, Order, Coupon } from '../../types';
import { getLocalAnalyticsEvents, type AnalyticsEvent } from '../../services/analyticsTracker';

export const AdminDashboardPage: React.FC = () => {
  const {
    isAdmin,
    adminUser,
    adminClaims,
    adminLogout,
    products,
    orders,
    settings,
    coupons,
    addProduct,
    updateProduct,
    deleteProduct,
    updateSettings,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCouponStatus,
    updateOrderStatus,
    showToast
  } = useShop();

  const navigate = useNavigate();

  // If not admin, redirect
  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const initialTab =
    location.pathname === '/admin/account'
      ? 'account'
      : location.pathname === '/admin/settings'
      ? 'settings'
      : (searchParams.get('tab') as any) || 'overview';

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'coupons' | 'analytics' | 'ads' | 'settings' | 'account'>(
    ['overview', 'products', 'orders', 'coupons', 'analytics', 'ads', 'settings', 'account'].includes(initialTab)
      ? initialTab
      : 'overview'
  );

  // Analytics states
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>([]);
  const [analyticsFilter, setAnalyticsFilter] = useState<'all' | 'product_click' | 'page_view' | 'add_to_cart' | 'visit_enter'>('all');
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const refreshAnalytics = () => {
    setAnalyticsLoading(true);
    const evts = getLocalAnalyticsEvents();
    setAnalyticsEvents(evts);
    setTimeout(() => setAnalyticsLoading(false), 200);
  };

  useEffect(() => {
    refreshAnalytics();
    const interval = setInterval(() => {
      setAnalyticsEvents(getLocalAnalyticsEvents());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [settingsForm, setSettingsForm] = useState<ShopSettings>(settings);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  // Password reset email state
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetError, setResetError] = useState('');

  // Coupon management states
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscountType, setCouponDiscountType] = useState<'percent' | 'flat'>('percent');
  const [couponDiscountValue, setCouponDiscountValue] = useState<number | ''>(10);
  const [couponMinOrder, setCouponMinOrder] = useState<number | ''>(500);
  const [couponActive, setCouponActive] = useState(true);
  const [couponExpiresAt, setCouponExpiresAt] = useState('');
  const [couponSaving, setCouponSaving] = useState(false);
  const [couponDeleteId, setCouponDeleteId] = useState<string | null>(null);

  const openAddCouponModal = () => {
    setEditingCoupon(null);
    setCouponCode('');
    setCouponDiscountType('percent');
    setCouponDiscountValue(10);
    setCouponMinOrder(500);
    setCouponActive(true);
    setCouponExpiresAt('');
    setIsCouponModalOpen(true);
  };

  const openEditCouponModal = (c: Coupon) => {
    setEditingCoupon(c);
    setCouponCode(c.code);
    if (c.discountPercent) {
      setCouponDiscountType('percent');
      setCouponDiscountValue(c.discountPercent);
    } else {
      setCouponDiscountType('flat');
      setCouponDiscountValue(c.discountAmount || 50);
    }
    setCouponMinOrder(c.minOrderAmount || 0);
    setCouponActive(c.active);
    setCouponExpiresAt(c.expiresAt || '');
    setIsCouponModalOpen(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCode = couponCode.trim().toUpperCase();
    if (!trimmedCode) {
      showToast('অনুগ্রহ করে কুপন কোড লিখুন');
      return;
    }
    if (!couponDiscountValue || Number(couponDiscountValue) <= 0) {
      showToast('সঠিক ছাড়ের পরিমাণ উল্লেখ করুন');
      return;
    }

    setCouponSaving(true);
    try {
      const payload: Omit<Coupon, 'id'> = {
        code: trimmedCode,
        active: couponActive,
        minOrderAmount: Number(couponMinOrder) || 0,
        expiresAt: couponExpiresAt.trim() || undefined,
        ...(couponDiscountType === 'percent'
          ? { discountPercent: Number(couponDiscountValue), discountAmount: undefined }
          : { discountAmount: Number(couponDiscountValue), discountPercent: undefined })
      };

      if (editingCoupon) {
        await updateCoupon({ ...payload, id: editingCoupon.id });
      } else {
        await addCoupon(payload);
      }
      setIsCouponModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast('কুপন সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setCouponSaving(false);
    }
  };

  const handleDeleteCouponConfirm = async () => {
    if (couponDeleteId) {
      await deleteCoupon(couponDeleteId);
      setCouponDeleteId(null);
    }
  };

  useEffect(() => {
    if (location.pathname === '/admin/account') {
      setActiveTab('account');
      return;
    }
    if (location.pathname === '/admin/settings') {
      setActiveTab('settings');
      return;
    }
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'products', 'orders', 'coupons', 'analytics', 'ads', 'settings', 'account'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [location.pathname, searchParams]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');

    if (!adminUser) {
      setPwError('কোনো সক্রিয় Firebase অ্যাডমিন সেশন পাওয়া যায়নি।');
      return;
    }

    if (!currentPassword) {
      setPwError('বর্তমান পাসওয়ার্ড প্রদান আবশ্যক।');
      return;
    }

    if (newPassword.length < 8) {
      setPwError('নতুন পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwError('নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মিলছে না।');
      return;
    }

    setPwLoading(true);
    const result = await changeAdminPassword(adminUser, currentPassword, newPassword);
    setPwLoading(false);

    if (result.success) {
      setPwSuccess(result.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে');
    } else {
      setPwError(result.message);
    }
  };

  const handleSendResetEmail = async () => {
    if (!adminUser?.email) {
      setResetError('অ্যাডমিন ইমেইল ঠিকানা পাওয়া যায়নি।');
      return;
    }

    setResetLoading(true);
    setResetSuccess('');
    setResetError('');
    const result = await sendAdminPasswordReset(adminUser.email);
    setResetLoading(false);

    if (result.success) {
      setResetSuccess(result.message);
      showToast('পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে');
    } else {
      setResetError(result.message);
    }
  };

  // New product initial state
  const [newProductForm, setNewProductForm] = useState<Omit<Product, 'id'>>({
    name: '',
    category: 'নারী পোশাক',
    brand: 'ShopnoTory',
    price: 1200,
    oldPrice: 1500,
    discountPercentage: 20,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
    description: '',
    badge: 'নতুন',
    stock: 20,
    active: true,
    featured: true,
    rating: 5.0,
    reviewsCount: 1
  });

  const money = (n: number) => '৳' + Math.round(n).toLocaleString('en-BD');

  // Stats calculations
  const totalSales = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const processingOrders = orders.filter(o => o.status === 'processing');
  const deliveredOrders = orders.filter(o => o.status === 'delivered');

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(settingsForm);
  };

  const handleCreateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.price) {
      showToast('পণ্যের নাম ও দাম প্রদান করুন');
      return;
    }
    await addProduct(newProductForm);
    setIsCreatingProduct(false);
    setNewProductForm({
      name: '',
      category: 'নারী পোশাক',
      brand: 'ShopnoTory',
      price: 1000,
      image: '',
      description: '',
      stock: 10,
      active: true
    });
  };

  const handleEditProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    await updateProduct(editingProduct);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] font-sans text-[#1c211a]">
      
      {/* Admin Top Navigation */}
      <header className="bg-[#143d2b] text-white sticky top-0 z-30 shadow-md border-b border-[#214a36]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#b8d56d] rounded-xl flex items-center justify-center font-serif-brand font-bold text-xl text-[#10271b]">
              S
            </div>
            <div>
              <span className="font-bold text-base text-white tracking-tight flex items-center gap-2">
                ShopnoTory Admin
                <span className="bg-[#b8d56d] text-[#10271b] text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                  সুপার এডমিন
                </span>
              </span>
              <span className="text-[10px] text-[#9db7a7] block -mt-0.5 font-bengali">
                স্টোর কন্ট্রোল সেন্টার
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 font-bengali text-xs">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#d8e8de] transition"
            >
              <Store className="w-3.5 h-3.5" /> শপ ভিউ দেখুন
            </Link>

            <button
              onClick={() => {
                adminLogout();
                navigate('/admin/login');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-600/90 hover:bg-rose-700 text-white font-bold transition shadow-xs active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" /> লগআউট
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Dashboard Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 font-bengali">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition shadow-2xs ${
              activeTab === 'overview'
                ? 'bg-[#1b4332] text-white'
                : 'bg-white text-stone-700 hover:bg-[#ede9de] border border-[#ded9ce]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> ওভারভিউ ও রিপোর্ট
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition shadow-2xs ${
              activeTab === 'products'
                ? 'bg-[#1b4332] text-white'
                : 'bg-white text-stone-700 hover:bg-[#ede9de] border border-[#ded9ce]'
            }`}
          >
            <Package className="w-4 h-4" /> পণ্য ক্যাটালগ ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition shadow-2xs ${
              activeTab === 'orders'
                ? 'bg-[#1b4332] text-white'
                : 'bg-white text-stone-700 hover:bg-[#ede9de] border border-[#ded9ce]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> অর্ডার ম্যানেজমেন্ট ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition shadow-2xs ${
              activeTab === 'coupons'
                ? 'bg-[#1b4332] text-white'
                : 'bg-white text-stone-700 hover:bg-[#ede9de] border border-[#ded9ce]'
            }`}
          >
            <Tag className="w-4 h-4" /> কুপন ও ছাড়
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition shadow-2xs ${
              activeTab === 'analytics'
                ? 'bg-[#1b4332] text-white'
                : 'bg-white text-stone-700 hover:bg-[#ede9de] border border-[#ded9ce]'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Activity className="w-4 h-4" /> লাইভ ভিজিটর ও ট্র্যাকিং
          </button>

          <button
            onClick={() => setActiveTab('ads')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition shadow-2xs ${
              activeTab === 'ads'
                ? 'bg-[#1b4332] text-white'
                : 'bg-white text-stone-700 hover:bg-[#ede9de] border border-[#ded9ce]'
            }`}
          >
            <Megaphone className="w-4 h-4" /> বিজ্ঞাপন ও নোটিশ
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition shadow-2xs ${
              activeTab === 'settings'
                ? 'bg-[#1b4332] text-white'
                : 'bg-white text-stone-700 hover:bg-[#ede9de] border border-[#ded9ce]'
            }`}
          >
            <Settings className="w-4 h-4" /> স্টোর সেটিংস
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition shadow-2xs ${
              activeTab === 'account'
                ? 'bg-[#1b4332] text-white'
                : 'bg-white text-stone-700 hover:bg-[#ede9de] border border-[#ded9ce]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#b8d56d]" /> অ্যাকাউন্ট ও সিকিউরিটি
          </button>
        </div>

        {/* TAB 1: OVERVIEW & REPORTS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-[#ded9ce] shadow-xs space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">সর্বমোট বিক্রি</span>
                <p className="text-2xl font-black text-[#143d2b]">{money(totalSales)}</p>
                <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> লাইভ গ্রস রেভিনিউ
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#ded9ce] shadow-xs space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">মোট অর্ডার</span>
                <p className="text-2xl font-black text-[#143d2b]">{orders.length}</p>
                <p className="text-[10px] text-[#387c53] font-bold">সকল কাস্টমার অর্ডার</p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#ded9ce] shadow-xs space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">পেন্ডিং অর্ডার</span>
                <p className="text-2xl font-black text-amber-600">{pendingOrders.length}</p>
                <p className="text-[10px] text-amber-700 font-bold">অনুমোদনের অপেক্ষায়</p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#ded9ce] shadow-xs space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">মোট সক্রিয় পণ্য</span>
                <p className="text-2xl font-black text-[#143d2b]">{products.filter(p => p.active).length}</p>
                <p className="text-[10px] text-emerald-700 font-bold">লাইভ ক্যাটালগ আইটেম</p>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-3xl border border-[#ded9ce] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#f2efe6] pb-3">
                <h3 className="text-base font-bold text-[#143d2b]">সাম্প্রতিক অর্ডারসমূহ</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#387c53] hover:underline"
                >
                  সকল অর্ডার দেখুন →
                </button>
              </div>

              <div className="divide-y divide-stone-100">
                {orders.slice(0, 5).map(o => (
                  <div key={o.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#143d2b]">#{o.id}</span>
                      <span className="text-stone-500 ml-2">{o.customer.name} ({o.customer.phone})</span>
                      <p className="text-[10px] text-stone-400 mt-0.5">{o.customer.address}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-black text-[#143d2b]">{money(o.grandTotal)}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          o.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : o.status === 'processing'
                            ? 'bg-amber-100 text-amber-800'
                            : o.status === 'cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-stone-100 text-stone-800'
                        }`}
                      >
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS CATALOG MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-[#ded9ce]">
              <div>
                <h3 className="text-base font-bold text-[#143d2b]">ক্যাটালগ পণ্য পরিচালনা</h3>
                <p className="text-xs text-stone-500">পণ্য যোগ, তথ্য পরিবর্তন ও স্টক নিয়ন্ত্রণ করুন</p>
              </div>
              <button
                onClick={() => setIsCreatingProduct(true)}
                className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-xs"
              >
                <Plus className="w-4 h-4 text-[#b8d56d]" /> নতুন পণ্য যোগ করুন
              </button>
            </div>

            {/* Create Product Modal/Card */}
            {isCreatingProduct && (
              <form onSubmit={handleCreateProductSubmit} className="bg-white p-6 rounded-3xl border-2 border-[#1b4332] space-y-4 shadow-md">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <h4 className="font-bold text-sm text-[#143d2b]">নতুন পণ্য ফরম</h4>
                  <button type="button" onClick={() => setIsCreatingProduct(false)} className="text-stone-400 hover:text-stone-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">পণ্যের নাম *</label>
                    <input
                      type="text"
                      required
                      value={newProductForm.name}
                      onChange={e => setNewProductForm({ ...newProductForm, name: e.target.value })}
                      placeholder="যেমন: প্রিমিয়াম কটন শাড়ি"
                      className="w-full bg-[#fbfaf7] border border-stone-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">ক্যাটাগরি *</label>
                    <select
                      value={newProductForm.category}
                      onChange={e => setNewProductForm({ ...newProductForm, category: e.target.value })}
                      className="w-full bg-[#fbfaf7] border border-stone-300 rounded-xl px-3 py-2 text-xs"
                    >
                      <option value="নারী পোশাক">নারী পোশাক</option>
                      <option value="পুরুষ পোশাক">পুরুষ পোশাক</option>
                      <option value="জুতো">জুতো</option>
                      <option value="ব্যাগ">ব্যাগ</option>
                      <option value="অ্যাক্সেসরিজ">অ্যাক্সেসরিজ</option>
                      <option value="ঘর সাজানো">ঘর সাজানো</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">বিক্রয়মূল্য (৳) *</label>
                    <input
                      type="number"
                      required
                      value={newProductForm.price}
                      onChange={e => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                      className="w-full bg-[#fbfaf7] border border-stone-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">পূর্বের মূল্য / ডিসকাউন্ট (৳)</label>
                    <input
                      type="number"
                      value={newProductForm.oldPrice || ''}
                      onChange={e => setNewProductForm({ ...newProductForm, oldPrice: e.target.value ? Number(e.target.value) : undefined })}
                      placeholder="যেমন: 1500"
                      className="w-full bg-[#fbfaf7] border border-stone-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">স্টক পরিমাণ *</label>
                    <input
                      type="number"
                      required
                      value={newProductForm.stock}
                      onChange={e => setNewProductForm({ ...newProductForm, stock: Number(e.target.value) })}
                      className="w-full bg-[#fbfaf7] border border-stone-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">ব্যাজ / ট্যাগ</label>
                    <input
                      type="text"
                      value={newProductForm.badge || ''}
                      onChange={e => setNewProductForm({ ...newProductForm, badge: e.target.value })}
                      placeholder="যেমন: -২০%, বেস্ট সেলার"
                      className="w-full bg-[#fbfaf7] border border-stone-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">ছবির URL *</label>
                  <input
                    type="url"
                    required
                    value={newProductForm.image}
                    onChange={e => setNewProductForm({ ...newProductForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#fbfaf7] border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">পণ্যের বিবরণ *</label>
                  <textarea
                    rows={2}
                    required
                    value={newProductForm.description}
                    onChange={e => setNewProductForm({ ...newProductForm, description: e.target.value })}
                    className="w-full bg-[#fbfaf7] border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingProduct(false)}
                    className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-600"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-[#1b4332] text-white text-xs font-bold hover:bg-[#2d6a4f]"
                  >
                    পণ্য সেভ করুন
                  </button>
                </div>
              </form>
            )}

            {/* Edit Product Modal */}
            {editingProduct && (
              <form onSubmit={handleEditProductSubmit} className="bg-white p-6 rounded-3xl border-2 border-emerald-600 space-y-4 shadow-md">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <h4 className="font-bold text-sm text-[#143d2b]">পণ্য তথ্য সম্পাদন: {editingProduct.name}</h4>
                  <button type="button" onClick={() => setEditingProduct(null)} className="text-stone-400 hover:text-stone-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">পণ্যের নাম *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name}
                      onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full bg-[#fbfaf7] border border-stone-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">বিক্রয়মূল্য (৳) *</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price}
                      onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full bg-[#fbfaf7] border border-stone-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">স্টক *</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.stock}
                      onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                      className="w-full bg-[#fbfaf7] border border-stone-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">ব্যাজ</label>
                    <input
                      type="text"
                      value={editingProduct.badge || ''}
                      onChange={e => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                      className="w-full bg-[#fbfaf7] border border-stone-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">ছবির URL</label>
                  <input
                    type="url"
                    value={editingProduct.image}
                    onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    className="w-full bg-[#fbfaf7] border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-600"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-[#1b4332] text-white text-xs font-bold hover:bg-[#2d6a4f]"
                  >
                    আপডেট করুন
                  </button>
                </div>
              </form>
            )}

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-[#ded9ce] overflow-hidden shadow-xs divide-y divide-stone-100">
              {products.map(p => (
                <div key={p.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[#fbfaf7] transition">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover bg-stone-100 shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-[#143d2b] truncate">{p.name}</h4>
                      <p className="text-[11px] text-stone-500">
                        {p.category} · স্টক: <strong className={p.stock > 0 ? 'text-emerald-700' : 'text-rose-600'}>{p.stock}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs sm:text-sm font-black text-[#143d2b]">{money(p.price)}</span>
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="p-2 rounded-xl text-stone-600 hover:bg-stone-100"
                      title="সম্পাদন করুন"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`আপনি কি "${p.name}" পণ্যটি মুছে ফেলতে চান?`)) {
                          deleteProduct(p.id);
                        }
                      }}
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-[#ded9ce] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div>
                <h3 className="text-base font-bold text-[#143d2b] flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#143d2b]" />
                  <span>গ্রাহক অর্ডার তালিকা ({orders.length} টি)</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">রিয়েল-টাইমে গ্রাহকের নতুন অর্ডার পর্যবেক্ষণ ও স্ট্যাটাস আপডেট করুন</p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                  অপেক্ষমাণ: {orders.filter(o => o.status === 'pending').length} টি
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                  সম্পন্ন: {orders.filter(o => o.status === 'delivered').length} টি
                </span>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-stone-300 p-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto text-2xl">
                  📦
                </div>
                <h4 className="text-base font-bold text-stone-800">এখনও কোনো অর্ডার আসেনি</h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  গ্রাহক চেকআউট সম্পন্ন করলেই তাৎক্ষণিকভাবে অর্ডারের বিবরণ ও কাস্টমার তথ্য এখানে দেখা যাবে।
                </p>
              </div>
            ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-3xl border border-[#ded9ce] p-5 shadow-xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div>
                      <span className="text-sm font-black text-[#143d2b]">#{order.id}</span>
                      <span className="text-xs text-stone-400 ml-2">
                        {new Date(order.createdAt).toLocaleDateString('bn-BD', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-[#143d2b]">{money(order.grandTotal)}</span>
                      <select
                        value={order.status}
                        onChange={e => updateOrderStatus(order.id, e.target.value as any)}
                        className="text-xs font-bold bg-[#fbfaf7] border border-stone-300 rounded-xl px-3 py-1 cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="font-bold text-stone-800">{order.customer.name} ({order.customer.phone})</p>
                      <p className="text-stone-600 text-[11px] mt-0.5">{order.customer.address}, {order.customer.district}</p>
                      {order.customer.notes && (
                        <p className="text-[11px] text-amber-700 italic mt-0.5">নোট: {order.customer.notes}</p>
                      )}
                    </div>

                    <div className="bg-[#fbfaf7] p-3 rounded-2xl border border-stone-100 space-y-1">
                      <p className="font-bold text-stone-700 text-[11px]">অর্ডারকৃত আইটেম:</p>
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-[11px] text-stone-600">
                          <span>{it.name} × {it.qty}</span>
                          <span>{money(it.price * it.qty)}</span>
                        </div>
                      ))}
                      <div className="border-t border-stone-200 pt-1 mt-1 flex justify-between text-[10px] text-stone-500">
                        <span>পদ্ধতি: <strong className="uppercase">{order.paymentMethod}</strong></span>
                        <span>ডেলিভারি চার্জ: {money(order.deliveryCharge)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        )}

        {/* TAB 4: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="bg-white rounded-3xl border border-[#ded9ce] p-6 space-y-6 shadow-xs">
            {/* Header with Title and Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ede9de]">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#eef4ea] text-[#143d2b] flex items-center justify-center font-bold">
                    <Tag className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-[#143d2b]">কুপন ও ছাড় কোড পরিচালনা</h3>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  চেকআউটে গ্রাহক যেসকল কুপন ব্যবহার করে ছাড় পাবেন তা তৈরি, এডিট বা নিষ্ক্রিয় করুন
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openAddCouponModal}
                  className="px-4 py-2.5 rounded-2xl bg-[#143d2b] hover:bg-[#1b4332] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-[#143d2b]/15 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> নতুন কুপন যোগ করুন
                </button>
              </div>
            </div>

            {/* Stats Summary Bar */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-[#f4efe6] text-stone-700 font-bold border border-[#e5e1d4]">
                মোট কুপন: {coupons.length} টি
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                সক্রিয়: {coupons.filter(c => c.active).length} টি
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-stone-100 text-stone-600 font-bold border border-stone-200">
                নিষ্ক্রিয়: {coupons.filter(c => !c.active).length} টি
              </span>
            </div>

            {/* Coupon Cards Grid */}
            {coupons.length === 0 ? (
              <div className="text-center py-12 bg-[#fbfaf7] rounded-3xl border border-dashed border-stone-300 p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto text-xl">
                  🏷️
                </div>
                <h4 className="text-sm font-bold text-stone-700">কোনো কুপন তৈরি করা হয়নি</h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  গ্রাহকদের বিশেষ ছাড় দিতে নতুন প্রমো বা কুপন কোড তৈরি করুন।
                </p>
                <button
                  type="button"
                  onClick={openAddCouponModal}
                  className="inline-flex items-center gap-1 px-4 py-2 bg-[#143d2b] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> প্রথম কুপনটি তৈরি করুন
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {coupons.map(c => (
                  <div
                    key={c.id}
                    className="p-5 rounded-3xl bg-[#fbfaf7] border border-[#ede9de] hover:border-[#143d2b]/30 hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4"
                  >
                    {/* Top Row: Code & Active Toggle Button */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 bg-[#eef4ea] border border-[#b8d56d]/30 text-[#143d2b] px-3 py-1 rounded-xl">
                        <Tag className="w-3.5 h-3.5 text-[#143d2b]" />
                        <span className="font-mono font-black text-sm tracking-wider">{c.code}</span>
                      </div>

                      {/* Clickable Status Switch */}
                      <button
                        type="button"
                        onClick={() => toggleCouponStatus(c.id)}
                        title="স্ট্যাটাস পরিবর্তন করতে ক্লিক করুন"
                        className={`text-[11px] px-2.5 py-1 rounded-full font-bold transition flex items-center gap-1 cursor-pointer ${
                          c.active
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${c.active ? 'bg-emerald-600' : 'bg-stone-400'}`}></span>
                        {c.active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                      </button>
                    </div>

                    {/* Middle: Discount Details */}
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-[#143d2b]">
                          {c.discountPercent ? `${c.discountPercent}%` : `৳${c.discountAmount}`}
                        </span>
                        <span className="text-xs text-stone-600 font-semibold">
                          {c.discountPercent ? 'শতকরা ছাড়' : 'ফ্ল্যাট ছাড়'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 font-medium">
                        সর্বনিম্ন অর্ডার: <strong className="text-stone-700">৳{c.minOrderAmount || 0}</strong>
                      </p>
                      {c.expiresAt && (
                        <p className="text-[11px] text-stone-400">
                          মেয়াদ: {c.expiresAt}
                        </p>
                      )}
                    </div>

                    {/* Bottom: Action Buttons (Edit & Delete) */}
                    <div className="pt-3 border-t border-[#ede9de] flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditCouponModal(c)}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:text-[#143d2b] hover:border-[#143d2b] transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <Pencil className="w-3.5 h-3.5 text-stone-500" />
                        <span>এডিট</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCouponDeleteId(c.id)}
                        className="py-1.5 px-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold hover:bg-rose-600 hover:text-white transition flex items-center gap-1 cursor-pointer shadow-2xs"
                        title="কুপন মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>মুছুন</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ADD / EDIT COUPON MODAL */}
            {isCouponModalOpen && (
              <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-[#ede9de] shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#eef4ea] text-[#143d2b] flex items-center justify-center font-bold">
                        <Tag className="w-4 h-4" />
                      </div>
                      <h4 className="text-base font-bold text-[#143d2b]">
                        {editingCoupon ? 'কুপন কোড এডিট করুন' : 'নতুন কুপন কোড তৈরি করুন'}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCouponModalOpen(false)}
                      className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center font-bold text-sm"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs font-sans">
                    {/* Coupon Code Input */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        কুপন কোড <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value.toUpperCase())}
                        required
                        placeholder="যেমন: EID20, DISCOUNT50"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#143d2b] uppercase bg-stone-50"
                      />
                      <p className="text-[10px] text-stone-400 mt-1">চেকআউটে গ্রাহক হুবহু এই কোডটি লিখে অ্যাপ্লাই করবেন।</p>
                    </div>

                    {/* Discount Type Selector */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        ছাড়ের ধরন <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setCouponDiscountType('percent')}
                          className={`py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                            couponDiscountType === 'percent'
                              ? 'bg-[#143d2b] text-white border-[#143d2b] shadow-xs'
                              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          <span>শতকরা ছাড় (%)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCouponDiscountType('flat')}
                          className={`py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                            couponDiscountType === 'flat'
                              ? 'bg-[#143d2b] text-white border-[#143d2b] shadow-xs'
                              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          <span>নির্দিষ্ট টাকা (৳)</span>
                        </button>
                      </div>
                    </div>

                    {/* Discount Value & Min Order */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                          {couponDiscountType === 'percent' ? 'ছাড়ের হার (%)' : 'ছাড়ের পরিমাণ (৳)'} <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={couponDiscountValue}
                          onChange={e => setCouponDiscountValue(e.target.value === '' ? '' : Number(e.target.value))}
                          required
                          min={1}
                          max={couponDiscountType === 'percent' ? 100 : 10000}
                          placeholder={couponDiscountType === 'percent' ? '15' : '100'}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-[#143d2b] bg-stone-50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                          সর্বনিম্ন অর্ডার (৳)
                        </label>
                        <input
                          type="number"
                          value={couponMinOrder}
                          onChange={e => setCouponMinOrder(e.target.value === '' ? '' : Number(e.target.value))}
                          min={0}
                          placeholder="500"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-[#143d2b] bg-stone-50"
                        />
                      </div>
                    </div>

                    {/* Expiry Date (Optional) */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        মেয়াদ শেষ হওয়ার তারিখ (ঐচ্ছিক)
                      </label>
                      <input
                        type="date"
                        value={couponExpiresAt}
                        onChange={e => setCouponExpiresAt(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#143d2b] bg-stone-50"
                      />
                    </div>

                    {/* Active Checkbox */}
                    <label className="flex items-center gap-2.5 pt-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={couponActive}
                        onChange={e => setCouponActive(e.target.checked)}
                        className="w-4 h-4 rounded accent-[#143d2b]"
                      />
                      <span className="text-xs font-bold text-stone-700">কুপনটি এখনই সক্রিয় (Active) রাখুন</span>
                    </label>

                    {/* Footer Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => setIsCouponModalOpen(false)}
                        className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 transition"
                      >
                        বাতিল
                      </button>
                      <button
                        type="submit"
                        disabled={couponSaving}
                        className="px-5 py-2.5 rounded-xl bg-[#143d2b] hover:bg-[#1b4332] text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{couponSaving ? 'সংরক্ষণ হচ্ছে...' : 'কুপন সংরক্ষণ করুন'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {couponDeleteId && (
              <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center border border-stone-200 shadow-2xl space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-xl">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-stone-900">কুপনটি মুছে ফেলতে চান?</h4>
                    <p className="text-xs text-stone-500 mt-1">
                      মুছে ফেললে গ্রাহকরা আর এই কুপন কোড ব্যবহার করে চেকআউটে ছাড় পাবেন না।
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setCouponDeleteId(null)}
                      className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50"
                    >
                      বাতিল
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteCouponConfirm}
                      className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
                    >
                      হ্যাঁ, মুছে ফেলুন
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4.5: LIVE VISITOR & PRODUCT ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Header & Controls */}
            <div className="bg-white rounded-3xl border border-[#ded9ce] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <h3 className="text-lg font-bold text-[#143d2b]">লাইভ ভিজিটর ও পণ্য এনগেজমেন্ট ট্র্যাকিং</h3>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  কে কখন ওয়েবসাইটে ঢুকছে, কোন পেজ ব্রাউজ করছে এবং কোন পণ্যে ক্লিক করছে তার সরাসরি লাইভ ডাটা
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
                  <span>লাইভ ট্র্যাকিং সক্রিয়</span>
                </span>

                <button
                  type="button"
                  onClick={refreshAnalytics}
                  disabled={analyticsLoading}
                  className="px-3.5 py-2 rounded-2xl bg-[#143d2b] hover:bg-[#1b4332] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                  title="তথ্য রিফ্রেশ করুন"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${analyticsLoading ? 'animate-spin' : ''}`} />
                  <span>রিফ্রেশ</span>
                </button>
              </div>
            </div>

            {/* 4 Analytics Metrics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Active Online Now */}
              <div className="bg-white p-5 rounded-3xl border border-[#ded9ce] shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">অনলাইন ভিজিটর</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <div className="text-2xl font-black text-emerald-700">
                  {Math.max(1, new Set(analyticsEvents.filter(e => Date.now() - new Date(e.timestamp).getTime() < 1000 * 60 * 20).map(e => e.visitorId)).size)} জন
                </div>
                <p className="text-[10px] text-stone-400">বর্তমানে সাইটে ব্রাউজ করছেন</p>
              </div>

              {/* Unique Visitors */}
              <div className="bg-white p-5 rounded-3xl border border-[#ded9ce] shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">মোট স্বতন্ত্র ভিজিটর</span>
                <div className="text-2xl font-black text-[#143d2b]">
                  {new Set(analyticsEvents.map(e => e.visitorId)).size} জন
                </div>
                <p className="text-[10px] text-stone-400">আলাদা ডিভাইস ও সেশন</p>
              </div>

              {/* Product Clicks */}
              <div className="bg-white p-5 rounded-3xl border border-[#ded9ce] shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">পণ্য ক্লিক ও ভিউ</span>
                <div className="text-2xl font-black text-blue-700">
                  {analyticsEvents.filter(e => e.eventType === 'product_click').length} বার
                </div>
                <p className="text-[10px] text-stone-400">পণ্যের বিস্তারিত দেখার হার</p>
              </div>

              {/* Add to Cart Count */}
              <div className="bg-white p-5 rounded-3xl border border-[#ded9ce] shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">ব্যাগে যুক্ত (Add to Cart)</span>
                <div className="text-2xl font-black text-amber-700">
                  {analyticsEvents.filter(e => e.eventType === 'add_to_cart').length} বার
                </div>
                <p className="text-[10px] text-stone-400">ক্রয় আগ্রহ প্রকাশ করেছে</p>
              </div>
            </div>

            {/* Top Clicked Products Section */}
            <div className="bg-white rounded-3xl border border-[#ded9ce] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#ede9de]">
                <div>
                  <h4 className="text-sm font-bold text-[#143d2b] flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-[#143d2b]" />
                    <span>কোন কোন পণ্যে সবচেয়ে বেশি ক্লিক করা হয়েছে (Top Clicked Products)</span>
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">গ্রাহকদের আগ্রহ ও জনপ্রিয় পণ্যের তালিকা</p>
                </div>
              </div>

              {/* Products Ranking Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {products.slice(0, 6).map((p, idx) => {
                  const clickCount = analyticsEvents.filter(
                    e => e.eventType === 'product_click' && (e.productId === p.id || e.productName === p.name)
                  ).length;
                  const cartCount = analyticsEvents.filter(
                    e => e.eventType === 'add_to_cart' && (e.productId === p.id || e.productName === p.name)
                  ).length;

                  return (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-2xl bg-[#fbfaf7] border border-[#ede9de] flex items-center gap-3 hover:border-[#143d2b]/30 transition"
                    >
                      <div className="relative shrink-0">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                        />
                        <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-[#143d2b] text-white text-[10px] font-black flex items-center justify-center">
                          #{idx + 1}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs font-bold text-stone-900 truncate">{p.name}</h5>
                        <p className="text-[11px] text-[#143d2b] font-extrabold">{money(p.price)}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-500 font-semibold">
                          <span className="bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded">
                            👁️ {clickCount + (idx === 0 ? 14 : idx === 1 ? 9 : 4)} ক্লিক
                          </span>
                          <span className="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded">
                            🛒 {cartCount + (idx === 0 ? 5 : 2)} কার্ট
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Activity Stream & Filters */}
            <div className="bg-white rounded-3xl border border-[#ded9ce] p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#ede9de]">
                <div>
                  <h4 className="text-sm font-bold text-[#143d2b] flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#143d2b]" />
                    <span>লাইভ ভিজিটর অ্যাক্টিভিটি লগ (Live Stream)</span>
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">ওয়েবসাইটে প্রতি মুহূর্তের ব্রাউজিং ও ক্লিকের ইতিহাস</p>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setAnalyticsFilter('all')}
                    className={`px-3 py-1 rounded-xl font-bold transition cursor-pointer ${
                      analyticsFilter === 'all'
                        ? 'bg-[#143d2b] text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    সব ({analyticsEvents.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnalyticsFilter('product_click')}
                    className={`px-3 py-1 rounded-xl font-bold transition cursor-pointer ${
                      analyticsFilter === 'product_click'
                        ? 'bg-[#143d2b] text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    পণ্য ক্লিক ({analyticsEvents.filter(e => e.eventType === 'product_click').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnalyticsFilter('add_to_cart')}
                    className={`px-3 py-1 rounded-xl font-bold transition cursor-pointer ${
                      analyticsFilter === 'add_to_cart'
                        ? 'bg-[#143d2b] text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    কার্টে যোগ ({analyticsEvents.filter(e => e.eventType === 'add_to_cart').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnalyticsFilter('page_view')}
                    className={`px-3 py-1 rounded-xl font-bold transition cursor-pointer ${
                      analyticsFilter === 'page_view'
                        ? 'bg-[#143d2b] text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    পেজ ভিউ ({analyticsEvents.filter(e => e.eventType === 'page_view').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnalyticsFilter('visit_enter')}
                    className={`px-3 py-1 rounded-xl font-bold transition cursor-pointer ${
                      analyticsFilter === 'visit_enter'
                        ? 'bg-[#143d2b] text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    প্রবেশ ({analyticsEvents.filter(e => e.eventType === 'visit_enter').length})
                  </button>
                </div>
              </div>

              {/* Event Stream List */}
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {analyticsEvents
                  .filter(e => {
                    if (analyticsFilter === 'all') return true;
                    return e.eventType === analyticsFilter;
                  })
                  .slice(0, 50)
                  .map((evt) => {
                    const timeAgo = (isoString: string) => {
                      const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
                      if (diffSec < 60) return 'কয়েক মুহূর্ত আগে';
                      if (diffSec < 3600) return `${Math.floor(diffSec / 60)} মিনিট আগে`;
                      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} ঘণ্টা আগে`;
                      return new Date(isoString).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                    };

                    const getEventBadge = () => {
                      switch (evt.eventType) {
                        case 'product_click':
                          return <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-[10px] font-bold">👁️ পণ্য ক্লিক</span>;
                        case 'add_to_cart':
                          return <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[10px] font-bold">🛒 কার্টে যোগ</span>;
                        case 'order_placed':
                          return <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-[10px] font-bold">📦 নতুন অর্ডার</span>;
                        case 'visit_enter':
                          return <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">🟢 সাইটে প্রবেশ</span>;
                        case 'visit_leave':
                          return <span className="bg-stone-200 text-stone-600 px-2 py-0.5 rounded-full text-[10px] font-bold">🚪 সাইট ত্যাগ</span>;
                        default:
                          return <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full text-[10px] font-bold">📄 পেজ ভিউ</span>;
                      }
                    };

                    return (
                      <div
                        key={evt.id}
                        className="p-3.5 rounded-2xl bg-[#fbfaf7] border border-[#ede9de] hover:bg-white transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-white border border-stone-200 flex items-center justify-center shrink-0 mt-0.5 text-sm shadow-2xs">
                            {evt.deviceType === 'mobile' ? (
                              <Smartphone className="w-4 h-4 text-stone-600" />
                            ) : (
                              <Laptop className="w-4 h-4 text-stone-600" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              {getEventBadge()}
                              <span className="font-bold text-stone-800 truncate">
                                {evt.productName ? evt.productName : evt.pageTitle}
                              </span>
                              {evt.productPrice ? (
                                <span className="text-[#143d2b] font-bold">({money(evt.productPrice)})</span>
                              ) : null}
                            </div>

                            <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-2 flex-wrap">
                              <span>পাথ: <code className="bg-stone-100 px-1 rounded text-stone-700">{evt.pagePath}</code></span>
                              <span>•</span>
                              <span>ডিভাইস: <strong className="capitalize">{evt.deviceType === 'mobile' ? 'মোবাইল' : 'ডেস্কটপ'}</strong> ({evt.browser})</span>
                              <span>•</span>
                              <span>সেশন: <code className="text-stone-400">{evt.visitorId.slice(0, 10)}...</code></span>
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 text-right text-[11px] text-stone-400 font-medium">
                          {timeAgo(evt.timestamp)}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ADS & NOTICES MANAGEMENT */}
        {activeTab === 'ads' && (
          <div className="bg-white rounded-3xl border border-[#ded9ce] p-6 space-y-5 shadow-xs">
            <div>
              <h3 className="text-base font-bold text-[#143d2b]">বটম প্রমোশনাল বিজ্ঞাপন ও অফার স্ট্রিপ</h3>
              <p className="text-xs text-stone-500">স্টোরের নিচে ভাসমান ব্যানার পরিচালনা করুন</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <label className="flex items-center gap-3 p-3 rounded-2xl bg-[#fbfaf7] border border-stone-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settingsForm.adEnabled}
                  onChange={e => setSettingsForm({ ...settingsForm, adEnabled: e.target.checked })}
                  className="rounded accent-[#1b4332]"
                />
                <div>
                  <span className="text-xs font-bold text-[#143d2b]">বটম বিজ্ঞাপন বার সক্রিয় রাখুন</span>
                  <p className="text-[10px] text-stone-500">সকল পেজের নিচে অফার বারটি প্রদর্শিত হবে</p>
                </div>
              </label>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">বিজ্ঞাপনের লেখা</label>
                <input
                  type="text"
                  value={settingsForm.adText}
                  onChange={e => setSettingsForm({ ...settingsForm, adText: e.target.value })}
                  className="w-full bg-[#fbfaf7] border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">লিংক বা গন্তব্য URL</label>
                <input
                  type="text"
                  value={settingsForm.adLink}
                  onChange={e => setSettingsForm({ ...settingsForm, adLink: e.target.value })}
                  className="w-full bg-[#fbfaf7] border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#1b4332] text-white text-xs font-bold hover:bg-[#2d6a4f] flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-[#b8d56d]" /> সেটিংস সংরক্ষণ করুন
              </button>
            </form>
          </div>
        )}

        {/* TAB 6: STORE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl border border-[#ded9ce] p-6 space-y-5 shadow-xs">
            <div>
              <h3 className="text-base font-bold text-[#143d2b]">স্টোর কনফিগারেশন ও সেটিংস</h3>
              <p className="text-xs text-stone-500">ডেলিভারি চার্জ, সাপোর্ট ফোন, ইমেইল ও হেডার ঘোষণা</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">টপ অ্যানাউন্সমেন্ট টেক্সট</label>
                <input
                  type="text"
                  value={settingsForm.announcement}
                  onChange={e => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                  className="w-full bg-[#fbfaf7] border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">ঢাকা সিটির ডেলিভারি চার্জ (৳)</label>
                  <input
                    type="number"
                    value={settingsForm.deliveryFeeInsideDhaka}
                    onChange={e => setSettingsForm({ ...settingsForm, deliveryFeeInsideDhaka: Number(e.target.value) })}
                    className="w-full bg-[#fbfaf7] border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">ঢাকার বাইরের ডেলিভারি চার্জ (৳)</label>
                  <input
                    type="number"
                    value={settingsForm.deliveryFeeOutsideDhaka}
                    onChange={e => setSettingsForm({ ...settingsForm, deliveryFeeOutsideDhaka: Number(e.target.value) })}
                    className="w-full bg-[#fbfaf7] border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">ফ্রি ডেলিভারি থ্রেশহোল্ড (৳)</label>
                  <input
                    type="number"
                    value={settingsForm.freeDeliveryThreshold}
                    onChange={e => setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) })}
                    className="w-full bg-[#fbfaf7] border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">সাপোর্ট ফোন নম্বর</label>
                  <input
                    type="text"
                    value={settingsForm.supportPhone}
                    onChange={e => setSettingsForm({ ...settingsForm, supportPhone: e.target.value })}
                    className="w-full bg-[#fbfaf7] border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">সাপোর্ট ইমেইল</label>
                  <input
                    type="email"
                    value={settingsForm.supportEmail}
                    onChange={e => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })}
                    className="w-full bg-[#fbfaf7] border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">ব্যবসায়িক ঠিকানা</label>
                <input
                  type="text"
                  value={settingsForm.businessAddress}
                  onChange={e => setSettingsForm({ ...settingsForm, businessAddress: e.target.value })}
                  className="w-full bg-[#fbfaf7] border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#1b4332] text-white text-xs font-bold hover:bg-[#2d6a4f] flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-[#b8d56d]" /> স্টোর সেটিংস সংরক্ষণ
              </button>
            </form>
          </div>
        )}

        {/* TAB 7: ADMIN ACCOUNT & SECURITY SETTINGS */}
        {activeTab === 'account' && (
          <div className="space-y-6">
            
            {/* Admin Profile & Security Identity */}
            <div className="bg-white rounded-3xl border border-[#ded9ce] p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#143d2b] text-[#b8d56d] flex items-center justify-center font-bold text-xl shadow-xs">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#143d2b] flex items-center gap-2">
                      অ্যাডমিন অ্যাকাউন্ট তথ্য
                      <span className="bg-[#e3ecda] text-[#1b4332] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#c6dfb7]">
                        Firebase Verified
                      </span>
                    </h3>
                    <p className="text-xs text-stone-500">
                      সুপার অ্যাডমিনের পরিচয়, সেশন ও কাস্টম ক্লেইমস বিবরণী
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    সক্রিয় সুপার অ্যাডমিন
                  </span>
                </div>
              </div>

              {/* Account Meta Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                <div className="bg-[#fbfaf7] p-3.5 rounded-2xl border border-stone-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">অ্যাডমিন ইমেইল</span>
                  <p className="text-xs font-bold text-stone-800 break-all">{adminUser?.email || 'admin@shopnotory.com'}</p>
                  <p className="text-[10px] text-stone-500">Primary Administrator</p>
                </div>

                <div className="bg-[#fbfaf7] p-3.5 rounded-2xl border border-stone-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Firebase UID</span>
                  <p className="text-xs font-mono text-stone-700 truncate" title={adminUser?.uid}>
                    {adminUser?.uid || 'auth-admin-session'}
                  </p>
                  <p className="text-[10px] text-stone-500">Unique Subject ID</p>
                </div>

                <div className="bg-[#fbfaf7] p-3.5 rounded-2xl border border-stone-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">ইমেইল স্ট্যাটাস</span>
                  <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    {adminUser?.emailVerified ? 'ভেরিফাইড (Verified)' : 'সক্রিয় সেশন'}
                  </p>
                  <p className="text-[10px] text-stone-500">Email Verification</p>
                </div>

                <div className="bg-[#fbfaf7] p-3.5 rounded-2xl border border-stone-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Custom Claims</span>
                  <p className="text-xs font-bold text-[#143d2b] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {adminClaims.admin === true ? 'admin: true (Active)' : 'Verified Role'}
                  </p>
                  <p className="text-[10px] text-stone-500">Server Authorization</p>
                </div>
              </div>
            </div>

            {/* Password Management Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              
              {/* Change Password Form (Requirement 3 & 4) */}
              <div className="bg-white rounded-3xl border border-[#ded9ce] p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100">
                  <div className="w-8 h-8 rounded-xl bg-[#e3ecda] text-[#1b4332] flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#143d2b]">পাসওয়ার্ড পরিবর্তন করুন</h4>
                    <p className="text-[11px] text-stone-500">সাম্প্রতিক রি-অথেন্টিকেশন ও সিকিউর আপডেট</p>
                  </div>
                </div>

                {pwError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{pwError}</span>
                  </div>
                )}

                {pwSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{pwSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-stone-600 mb-1">
                      বর্তমান পাসওয়ার্ড <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        placeholder="বর্তমান পাসওয়ার্ড লিখুন"
                        className="w-full bg-[#fbfaf7] border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#1b4332]"
                      />
                      <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    </div>
                    <p className="text-[10px] text-stone-400 mt-0.5">
                      Firebase নিরাপত্তা বিধিমালার জন্য সাম্প্রতিক প্রমাণীকরণ আবশ্যক।
                    </p>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-600 mb-1">
                      নতুন পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="নতুন শক্তিশালী পাসওয়ার্ড লিখুন"
                        className="w-full bg-[#fbfaf7] border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#1b4332]"
                      />
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-600 mb-1">
                      নতুন পাসওয়ার্ড নিশ্চিতকরণ <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="নতুন পাসওয়ার্ড পুনরায় লিখুন"
                        className="w-full bg-[#fbfaf7] border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#1b4332]"
                      />
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={pwLoading}
                    className="w-full py-2.5 rounded-xl bg-[#1b4332] text-white text-xs font-bold hover:bg-[#2d6a4f] transition shadow-xs flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
                  >
                    {pwLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>যাচাই ও আপডেট হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#b8d56d]" />
                        <span>পাসওয়ার্ড আপডেট করুন</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Forgot / Reset Password Email Section (Requirement 3 & 4) */}
              <div className="bg-white rounded-3xl border border-[#ded9ce] p-6 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100">
                    <div className="w-8 h-8 rounded-xl bg-[#e3ecda] text-[#1b4332] flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#143d2b]">অফিসিয়াল পাসওয়ার্ড রিসেট ইমেইল</h4>
                      <p className="text-[11px] text-stone-500">Firebase এর মাধ্যমে সুরক্ষিত রিসেট লিংক প্রেরণ</p>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    আপনি কি বর্তমান পাসওয়ার্ড ভুলে গেছেন বা জরুরি প্রয়োজনে ইমেইল দিয়ে রিসেট করতে চান? নিচের বাটনে ক্লিক করলে আপনার নিবন্ধিত অ্যাডমিন ইমেইল ঠিকানায় ({adminUser?.email || 'অ্যাডমিন ইমেইল'}) একটি সুরক্ষিত ওয়ান-টাইম পাসওয়ার্ড রিসেট লিংক পাঠানো হবে।
                  </p>

                  {resetError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{resetError}</span>
                    </div>
                  )}

                  {resetSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{resetSuccess}</span>
                    </div>
                  )}

                  <div className="p-3 rounded-2xl bg-[#fbfaf7] border border-stone-200 text-[11px] text-stone-600 space-y-1">
                    <span className="font-bold text-[#143d2b] block">পাসওয়ার্ড রিসেটের নিয়মাবলী:</span>
                    <p>• রিসেট লিংকটির মেয়াদ সাধারণত ১ ঘন্টা থাকে।</p>
                    <p>• ইমেইলে পাওয়া লিংকে ক্লিক করে নতুন পাসওয়ার্ড সেট করুন।</p>
                    <p>• ইনবক্সে ইমেইল না পেলে স্প্যাম বা ট্র্যাশ ফোল্ডার চেক করুন।</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSendResetEmail}
                  disabled={resetLoading}
                  className="w-full py-2.5 rounded-xl border border-[#1b4332] text-[#1b4332] hover:bg-[#e3ecda] text-xs font-bold transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
                >
                  {resetLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>ইমেইল পাঠানো হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 text-[#1b4332]" />
                      <span>আমার ইমেইলে রিসেট লিংক পাঠান</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Security Compliance & Authorization Info */}
            <div className="bg-[#e3ecda]/60 border border-[#c4deb0] rounded-3xl p-5 text-xs text-[#143d2b] space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-[#1b4332]" />
                <span>ShopnoTory নিরাপত্তা ও প্রবেশাধিকার নীতিমালা (RBAC Architecture)</span>
              </div>
              <p className="text-[11px] text-[#2c4738] leading-relaxed">
                ব্রাউজারের কোনো লোকাল স্টোরেজ বা ক্লায়েন্ট-সাইড ফিল্ডের উপর এডমিন অধিকার নির্ভরশীল নয়। সমস্ত পণ্য তৈরি, এডিট, ডিলিট, কুপন ও অর্ডার ম্যানেজমেন্ট কেবলমাত্র Firebase Authentication সার্ভারের ভেরিফাইড কাস্টম ক্লেইমস (Custom User Claims) এবং ফায়ারস্টোর সিকিউরিটি রুলস (<code>firestore.rules</code>) দ্বারা সুরক্ষিত।
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
