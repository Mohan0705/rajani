import React from 'react';
import { useSettings } from '../context/SettingsContext';

export const TermsPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-stone-800 text-xs sm:text-sm leading-relaxed">
      <h1 className="font-serif text-2xl font-bold text-stone-900 border-b border-stone-200 pb-3">
        Terms and Conditions
      </h1>
      <p>
        Welcome to <strong>{settings.business_name || 'Rajani Sarees'}</strong>. By browsing our product catalog and submitting enquiries, you agree to these terms.
      </p>

      <h2 className="font-serif text-base font-bold text-stone-900 pt-2">1. Product Availability & Colors</h2>
      <p>
        Handloom sarees are individually crafted by master weavers. Slight natural variations in thread weave or color tone may occur compared to digital screen displays. Product availability is confirmed upon direct WhatsApp or phone verification.
      </p>

      <h2 className="font-serif text-base font-bold text-stone-900 pt-2">2. Exchange & Returns</h2>
      <p>
        {settings.return_info || 'All sarees undergo strict 3-step quality checking before courier dispatch. In the rare event of a manufacturing defect, exchange requests must be notified within 7 days of delivery.'}
      </p>

      <h2 className="font-serif text-base font-bold text-stone-900 pt-2">3. Shipping & Delivery</h2>
      <p>
        {settings.delivery_info || 'We offer free express delivery across India for orders above ₹1,999. Estimated courier timeline is 2-5 working days depending on destination pincode.'}
      </p>
    </div>
  );
};
