/**
 * Persistent Data Store for Saree Business & Lead CRM
 * Uses JSON file persistence in /data/saree_db.json
 */

import fs from 'fs';
import path from 'path';
import {
  Product,
  Category,
  Lead,
  LeadNote,
  BusinessSettings,
  Testimonial,
  AnalyticsOverview,
  AdminUser
} from '../src/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'saree_db.json');

interface Schema {
  settings: BusinessSettings;
  categories: Category[];
  products: Product[];
  leads: Lead[];
  testimonials: Testimonial[];
  admins: AdminUser[];
}

const DEFAULT_SETTINGS: BusinessSettings = {
  business_name: 'Rajani Sarees',
  tagline: 'Grace in Every Drape, Beauty in Every You',
  description: 'Handwoven Kanchipuram silks, Royal Banarasi weaves, Designer Organza, and Pure Cotton sarees direct from master weavers.',
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
  delivery_info: 'Free express courier delivery across India on orders above ₹1,999. Worldwide shipping available.',
  return_info: 'Rigorous 3-step quality inspection prior to dispatch. Easy 7-day exchange support for manufacturing defects.',
  hero_headline: 'Elegance Woven Into Every Saree',
  hero_subheadline: 'Discover hand-selected Kanchipuram silks, Banarasi weaves, and lightweight organza sarees crafted for weddings, festivals, and every special moment.',
  hero_image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80',
  logo_url: ''
};

const SEED_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Kanchipuram Silk',
    slug: 'kanchipuram-silk',
    description: 'Traditional pure silk handwoven sarees with gold zari woven borders for weddings and grand occasions.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'cat-2',
    name: 'Banarasi Silk',
    slug: 'banarasi-silk',
    description: 'Royal brocades with intricate floral kadwa weaves and lustrous metallic finish from Varanasi.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'cat-3',
    name: 'Designer Party Wear',
    slug: 'designer-party-wear',
    description: 'Modern silhouettes with sequin highlights, cutwork borders, and contemporary pallu draping.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    display_order: 3,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'cat-4',
    name: 'Soft Silk & Chanderi',
    slug: 'soft-silk-chanderi',
    description: 'Lightweight, comfortable pure soft silk and sheen Chanderi sarees for day-long festive wear.',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    display_order: 4,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'cat-5',
    name: 'Organza & Net',
    slug: 'organza-net',
    description: 'Breezy sheer organza sarees accented with delicate floral embroidery and pearl lace.',
    image: 'https://images.unsplash.com/photo-1610030469888-2ffbd9f8602b?auto=format&fit=crop&w=800&q=80',
    display_order: 5,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'cat-6',
    name: 'Premium Cotton',
    slug: 'premium-cotton',
    description: 'Handloom Mulmul and Linen cotton sarees designed for effortless daily elegance and summer comfort.',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    display_order: 6,
    is_active: true,
    created_at: new Date().toISOString()
  }
];

