import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Truck,
  RotateCcw,
  CreditCard,
  Banknote,
  Headphones,
  Award,
  Sparkles,
  HeartHandshake
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { api } from '../lib/api';
import { Product, Category, Testimonial } from '../types';
import { ProductCard } from '../components/ProductCard';
import { LeadFormModal } from '../components/LeadFormModal';
import { getGeneralWhatsAppUrl } from '../lib/whatsapp';

export const HomePage: React.FC = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Enquiry Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Hero Slider State
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  const heroSlides = [
    {
      titleLine1: 'Grace in Every Drape',
      titleLine2: 'Beauty in Every You',
      subtitle:
        'Discover premium sarees for every occasion. Crafted with love, woven with tradition.',
      image:
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
      badge: 'Festive Edition 2025'
    },
    {
      titleLine1: 'Royal Banarasi Silks',
      titleLine2: 'Timeless Heirloom Weaves',
      subtitle:
        'Intricate kadwa zari weaves handcrafted by master artisans of Varanasi.',
      image:
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80',
      badge: 'Heirloom Collection'
    },
    {
      titleLine1: 'Breezy Organza & Chiffon',
      titleLine2: 'Elegance for Modern Celebrations',
      subtitle:
        'Lightweight, fluid drapes adorned with delicate floral embroidery and cutwork.',
      image:
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
      badge: 'New Season Edit'
    }
  ];

  // Circular Category Items
  const circleCategories = [
    {
      id: 'c-1',
      name: 'NEW IN',
      slug: 'new-arrivals',
      image:
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'c-2',
      name: 'TOP WEAR',
      slug: 'top-wear',
      image:
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'c-3',
      name: 'SAREES',
      slug: 'kanchipuram-silk',
      image:
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'c-4',
      name: 'BLOUSES',
      slug: 'blouses',
      image:
        'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'c-5',
      name: 'DRESS MATERIALS',
      slug: 'dress-materials',
      image:
        'https://images.unsplash.com/photo-1610030469888-2ffbd9f8602b?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'c-6',
      name: 'COLLECTIONS',
      slug: 'banarasi-silk',
      image:
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'c-7',
      name: 'WEDDING PICKS',
      slug: 'designer-party-wear',
      image:
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'c-8',
      name: 'SALE',
      slug: 'soft-silk-chanderi',
      image:
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80'
    }
  ];

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes, testRes] = await Promise.all([
          api.getProducts({ limit: 12 }),
          api.getCategories(),
          api.getSettings().then(() => [
            {
              id: 't-1',
              customer_name: 'Priya Rajan',
              location: 'Chennai',
              review_text:
                'The Kanchipuram silk saree is absolutely breathtaking. Pure zari work and the drape is so graceful!',
              rating: 5
            },
            {
              id: 't-2',
              customer_name: 'Ananya Sharma',
              location: 'Hyderabad',
              review_text:
                'Ordered for my sister’s wedding. Express WhatsApp video drape consultation helped us pick the perfect color.',
              rating: 5
            },
            {
              id: 't-3',
              customer_name: 'Meera Iyer',
              location: 'Bengaluru',
              review_text:
                '100% genuine Silk Mark certified saree delivered within 2 days. Highly recommended!',
              rating: 5
            }
          ])
        ]);

        setProducts(prodRes.products || []);
        setCategories(catRes || []);
        setTestimonials(testRes || []);
      } catch (e) {
        console.error('Error loading home page data:', e);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, [settings]);

  const waUrl = getGeneralWhatsAppUrl(settings);

  const handleOpenEnquiry = (product?: Product) => {
    setSelectedProduct(product || null);
    setModalOpen(true);
  };

  const nextHeroSlide = () => {
    setCurrentHeroIndex((prev) => (prev + 1) % heroSlides.length);
  };

  const prevHeroSlide = () => {
    setCurrentHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const activeSlide = heroSlides[currentHeroIndex];

  return (
    <div className="space-y-12 lg:space-y-16 pb-12 bg-white">
      {/* 1. HERO SLIDER BANNER SECTION */}
      <section className="relative bg-[#F5F0E8] overflow-hidden border-b border-[#EAE5D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 lg:py-16 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[480px]">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left z-10">
              <div className="space-y-2">
                <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-stone-900 leading-[1.15] tracking-tight">
                  {activeSlide.titleLine1} <br />
                  <span className="italic font-serif text-[#800020] font-medium">
                    {activeSlide.titleLine2}
                  </span>
                </h1>

                <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-lg pt-2">
                  {activeSlide.subtitle}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/products"
                  className="bg-[#800020] hover:bg-[#5A1216] text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-2xs shadow-sm transition-all"
                >
                  EXPLORE COLLECTION
                </Link>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-[#800020] text-[#800020] hover:bg-[#800020] hover:text-white text-xs font-bold uppercase tracking-widest px-6 py-3.5 rounded-2xs transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>CHAT ON WHATSAPP</span>
                </a>
              </div>

              {/* Trust Badges Row */}
              <div className="pt-6 flex flex-wrap items-center gap-6 sm:gap-8 text-xs text-stone-700 font-medium border-t border-[#EAE5D9]/80">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#800020]" />
                  <span>Premium Quality Fabric</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#800020]" />
                  <span>Trusted by Millions</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#800020]" />
                  <span>Secure & Easy Shopping</span>
                </div>
              </div>
            </div>

            {/* Right Image Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[3/4] max-w-md mx-auto rounded-2xs overflow-hidden shadow-md border-4 border-white bg-white group">
                <img
                  src={activeSlide.image}
                  alt={activeSlide.titleLine1}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest text-[#800020] shadow-2xs">
                  {activeSlide.badge}
                </div>
              </div>
            </div>

          </div>

          {/* Slider Navigation Arrows */}
          <button
            onClick={prevHeroSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-stone-800 shadow-md flex items-center justify-center transition-all z-20"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextHeroSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-stone-800 shadow-md flex items-center justify-center transition-all z-20"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicators */}
          <div className="flex items-center justify-center gap-2 pt-6">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentHeroIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentHeroIndex === idx ? 'w-6 bg-[#800020]' : 'w-2 bg-stone-300'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. CIRCULAR CATEGORY QUICK NAVIGATION BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between sm:justify-center gap-4 sm:gap-8 overflow-x-auto pb-4 scrollbar-none pt-2">
          {circleCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 shrink-0 group text-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden p-0.5 border-2 border-[#800020]/20 group-hover:border-[#800020] transition-all bg-stone-100 shadow-2xs">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-800 group-hover:text-[#800020] transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. "TRENDING NOW" PRODUCT GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#EAE5D9] pb-4">
          <div className="text-center sm:text-left">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-stone-900 flex items-center justify-center sm:justify-start gap-2">
              <span>TRENDING NOW</span>
            </h2>
            <div className="w-16 h-0.5 bg-[#800020] mx-auto sm:mx-0 mt-1" />
          </div>

          <Link
            to="/products"
            className="text-xs font-extrabold uppercase tracking-widest text-[#800020] hover:text-stone-900 border border-[#800020] px-5 py-2 rounded-2xs transition-colors"
          >
            VIEW ALL
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-stone-100 aspect-[3/4] rounded-2xs animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {products.slice(0, 6).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickEnquire={handleOpenEnquiry}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. VALUE PROPOSITION HIGHLIGHTS BAR */}
      <section className="bg-[#FAF8F5] border-y border-[#EAE5D9] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            
            <div className="space-y-2 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-white border border-[#EAE5D9] flex items-center justify-center text-[#800020] shadow-2xs">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Free Shipping
              </h3>
              <p className="text-[11px] text-stone-500">On Prepaid Orders</p>
            </div>

            <div className="space-y-2 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-white border border-[#EAE5D9] flex items-center justify-center text-[#800020] shadow-2xs">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Easy Returns
              </h3>
              <p className="text-[11px] text-stone-500">Within 7 Days</p>
            </div>

            <div className="space-y-2 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-white border border-[#EAE5D9] flex items-center justify-center text-[#800020] shadow-2xs">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Secure Payment
              </h3>
              <p className="text-[11px] text-stone-500">100% Protected</p>
            </div>

            <div className="space-y-2 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-white border border-[#EAE5D9] flex items-center justify-center text-[#800020] shadow-2xs">
                <Banknote className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                COD Available
              </h3>
              <p className="text-[11px] text-stone-500">Pay on Delivery</p>
            </div>

            <div className="space-y-2 flex flex-col items-center col-span-2 md:col-span-1">
              <div className="w-10 h-10 rounded-full bg-white border border-[#EAE5D9] flex items-center justify-center text-[#800020] shadow-2xs">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                24/7 Support
              </h3>
              <p className="text-[11px] text-stone-500">We're Here to Help</p>
            </div>

          </div>
        </div>
      </section>

      {/* Floating WhatsApp CTA */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-full flex items-center gap-2 shadow-lg text-xs uppercase tracking-wider transition-all hover:scale-105"
      >
        <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
        <span>WhatsApp Us</span>
      </a>

      {/* Enquiry Modal */}
      <LeadFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
};
