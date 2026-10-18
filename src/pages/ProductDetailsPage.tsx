import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  ChevronRight,
  Plus,
  Minus,
  Check,
  Share2,
  ArrowRight
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/common/ProductCard';
import { trackEvent } from '../services/analyticsTracker';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart, toggleWishlist, isInWishlist, showToast } = useShop();
  const navigate = useNavigate();

  const product = products.find(p => p.id === id);
  const [selectedImg, setSelectedImg] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');

  useEffect(() => {
    if (product) {
      trackEvent({
        eventType: 'product_click',
        pagePath: `/product/${product.id}`,
        pageTitle: product.name,
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        productPrice: product.price,
        productCategory: product.category
      });
    }
  }, [product?.id]);

  // Related products
  const relatedProducts = products
    .filter(p => p.id !== id && (product ? p.category === product.category : true))
    .slice(0, 4);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4 font-bengali">
        <h2 className="text-2xl font-black text-[#143d2b]">পণ্যটি খুঁজে পাওয়া যায়নি</h2>
        <p className="text-xs text-stone-500">সম্ভবত পণ্যটি সরিয়ে ফেলা হয়েছে বা লিঙ্কটি ভুল।</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-[#1b4332] text-white px-6 py-2.5 rounded-full text-xs font-bold"
        >
          শপ কালেকশনে ফিরে যান
        </Link>
      </div>
    );
  }

  const currentImage = selectedImg || product.image;
  const isFav = isInWishlist(product.id);
  const inStock = product.stock > 0;
  const money = (n: number) => '৳' + Math.round(n).toLocaleString('en-BD');

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 font-sans space-y-12">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[#787f73] font-bengali">
        <Link to="/" className="hover:text-[#1b4332]">হোম</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-[#1b4332]">শপ কালেকশন</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-[#1b4332]">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#143d2b] font-bold truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid lg:grid-cols-12 gap-8 sm:gap-12 font-bengali">
        
        {/* Left: Image Gallery */}
        <div className="lg:col-span-6 space-y-3">
          <div className="aspect-square rounded-3xl overflow-hidden bg-[#f4f2ea] border border-[#ede9de] shadow-sm relative group">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {product.badge && inStock && (
              <span className="absolute top-4 left-4 bg-[#b8d56d] text-[#122e20] text-xs font-black px-3 py-1 rounded-full shadow-xs">
                {product.badge}
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-stone-700 flex items-center justify-center shadow-md active:scale-90 transition"
              aria-label="পছন্দে যোগ করুন"
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

          {/* Thumbnail Strip */}
          {product.galleryImages && product.galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(img)}
                  className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition shrink-0 ${
                    currentImage === img ? 'border-[#1b4332] shadow-sm' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#387c53] uppercase tracking-wider">
              {product.category} {product.brand && `· ${product.brand}`}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#143d2b] leading-snug">
              {product.name}
            </h1>

            {/* Ratings & Stock */}
            <div className="flex items-center gap-3 pt-1 text-xs">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
                <span className="text-[#143d2b] ml-1">{product.rating || 4.9}</span>
              </div>
              <span className="text-stone-300">|</span>
              <span className="text-stone-500 font-semibold">{product.reviewsCount || 24} টি রিভিউ</span>
              <span className="text-stone-300">|</span>
              <span className={`font-bold ${inStock ? 'text-emerald-700' : 'text-rose-600'}`}>
                {inStock ? `স্টকে আছে (${product.stock}টি)` : 'স্টক শেষ'}
              </span>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-[#f5f2e8] border border-[#e8e4d8]">
            <span className="text-2xl sm:text-3xl font-black text-[#143d2b]">
              {money(product.price)}
            </span>
            {product.oldPrice && (
              <>
                <span className="text-sm text-stone-400 line-through">{money(product.oldPrice)}</span>
                <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                  {money(product.oldPrice - product.price)} ছাড়
                </span>
              </>
            )}
          </div>

          <p className="text-xs sm:text-sm text-[#525a4c] leading-relaxed">
            {product.description}
          </p>

          {/* Quantity Controls & Add to Cart */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-stone-700">পরিমাণ:</span>
              <div className="flex items-center border border-[#d8d3c5] rounded-xl bg-white overflow-hidden shadow-2xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-[#f5f2e8] text-stone-700"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 py-1 text-xs font-black text-[#143d2b]">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 hover:bg-[#f5f2e8] text-stone-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => addToCart(product, quantity)}
                disabled={!inStock}
                className="flex-1 bg-[#1b4332] hover:bg-[#2d6a4f] text-white py-3.5 px-6 rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4 text-[#b8d56d]" /> কার্টে যোগ করুন
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!inStock}
                className="flex-1 bg-[#b8d56d] hover:bg-[#c9e879] text-[#10271b] py-3.5 px-6 rounded-full text-xs font-black flex items-center justify-center gap-2 shadow-md active:scale-95 transition disabled:opacity-50"
              >
                এখনই অর্ডার করুন <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Assurance Delivery Box */}
          <div className="bg-white p-4 rounded-2xl border border-[#ede9de] space-y-2.5 text-xs text-[#525a4c]">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#387c53] shrink-0" />
              <span>ঢাকা সিটিতে ২৪-৪৮ ঘণ্টায় ও ঢাকার বাইরে ২-৩ দিনে পৌঁছে যাবে</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#387c53] shrink-0" />
              <span>ক্যাশ অন ডেলিভারিতে পণ্য দেখে টাকা পরিশোধের সুযোগ</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-[#387c53] shrink-0" />
              <span>৭ দিনের সহজ ও ঝামেলাহীন রিপ্লেসমেন্ট পলিসি</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Details Tabs */}
      {product.specifications && (
        <div className="bg-white rounded-3xl border border-[#ede9de] p-6 sm:p-8 font-bengali space-y-4">
          <h3 className="text-lg font-bold text-[#143d2b] border-b border-stone-100 pb-3">
            পণ্যের বিবরণ ও স্পেসিফিকেশন
          </h3>
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            {Object.entries(product.specifications).map(([key, val]) => (
              <div key={key} className="flex justify-between p-2.5 rounded-xl bg-[#fbfaf7] border border-stone-100">
                <span className="font-semibold text-stone-500">{key}:</span>
                <span className="font-bold text-[#143d2b]">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 font-bengali">
          <h3 className="text-xl font-bold text-[#143d2b]">সম্পর্কিত আরও পণ্য</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
