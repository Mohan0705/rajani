import React, { useState } from 'react';
import { Save, CheckCircle2, Store, Phone, Globe, MessageCircle, MapPin, Search } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useSettings } from '../../context/SettingsContext';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings, loading } = useSettings();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sync form when settings load
  React.useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      await updateSettings(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Business Settings & Contact Info">
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
        
        {/* Header Action Bar */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div>
            <h3 className="font-serif font-bold text-stone-900 text-sm">General Business & Contact Configuration</h3>
            <p className="text-xs text-stone-500">Changes reflect immediately across website, headers, & WhatsApp links</p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>

        {saved && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        {/* Section 1: Business Identity & Contact */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 text-xs">
          <h4 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-100 pb-2 flex items-center gap-2">
            <Store className="w-4 h-4 text-amber-800" />
            <span>Identity & Contact Details</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Business Name *</label>
              <input
                type="text"
                required
                value={form.business_name}
                onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-stone-300 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Tagline / Subtitle</label>
              <input
                type="text"
                value={form.tagline || ''}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-stone-300 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Primary Phone Number *</label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-stone-300 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">WhatsApp Number (with country code e.g. 919876543210) *</label>
              <input
                type="text"
                required
                value={form.whatsapp_number}
                onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-stone-300 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Support Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-stone-300 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Physical Store Address */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 text-xs">
          <h4 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-100 pb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-800" />
            <span>Store Location & Directions</span>
          </h4>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Street Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-stone-300 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">City / Town</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-stone-300 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">State</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-stone-300 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Pincode</label>
              <input
                type="text"
                value={form.pin_code}
                onChange={(e) => setForm({ ...form, pin_code: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-stone-300 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Opening Hours</label>
              <input
                type="text"
                value={form.opening_hours}
                onChange={(e) => setForm({ ...form, opening_hours: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-stone-300 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Google Maps Profile URL</label>
              <input
                type="text"
                value={form.google_maps_url || ''}
                onChange={(e) => setForm({ ...form, google_maps_url: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-stone-300 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Social & WhatsApp Message Defaults */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 text-xs">
          <h4 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-100 pb-2 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp Lead Auto-Template & Instagram</span>
          </h4>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Instagram Profile URL</label>
            <input
              type="text"
              value={form.instagram_url || ''}
              onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-stone-300 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Default WhatsApp Message Template</label>
            <textarea
              rows={2}
              value={form.whatsapp_default_message || ''}
              onChange={(e) => setForm({ ...form, whatsapp_default_message: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-stone-300 outline-none resize-none"
            />
          </div>
        </div>

        {/* Section 4: SEO Metadata */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 text-xs">
          <h4 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-100 pb-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-amber-800" />
            <span>Google SEO & Meta Tags</span>
          </h4>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">SEO Title</label>
            <input
              type="text"
              value={form.seo_title || ''}
              onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-stone-300 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Meta Description</label>
            <textarea
              rows={2}
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-stone-300 outline-none resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs py-3.5 px-6 rounded-xl shadow-md transition-colors"
        >
          {saving ? 'Saving Settings...' : 'Save All Settings'}
        </button>

      </form>
    </AdminLayout>
  );
};