const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Bridal Crimson Kanchipuram Pure Zari Silk Saree',
    slug: 'bridal-crimson-kanchipuram-pure-zari-silk-saree',
    sku: 'KS-101',
    category_id: 'cat-1',
    category_name: 'Kanchipuram Silk',
    price: 18500,
    original_price: 24000,
    discount_pct: 23,
    description: 'Exquisite bridal crimson pure Kanchipuram handloom silk saree featuring rich korvai gold zari temple border and heavy brocade pallu. Comes with unstitched matching blouse piece with zari border.',
    fabric: 'Kanchipuram Silk',
    color: 'Crimson Red',
    pattern: 'Korvai Gold Zari Weave',
    occasion: 'Wedding / Bridal',
    availability: 'In Stock',
    is_active: true,
    is_featured: true,
    is_new_arrival: true,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80'
    ],
    care_instructions: 'Dry clean only. Store wrapped in pure cotton cloth.',
    delivery_info: 'Ships within 24 hours. Express 2-3 day delivery across major Indian cities.',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-2',
    name: 'Royal Golden Yellow Banarasi Kadwa Silk Saree',
    slug: 'royal-golden-yellow-banarasi-kadwa-silk-saree',
    sku: 'BS-204',
    category_id: 'cat-2',
    category_name: 'Banarasi Silk',
    price: 12900,
    original_price: 16500,
    discount_pct: 22,
    description: 'Regal golden yellow Banarasi silk saree woven with gold and silver zari floral kadwa jaal motifs across the body. Elegant scalloped border and opulent pallu.',
    fabric: 'Banarasi Katan Silk',
    color: 'Golden Yellow',
    pattern: 'Kadwa Jaal Weave',
    occasion: 'Festive / Haldi',
    availability: 'In Stock',
    is_active: true,
    is_featured: true,
    is_new_arrival: false,
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80'
    ],
    care_instructions: 'Dry clean only.',
    delivery_info: 'Free express shipping across India.',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-3',
    name: 'Emerald Green Soft Kanjivaram Silk Saree',
    slug: 'emerald-green-soft-kanjivaram-silk-saree',
    sku: 'KS-108',
    category_id: 'cat-1',
    category_name: 'Kanchipuram Silk',
    price: 9800,
    original_price: 12500,
    discount_pct: 21,
    description: 'Ultra-soft weightless Kanjivaram silk saree in rich emerald green with subtle copper zari peacock buttas and contrast magenta zari border.',
    fabric: 'Soft Kanchipuram Silk',
    color: 'Emerald Green',
    pattern: 'Peacock Zari Buttis',
    occasion: 'Festive / Puja',
    availability: 'In Stock',
    is_active: true,
    is_featured: true,
    is_new_arrival: true,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80'
    ],
    care_instructions: 'Dry clean only.',
    delivery_info: 'Free delivery in 3-5 working days.',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-4',
    name: 'Pastel Rose Pink Floral Organza Hand-Embroidered Saree',
    slug: 'pastel-rose-pink-floral-organza-saree',
    sku: 'ORG-302',
    category_id: 'cat-5',
    category_name: 'Organza & Net',
    price: 6490,
    original_price: 8200,
    discount_pct: 20,
    description: 'Breezy light pastel pink sheer organza saree with delicate hand-embroidered resham floral vine motifs and scalloped cutwork border with subtle pearl accents.',
    fabric: 'Pure Sheer Organza',
    color: 'Pastel Rose Pink',
    pattern: 'Hand Embroidered Floral',
    occasion: 'Party / Reception',
    availability: 'In Stock',
    is_active: true,
    is_featured: true,
    is_new_arrival: true,
    images: [
      'https://images.unsplash.com/photo-1610030469888-2ffbd9f8602b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80'
    ],
    care_instructions: 'Dry clean only. Do not wring.',
    delivery_info: 'Dispatched in 24 hrs.',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-5',
    name: 'Midnight Navy Blue Sequin Work Designer Georgette Saree',
    slug: 'midnight-navy-blue-sequin-georgette-saree',
    sku: 'DS-405',
    category_id: 'cat-3',
    category_name: 'Designer Party Wear',
    price: 5200,
    original_price: 6900,
    discount_pct: 24,
    description: 'Showstopper midnight navy blue fluid georgette saree embellished with tone-on-tone micro sequin border and glamorous designer blouse piece.',
    fabric: 'Pure Viscose Georgette',
    color: 'Midnight Navy Blue',
    pattern: 'Sequin Border',
    occasion: 'Party / Cocktail',
    availability: 'In Stock',
    is_active: true,
    is_featured: false,
    is_new_arrival: true,
    images: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80'
    ],
    care_instructions: 'Dry clean recommended.',
    delivery_info: 'Free courier delivery across India.',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-6',
    name: 'Golden Peach Chanderi Silk Cotton Saree with Zari Muti',
    slug: 'golden-peach-chanderi-silk-cotton-saree',
    sku: 'CHS-501',
    category_id: 'cat-4',
    category_name: 'Soft Silk & Chanderi',
    price: 3800,
    original_price: 4900,
    discount_pct: 22,
    description: 'Soft sheen golden peach Chanderi tissue silk cotton saree decorated with classic silver zari coins (booti) and thin gold woven border.',
    fabric: 'Chanderi Silk Cotton',
    color: 'Peach & Gold',
    pattern: 'Zari Coin Booti',
    occasion: 'Festive / Day Event',
    availability: 'In Stock',
    is_active: true,
    is_featured: false,
    is_new_arrival: false,
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80'
    ],
    care_instructions: 'Gentle hand wash in cold water or dry clean.',
    delivery_info: 'Standard delivery 3-5 business days.',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-7',
    name: 'Mulberry Purple Kanjeevaram Tissue Silk Saree',
    slug: 'mulberry-purple-kanjeevaram-tissue-silk-saree',
    sku: 'KS-112',
    category_id: 'cat-1',
    category_name: 'Kanchipuram Silk',
    price: 15900,
    original_price: 19800,
    discount_pct: 19,
    description: 'Lustrous mulberry purple tissue Kanjivaram silk saree with shimmering metallic shot effect, heavy gold peacock pallu and rich contrast temple border.',
    fabric: 'Tissue Kanchipuram Silk',
    color: 'Mulberry Purple',
    pattern: 'Metallic Shot Zari Weave',
    occasion: 'Wedding / Reception',
    availability: 'Limited Stock',
    is_active: true,
    is_featured: true,
    is_new_arrival: false,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80'
    ],
    care_instructions: 'Dry clean only.',
    delivery_info: 'Express 2-day delivery.',
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-8',
    name: 'Handloom Mint Green Linen Cotton Block Print Saree',
    slug: 'handloom-mint-green-linen-cotton-saree',
    sku: 'PC-602',
    category_id: 'cat-6',
    category_name: 'Premium Cotton',
    price: 2450,
    original_price: 3200,
    discount_pct: 23,
    description: 'Ultra-breathable mint green pure linen cotton handloom saree with hand block printed floral motifs and subtle silver zari selvedge border.',
    fabric: 'Pure Linen Cotton',
    color: 'Mint Green',
    pattern: 'Floral Block Print',
    occasion: 'Daily / Workwear',
    availability: 'In Stock',
    is_active: true,
    is_featured: false,
    is_new_arrival: true,
    images: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80'
    ],
    care_instructions: 'Soft hand wash separately in cold water.',
    delivery_info: 'Ships in 1-2 days.',
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    updated_at: new Date().toISOString()
  }
];

