export type ProductCategory =
  | 'নারী পোশাক'
  | 'পুরুষ পোশাক'
  | 'জুতো'
  | 'ব্যাগ'
  | 'অ্যাক্সেসরিজ'
  | 'ঘর সাজানো'
  | 'লাইফস্টাইল';

export interface Product {
  id: string;
  name: string;
  category: string;
  brand?: string;
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  image: string;
  galleryImages?: string[];
  description: string;
  specifications?: Record<string, string>;
  badge?: string;
  stock: number;
  active: boolean;
  featured?: boolean;
  rating?: number;
  reviewsCount?: number;
  tags?: string[];
  createdAt?: string;
}

export interface CartLine {
  product: Product;
  qty: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  address: string;
  district: string;
  city: 'dhaka' | 'outside';
  notes?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

export interface Order {
  id: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryCharge: number;
  grandTotal: number;
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'sslcommerz';
  paymentStatus: 'pending' | 'paid' | 'awaiting_verification';
  transactionId?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrderAmount?: number;
  active: boolean;
  expiresAt?: string;
}

export interface ShopSettings {
  adEnabled: boolean;
  adText: string;
  adLink: string;
  announcement: string;
  deliveryFeeInsideDhaka: number;
  deliveryFeeOutsideDhaka: number;
  freeDeliveryThreshold: number;
  supportPhone: string;
  supportEmail: string;
  supportHours: string;
  businessAddress: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'customer' | 'admin';
  joinedAt: string;
}
