import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { updateMetaTags, generateLocalBusinessSchema, injectStructuredData } from '../lib/seo';
import { getGeneralWhatsAppUrl } from '../lib/whatsapp';
import { api } from '../lib/api';

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    updateMetaTags({
      title: 'Contact Us & Boutique Store Location',
      description: `Get in touch with ${settings.business_name}. Phone: ${settings.phone}, Location: ${settings.address}, ${settings.city}. Contact on WhatsApp for quick saree enquiries.`,
      settings
    });

    const schema = generateLocalBusinessSchema(settings);
    injectStructuredData(schema, 'local-business-schema');
  }, [settings]);

  const waUrl = getGeneralWhatsAppUrl(settings);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
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
        message: formData.message,
        source: 'Website Contact Page'
      });

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold text-amber-800 tracking-widest uppercase">
          Direct Customer Support
        </span>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Contact & Store Location</h1>
        <p className="text-stone-600 text-xs sm:text-sm">
          Visit our offline boutique or reach out via WhatsApp for saree consultation and order tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Info Column */}
        <div className="lg:col-span-5 space-y-6 bg-stone-900 text-stone-100 p-8 rounded-2xl shadow-xl">
          <h2 className="font-serif text-xl font-bold text-white border-b border-stone-800 pb-4">
            Boutique Contact Info
          </h2>

          <ul className="space-y-4 text-xs sm:text-sm">
            <li className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Call Us Direct</span>
                <a href={`tel:${settings.phone}`} className="font-semibold hover:text-amber-300">
                  {settings.phone}
                </a>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">WhatsApp Consultation</span>
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-400 underline">
                  Start Live Chat on WhatsApp
                </a>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Email Address</span>
                <span className="font-semibold">{settings.email}</span>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Store Working Hours</span>
                <span className="font-semibold">{settings.opening_hours}</span>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Store Address</span>
                <span className="font-semibold">
                  {settings.address}, {settings.city}, {settings.state} - {settings.pin_code}
                </span>
              </div>
            </li>
          </ul>

          {settings.google_maps_url && (
            <a
              href={settings.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-amber-800 hover:bg-amber-700 text-white font-semibold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors mt-4"
            >
              <MapPin className="w-4 h-4" />
              <span>Get Directions on Google Maps</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-stone-200/80 shadow-xs space-y-6">
          <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-3">
            Send Us an Enquiry
          </h2>

          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-stone-900">Enquiry Received!</h3>
              <p className="text-xs text-stone-600">
                Thank you {formData.name}. Our team will contact you shortly via phone or WhatsApp.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-xs text-rose-600 p-2 bg-rose-50 rounded">{error}</p>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs p-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs p-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-800 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs p-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Your City / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Hyderabad / Visakhapatnam"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-xs p-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Message / Saree Requirements</label>
                <textarea
                  rows={4}
                  placeholder="Tell us what type of saree or budget you are looking for..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full text-xs p-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-800 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-900 hover:bg-amber-950 text-white font-semibold text-xs py-3 px-6 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting...' : 'Submit Enquiry'}</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
