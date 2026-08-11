import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MessageCircle,
  Sparkles,
  ShieldCheck,
  Truck,
  ArrowRight,
  CheckCircle2,
  Clock,
  Heart,
  Share2,
  ChevronRight
} from 'lucide-react';
import { Product } from '../types';
import { api } from '../lib/api';
import { useSettings } from '../context/SettingsContext';
import { getProductWhatsAppUrl } from '../lib/whatsapp';
import { updateMetaTags, generateProductSchema, injectStructuredData } from '../lib/seo';
import { ProductCard } from '../components/ProductCard';
import { LeadFormModal } from '../components/LeadFormModal';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { settings } = useSettings();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    api
      .getProductBySlugOrId(slug)
      .then((p) => {
        setProduct(p);
        setSelectedImage(p.images?.[0] || '');

        updateMetaTags({
          title: `${p.name} (${p.sku})`,
          description: `${p.description}. Fabric: ${p.fabric}. Price: ₹${p.price.toLocaleString('en-IN')}. Enquire directly on WhatsApp.`,
          image: p.images?.[0],
          settings
        });

        const schema = generateProductSchema(p, settings);
        injectStructuredData(schema, 'product-ld-json');

        // Load related products
        api
          .getProducts({ category_slug: p.category_name, limit: 5 })
          .then((res) => setRelatedProducts(res.products.filter((rel) => rel.id !== p.id).slice(0, 4)))
          .catch(() => {});
      })
      .catch((err) => {
        setError(err.message || 'Product not found');
      })
      .finally(() => setLoading(false));
  }, [slug, settings]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
          <div className="bg-stone-100 aspect-[3/4] rounded-2xl" />
          <div className="space-y-4 pt-4">
            <div className="h-6 bg-stone-100 rounded w-1/3" />
            <div className="h-8 bg-stone-100 rounded w-3/4" />
            <div className="h-10 bg-stone-100 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Saree Not Found</h2>
        <p className="text-xs text-stone-600">The saree you are looking for may be out of stock or renamed.</p>
        <Link to="/products" className="inline-block bg-amber-900 text-amber-50 px-5 py-2.5 rounded-xl text-xs font-semibold">
          Browse All Sarees
        </Link>
      </div>
    );
  }

  const waUrl = getProductWhatsAppUrl(product, settings);
  const currency = settings.currency || '₹';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 bg-white">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
        <Link to="/" className="hover:text-stone-900">Home</Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <Link to="/products" className="hover:text-stone-900">Catalog</Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="text-stone-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-[3/4] rounded-2xs overflow-hidden bg-[#FAF8F5] border border-[#EAE5D9] shadow-xs relative">
            <img
              src={selectedImage || product.images?.[0]}
              alt={product.name}
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />

            {product.discount_pct && product.discount_pct > 0 ? (
              <span className="absolute top-3 left-3 bg-[#800020] text-white font-extrabold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-2xs shadow-2xs">
                SAVE {product.discount_pct}%
              </span>
            ) : null}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-24 rounded-2xs overflow-hidden border transition-all shrink-0 ${
                    selectedImage === img ? 'border-[#800020] shadow-2xs scale-105' : 'border-[#EAE5D9] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Specs & Conversion CTAs */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2 border-b border-[#EAE5D9] pb-5">
            <div className="flex items-center justify-between text-xs font-bold text-[#800020] tracking-wider uppercase">
              <span>{product.category_name} • {product.fabric}</span>
              <span className="text-stone-400 font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="font-serif italic text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
              {product.name}
            </h1>

            {/* Price & Savings */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-[#800020] font-bold text-2xl sm:text-3xl">
                {currency}{product.price.toLocaleString('en-IN')}.00
              </span>

              {product.original_price && product.original_price > product.price && (
                <span className="text-stone-400 text-sm sm:text-base line-through">
                  {currency}{product.original_price.toLocaleString('en-IN')}.00
                </span>
              )}

              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-2xs border border-emerald-200 uppercase tracking-wide">
                {product.availability}
              </span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3 pt-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-widest py-3.5 px-6 rounded-2xs shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white text-emerald-700" />
              <span>Enquire & Order on WhatsApp</span>
            </a>

            <button
              onClick={() => setModalOpen(true)}
              className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-widest py-3.5 px-6 rounded-2xs transition-all"
            >
              Send Direct Enquiry Form
            </button>
          </div>

          {/* Key Attributes Grid */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-[#FAF8F5] rounded-2xs border border-[#EAE5D9] text-xs">
            <div>
              <span className="text-stone-400 block text-[10px] font-bold uppercase tracking-wider">Fabric</span>
              <span className="font-semibold text-stone-800">{product.fabric}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] font-bold uppercase tracking-wider">Color</span>
              <span className="font-semibold text-stone-800">{product.color}</span>
            </div>
            {product.pattern && (
              <div>
                <span className="text-stone-400 block text-[10px] font-bold uppercase tracking-wider">Pattern / Weave</span>
                <span className="font-semibold text-stone-800">{product.pattern}</span>
              </div>
            )}
            {product.occasion && (
              <div>
                <span className="text-stone-400 block text-[10px] font-bold uppercase tracking-wider">Occasion</span>
                <span className="font-semibold text-stone-800">{product.occasion}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2 pt-2">
            <h3 className="font-serif italic font-bold text-stone-900 text-sm">Product Description</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Delivery & Assurance Cards */}
          <div className="space-y-2 pt-2 border-t border-[#EAE5D9]">
            <div className="flex items-start gap-3 text-xs text-stone-600">
              <Truck className="w-4 h-4 text-[#800020] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-stone-800 block">Dispatch & Delivery</span>
                <span>{product.delivery_info || 'Free express courier across India. Ships within 24 hours.'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-stone-600">
              <ShieldCheck className="w-4 h-4 text-[#800020] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-stone-800 block">Quality Guarantee</span>
                <span>100% genuine silk mark certified. Rigorous inspection prior to packaging.</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-[#EAE5D9] space-y-6">
          <h2 className="font-serif italic text-xl sm:text-2xl font-bold text-stone-900">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

      <LeadFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={product}
      />
    </div>
  );
};
