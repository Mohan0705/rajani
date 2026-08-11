import React, { createContext, useContext, useState, useEffect } from 'react';
import { BusinessSettings } from '../types';
import { api } from '../lib/api';

const DEFAULT_SETTINGS: BusinessSettings = {
  business_name: 'Rajani Sarees',
  tagline: 'Grace in Every Drape, Beauty in Every You',
  description: 'Handcrafted Kanchipuram silks, Royal Banarasi weaves, and fine designer sarees.',
  phone: '+91 98765 43210',
  whatsapp_number: '919876543210',
  email: 'contact@rajanisarees.com',
  address: 'Door No 4-12, Main Temple Road, Near Clock Tower',
  city: 'Tadepalligudem',
  state: 'Andhra Pradesh',
  country: 'India',
  pin_code: '534101',
  opening_hours: 'Mon - Sat: 10:00 AM - 9:00 PM, Sun: 11:00 AM - 7:00 PM',
  instagram_url: 'https://instagram.com/rajanisarees',
  facebook_url: 'https://facebook.com/rajanisarees',
  google_maps_url: 'https://maps.google.com',
  google_business_profile_url: 'https://g.co/kgs/rajanisarees',
  currency: '₹',
  delivery_info: 'Free express courier delivery across India on orders above ₹1,999.',
  return_info: 'Easy 7-day exchange for manufacturing defects.',
  hero_headline: 'Elegance Woven Into Every Saree',
  hero_subheadline: 'Discover hand-selected Kanchipuram silks, Banarasi weaves, and lightweight organza sarees crafted for weddings and special celebrations.',
  hero_image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80',
  logo_url: ''
};

interface SettingsContextType {
  settings: BusinessSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<BusinessSettings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  loading: true,
  refreshSettings: async () => {},
  updateSettings: async () => {}
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<BusinessSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings(data);
    } catch (e) {
      console.warn('Could not load settings from backend, using defaults:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<BusinessSettings>) => {
    const updated = await api.updateSettings(newSettings);
    setSettings(updated);
  };

  return (
    <SettingsContext.Provider
      value={{ settings, loading, refreshSettings: loadSettings, updateSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
