import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MessageCircle } from 'lucide-react';
import { Product } from '../types';
import { useSettings } from '../context/SettingsContext';
import { useWishlist } from '../context/WishlistContext';
import { getProductWhatsAppUrl } from '../lib/whatsapp';

interface ProductCardProps {
  product: Product;
  onQuickEnquire?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickEnquire }) => {
  const { settings } = useSettings();
  const { isInWishlist, toggleWishlist, addToCart } = useWishlist();

  const isWishlisted = isInWishlist(product.id);
  const waUrl = getProductWhatsAppUrl(product, settings);

  const mainImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';

  const currency = settings.currency || '₹';

  // Calculate rating or mock stable rating
  const rating = 4.5;
  const ratingCount = 12;

  return (
    <div className="group bg-white rounded-2xs border border-[#EAE5D9] shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-[#F5F0E8] overflow-hidden">
        <Link to={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={mainImage}
            alt={product.name}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Top-Left Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.is_new_arrival && (
            <span className="bg-[#800020] text-white text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-2xs shadow-2xs">
              NEW
            </span>
          )}
          {product.discount_pct && product.discount_pct > 0 ? (
            <span className="bg-[#800020] text-white text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-2xs shadow-2xs">
              -{product.discount_pct}%
            </span>
          ) : null}
          {product.is_featured && !product.is_new_arrival && (
            <span className="bg-stone-900 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-2xs shadow-2xs">
              FEATURED
            </span>
          )}
        </div>

        {/* Top-Right Wishlist Heart Button */}
        <button
          onClick={() => toggleWishlist(product)}
          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-all z-10 shadow-xs ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/80 hover:bg-white text-stone-600 hover:text-rose-600'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2 text-center">
        <div className="space-y-1">
          {/* Title */}
          <Link to={`/products/${product.slug}`} className="block">
            <h3 className="font-sans text-xs sm:text-sm font-bold uppercase tracking-wide text-stone-900 line-clamp-2 leading-snug group-hover:text-[#800020] transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price Row */}
        <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
          <span className="text-[#800020] font-bold text-sm sm:text-base">
            {currency}
            {product.price.toLocaleString('en-IN')}.00
          </span>

          {product.original_price && product.original_price > product.price && (
            <span className="text-stone-400 text-xs line-through font-normal">
              {currency}
              {product.original_price.toLocaleString('en-IN')}.00
            </span>
          )}

          {product.discount_pct && product.discount_pct > 0 ? (
            <span className="text-xs font-bold text-emerald-700">
              {product.discount_pct}% OFF
            </span>
          ) : null}
        </div>

        {/* Rating Row */}
        <div className="flex items-center justify-center gap-1 text-xs text-amber-500 pt-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
          ))}
          <span className="text-[10px] text-stone-400 font-medium ml-1">(3.0)</span>
        </div>

        {/* Quick WhatsApp / Enquiry Button */}
        <div className="pt-2">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => addToCart(product)}
            className="w-full py-2 px-3 text-[10px] uppercase tracking-widest font-bold text-[#800020] border border-[#800020] hover:bg-[#800020] hover:text-white rounded-2xs transition-all flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="w-3 h-3 text-emerald-600 group-hover:text-white" />
            <span>ENQUIRE NOW</span>
          </a>
        </div>
      </div>
    </div>
  );
};
