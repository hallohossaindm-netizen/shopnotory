import type { Product, ShopSettings, Coupon } from '../types';

export const initialSettings: ShopSettings = {
  adEnabled: true,
  adText: 'সীমিত সময়ের জন্য বিশেষ ছাড়! এখনই শপ কালেকশন দেখুন →',
  adLink: '/shop',
  announcement: 'স্বপ্নের কেনাকাটা, এখন আরও সহজ ✨ সারা দেশে ক্যাশ অন ডেলিভারি',
  deliveryFeeInsideDhaka: 60,
  deliveryFeeOutsideDhaka: 120,
  freeDeliveryThreshold: 3000,
  supportPhone: '01845805713',
  whatsappPhone: '01845805713',
  supportEmail: 'support@shopnotory.com',
  supportHours: 'সকাল ৯টা — রাত ৯টা (সপ্তাহে ৭ দিন)',
  businessAddress: '১২৩, মেইন রোড, ধানমন্ডি, ঢাকা - ১২০৫, বাংলাদেশ',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  youtubeUrl: 'https://youtube.com',
};

export const initialCoupons: Coupon[] = [
  {
    id: 'c1',
    code: 'SHOPNO10',
    discountPercent: 10,
    minOrderAmount: 1000,
    active: true,
  },
  {
    id: 'c2',
    code: 'WELCOME50',
    discountAmount: 50,
    minOrderAmount: 500,
    active: true,
  },
  {
    id: 'c3',
    code: 'EID20',
    discountPercent: 20,
    minOrderAmount: 2500,
    active: true,
  },
];

