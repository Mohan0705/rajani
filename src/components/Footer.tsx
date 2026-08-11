import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Instagram,
  Facebook,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { getGeneralWhatsAppUrl } from '../lib/whatsapp';

export const Footer: React.FC = () => {
  const { settings } = useSettings();
  const waUrl = getGeneralWhatsAppUrl(settings);

  return (
    <footer className="bg-[#FAF8F5] text-stone-700 border-t border-[#EAE5D9] pt-12 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-[#EAE5D9]">
          
          {/* Brand & Tagline Column */}
          <div className="space-y-3">
            <div className="flex flex-col items-start">
              <div className="flex items-baseline gap-1">
                <span className="font-serif italic text-2xl font-bold text-[#800020] tracking-tight">
                  {settings.business_name ? settings.business_name.split(' ')[0] : 'Rajani'}
                </span>
                <span className="font-sans font-extrabold text-[10px] uppercase tracking-[0.2em] text-[#800020]">
                  Sarees
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-[0.25em] font-medium text-stone-400 mt-0.5">
                {settings.tagline || 'Grace in Every Drape'}
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed pt-1">
              {settings.description ||
                'Discover premium handloom and designer sarees for weddings, festivities and special occasions. Crafted with love, woven with tradition.'}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.facebook_url || 'https://facebook.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-[#EAE5D9] hover:bg-[#800020] hover:text-white text-stone-700 flex items-center justify-center transition-colors shadow-2xs"
                aria-label="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href={settings.instagram_url || 'https://instagram.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-[#EAE5D9] hover:bg-[#800020] hover:text-white text-stone-700 flex items-center justify-center transition-colors shadow-2xs"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors shadow-2xs"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Quick Navigation
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/products?filter=new" className="hover:text-[#800020] transition-colors">
                  NEW IN
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#800020] transition-colors">
                  All Sarees
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-[#800020] transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/products?category=blouses" className="hover:text-[#800020] transition-colors">
                  Blouses
                </Link>
              </li>
              <li>
                <Link to="/products?filter=sale" className="hover:text-[#800020] transition-colors">
                  Offers & Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Customer Service
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#800020] shrink-0" />
                <span>{settings.phone || '+91 98765 43210'}</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  WhatsApp Support
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#800020] shrink-0" />
                <span>{settings.email || 'support@rajanisarees.com'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#800020] shrink-0" />
                <span>{settings.opening_hours || 'Mon - Sat: 10AM - 9PM'}</span>
              </li>
            </ul>
          </div>

          {/* Store Location Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Boutique Location
            </h3>
            <p className="flex items-start gap-2 text-xs text-stone-600">
              <MapPin className="w-4 h-4 text-[#800020] shrink-0 mt-0.5" />
              <span>
                {settings.address || 'Main Fashion Avenue'}, {settings.city || 'Surat'},{' '}
                {settings.state || 'Gujarat'} - {settings.pin_code || '395003'}
              </span>
            </p>

            <div className="pt-2">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#800020] hover:underline"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin & CRM Portal</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2 text-center sm:text-left">
          <p>© {new Date().getFullYear()} {settings.business_name || 'Rajani Sarees'}. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:underline">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
