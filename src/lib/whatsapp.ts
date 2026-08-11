/**
 * WhatsApp Helper Utilities
 */

import { Product, BusinessSettings } from '../types';

/**
 * Format a phone number into an international WhatsApp digits-only format
 * e.g., "+91 98765 43210" -> "919876543210"
 */
export function formatWhatsAppNumber(phone: string): string {
  if (!phone) return '919876543210';
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 10) {
    return `91${clean}`; // Default India country code if 10 digits
  }
  return clean;
}

/**
 * Generate a pre-filled WhatsApp link for a specific Product Enquiry
 */
export function getProductWhatsAppUrl(
  product: Product,
  settings: Partial<BusinessSettings>
): string {
  const number = formatWhatsAppNumber(settings.whatsapp_number || settings.phone || '919876543210');
  
  const priceFormatted = `${settings.currency || '₹'}${product.price.toLocaleString('en-IN')}`;
  
  const text = `Hi ${settings.business_name || 'Rajani Sarees'}, I am interested in this saree:

📌 *Product:* ${product.name}
🏷️ *SKU:* ${product.sku}
💰 *Price:* ${priceFormatted}
🧵 *Fabric:* ${product.fabric}
🎨 *Color:* ${product.color}

Is this item currently available for delivery? Please share more details.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/**
 * Generate a general WhatsApp consultation link
 */
export function getGeneralWhatsAppUrl(
  settings: Partial<BusinessSettings>,
  customMessage?: string
): string {
  const number = formatWhatsAppNumber(settings.whatsapp_number || settings.phone || '919876543210');
  const defaultText = `Hi ${settings.business_name || 'Rajani Sarees'}, I would like to inquire about your saree collections and custom order options.`;
  const text = customMessage || defaultText;
  
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
