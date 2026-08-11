/**
 * Types & Interfaces for Saree Business & Lead Generation CRM
 */

export type AvailabilityStatus = 'In Stock' | 'Limited Stock' | 'Pre-Order' | 'Out of Stock';

export type LeadStatus = 'New' | 'Contacted' | 'Interested' | 'Follow-up' | 'Converted' | 'Not Interested' | 'Lost';

export type LeadSource = 'Website' | 'Instagram' | 'Facebook' | 'Google' | 'WhatsApp' | 'Direct' | 'Referral' | 'Other';

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category_id: string;
  category_name: string;
  price: number;
  original_price?: number;
  discount_pct?: number;
  description: string;
  fabric: string; // e.g. Kanchipuram Silk, Banarasi Silk, Pure Cotton, Organza
  color: string;
  pattern?: string;
  occasion?: string; // e.g. Wedding, Festive, Party, Casual
  availability: AvailabilityStatus;
  is_active: boolean;
  is_featured: boolean;
  is_new_arrival: boolean;
  images: string[];
  care_instructions?: string;
  delivery_info?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  note: string;
  created_by: string;
  created_at: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  city?: string;
  product_id?: string;
  product_name?: string;
  product_sku?: string;
  product_image?: string;
  message?: string;
  preferred_contact?: 'WhatsApp' | 'Call' | 'Either';
  preferred_color?: string;
  budget_range?: string;
  source: LeadSource;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
  landing_page?: string;
  status: LeadStatus;
  notes: LeadNote[];
  follow_up_date?: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessSettings {
  business_name: string;
  tagline: string;
  description: string;
  phone: string;
  whatsapp_number: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pin_code: string;
  opening_hours: string;
  instagram_url: string;
  facebook_url: string;
  google_maps_url: string;
  google_business_profile_url: string;
  currency: string;
  delivery_info: string;
  return_info: string;
  hero_headline: string;
  hero_subheadline: string;
  hero_image: string;
  logo_url?: string;
  whatsapp_default_message?: string;
  seo_title?: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  location: string;
  rating: number;
  review_text: string;
  is_featured: boolean;
  is_demo?: boolean;
  created_at: string;
}

export interface AnalyticsOverview {
  total_leads: number;
  new_leads_today: number;
  follow_ups_pending: number;
  converted_leads: number;
  conversion_rate: number;
  total_products: number;
  leads_by_source: Record<string, number>;
  leads_by_status: Record<string, number>;
  top_products: Array<{ product_name: string; enquiry_count: number; product_image?: string }>;
  recent_leads: Lead[];
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'owner';
}
