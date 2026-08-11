import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  X,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { Product, Category } from '../../types';
import { api } from '../../lib/api';
import { useSettings } from '../../context/SettingsContext';

export const AdminProductsPage: React.FC = () => {
  const { settings } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Product Form Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [form, setForm] = useState({
    name: '',
    sku: '',
    category_name: '',
    price: 0,
    original_price: 0,
    fabric: 'Kanchipuram Silk',
    color: 'Red',
    pattern: 'Gold Zari Brocade',
    occasion: 'Bridal / Wedding',
    description: '',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
    is_featured: false,
    is_new_arrival: true,
    availability: 'In Stock' as any
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getProducts({ search, limit: 50 }),
        api.getCategories()
      ]);
      setProducts(prodRes.products);
      setCategories(catRes);
      if (catRes.length > 0 && !form.category_name) {
        setForm((prev) => ({ ...prev, category_name: catRes[0].name }));
      }
    } catch (e) {
      console.error('Failed to load products:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      sku: `SML-${Math.floor(1000 + Math.random() * 9000)}`,
      category_name: categories[0]?.name || 'Kanchipuram Silk Sarees',
      price: 14999,
      original_price: 18999,
      fabric: 'Pure Silk',
      color: 'Crimson Red',
      pattern: 'Traditional Zari',
      occasion: 'Wedding Ceremony',
      description: 'Handwoven pure silk saree with opulent gold zari borders.',
      images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
      is_featured: true,
      is_new_arrival: true,
      availability: 'In Stock'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      sku: p.sku,
      category_name: p.category_name,
      price: p.price,
      original_price: p.original_price || p.price,
      fabric: p.fabric,
      color: p.color,
      pattern: p.pattern || '',
      occasion: p.occasion || '',
      description: p.description,
      images: p.images || [],
      is_featured: p.is_featured,
      is_new_arrival: p.is_new_arrival,
      availability: p.availability
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug = form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      const category_id = categories.find((c) => c.name === form.category_name)?.id || 'cat-1';
      const payload = { ...form, slug, category_id, is_active: true };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
      } else {
        await api.createProduct(payload);
      }
      setModalOpen(false);
      loadData();
    } catch (e) {
      alert('Failed to save product');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await api.deleteProduct(id);
        loadData();
      } catch (e) {
        alert('Failed to delete product');
      }
    }
  };

  return (
    <AdminLayout title="Saree Catalog & Inventory">
      <div className="space-y-6">
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-stone-300 outline-none"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Saree Product</span>
          </button>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-xs text-stone-400">Loading catalog...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  <tr>
                    <th className="p-4">Saree</th>
                    <th className="p-4">SKU</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Fabric</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0]}
                            alt={p.name}
                            className="w-10 h-12 object-cover rounded border border-stone-200"
                          />
                          <div>
                            <span className="font-bold text-stone-900 block">{p.name}</span>
                            {p.is_featured && (
                              <span className="text-[9px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-stone-600">{p.sku}</td>
                      <td className="p-4 text-stone-800">{p.category_name}</td>
                      <td className="p-4 text-stone-600">{p.fabric}</td>
                      <td className="p-4 font-bold text-stone-900">
                        {settings.currency || '₹'}{p.price.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                          {p.availability}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`/products/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-stone-400 hover:text-stone-800"
                            title="Preview"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-amber-900 hover:bg-amber-100 rounded"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-serif font-bold text-stone-900 text-lg">
                {editingProduct ? 'Edit Saree Product' : 'Add New Saree Product'}
              </h3>
              <button onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-stone-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-stone-300 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={form.category_name}
                    onChange={(e) => setForm({ ...form, category_name: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-stone-300 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-stone-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Original MRP (₹)</label>
                  <input
                    type="number"
                    value={form.original_price}
                    onChange={(e) => setForm({ ...form, original_price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-stone-300 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Fabric</label>
                  <input
                    type="text"
                    value={form.fabric}
                    onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-stone-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Primary Color</label>
                  <input
                    type="text"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-stone-300 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={form.images[0] || ''}
                  onChange={(e) => setForm({ ...form, images: [e.target.value] })}
                  className="w-full p-2.5 rounded-lg border border-stone-300 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-stone-300 outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                    className="rounded text-amber-900"
                  />
                  <span>Highlight as Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={form.is_new_arrival}
                    onChange={(e) => setForm({ ...form, is_new_arrival: e.target.checked })}
                    className="rounded text-amber-900"
                  />
                  <span>Mark as New Arrival</span>
                </label>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 border border-stone-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-900 text-white rounded-xl font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};
