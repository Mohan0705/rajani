/**
 * Dynamic SEO & Structured Data (Schema.org) Manager
 */

import { Product, BusinessSettings } from '../types';

export function updateMetaTags(options: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  settings?: Partial<BusinessSettings>;
}) {
  const brandName = options.settings?.business_name || 'Rajani Sarees';
  const pageTitle = options.title
    ? `${options.title} | ${brandName}`
    : `${brandName} - Premium Handcrafted Sarees`;
  
  const description = options.description ||
    options.settings?.description ||
    'Discover authentic Kanchipuram silk, Banarasi, Organza, and designer sarees. Enquire directly on WhatsApp for pan-India delivery.';

  document.title = pageTitle;

  // Set standard meta tags
  setMeta('description', description);
  setMeta('og:title', pageTitle, 'property');
  setMeta('og:description', description, 'property');
  setMeta('og:type', 'website', 'property');
  if (options.image) {
    setMeta('og:image', options.image, 'property');
  }
  if (options.url) {
    setMeta('og:url', options.url, 'property');
  }
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', pageTitle);
  setMeta('twitter:description', description);
}

function setMeta(name: string, content: string, attribute = 'name') {
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Inject Schema.org JSON-LD Structured Data
 */
export function injectStructuredData(schemaData: object, id = 'json-ld-schema') {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.text = JSON.stringify(schemaData);
}

export function generateProductSchema(product: Product, settings: Partial<BusinessSettings>) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.sku,
    category: product.category_name,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.availability === 'In Stock'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: settings.business_name || 'Rajani Sarees'
      }
    }
  };
}

export function generateLocalBusinessSchema(settings: Partial<BusinessSettings>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: settings.business_name || 'Rajani Sarees',
    description: settings.description || 'Premium Handcrafted Sarees',
    telephone: settings.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      addressLocality: settings.city,
      addressRegion: settings.state,
      postalCode: settings.pin_code,
      addressCountry: settings.country || 'IN'
    },
    openingHours: settings.opening_hours || 'Mo-Sa 10:00-21:00',
    priceRange: '₹₹₹'
  };
}
