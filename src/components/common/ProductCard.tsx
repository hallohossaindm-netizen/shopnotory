import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import type { Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { trackEvent } from '../../services/analyticsTracker';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const isFav = isInWishlist(product.id);
  const inStock = product.stock > 0;

  const money = (n: number) => '৳' + Math.round(n).toLocaleString('en-BD');

  const handleProductClick = () => {
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
  };

  return (
    <div className="group bg-white rounded-2xl border border-[#ede9de] overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between font-sans relative">
      {/* Product Image & Badges */}
      <div className="relative aspect-square overflow-hidden bg-[#f4f2ea]">
        <Link
          to={`/product/${product.id}`}
          onClick={handleProductClick}
          className="block w-full h-full"
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Out of Stock Overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center pointer-events-none">
            <span className="bg-rose-600 text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bengali">
              স্টক শেষ
            </span>
          </div>
        )}

        {/* Discount / Custom Badge */}
        {product.badge && inStock && (
          <span className="absolute top-2.5 left-2.5 bg-[#b8d56d] text-[#122e20] text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-2xs font-bengali">
            {product.badge}
          </span>
        )}

        {/* Wishlist Heart Button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-700 flex items-center justify-center shadow-xs transition active:scale-90"
          aria-label="পছন্দে যোগ করুন"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between font-bengali">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#666b60] mb-1">
            <span className="font-semibold text-[#387c53] truncate max-w-[100px]">{product.category}</span>
            {product.rating && (
              <span className="flex items-center gap-0.5 text-amber-600 font-bold text-[10px]">
                <Star className="w-3 h-3 fill-amber-500" /> {product.rating}
              </span>
            )}
          </div>

          <Link
            to={`/product/${product.id}`}
            onClick={handleProductClick}
            className="font-bold text-xs sm:text-sm text-[#143d2b] line-clamp-1 hover:text-[#387c53] transition block"
          >
            {product.name}
          </Link>

          <p className="text-[11px] text-[#787f73] line-clamp-2 mt-1 leading-snug hidden sm:block">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-2.5 mt-2 border-t border-[#f2efe6] flex items-center justify-between gap-1.5">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5">
              <span className="font-black text-sm sm:text-base text-[#122e20]">{money(product.price)}</span>
              {product.oldPrice && (
                <span className="text-[10px] sm:text-xs text-stone-400 line-through">{money(product.oldPrice)}</span>
              )}
            </div>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={!inStock}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shrink-0 shadow-2xs ${
              inStock
                ? 'bg-[#1b4332] hover:bg-[#2d6a4f] text-white'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#b8d56d]" />
            <span className="hidden sm:inline">কার্টে যোগ করুন</span>
            <span className="sm:hidden">কার্ট</span>
          </button>
        </div>
      </div>
    </div>
  );
};
