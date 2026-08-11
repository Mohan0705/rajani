import React from 'react';
import { useSettings } from '../context/SettingsContext';

export const PrivacyPolicyPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-stone-800 text-xs sm:text-sm leading-relaxed">
      <h1 className="font-serif text-2xl font-bold text-stone-900 border-b border-stone-200 pb-3">
        Privacy Policy
      </h1>
      <p>
        At <strong>{settings.business_name || 'Rajani Sarees'}</strong>, we respect your privacy and are committed to protecting the personal information you share with us when submitting saree enquiries or contacting us via WhatsApp.
      </p>

      <h2 className="font-serif text-base font-bold text-stone-900 pt-2">1. Information We Collect</h2>
      <p>
        When you fill out an enquiry form or message us, we collect basic details such as your name, phone number/WhatsApp number, city, and saree preferences. We use this strictly to respond to your specific enquiry and fulfill product orders.
      </p>

      <h2 className="font-serif text-base font-bold text-stone-900 pt-2">2. How We Use Your Data</h2>
      <ul className="list-disc pl-5 space-y-1 text-stone-600">
        <li>To contact you regarding saree availability, price quotes, and dispatch tracking.</li>
        <li>To answer customer service requests via phone or WhatsApp.</li>
        <li>We NEVER sell, rent, or lease customer contact lists to third-party marketing companies.</li>
      </ul>

      <h2 className="font-serif text-base font-bold text-stone-900 pt-2">3. Contact Us</h2>
      <p>
        If you have questions about our privacy policy, feel free to call us at {settings.phone} or visit our store at {settings.address}, {settings.city}.
      </p>
    </div>
  );
};
