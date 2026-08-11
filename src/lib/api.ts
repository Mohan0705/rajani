/**
 * API Client functions for Saree Business & Lead CRM
 */

import { Product, Category, Lead, BusinessSettings, AnalyticsOverview, Testimonial } from '../types';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('saree_admin_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>)
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });
  const data = await res.json();

  if (!res.ok || data.success === false) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
}

export const api = {
  // Settings
  async getSettings(): Promise<BusinessSettings> {
    const data = await fetchJSON<{ settings: BusinessSettings }>('/api/settings');
    return data.settings;
  },

  async updateSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
    const data = await fetchJSON<{ settings: BusinessSettings }>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
    return data.settings;
  },

  // Categories
  async getCategories(admin = false): Promise<Category[]> {
    const data = await fetchJSON<{ categories: Category[] }>(`/api/categories?admin=${admin}`);
    return data.categories;
  },

  async createCategory(category: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
    const data = await fetchJSON<{ category: Category }>('/api/categories', {
      method: 'POST',
      body: JSON.stringify(category)
    });
    return data.category;
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const data = await fetchJSON<{ category: Category }>(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    return data.category;
  },

  async deleteCategory(id: string): Promise<boolean> {
    const data = await fetchJSON<{ success: boolean }>(`/api/categories/${id}`, {
      method: 'DELETE'
    });
    return data.success;
  },

  // Products
  async getProducts(params?: Record<string, any>): Promise<{ products: Product[]; total: number }> {
    const query = new URLSearchParams(params).toString();
    return fetchJSON<{ products: Product[]; total: number }>(`/api/products?${query}`);
  },

  async getAllProductsAdmin(): Promise<Product[]> {
    const data = await fetchJSON<{ products: Product[] }>('/api/products/admin/all');
    return data.products;
  },

  async getProductBySlugOrId(slugOrId: string): Promise<Product> {
    const data = await fetchJSON<{ product: Product }>(`/api/products/${slugOrId}`);
    return data.product;
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const data = await fetchJSON<{ product: Product }>('/api/products', {
      method: 'POST',
      body: JSON.stringify(product)
    });
    return data.product;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const data = await fetchJSON<{ product: Product }>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    return data.product;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const data = await fetchJSON<{ success: boolean }>(`/api/products/${id}`, {
      method: 'DELETE'
    });
    return data.success;
  },

  // Leads
  async submitLead(leadData: {
    name: string;
    phone: string;
    email?: string;
    city?: string;
    product_id?: string;
    product_name?: string;
    product_sku?: string;
    product_image?: string;
    message?: string;
    preferred_contact?: string;
    preferred_color?: string;
    budget_range?: string;
    source?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    referrer?: string;
    landing_page?: string;
    website_honeypot?: string;
  }): Promise<Lead> {
    const data = await fetchJSON<{ lead: Lead }>('/api/leads', {
      method: 'POST',
      body: JSON.stringify(leadData)
    });
    return data.lead;
  },

  async getLeads(filters?: { status?: string; source?: string; search?: string }): Promise<Lead[]> {
    const query = new URLSearchParams(filters as any).toString();
    const data = await fetchJSON<{ leads: Lead[] }>(`/api/leads?${query}`);
    return data.leads;
  },

  async getLeadById(id: string): Promise<Lead> {
    const data = await fetchJSON<{ lead: Lead }>(`/api/leads/${id}`);
    return data.lead;
  },

  async updateLeadStatus(id: string, status: string): Promise<Lead> {
    const data = await fetchJSON<{ lead: Lead }>(`/api/leads/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    return data.lead;
  },

  async addLeadNote(id: string, note: string, created_by = 'Admin'): Promise<Lead> {
    const data = await fetchJSON<{ lead: Lead }>(`/api/leads/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note, created_by })
    });
    return data.lead;
  },

  async setLeadFollowUp(id: string, follow_up_date: string): Promise<Lead> {
    const data = await fetchJSON<{ lead: Lead }>(`/api/leads/${id}/followup`, {
      method: 'PUT',
      body: JSON.stringify({ follow_up_date })
    });
    return data.lead;
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsOverview> {
    const data = await fetchJSON<{ analytics: AnalyticsOverview }>('/api/analytics');
    return data.analytics;
  },

  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    const data = await fetchJSON<{ testimonials: Testimonial[] }>('/api/testimonials');
    return data.testimonials;
  },

  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const data = await fetchJSON<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    localStorage.setItem('saree_admin_token', data.token);
    return data;
  },

  async getMe(): Promise<any> {
    const data = await fetchJSON<{ user: any }>('/api/auth/me');
    return data.user;
  },

  logout() {
    localStorage.removeItem('saree_admin_token');
  }
};
