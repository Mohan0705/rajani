import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Plus,
  MessageCircle,
  Phone,
  Clock,
  MoreVertical,
  Calendar,
  X
} from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { Lead, LeadStatus } from '../../types';
import { api } from '../../lib/api';
import { AdminLeadDrawer } from '../../components/AdminLeadDrawer';
import { useSettings } from '../../context/SettingsContext';

export const AdminLeadsPage: React.FC = () => {
  const { settings } = useSettings();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Add Manual Lead Modal
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    name: '',
    phone: '',
    city: '',
    source: 'Instagram',
    product_name: '',
    message: ''
  });

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await api.getLeads({
        status: statusFilter === 'All' ? undefined : (statusFilter as LeadStatus),
        search
      });
      setLeads(data);
    } catch (e) {
      console.error('Failed to load leads:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, search]);

  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Name', 'Phone', 'City', 'Product', 'Source', 'Status', 'Message'];
    const rows = leads.map((l) => [
      l.id,
      new Date(l.created_at).toLocaleDateString(),
      `"${l.name}"`,
      l.phone,
      `"${l.city || ''}"`,
      `"${l.product_name || ''}"`,
      l.source,
      l.status,
      `"${(l.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateManualLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.submitLead(manualModalOpen ? manualForm : manualForm);
      setManualModalOpen(false);
      setManualForm({ name: '', phone: '', city: '', source: 'Instagram', product_name: '', message: '' });
      fetchLeads();
    } catch (e) {
      alert('Failed to add lead');
    }
  };

  const statusOptions = ['All', 'New', 'Contacted', 'Interested', 'Follow-up', 'Converted', 'Not Interested', 'Lost'];

  return (
    <AdminLayout title="Lead CRM & Customer Tracker">
      <div className="space-y-6">
        
        {/* Top Controls Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads by name, phone, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-800 outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={handleExportCSV}
              className="bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 flex items-center gap-2 shadow-2xs"
            >
              <Download className="w-4 h-4 text-stone-600" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setManualModalOpen(true)}
              className="bg-amber-900 hover:bg-amber-950 text-amber-50 font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Manual Lead</span>
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {statusOptions.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-amber-900 text-amber-50 shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Leads Table Container */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-xs text-stone-400">Loading lead database...</div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center text-xs text-stone-500 space-y-2">
              <p className="font-serif font-bold text-base text-stone-800">No leads found</p>
              <p>There are no customer enquiries matching your filter criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  <tr>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">City</th>
                    <th className="p-4">Product</th>
                    <th className="p-4">Source</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Quick Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {leads.map((l) => {
                    const cleanP = (l.whatsapp || l.phone || '').replace(/\D/g, '');
                    const waP = cleanP.length === 10 ? `91${cleanP}` : cleanP;
                    const waUrl = `https://wa.me/${waP}`;

                    return (
                      <tr
                        key={l.id}
                        onClick={() => setSelectedLead(l)}
                        className="hover:bg-amber-50/50 transition-colors cursor-pointer"
                      >
                        <td className="p-4 font-bold text-stone-900">
                          {l.name}
                        </td>
                        <td className="p-4 text-stone-800 font-mono">
                          {l.phone}
                        </td>
                        <td className="p-4 text-stone-600">
                          {l.city || '-'}
                        </td>
                        <td className="p-4 max-w-xs truncate">
                          {l.product_name ? (
                            <span className="font-semibold text-stone-800">{l.product_name}</span>
                          ) : (
                            <span className="text-stone-400 italic">General Query</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="text-amber-800 font-semibold">{l.source}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                            {l.status}
                          </span>
                        </td>
                        <td className="p-4 text-stone-500 whitespace-nowrap">
                          {new Date(l.created_at).toLocaleDateString('en-IN')}
                        </td>
                        <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                              title="WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`tel:${l.phone}`}
                              className="p-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200"
                              title="Call Phone"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Manual Lead Modal */}
      {manualModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-serif font-bold text-stone-900 text-base">Add Offline Lead</h3>
              <button onClick={() => setManualModalOpen(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleCreateManualLead} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={manualForm.name}
                  onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={manualForm.phone}
                  onChange={(e) => setManualForm({ ...manualForm, phone: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Source</label>
                <select
                  value={manualForm.source}
                  onChange={(e) => setManualForm({ ...manualForm, source: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
                >
                  <option value="Instagram">Instagram DM / Referral</option>
                  <option value="Store Walk-in">Store Walk-in</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="WhatsApp Direct">WhatsApp Direct</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Product Interested In</label>
                <input
                  type="text"
                  placeholder="e.g. Pure Kanchipuram Crimson Silk Saree"
                  value={manualForm.product_name}
                  onChange={(e) => setManualForm({ ...manualForm, product_name: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-900 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                Save Lead
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Drawer */}
      <AdminLeadDrawer
        lead={selectedLead}
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        onLeadUpdated={fetchLeads}
      />
    </AdminLayout>
  );
};
