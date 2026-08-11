import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { Category } from '../../types';
import { api } from '../../lib/api';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: ''
  });

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (e) {
      console.error('Failed to load categories:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setForm({
      name: '',
      slug: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: c.image
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, { ...form, slug, display_order: 1, is_active: true });
      } else {
        await api.createCategory({ ...form, slug, display_order: 1, is_active: true });
      }
      setModalOpen(false);
      loadCategories();
    } catch (e) {
      alert('Failed to save category');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      try {
        await api.deleteCategory(id);
        loadCategories();
      } catch (e) {
        alert('Failed to delete category');
      }
    }
  };

  return (
    <AdminLayout title="Saree Category Management">
      <div className="space-y-6">
        
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200">
          <div>
            <h3 className="font-serif font-bold text-stone-900 text-sm">Product Categories</h3>
            <p className="text-xs text-stone-500">Organize sarees by weave type and occasion</p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs space-y-3 flex flex-col justify-between p-4">
              <div className="space-y-2">
                <div className="aspect-[16/9] bg-stone-100 rounded-xl overflow-hidden">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-stone-900 text-base">{c.name}</h4>
                  <span className="text-[10px] font-mono text-stone-400 block">/collections/{c.slug}</span>
                  <p className="text-xs text-stone-600 line-clamp-2 mt-1">{c.description}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="text-amber-900 hover:underline font-semibold flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(c.id, c.name)}
                  className="text-rose-600 hover:underline font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-serif font-bold text-stone-900 text-base">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-stone-300 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-stone-300 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-stone-300 outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-amber-900 text-white rounded-lg font-bold">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
