import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, RefreshCw, X, MessageCircle } from 'lucide-react';
import { Product, Category } from '../types';
import { api } from '../lib/api';
import { ProductCard } from '../components/ProductCard';
import { LeadFormModal } from '../components/LeadFormModal';
import { updateMetaTags } from '../lib/seo';
import { useSettings } from '../context/SettingsContext';

export const ProductsPage: React.FC = () => {
  const { settings } = useSettings();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCatSlug, setSelectedCatSlug] = useState(searchParams.get('category') || '');
  const [fabric, setFabric] = useState(searchParams.get('fabric') || '');
  const [color, setColor] = useState(searchParams.get('color') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    updateMetaTags({
      title: 'Full Saree Catalog',
      description: 'Explore our full handloom saree catalog featuring Kanchipuram silk, Banarasi weaves, organza, and cotton sarees.',
      settings
    });

    api.getCategories().then((cats) => setCategories(cats));
  }, [settings]);

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const res = await api.getProducts({
          search,
          category_slug: selectedCatSlug,
          fabric,
          color,
          sort,
          limit: 30
        });
        setProducts(res.products);
        setTotalProducts(res.total);
      } catch (e) {
        console.error('Error loading products:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [search, selectedCatSlug, fabric, color, sort]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCatSlug('');
    setFabric('');
    setColor('');
    setSort('newest');
    setSearchParams({});
  };

  const handleOpenEnquiry = (product?: Product) => {
    setSelectedProduct(product || null);
    setModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-[10px] font-extrabold text-[#800020] tracking-[0.25em] uppercase">
          Exclusive Handloom Weaves
        </span>
        <h1 className="font-serif italic text-3xl sm:text-4xl font-bold text-stone-900">Saree Catalog</h1>
        <p className="text-stone-600 text-xs sm:text-sm">
          Browse our complete range. Enquire directly on WhatsApp for ready stock availability and pan-India delivery.
        </p>
      </div>

      {/* Search & Mobile Filter Trigger Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FAF8F5] p-4 rounded-2xs border border-[#EAE5D9]">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by saree name, SKU, or fabric..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-2xs border border-[#EAE5D9] focus:border-[#800020] outline-none bg-white"
          />
        </div>

        {/* Sort & Mobile Trigger */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 text-xs font-semibold px-3.5 py-2.5 rounded-2xs bg-white border border-[#EAE5D9] text-stone-800"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#800020]" />
            <span>Filter</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-stone-600 ml-auto sm:ml-0">
            <span className="font-medium hidden sm:inline">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-xs p-2 rounded-2xs border border-[#EAE5D9] bg-white font-medium text-stone-800 outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="oldest">Featured First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Layout Grid: Desktop Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 p-5 bg-white rounded-xl border border-stone-200 h-fit sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <h3 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-800" />
              <span>Filters</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-amber-900 hover:underline font-semibold flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
              Category
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCatSlug('')}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-md transition-colors ${
                  selectedCatSlug === ''
                    ? 'bg-amber-100 text-amber-950 font-bold'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCatSlug(c.slug)}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-md transition-colors ${
                    selectedCatSlug === c.slug
                      ? 'bg-amber-100 text-amber-950 font-bold'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Fabric Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
              Fabric Type
            </label>
            <select
              value={fabric}
              onChange={(e) => setFabric(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white outline-none"
            >
              <option value="">All Fabrics</option>
              <option value="Kanchipuram Silk">Kanchipuram Silk</option>
              <option value="Banarasi Silk">Banarasi Silk</option>
              <option value="Organza">Organza</option>
              <option value="Soft Silk">Soft Silk</option>
              <option value="Georgette">Georgette</option>
              <option value="Chanderi">Chanderi</option>
              <option value="Linen Cotton">Linen Cotton</option>
            </select>
          </div>
        </aside>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex justify-end lg:hidden">
            <div className="bg-white w-80 h-full p-6 shadow-2xl flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <h3 className="font-serif font-bold text-stone-900 text-base">Filter Sarees</h3>
                  <button onClick={() => setMobileFilterOpen(false)} className="p-1">
                    <X className="w-5 h-5 text-stone-500" />
                  </button>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                    Category
                  </label>
                  <select
                    value={selectedCatSlug}
                    onChange={(e) => setSelectedCatSlug(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                    Fabric
                  </label>
                  <select
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="">All Fabrics</option>
                    <option value="Kanchipuram Silk">Kanchipuram Silk</option>
                    <option value="Banarasi Silk">Banarasi Silk</option>
                    <option value="Organza">Organza</option>
                    <option value="Georgette">Georgette</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex gap-2">
                <button
                  onClick={handleResetFilters}
                  className="flex-1 py-2.5 text-xs font-semibold border border-stone-300 rounded-lg"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-2.5 text-xs font-semibold bg-amber-900 text-white rounded-lg"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Showing <strong className="text-stone-900">{products.length}</strong> of {totalProducts} sarees</span>
            {(selectedCatSlug || search || fabric) && (
              <button onClick={handleResetFilters} className="text-amber-900 hover:underline font-semibold">
                Clear Active Filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-stone-100 aspect-[3/4] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-stone-50 rounded-2xl p-12 text-center border border-stone-200 space-y-3">
              <p className="font-serif font-bold text-lg text-stone-800">No sarees found matching your filters</p>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try searching for another keyword or clear fabric filters to view all available collections.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-amber-900 text-amber-50 font-semibold px-4 py-2 rounded-xl text-xs"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} onQuickEnquire={handleOpenEnquiry} />
              ))}
            </div>
          )}
        </div>

      </div>

      <LeadFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
};
