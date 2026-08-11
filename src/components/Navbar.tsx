import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  ChevronDown,
  Menu,
  X,
  Phone,
  Truck,
  RotateCcw,
  Headphones,
  Instagram,
  Facebook,
  Twitter,
  Sparkles
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useWishlist } from '../context/WishlistContext';

export const Navbar: React.FC<{ onOpenEnquiry?: () => void }> = ({ onOpenEnquiry }) => {
  const { settings } = useSettings();
  const { wishlist, cart } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#EAE5D9] shadow-2xs font-sans">
      {/* 1. TOP UTILITY ANNOUNCEMENT BAR */}
      <div className="bg-[#FAF8F5] border-b border-[#EAE5D9] text-[#4A4238] text-[11px] py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          
          {/* Left: Value proposition highlights */}
          <div className="flex items-center gap-4 sm:gap-6 text-[11px] font-medium tracking-wide">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#800020]" />
              <span className="font-semibold text-stone-800">FREE SHIPPING</span>
              <span className="text-stone-500 hidden sm:inline">on Prepaid Orders</span>
            </span>
            <span className="hidden md:inline text-stone-300">|</span>
            <span className="hidden sm:flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-[#800020]" />
              <span>Easy Returns & Exchange</span>
            </span>
            <span className="hidden lg:inline text-stone-300">|</span>
            <span className="hidden lg:flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-[#800020]" />
              <span>24/7 Customer Support</span>
            </span>
          </div>

          {/* Right: Phone & Socials */}
          <div className="flex items-center gap-4 text-[11px] text-stone-600 font-medium">
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center gap-1.5 hover:text-[#800020] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#800020]" />
              <span>{settings.phone || '+91 98765 43210'}</span>
            </a>

            <div className="flex items-center gap-2 pl-2 border-l border-stone-300">
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#800020] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </a>
              )}
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#800020] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex flex-col items-start group">
            <div className="flex items-baseline gap-1">
              <span className="font-serif italic text-2xl sm:text-3xl font-bold text-[#800020] tracking-tight group-hover:text-stone-900 transition-colors">
                {settings.business_name ? settings.business_name.split(' ')[0] : 'Rajani'}
              </span>
              <span className="font-sans font-extrabold text-[11px] uppercase tracking-[0.25em] text-[#800020]">
                Sarees
              </span>
            </div>
            <span className="text-[8px] uppercase tracking-[0.3em] font-medium text-stone-400 -mt-1 block">
              Grace in Every Drape
            </span>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <Link
              to="/products?filter=new"
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-800 hover:text-[#800020] transition-colors relative py-1"
            >
              <span>NEW IN</span>
              <span className="bg-[#800020] text-white text-[8px] font-black px-1.5 py-0.5 rounded-2xs uppercase tracking-tighter animate-pulse">
                NEW
              </span>
            </Link>

            <Link
              to="/products?category=topwear"
              className="text-xs font-bold uppercase tracking-wider text-stone-800 hover:text-[#800020] transition-colors py-1"
            >
              TOP WEAR
            </Link>

            <div className="relative group/nav">
              <Link
                to="/products"
                className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-stone-800 hover:text-[#800020] transition-colors py-1"
              >
                <span>SAREES</span>
                <ChevronDown className="w-3 h-3 text-stone-400 group-hover/nav:rotate-180 transition-transform" />
              </Link>
            </div>

            <Link
              to="/products?category=blouses"
              className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-stone-800 hover:text-[#800020] transition-colors py-1"
            >
              <span>BLOUSES</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </Link>

            <Link
              to="/products?category=dress-materials"
              className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-stone-800 hover:text-[#800020] transition-colors py-1"
            >
              <span>DRESS MATERIALS</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </Link>

            <Link
              to="/collections"
              className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-stone-800 hover:text-[#800020] transition-colors py-1"
            >
              <span>COLLECTIONS</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </Link>

            <Link
              to="/products?filter=sale"
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-800 hover:text-[#800020] transition-colors py-1"
            >
              <span>OFFERS</span>
              <span className="bg-emerald-700 text-white text-[8px] font-black px-1.5 py-0.5 rounded-2xs uppercase tracking-tighter">
                SALE
              </span>
            </Link>
          </nav>

          {/* Right Action Icons (Search, User, Wishlist, Cart) */}
          <div className="flex items-center gap-4 sm:gap-5 text-stone-800">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hover:text-[#800020] transition-colors p-1"
              title="Search Sarees"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[1.75]" />
            </button>

            {/* Profile / Admin Login Button */}
            <Link
              to="/admin/login"
              className="hover:text-[#800020] transition-colors p-1 hidden sm:block"
              title="Account & CRM"
              aria-label="User Account"
            >
              <User className="w-5 h-5 stroke-[1.75]" />
            </Link>

            {/* Wishlist Button with Counter Badge */}
            <Link
              to="/products?filter=wishlist"
              className="hover:text-[#800020] transition-colors p-1 relative"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.75]" />
              <span className="absolute -top-1 -right-1 bg-[#800020] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            </Link>

            {/* Cart Bag Button with Counter Badge */}
            <button
              onClick={() => {
                if (onOpenEnquiry) onOpenEnquiry();
              }}
              className="hover:text-[#800020] transition-colors p-1 relative"
              title="Enquiry Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              <span className="absolute -top-1 -right-1 bg-[#800020] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1 text-stone-800 hover:text-[#800020]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* 3. INTERACTIVE SEARCH DRAWER */}
      {searchOpen && (
        <div className="bg-[#FAF8F5] border-t border-[#EAE5D9] p-4 animate-fadeIn">
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Kanchipuram, Banarasi, Georgette, Silk sarees..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#EAE5D9] text-xs focus:outline-none focus:border-[#800020] rounded-2xs"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="bg-[#800020] hover:bg-[#5A1216] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-2xs transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-2 text-stone-400 hover:text-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* 4. MOBILE DRAWER NAVIGATION */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#EAE5D9] bg-[#FAF8F5] px-6 py-5 space-y-4">
          <div className="flex flex-col space-y-3 text-xs font-bold uppercase tracking-wider text-stone-800">
            <Link
              to="/products?filter=new"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 border-b border-stone-200"
            >
              <span>NEW IN</span>
              <span className="bg-[#800020] text-white text-[9px] px-2 py-0.5 rounded-2xs">NEW</span>
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-stone-200"
            >
              SAREES
            </Link>
            <Link
              to="/collections"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-stone-200"
            >
              COLLECTIONS
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-stone-200"
            >
              ABOUT US
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-stone-200"
            >
              CONTACT & LOCATION
            </Link>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-stone-600">
            <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)} className="underline font-semibold text-[#800020]">
              CRM Admin Portal
            </Link>
            <span>{settings.phone}</span>
          </div>
        </div>
      )}
    </header>
  );
};
