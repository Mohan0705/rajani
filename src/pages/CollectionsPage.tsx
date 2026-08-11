import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Category } from '../types';
import { api } from '../lib/api';
import { updateMetaTags } from '../lib/seo';
import { useSettings } from '../context/SettingsContext';

export const CollectionsPage: React.FC = () => {
  const { settings } = useSettings();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updateMetaTags({
      title: 'Explore Saree Collections',
      description: 'Discover our complete range of handloom saree categories: Kanchipuram silk, Banarasi brocades, organza, and cotton sarees.',
      settings
    });

    api
      .getCategories()
      .then((cats) => setCategories(cats))
      .finally(() => setLoading(false));
  }, [settings]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold text-amber-800 tracking-widest uppercase">
          Master Weaving Clusters
        </span>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Saree Collections</h1>
        <p className="text-stone-600 text-xs sm:text-sm">
          Select a saree category to explore curated designs for weddings, festivals, and grand celebrations.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-stone-100 aspect-[4/3] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="aspect-[4/3] bg-stone-100 overflow-hidden relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-serif text-xl font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                    {cat.name}
                  </h2>
                  <p className="text-stone-600 text-xs line-clamp-2 mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="pt-3 flex items-center text-xs font-bold text-amber-900 group-hover:text-amber-950 gap-1">
                  <span>Browse Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
