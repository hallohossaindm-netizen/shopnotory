import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Product, CartLine, Order, ShopSettings, Coupon, CustomerUser, CustomerInfo } from '../types';
import { initialProducts, initialSettings, initialCoupons } from '../data/mockData';
import { db, auth, firebaseReady } from '../firebase';
import { collection, onSnapshot, doc, setDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { loginAdminWithFirebase, verifyAdminPrivileges } from '../services/adminAuth';

interface ShopContextType {
  products: Product[];
  cart: CartLine[];
  wishlist: string[];
  orders: Order[];
  settings: ShopSettings;
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  activeUser: CustomerUser | null;
  isAdmin: boolean;
  adminUser: User | null;
  adminClaims: Record<string, any>;
  firebaseConfigured: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  // Cart Actions
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;
  deliveryCharge: number;
  discountAmount: number;
  cartGrandTotal: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  // Order Actions
  createOrder: (customer: CustomerInfo, paymentMethod: Order['paymentMethod'], transactionId?: string) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  // Admin & Products Management
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  updateSettings: (newSettings: ShopSettings) => Promise<void>;
  // Coupon Management
  addCoupon: (coupon: Omit<Coupon, 'id'>) => Promise<void>;
  updateCoupon: (coupon: Coupon) => Promise<void>;
  deleteCoupon: (couponId: string) => Promise<void>;
  toggleCouponStatus: (couponId: string) => Promise<void>;
  adminLogin: (email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  adminLogout: () => void;
  customerLogin: (email: string, name: string) => void;
  customerLogout: () => void;
  // Toast
  toast: string;
  showToast: (msg: string) => void;
}

const STORAGE_PRODUCTS = 'shopnotory_products_v2';
const STORAGE_CART = 'shopnotory_cart_v2';
const STORAGE_WISHLIST = 'shopnotory_wishlist_v2';
const STORAGE_ORDERS = 'shopnotory_orders_v2';
const STORAGE_SETTINGS = 'shopnotory_settings_v2';
const STORAGE_COUPONS = 'shopnotory_coupons_v2';
const STORAGE_ADMIN = 'shopnotory_admin_session';

const ShopContext = createContext<ShopContextType | null>(null);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PRODUCTS);
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  // Cart
  const [cart, setCart] = useState<CartLine[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_WISHLIST);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ORDERS);
      if (saved) return JSON.parse(saved);
      // Sample starter orders
      return [
        {
          id: 'ST-948102',
          customer: {
            name: 'তানজিলা হক',
            phone: '01711223344',
            email: 'tanjila@example.com',
            address: 'বাড়ি ১২, রোড ৪, ধানমন্ডি',
            district: 'ঢাকা',
            city: 'dhaka',
            notes: 'বিকেল ৪টার পরে ডেলিভারি দিলে ভালো হয়।'
          },
          items: [
            {
              productId: 'p-1',
              name: 'কটন শাড়ি (সফট হ্যান্ডলুম প্রিন্ট)',
              price: 1200,
              qty: 1,
              image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85'
            },
            {
              productId: 'p-4',
              name: 'লেডিজ শোল্ডার ব্যাগ (লাক্সারি টোট)',
              price: 1800,
              qty: 1,
              image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85'
            }
          ],
          subtotal: 3000,
          discount: 300,
          couponCode: 'SHOPNO10',
          deliveryCharge: 0,
          grandTotal: 2700,
          paymentMethod: 'cod',
          paymentStatus: 'pending',
          status: 'processing',
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
        },
        {
          id: 'ST-829104',
          customer: {
            name: 'রাকিব আহমেদ',
            phone: '01899112233',
            email: 'rakib@example.com',
            address: 'জিইসি মোড়, নাসিরাবাদ',
            district: 'চট্টগ্রাম',
            city: 'outside'
          },
          items: [
            {
              productId: 'p-2',
              name: 'প্রিমিয়াম পাঞ্জাবি সেট (এলিগ্যান্ট কটন)',
              price: 1050,
              qty: 1,
              image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=85'
            }
          ],
          subtotal: 1050,
          discount: 0,
          deliveryCharge: 120,
          grandTotal: 1170,
          paymentMethod: 'bkash',
          paymentStatus: 'paid',
          transactionId: 'TRX98716298',
          status: 'shipped',
          createdAt: new Date(Date.now() - 3600000 * 26).toISOString()
        }
      ];
    } catch {
      return [];
    }
  });

  // Settings
  const [settings, setSettings] = useState<ShopSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.supportPhone || parsed.supportPhone.includes('123456') || parsed.supportPhone === '+880 1700 123456') {
          parsed.supportPhone = '01845805713';
        }
        if (!parsed.whatsappPhone) {
          parsed.whatsappPhone = '01845805713';
        }
        return parsed;
      }
      return initialSettings;
    } catch {
      return initialSettings;
    }
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_COUPONS);
      return saved ? JSON.parse(saved) : initialCoupons;
    } catch {
      return initialCoupons;
    }
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Active customer & admin
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [adminClaims, setAdminClaims] = useState<Record<string, any>>({});

  const [activeUser, setActiveUser] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem('shopnotory_customer');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Global search & category
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('সব');

  // Toast
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(products));
    } catch {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CART, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_WISHLIST, JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_COUPONS, JSON.stringify(coupons));
    } catch {}
  }, [coupons]);

  // Firebase Auth admin verification listener
  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, async (u) => {
      if (u) {
        const verification = await verifyAdminPrivileges(u);
        if (verification.isAuthorized) {
          setIsAdmin(true);
          setAdminUser(u);
          setAdminClaims(verification.claims);
        } else {
          setIsAdmin(false);
          setAdminUser(null);
          setAdminClaims({});
        }
      } else {
        setIsAdmin(false);
        setAdminUser(null);
        setAdminClaims({});
      }
    });
  }, []);

  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(collection(db, 'products'), snap => {
      if (!snap.empty) {
        const live = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
        setProducts(live);
      }
    }, () => {});
    return unsub;
  }, []);

  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(doc(db, 'settings', 'store'), snap => {
      if (snap.exists()) {
        setSettings({ ...initialSettings, ...snap.data() } as ShopSettings);
      }
    }, () => {});
    return unsub;
  }, []);

  // Cart calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, line) => acc + line.product.price * line.qty, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((acc, line) => acc + line.qty, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.minOrderAmount && cartSubtotal < appliedCoupon.minOrderAmount) {
      return 0;
    }
    if (appliedCoupon.discountPercent) {
      return Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
    }
    if (appliedCoupon.discountAmount) {
      return Math.min(appliedCoupon.discountAmount, cartSubtotal);
    }
    return 0;
  }, [appliedCoupon, cartSubtotal]);

  const deliveryCharge = useMemo(() => {
    if (cart.length === 0) return 0;
    if (cartSubtotal >= settings.freeDeliveryThreshold) return 0;
    return settings.deliveryFeeInsideDhaka;
  }, [cart, cartSubtotal, settings]);

  const cartGrandTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - discountAmount) + deliveryCharge;
  }, [cartSubtotal, discountAmount, deliveryCharge]);

  // Cart actions
  const addToCart = (product: Product, qty: number = 1) => {
    if (product.stock <= 0) {
      showToast('দুঃখিত, এই পণ্যটি বর্তমানে স্টকে নেই');
      return;
    }

    setCart(prev => {
      const index = prev.findIndex(item => item.product.id === product.id);
      if (index > -1) {
        const currentQty = prev[index].qty;
        const newQty = Math.min(currentQty + qty, product.stock);
        if (currentQty >= product.stock) {
          showToast(`সর্বোচ্চ স্টক (${product.stock}টি) আগেই কার্টে যুক্ত আছে`);
          return prev;
        }
        const updated = [...prev];
        updated[index] = { ...updated[index], qty: newQty };
        showToast(`${product.name} কার্টে আপডেট হয়েছে`);
        return updated;
      } else {
        showToast(`${product.name} কার্টে যোগ হয়েছে ✨`);
        return [...prev, { product, qty: Math.min(qty, product.stock) }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('পণ্যটি কার্ট থেকে সরানো হয়েছে');
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const nextQty = item.qty + delta;
            if (nextQty > item.product.stock) {
              showToast(`সর্বোচ্চ স্টক: ${item.product.stock} টি`);
              return item;
            }
            return { ...item, qty: nextQty };
          }
          return item;
        })
        .filter(item => item.qty > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === trimmed && c.active);
    if (!found) {
      return { success: false, message: 'প্রদত্ত কুপন কোডটি সঠিক নয়' };
    }
    if (found.minOrderAmount && cartSubtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `এই কুপন ব্যবহারের জন্য সর্বনিম্ন অর্ডার মূল্য ৳${found.minOrderAmount}`
      };
    }
    setAppliedCoupon(found);
    showToast(`কুপন ${found.code} সফলভাবে প্রয়োগ হয়েছে! 🎉`);
    return { success: true, message: 'কুপন সফলভাবে প্রয়োগ হয়েছে' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('কুপন ডিসকাউন্ট সরানো হয়েছে');
  };

  // Wishlist actions
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('পছন্দের তালিকা থেকে সরানো হয়েছে');
        return prev.filter(id => id !== productId);
      } else {
        showToast('পছন্দের তালিকায় যুক্ত হয়েছে ❤️');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  // Orders
  const createOrder = async (
    customer: CustomerInfo,
    paymentMethod: Order['paymentMethod'],
    transactionId?: string
  ): Promise<Order> => {
    const orderId = 'ST-' + Math.floor(100000 + Math.random() * 900000);
    const finalDelivery =
      cartSubtotal >= settings.freeDeliveryThreshold
        ? 0
        : customer.city === 'dhaka'
        ? settings.deliveryFeeInsideDhaka
        : settings.deliveryFeeOutsideDhaka;

    const finalGrandTotal = Math.max(0, cartSubtotal - discountAmount) + finalDelivery;

    const newOrder: Order = {
      id: orderId,
      customer,
      items: cart.map(line => ({
        productId: line.product.id,
        name: line.product.name,
        price: line.product.price,
        qty: line.qty,
        image: line.product.image
      })),
      subtotal: cartSubtotal,
      discount: discountAmount,
      couponCode: appliedCoupon?.code,
      deliveryCharge: finalDelivery,
      grandTotal: finalGrandTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : transactionId ? 'paid' : 'awaiting_verification',
      transactionId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Save to Firestore if available
    if (db) {
      try {
        await addDoc(collection(db, 'orders'), newOrder);
      } catch (err) {
        console.warn('Firestore order save notice:', err);
      }
    }

    // Update local orders
    setOrders(prev => [newOrder, ...prev]);

    // Update product stock
    setProducts(prev =>
      prev.map(p => {
        const bought = cart.find(c => c.product.id === p.id);
        return bought ? { ...p, stock: Math.max(0, p.stock - bought.qty) } : p;
      })
    );

    // Clear cart and coupon
    clearCart();
    setAppliedCoupon(null);
    showToast('আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে! 🎉');
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    if (db && auth?.currentUser) {
      try {
        await updateDoc(doc(db, 'orders', orderId), { status });
      } catch (err) {
        console.warn('Firestore update status notice:', err);
      }
    }

    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o))
    );
    showToast(`অর্ডার #${orderId} এর স্ট্যাটাস '${status}' করা হয়েছে`);
  };

  // Admin & Products Management
  const addProduct = async (productData: Omit<Product, 'id'>) => {
    const newId = 'p-' + Date.now();
    const newProduct: Product = {
      id: newId,
      ...productData,
      createdAt: new Date().toISOString()
    };

    if (db && auth?.currentUser) {
      try {
        await addDoc(collection(db, 'products'), newProduct);
      } catch (err) {
        console.warn('Firestore product add notice:', err);
      }
    }

    setProducts(prev => [newProduct, ...prev]);
    showToast('নতুন পণ্য সফলভাবে যুক্ত হয়েছে ✨');
  };

  const updateProduct = async (product: Product) => {
    if (db && auth?.currentUser) {
      try {
        await setDoc(doc(db, 'products', product.id), product, { merge: true });
      } catch (err) {
        console.warn('Firestore product update notice:', err);
      }
    }

    setProducts(prev => prev.map(p => (p.id === product.id ? product : p)));
    showToast('পণ্যের তথ্য আপডেট করা হয়েছে');
  };

  const deleteProduct = async (productId: string) => {
    if (db && auth?.currentUser) {
      try {
        await deleteDoc(doc(db, 'products', productId));
      } catch (err) {
        console.warn('Firestore product delete notice:', err);
      }
    }

    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast('পণ্যটি তালিকা থেকে মুছে ফেলা হয়েছে');
  };

  const updateSettings = async (newSettings: ShopSettings) => {
    if (db && auth?.currentUser) {
      try {
        await setDoc(doc(db, 'settings', 'store'), newSettings, { merge: true });
      } catch (err) {
        console.warn('Firestore settings update notice:', err);
      }
    }

    setSettings(newSettings);
    showToast('স্টোর সেটিংস সফলভাবে সংরক্ষিত হয়েছে');
  };

  const addCoupon = async (newC: Omit<Coupon, 'id'>) => {
    const couponId = 'cpn-' + Date.now();
    const created: Coupon = {
      id: couponId,
      ...newC,
      code: newC.code.trim().toUpperCase()
    };

    if (db && auth?.currentUser) {
      try {
        await setDoc(doc(db, 'coupons', couponId), created);
      } catch (err) {
        console.warn('Firestore coupon add notice:', err);
      }
    }

    setCoupons(prev => [created, ...prev]);
    showToast(`নতুন কুপন "${created.code}" সফলভাবে যোগ করা হয়েছে! 🏷️`);
  };

  const updateCoupon = async (updated: Coupon) => {
    const formatted: Coupon = {
      ...updated,
      code: updated.code.trim().toUpperCase()
    };

    if (db && auth?.currentUser) {
      try {
        await setDoc(doc(db, 'coupons', formatted.id), formatted, { merge: true });
      } catch (err) {
        console.warn('Firestore coupon update notice:', err);
      }
    }

    setCoupons(prev => prev.map(c => (c.id === formatted.id ? formatted : c)));
    showToast(`কুপন "${formatted.code}" তথ্য আপডেট করা হয়েছে ✨`);
  };

  const deleteCoupon = async (couponId: string) => {
    const target = coupons.find(c => c.id === couponId);
    if (db && auth?.currentUser) {
      try {
        await deleteDoc(doc(db, 'coupons', couponId));
      } catch (err) {
        console.warn('Firestore coupon delete notice:', err);
      }
    }

    setCoupons(prev => prev.filter(c => c.id !== couponId));
    showToast(`কুপন "${target?.code || ''}" মুছে ফেলা হয়েছে`);
  };

  const toggleCouponStatus = async (couponId: string) => {
    const target = coupons.find(c => c.id === couponId);
    if (!target) return;
    const newStatus = !target.active;
    const updated = { ...target, active: newStatus };

    if (db && auth?.currentUser) {
      try {
        await updateDoc(doc(db, 'coupons', couponId), { active: newStatus });
      } catch (err) {
        console.warn('Firestore coupon toggle notice:', err);
      }
    }

    setCoupons(prev => prev.map(c => (c.id === couponId ? updated : c)));
    showToast(`কুপন "${target.code}" ${newStatus ? 'সক্রিয়' : 'নিষ্ক্রিয়'} করা হয়েছে`);
  };

  const adminLogin = async (email: string, pass: string) => {
    if (!firebaseReady || !auth) {
      return {
        success: false,
        message: 'Firebase Authentication কনফিগার করা হয়নি। অ্যাডমিন সিস্টেমে প্রবেশের জন্য প্রথমে Firebase সেটআপ সম্পন্ন করুন।'
      };
    }

    const res = await loginAdminWithFirebase(email, pass);
    if (res.success && res.user) {
      setIsAdmin(true);
      setAdminUser(res.user);
      setAdminClaims(res.claims || {});
      showToast('এডমিন লগইন সফল!');
      return { success: true, message: 'এডমিন লগইন সফল' };
    } else {
      setIsAdmin(false);
      setAdminUser(null);
      setAdminClaims({});
      return { success: false, message: res.message };
    }
  };

  const adminLogout = async () => {
    if (auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
    setIsAdmin(false);
    setAdminUser(null);
    setAdminClaims({});
    try {
      localStorage.removeItem(STORAGE_ADMIN);
    } catch {}
    showToast('এডমিন সেশন সফলভাবে সমাপ্ত হয়েছে');
  };

  const customerLogin = (email: string, name: string) => {
    const user: CustomerUser = {
      id: 'cust-' + Date.now(),
      name,
      email,
      role: 'customer',
      joinedAt: new Date().toISOString()
    };
    setActiveUser(user);
    localStorage.setItem('shopnotory_customer', JSON.stringify(user));
    showToast(`স্বাগতম, ${name}!`);
  };

  const customerLogout = () => {
    setActiveUser(null);
    localStorage.removeItem('shopnotory_customer');
    showToast('লগআউট সফল হয়েছে');
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        settings,
        coupons,
        appliedCoupon,
        activeUser,
        isAdmin,
        adminUser,
        adminClaims,
        firebaseConfigured: firebaseReady,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartCount,
        deliveryCharge,
        discountAmount,
        cartGrandTotal,
        applyCoupon,
        removeCoupon,
        toggleWishlist,
        isInWishlist,
        createOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        updateSettings,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        toggleCouponStatus,
        adminLogin,
        adminLogout,
        customerLogin,
        customerLogout,
        toast,
        showToast
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
