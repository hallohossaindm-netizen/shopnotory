import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle2, Truck, AlertCircle, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const OrdersPage: React.FC = () => {
  const { orders } = useShop();
  const money = (n: number) => '৳' + Math.round(n).toLocaleString('en-BD');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-sans space-y-6 font-bengali">
      
      <div className="border-b border-[#ede9de] pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#143d2b]">অর্ডার ট্র্যাকিং ও ইতিহাস</h1>
          <p className="text-xs text-stone-500 mt-0.5">আপনার সকল অর্ডারের বর্তমান অবস্থা ও বিস্তারিত তথ্য</p>
        </div>
        <Link to="/shop" className="text-xs font-bold text-[#1b4332] hover:underline">
          নতুন কেনাকাটা করুন →
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-[#d8d3c5] p-12 text-center space-y-3">
          <Package className="w-12 h-12 text-stone-300 mx-auto" />
          <h2 className="text-base font-bold text-[#143d2b]">এখনো কোনো অর্ডার পাওয়া যায়নি</h2>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            আপনার পছন্দের পণ্যটি নির্বাচন করে শপিং শুরু করুন।
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#1b4332] text-white px-6 py-2.5 rounded-full text-xs font-bold"
          >
            কালেকশন দেখুন <ArrowRight className="w-4 h-4 text-[#b8d56d]" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const isDelivered = order.status === 'delivered';
            const isShipped = order.status === 'shipped' || isDelivered;
            const isProcessing = order.status === 'processing' || isShipped;

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-[#ede9de] p-5 sm:p-6 shadow-xs space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <span className="font-black text-sm text-[#143d2b]">অর্ডার #{order.id}</span>
                    <span className="text-xs text-stone-400 ml-2">
                      {new Date(order.createdAt).toLocaleDateString('bn-BD', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-500">পেমেন্ট: {order.paymentMethod.toUpperCase()}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        order.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'processing'
                          ? 'bg-amber-100 text-amber-800'
                          : order.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-stone-100 text-stone-800'
                      }`}
                    >
                      {order.status === 'pending'
                        ? 'অপেক্ষমান (Pending)'
                        : order.status === 'processing'
                        ? 'প্রসেসিং (Processing)'
                        : order.status === 'shipped'
                        ? 'কুরিয়ারে হস্তান্তর (Shipped)'
                        : order.status === 'delivered'
                        ? 'সফল ডেলিভারি (Delivered)'
                        : 'বাতিল (Cancelled)'}
                    </span>
                  </div>
                </div>

                {/* Progress Status Bar */}
                {order.status !== 'cancelled' && (
                  <div className="py-2">
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold text-stone-600 mb-1.5">
                      <span className="text-[#1b4332]">অর্ডার গ্রহণ</span>
                      <span className={isProcessing ? 'text-[#1b4332]' : 'text-stone-300'}>প্রস্তুত হচ্ছে</span>
                      <span className={isShipped ? 'text-[#1b4332]' : 'text-stone-300'}>কুরিয়ারে পথিমধ্যে</span>
                      <span className={isDelivered ? 'text-emerald-700' : 'text-stone-300'}>ডেলিভার্ড</span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden flex">
                      <div className="bg-[#1b4332] w-1/4 h-full" />
                      <div className={`h-full transition-all w-1/4 ${isProcessing ? 'bg-[#1b4332]' : 'bg-transparent'}`} />
                      <div className={`h-full transition-all w-1/4 ${isShipped ? 'bg-[#1b4332]' : 'bg-transparent'}`} />
                      <div className={`h-full transition-all w-1/4 ${isDelivered ? 'bg-emerald-600' : 'bg-transparent'}`} />
                    </div>
                  </div>
                )}

                {/* Items List */}
                <div className="space-y-2 pt-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center gap-2.5">
                        <img src={item.image} alt="" className="w-9 h-9 rounded-lg object-cover bg-stone-100" />
                        <div>
                          <p className="font-bold text-[#143d2b]">{item.name}</p>
                          <p className="text-[10px] text-stone-400">{money(item.price)} × {item.qty}</p>
                        </div>
                      </div>
                      <span className="font-bold text-stone-900">{money(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>

                {/* Footer of Order card */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div className="text-stone-500 text-[11px]">
                    ডেলিভারি ঠিকানা: {order.customer.address}, {order.customer.district}
                  </div>
                  <div className="text-right">
                    <span className="text-stone-500 text-[11px] mr-1">সর্বমোট:</span>
                    <span className="font-black text-sm text-[#143d2b]">{money(order.grandTotal)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