export const initialProducts: Product[] = [
  {
    id: 'p-1',
    name: 'কটন শাড়ি (সফট হ্যান্ডলুম প্রিন্ট)',
    category: 'নারী পোশাক',
    brand: 'ShopnoTory',
    price: 1200,
    oldPrice: 1500,
    discountPercentage: 20,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=85'
    ],
    description: 'খাঁটি সুতি সুতায় তৈরি নরম ও আরামদায়ক হ্যান্ডলুম কটন শাড়ি। গরমে সারাদিন পরে থাকার জন্য অত্যন্ত আরামদায়ক ও মার্জিত।',
    specifications: {
      'ফ্যাব্রিক': '১০০% পিউর কটন',
      'ব্লাউজ পিস': 'সাথে রানিং ব্লাউজ পিস অন্তর্ভুক্ত',
      'দৈর্ঘ্য': '১২ হাত',
      'ধোলাই নির্দেশনা': 'হ্যান্ড ওয়াশ / ড্রাই ওয়াশ'
    },
    badge: '-২০%',
    stock: 24,
    active: true,
    featured: true,
    rating: 4.9,
    reviewsCount: 32,
    tags: ['শাড়ি', 'নারী পোশাক', 'কটন']
  },
  {
    id: 'p-2',
    name: 'প্রিমিয়াম পাঞ্জাবি সেট (এলিগ্যান্ট কটন)',
    category: 'পুরুষ পোশাক',
    brand: 'Fashion Hub',
    price: 1050,
    oldPrice: 1250,
    discountPercentage: 16,
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=85'
    ],
    description: 'উৎসব ও শুভ দিনে পরিধানের জন্য আধুনিক কাটের প্রিমিয়াম কটন পাঞ্জাবি। সূক্ষ্ম বোতাম ও মসৃণ ফিনিশিং।',
    specifications: {
      'কাপড়': 'প্রিমিয়াম কটন জ্যাকার্ড',
      'সাইজ': '38, 40, 42, 44',
      'কলার': 'ব্যান্ড কলার',
      'ফিট': 'রেগুলার স্লিম ফিট'
    },
    badge: 'হট ডিল',
    stock: 18,
    active: true,
    featured: true,
    rating: 4.8,
    reviewsCount: 28,
    tags: ['পাঞ্জাবি', 'পুরুষ পোশাক']
  },
  {
    id: 'p-3',
    name: 'স্নিকার্স জুতা (লাইটওয়েট ও আরামদায়ক)',
    category: 'জুতো',
    brand: 'Style Zone',
    price: 2550,
    oldPrice: 3000,
    discountPercentage: 15,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=85'
    ],
    description: 'দৈনন্দিন হাঁটাচলা ও ক্যাজুয়াল আউটিংয়ের জন্য সেরা কুশনযুক্ত এয়ার-সোল স্নিকার্স। পা রাখে ঠান্ডা ও চাপমুক্ত।',
    specifications: {
      'সোল': 'অ্যান্টি-স্লিপ রাবার সোল',
      'ম্যাটেরিয়াল': 'ব্রিথেবল মেশ ও ফক্স লেদার',
      'সাইজ': '৩৯, ৪০, ৪১, ৪২, ৪৩, ৪৪'
    },
    badge: '-১৫%',
    stock: 12,
    active: true,
    featured: true,
    rating: 4.9,
    reviewsCount: 45,
    tags: ['জুতো', 'স্নিকার্স']
  },
  {
    id: 'p-4',
    name: 'লেডিজ শোল্ডার ব্যাগ (লাক্সারি টোট)',
    category: 'ব্যাগ',
    brand: 'ShopnoTory',
    price: 1800,
    oldPrice: 2200,
    discountPercentage: 18,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85'
    ],
    description: 'অফিস, শপিং কিংবা যেকোনো অনুষ্ঠানে ব্যবহারের জন্য আকর্ষণীয় গোল্ডেন হার্ডওয়্যার সংবলিত টেকসই লেদার হ্যান্ডব্যাগ।',
    specifications: {
      'ম্যাটেরিয়াল': 'হাই-গ্রেড পিইউ লেদার',
      'কম্পার্টমেন্ট': '৩টি মেইন চেইন ও সিক্রেট পকেট',
      'স্ট্র্যাপ': 'অ্যাডজাস্টেবল শোল্ডার স্ট্র্যাপ'
    },
    badge: 'বেস্ট সেলার',
    stock: 10,
    active: true,
    featured: true,
    rating: 5.0,
    reviewsCount: 22,
    tags: ['ব্যাগ', 'লেডিজ ব্যাগ']
  },
  {
    id: 'p-5',
    name: 'ক্লাসিক এভিয়েটর সানগ্লাস (ইউভি ৪০০)',
    category: 'অ্যাক্সেসরিজ',
    brand: 'Style Zone',
    price: 850,
    oldPrice: 1100,
    discountPercentage: 23,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85'
    ],
    description: 'চোখকে ক্ষতিকর রোদের অতিবেগুনি রশ্মি থেকে ১০০% সুরক্ষিত রাখে। মেটাল ফ্রেমের স্লিম ও স্মার্ট লুক।',
    specifications: {
      'প্রোটেকশন': 'UV400 পোলারাইজড লেন্স',
      'ফ্রেম': 'লাইটওয়েট অ্যালয় মেটাল',
      'বক্স': 'প্রোটেক্টিভ হার্ড কেস ও ক্লিনিং ক্লথ'
    },
    badge: 'ট্রেন্ডিং',
    stock: 15,
    active: true,
    featured: false,
    rating: 4.7,
    reviewsCount: 19,
    tags: ['সানগ্লাস', 'অ্যাক্সেসরিজ']
  },
  {
    id: 'p-6',
    name: 'লাক্সারি অ্যানালগ হাত ঘড়ি (লেদার স্ট্র্যাপ)',
    category: 'অ্যাক্সেসরিজ',
    brand: 'Fashion Hub',
    price: 1350,
    oldPrice: 1500,
    discountPercentage: 10,
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85'
    ],
    description: 'জাপানিজ কোয়ার্টজ মুভমেন্ট সংবলিত ওয়াটারপ্রুফ হ্যান্ডওয়াচ। জেনুইন লেদার স্ট্র্যাপে প্রিমিয়াম আভিজাত্য।',
    specifications: {
      'মুভমেন্ট': 'জাপানিজ কোয়ার্টজ মুভমেন্ট',
      'ওয়াটার রেজিস্ট্যান্স': '3 ATM (Splash Proof)',
      'ডায়াল সাইজ': '৪০ মিমি'
    },
    badge: '-১০%',
    stock: 14,
    active: true,
    featured: true,
    rating: 4.9,
    reviewsCount: 39,
    tags: ['ঘড়ি', 'অ্যাক্সেসরিজ']
  },
  {
    id: 'p-7',
    name: 'ঘর সাজানোর ডেকোরেশন পিস (আর্টিসান শো-পিস)',
    category: 'ঘর সাজানো',
    brand: 'ShopnoTory',
    price: 950,
    oldPrice: 1200,
    discountPercentage: 21,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85'
    ],
    description: 'ড্রয়িং রুম বা পড়ার টেবিলে নান্দনিক আবেশ সৃষ্টি করতে আধুনিক মিনিমালিস্টিক ডেকোরেটিভ শো-পিস।',
    specifications: {
      'উপাদান': 'সিরামিক ও মেটাল পলিশ',
      'উচ্চতা': '৮.৫ ইঞ্চি',
      'কালার': 'ম্যাট ব্ল্যাক ও গোল্ডেন'
    },
    badge: 'জনপ্রিয়',
    stock: 8,
    active: true,
    featured: false,
    rating: 4.8,
    reviewsCount: 16,
    tags: ['ঘর সাজানো', 'শো-পিস']
  },
  {
    id: 'p-8',
    name: 'ফরমাল কটন ফুল-স্লিভ শার্ট',
    category: 'পুরুষ পোশাক',
    brand: 'Fashion Hub',
    price: 1100,
    oldPrice: 1350,
    discountPercentage: 18,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=85'
    ],
    description: 'অফিস বা বিশেষ অনুষ্ঠানের জন্য পারফেক্ট ব্রিথেবল কটন শার্ট। সহজে আয়রন হয় এবং সারাদিন কুঁচকে যায় না।',
    specifications: {
      'কাপড়': '১০০% অক্সফোর্ড কটন',
      'কলার': 'ফরমাল স্প্রেড কলার',
      'সাইজ': 'M, L, XL, XXL'
    },
    badge: 'অফিস কালেকশন',
    stock: 20,
    active: true,
    featured: false,
    rating: 4.8,
    reviewsCount: 25,
    tags: ['শার্ট', 'পুরুষ পোশাক']
  },
  {
    id: 'p-9',
    name: 'নরম ক্যানভাস টোট ব্যাগ',
    category: 'ব্যাগ',
    brand: 'ShopnoTory',
    price: 890,
    oldPrice: 1150,
    discountPercentage: 22,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=85',
    description: 'ল্যাপটপ, বই ও দৈনন্দিন কেনাকাটার প্রয়োজনীয় জিনিস বহনের জন্য টেকসই সুতি ক্যানভাস ব্যাগ।',
    stock: 25,
    active: true,
    featured: true,
    rating: 4.9,
    reviewsCount: 41,
    tags: ['ব্যাগ', 'ক্যানভাস']
  },
  {
    id: 'p-10',
    name: 'আর্টিসান সিরামিক কফি মগ',
    category: 'ঘর সাজানো',
    brand: 'ShopnoTory',
    price: 650,
    oldPrice: 790,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558f8402d?auto=format&fit=crop&w=900&q=85',
    description: 'সকালের কফি বা বিকেলের চায়ের আড্ডার জন্য সুন্দর ও আকর্ষণীয় সিরামিক আর্ট মগ।',
    stock: 18,
    active: true,
    featured: false,
    rating: 4.8,
    reviewsCount: 19,
    tags: ['ঘর সাজানো', 'মগ']
  }
];

export const categoryList = [
  {
    name: 'নারী পোশাক',
    icon: '👗',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
    count: 24,
  },
  {
    name: 'পুরুষ পোশাক',
    icon: '👔',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=400&q=80',
    count: 18,
  },
  {
    name: 'জুতো',
    icon: '👟',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
    count: 12,
  },
  {
    name: 'ব্যাগ',
    icon: '👜',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80',
    count: 10,
  },
  {
    name: 'অ্যাক্সেসরিজ',
    icon: '👓',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80',
    count: 15,
  },
  {
    name: 'ঘর সাজানো',
    icon: '🪴',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80',
    count: 8,
  },
];
