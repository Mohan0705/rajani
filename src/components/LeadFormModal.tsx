import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, MessageCircle, Phone, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { useSettings } from '../context/SettingsContext';
import { api } from '../lib/api';
import { getProductWhatsAppUrl, getGeneralWhatsAppUrl } from '../lib/whatsapp';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export const LeadFormModal: React.FC<LeadFormModalProps> = ({ isOpen, onClose, product }) => {
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    preferred_contact: 'WhatsApp' as 'WhatsApp' | 'Call' | 'Either',
    preferred_color: product?.color || '',
    budget_range: '',
    message: product
      ? `Hi, I am interested in ${product.name} (SKU: ${product.sku}). Please share availability and best offer.`
      : 'Hi, I am looking for custom saree recommendations for an upcoming occasion.',
    website_honeypot: '' // Anti-spam
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract UTM parameters automatically on mount
  const [utmParams, setUtmParams] = useState({
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    referrer: '',
    landing_page: ''
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      setUtmParams({
        utm_source: urlParams.get('utm_source') || (document.referrer.includes('instagram') ? 'instagram' : 'website'),
        utm_medium: urlParams.get('utm_medium') || '',
        utm_campaign: urlParams.get('utm_campaign') || '',
        referrer: document.referrer || '',
        landing_page: window.location.pathname
      });
    }
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Please provide your name and phone number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.submitLead({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        product_id: product?.id,
        product_name: product?.name,
        product_sku: product?.sku,
        product_image: product?.images?.[0],
        message: formData.message,
        preferred_contact: formData.preferred_contact,
        preferred_color: formData.preferred_color,
        budget_range: formData.budget_range,
        source: utmParams.utm_source === 'instagram' ? 'Instagram' : 'Website',
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
        referrer: utmParams.referrer,
        landing_page: utmParams.landing_page,
        website_honeypot: formData.website_honeypot
      });

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const directWaUrl = product
    ? getProductWhatsAppUrl(product, settings)
    : getGeneralWhatsAppUrl(settings, formData.message);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/70 backdrop-blur-2xs transition-all animate-fadeIn">
      <div className="bg-[#F9F7F2] rounded-sm max-w-lg w-full shadow-2xl overflow-hidden border border-[#E5E1D8] flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-[#1A1A1A] text-white p-5 flex items-center justify-between relative border-b border-[#E5E1D8]/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#C5A059] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg italic text-white font-bold">
                {product ? 'Saree Enquiry' : 'Boutique Consultation'}
              </h2>
              <p className="text-[10px] uppercase tracking-widest text-[#C5A059]">
                {settings.business_name || 'Rajani Sarees'} • Direct Response
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-sm text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {submitted ? (
            /* Success State */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-[#F2EEE4] text-[#C5A059] rounded-full flex items-center justify-center mx-auto border border-[#E5E1D8]">
                <CheckCircle2 className="w-10 h-10 text-[#C5A059]" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-xl font-normal text-[#1A1A1A]">
                  Enquiry Submitted Successfully
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
                  Thank you <span className="font-bold text-[#1A1A1A]">{formData.name}</span>. Our boutique team will reach out shortly via {formData.preferred_contact}.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-3 max-w-xs mx-auto">
                <a
                  href={directWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#1A1A1A] hover:bg-[#C5A059] text-white font-bold py-3 px-4 rounded-sm flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Open WhatsApp Chat</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full bg-[#F2EEE4] hover:bg-[#E5E1D8] text-[#1A1A1A] font-bold py-2.5 px-4 rounded-sm text-[10px] uppercase tracking-widest transition-colors border border-[#E5E1D8]"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Form State */
            <form onSubmit={handleSubmit} className="space-y-4">
              {product && (
                <div className="flex items-center gap-3 p-3 bg-[#F2EEE4] rounded-sm border border-[#E5E1D8]">
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80'}
                    alt={product.name}
                    className="w-14 h-16 object-cover rounded-2xs border border-[#E5E1D8] shrink-0"
                  />
                  <div className="text-xs">
                    <span className="font-serif italic font-bold text-[#1A1A1A] line-clamp-1 block text-sm">
                      {product.name}
                    </span>
                    <span className="text-[#C5A059] font-bold text-xs block">
                      {settings.currency || '₹'}{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-stone-500 font-mono text-[10px] block">SKU: {product.sku}</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-sm border border-rose-200">
                  {error}
                </div>
              )}

              {/* Honeypot hidden input */}
              <input
                type="text"
                name="website_honeypot"
                value={formData.website_honeypot}
                onChange={(e) => setFormData({ ...formData, website_honeypot: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A] mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-sm bg-white border border-[#E5E1D8] focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A] mb-1">
                    Phone / WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-sm bg-white border border-[#E5E1D8] focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A] mb-1">
                    Your City / Town
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hyderabad / Chennai"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-sm bg-white border border-[#E5E1D8] focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A] mb-1">
                    Preferred Contact
                  </label>
                  <select
                    value={formData.preferred_contact}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferred_contact: e.target.value as any
                      })
                    }
                    className="w-full text-xs p-2.5 rounded-sm border border-[#E5E1D8] focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none bg-white"
                  >
                    <option value="WhatsApp">WhatsApp Message</option>
                    <option value="Call">Phone Call</option>
                    <option value="Either">Either WhatsApp or Call</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A] mb-1">
                  Message / Custom Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Mention color preference, occasion, or delivery timeline..."
                  className="w-full text-xs p-2.5 rounded-sm bg-white border border-[#E5E1D8] focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#1A1A1A] hover:bg-[#C5A059] text-white font-bold py-3.5 px-4 rounded-sm text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span>Submitting Enquiry...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Enquiry</span>
                    </>
                  )}
                </button>

                <a
                  href={directWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1A1A1A] hover:bg-[#C5A059] text-white font-bold py-3.5 px-4 rounded-sm text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors shrink-0"
                  title="Direct WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              </div>

              <p className="text-[10px] text-stone-500 text-center uppercase tracking-wider">
                🔒 Private & confidential boutique consultation.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