const SEED_LEADS: Lead[] = [
  {
    id: 'lead-101',
    name: 'Priya Sharma',
    phone: '+91 98765 12345',
    whatsapp: '919876512345',
    email: 'priya.s@example.com',
    city: 'Hyderabad',
    product_id: 'prod-1',
    product_name: 'Bridal Crimson Kanchipuram Pure Zari Silk Saree',
    product_sku: 'KS-101',
    product_image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=500&q=80',
    message: 'Hi, I need this bridal saree for my wedding on Oct 15. Is crimson red available in ready stock?',
    preferred_contact: 'WhatsApp',
    preferred_color: 'Crimson Red',
    budget_range: '₹15,000 - ₹20,000',
    source: 'Instagram',
    utm_source: 'instagram',
    utm_medium: 'social_ad',
    utm_campaign: 'festive_bridal_2026',
    status: 'Interested',
    notes: [
      {
        id: 'note-1',
        lead_id: 'lead-101',
        note: 'Customer asked for additional blouse pattern photos on WhatsApp. Sent video catalog.',
        created_by: 'Admin',
        created_at: new Date(Date.now() - 3600000 * 4).toISOString()
      }
    ],
    follow_up_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'lead-102',
    name: 'Sunita Reddy',
    phone: '+91 98480 22334',
    whatsapp: '919848022334',
    city: 'Vijayawada',
    product_id: 'prod-2',
    product_name: 'Royal Golden Yellow Banarasi Kadwa Silk Saree',
    product_sku: 'BS-204',
    product_image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=500&q=80',
    message: 'Looking for 3 matching sarees for haldi ceremony.',
    preferred_contact: 'Call',
    source: 'Google',
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'banarasi_sarees_ap',
    status: 'Contacted',
    notes: [
      {
        id: 'note-2',
        lead_id: 'lead-102',
        note: 'Called Sunita. Offered 5% discount on bulk order of 3 sarees.',
        created_by: 'Admin',
        created_at: new Date(Date.now() - 3600000 * 10).toISOString()
      }
    ],
    follow_up_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'lead-103',
    name: 'Ananya Rao',
    phone: '+91 99590 11223',
    whatsapp: '919959011223',
    city: 'Visakhapatnam',
    product_id: 'prod-4',
    product_name: 'Pastel Rose Pink Floral Organza Hand-Embroidered Saree',
    product_sku: 'ORG-302',
    product_image: 'https://images.unsplash.com/photo-1610030469888-2ffbd9f8602b?auto=format&fit=crop&w=500&q=80',
    message: 'Purchased for reception party.',
    preferred_contact: 'WhatsApp',
    source: 'Website',
    status: 'Converted',
    notes: [
      {
        id: 'note-3',
        lead_id: 'lead-103',
        note: 'Payment received via UPI (₹6,490). Shipped via DTDC tracking #DT98213.',
        created_by: 'Admin',
        created_at: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ],
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'lead-104',
    name: 'Lakshmi Narayana',
    phone: '+91 97010 44556',
    whatsapp: '919701044556',
    city: 'Tadepalligudem',
    product_id: 'prod-3',
    product_name: 'Emerald Green Soft Kanjivaram Silk Saree',
    product_sku: 'KS-108',
    product_image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=500&q=80',
    message: 'Can I visit the store in Tadepalligudem to see this in person?',
    preferred_contact: 'Call',
    source: 'Direct',
    status: 'Follow-up',
    notes: [],
    follow_up_date: new Date().toISOString().split('T')[0],
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date().toISOString()
  }
];

const SEED_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    customer_name: 'Sravanthi Garapati',
    location: 'Bhimavaram',
    rating: 5,
    review_text: 'Purchased my bridal Kanchipuram silk saree from Rajani Sarees. The zari work is pure and the fabric sheen is magnificent!',
    is_featured: true,
    is_demo: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'test-2',
    customer_name: 'Meenakshi Sundaram',
    location: 'Chennai',
    rating: 5,
    review_text: 'Enquired on WhatsApp and got instant response with high resolution video drape of the saree. Received my order in 2 days.',
    is_featured: true,
    is_demo: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'test-3',
    customer_name: 'Radhika Chowdary',
    location: 'Hyderabad',
    rating: 5,
    review_text: 'The organza saree is so lightweight and comfortable. Authentic quality and beautiful packaging.',
    is_featured: true,
    is_demo: true,
    created_at: new Date().toISOString()
  }
];

