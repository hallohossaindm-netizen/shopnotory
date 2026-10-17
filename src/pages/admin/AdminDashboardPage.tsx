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
  Mail
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { changeAdminPassword, sendAdminPasswordReset } from '../../services/adminAuth';
import type { Product, ShopSettings, Order } from '../../types';

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

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'coupons' | 'ads' | 'settings' | 'account'>(
    ['overview', 'products', 'orders', 'coupons', 'ads', 'settings', 'account'].includes(initialTab)
      ? initialTab
      : 'overview'
  );

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
    if (tabParam && ['overview', 'products', 'orders', 'coupons', 'ads', 'settings', 'account'].includes(tabParam)) {
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
            <div className="bg-white p-4 rounded-3xl border border-[#ded9ce]">
              <h3 className="text-base font-bold text-[#143d2b]">গ্রাহক অর্ডার তালিকা</h3>
              <p className="text-xs text-stone-500">স্ট্যাটাস আপডেট করুন ও ডেলিভারি তথ্য পর্যবেক্ষণ করুন</p>
            </div>

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
          </div>
        )}

        {/* TAB 4: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="bg-white rounded-3xl border border-[#ded9ce] p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-[#143d2b]">কুপন ও ছাড় কোড</h3>
            <p className="text-xs text-stone-500">সক্রিয় কুপন কোডসমূহ যা চেকআউটে গ্রাহক ব্যবহার করতে পারেন</p>

            <div className="grid sm:grid-cols-3 gap-4 pt-2">
              {coupons.map(c => (
                <div key={c.id} className="p-4 rounded-2xl bg-[#fbfaf7] border border-[#ede9de] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-[#143d2b] tracking-wider">{c.code}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      {c.active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600">
                    {c.discountPercent ? `${c.discountPercent}% ছাড়` : `৳${c.discountAmount} ফ্ল্যাট ছাড়`}
                  </p>
                  <p className="text-[10px] text-stone-400">
                    সর্বনিম্ন অর্ডার: ৳{c.minOrderAmount || 0}
                  </p>
                </div>
              ))}
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