class DatabaseStore {
  private db: Schema;

  constructor() {
    this.db = this.loadDB();
  }

  private loadDB(): Schema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error reading database file, resetting to defaults:', e);
    }

    const initialSchema: Schema = {
      settings: DEFAULT_SETTINGS,
      categories: SEED_CATEGORIES,
      products: SEED_PRODUCTS,
      leads: SEED_LEADS,
      testimonials: SEED_TESTIMONIALS,
      admins: [
        {
          id: 'admin-1',
          email: 'admin@saree.com',
          name: 'Boutique Owner',
          role: 'owner'
        }
      ]
    };

    this.saveDB(initialSchema);
    return initialSchema;
  }

  private saveDB(data?: Schema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data || this.db, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save database file:', e);
    }
  }

  // --- SETTINGS ---
  getSettings(): BusinessSettings {
    return this.db.settings;
  }

  updateSettings(newSettings: Partial<BusinessSettings>): BusinessSettings {
    this.db.settings = { ...this.db.settings, ...newSettings };
    this.saveDB();
    return this.db.settings;
  }

  // --- CATEGORIES ---
  getCategories(): Category[] {
    return this.db.categories.filter((c) => c.is_active);
  }

  getAllCategories(): Category[] {
    return this.db.categories;
  }

  createCategory(categoryData: Omit<Category, 'id' | 'created_at'>): Category {
    const newCat: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.db.categories.push(newCat);
    this.saveDB();
    return newCat;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const idx = this.db.categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.db.categories[idx] = { ...this.db.categories[idx], ...updates };
    this.saveDB();
    return this.db.categories[idx];
  }

  deleteCategory(id: string): boolean {
    const initialLen = this.db.categories.length;
    this.db.categories = this.db.categories.filter((c) => c.id !== id);
    if (this.db.categories.length !== initialLen) {
      this.saveDB();
      return true;
    }
    return false;
  }

  // --- PRODUCTS ---
  getProducts(filters?: {
    category_slug?: string;
    fabric?: string;
    color?: string;
    occasion?: string;
    search?: string;
    is_featured?: boolean;
    is_new_arrival?: boolean;
    min_price?: number;
    max_price?: number;
    sort?: string;
    limit?: number;
    offset?: number;
  }): { products: Product[]; total: number } {
    let list = this.db.products.filter((p) => p.is_active);

    if (filters) {
      if (filters.category_slug) {
        const cat = this.db.categories.find((c) => c.slug === filters.category_slug);
        if (cat) {
          list = list.filter((p) => p.category_id === cat.id);
        }
      }

      if (filters.fabric) {
        list = list.filter((p) => p.fabric.toLowerCase().includes(filters.fabric!.toLowerCase()));
      }

      if (filters.color) {
        list = list.filter((p) => p.color.toLowerCase().includes(filters.color!.toLowerCase()));
      }

      if (filters.occasion) {
        list = list.filter((p) => p.occasion && p.occasion.toLowerCase().includes(filters.occasion!.toLowerCase()));
      }

      if (filters.is_featured) {
        list = list.filter((p) => p.is_featured);
      }

      if (filters.is_new_arrival) {
        list = list.filter((p) => p.is_new_arrival);
      }

      if (filters.min_price !== undefined) {
        list = list.filter((p) => p.price >= filters.min_price!);
      }

      if (filters.max_price !== undefined) {
        list = list.filter((p) => p.price <= filters.max_price!);
      }

      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.fabric.toLowerCase().includes(q) ||
            p.color.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
      }

      // Sort
      if (filters.sort === 'price_low') {
        list.sort((a, b) => a.price - b.price);
      } else if (filters.sort === 'price_high') {
        list.sort((a, b) => b.price - a.price);
      } else if (filters.sort === 'oldest') {
        list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      } else {
        // Default newest first
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }
    }

    const total = list.length;
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 24;
    const paginated = list.slice(offset, offset + limit);

    return { products: paginated, total };
  }

  getAllProductsAdmin(): Product[] {
    return [...this.db.products].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  getProductBySlugOrId(slugOrId: string): Product | null {
    return (
      this.db.products.find((p) => p.slug === slugOrId || p.id === slugOrId) || null
    );
  }

  createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Product {
    const slug =
      productData.slug ||
      productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const newProd: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      slug,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.db.products.push(newProd);
    this.saveDB();
    return newProd;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.db.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    if (updates.name && !updates.slug) {
      updates.slug = updates.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    this.db.products[idx] = {
      ...this.db.products[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };

    this.saveDB();
    return this.db.products[idx];
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.db.products.length;
    this.db.products = this.db.products.filter((p) => p.id !== id);
    if (this.db.products.length !== initialLen) {
      this.saveDB();
      return true;
    }
    return false;
  }

  // --- LEADS ---
  getLeads(filters?: {
    status?: string;
    source?: string;
    search?: string;
    date_from?: string;
  }): Lead[] {
    let list = [...this.db.leads];

    if (filters) {
      if (filters.status && filters.status !== 'All') {
        list = list.filter((l) => l.status === filters.status);
      }

      if (filters.source && filters.source !== 'All') {
        list = list.filter((l) => l.source === filters.source);
      }

      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(
          (l) =>
            l.name.toLowerCase().includes(q) ||
            l.phone.includes(q) ||
            (l.product_name && l.product_name.toLowerCase().includes(q)) ||
            (l.city && l.city.toLowerCase().includes(q))
        );
      }
    }

    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getLeadById(id: string): Lead | null {
    return this.db.leads.find((l) => l.id === id) || null;
  }

  createLead(
    leadData: Omit<Lead, 'id' | 'status' | 'notes' | 'created_at' | 'updated_at'>
  ): Lead {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      status: 'New',
      notes: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.db.leads.unshift(newLead);
    this.saveDB();
    return newLead;
  }

  updateLeadStatus(id: string, status: Lead['status']): Lead | null {
    const idx = this.db.leads.findIndex((l) => l.id === id);
    if (idx === -1) return null;

    this.db.leads[idx].status = status;
    this.db.leads[idx].updated_at = new Date().toISOString();
    this.saveDB();
    return this.db.leads[idx];
  }

  addLeadNote(id: string, noteText: string, createdBy = 'Admin'): Lead | null {
    const idx = this.db.leads.findIndex((l) => l.id === id);
    if (idx === -1) return null;

    const newNote: LeadNote = {
      id: `note-${Date.now()}`,
      lead_id: id,
      note: noteText,
      created_by: createdBy,
      created_at: new Date().toISOString()
    };

    this.db.leads[idx].notes.push(newNote);
    this.db.leads[idx].updated_at = new Date().toISOString();
    this.saveDB();
    return this.db.leads[idx];
  }

  setLeadFollowUp(id: string, followUpDate: string): Lead | null {
    const idx = this.db.leads.findIndex((l) => l.id === id);
    if (idx === -1) return null;

    this.db.leads[idx].follow_up_date = followUpDate;
    this.db.leads[idx].updated_at = new Date().toISOString();
    this.saveDB();
    return this.db.leads[idx];
  }

  // --- ANALYTICS ---
  getAnalytics(): AnalyticsOverview {
    const leads = this.db.leads;
    const total_leads = leads.length;

    const todayStr = new Date().toISOString().split('T')[0];
    const new_leads_today = leads.filter(
      (l) => l.created_at.startsWith(todayStr) || l.status === 'New'
    ).length;

    const follow_ups_pending = leads.filter(
      (l) => l.status === 'Follow-up' || (l.follow_up_date && l.follow_up_date <= todayStr)
    ).length;

    const converted_leads = leads.filter((l) => l.status === 'Converted').length;
    const conversion_rate =
      total_leads > 0 ? Math.round((converted_leads / total_leads) * 100) : 0;

    const leads_by_source: Record<string, number> = {};
    const leads_by_status: Record<string, number> = {};
    const product_enquiries: Record<string, { count: number; image?: string }> = {};

    leads.forEach((l) => {
      // Source breakdown
      const src = l.source || 'Website';
      leads_by_source[src] = (leads_by_source[src] || 0) + 1;

      // Status breakdown
      const st = l.status || 'New';
      leads_by_status[st] = (leads_by_status[st] || 0) + 1;

      // Product breakdown
      if (l.product_name) {
        if (!product_enquiries[l.product_name]) {
          product_enquiries[l.product_name] = { count: 0, image: l.product_image };
        }
        product_enquiries[l.product_name].count += 1;
      }
    });

    const top_products = Object.entries(product_enquiries)
      .map(([pName, data]) => ({
        product_name: pName,
        enquiry_count: data.count,
        product_image: data.image
      }))
      .sort((a, b) => b.enquiry_count - a.enquiry_count)
      .slice(0, 5);

    const recent_leads = leads.slice(0, 6);

    return {
      total_leads,
      new_leads_today,
      follow_ups_pending,
      converted_leads,
      conversion_rate,
      total_products: this.db.products.length,
      leads_by_source,
      leads_by_status,
      top_products,
      recent_leads
    };
  }

  // --- TESTIMONIALS ---
  getTestimonials(): Testimonial[] {
    return this.db.testimonials.filter((t) => t.is_featured);
  }

  addTestimonial(testData: Omit<Testimonial, 'id' | 'created_at'>): Testimonial {
    const newTest: Testimonial = {
      ...testData,
      id: `test-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.db.testimonials.push(newTest);
    this.saveDB();
    return newTest;
  }
}

export const dbStore = new DatabaseStore();
