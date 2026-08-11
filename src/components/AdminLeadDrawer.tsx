import React, { useState } from 'react';
import {
  X,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  Plus,
  Tag,
  MapPin,
  Globe,
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Lead, LeadStatus } from '../types';
import { useSettings } from '../context/SettingsContext';
import { api } from '../lib/api';

interface AdminLeadDrawerProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onLeadUpdated: () => void;
}

export const AdminLeadDrawer: React.FC<AdminLeadDrawerProps> = ({
  lead,
  isOpen,
  onClose,
  onLeadUpdated
}) => {
  const { settings } = useSettings();
  const [newNote, setNewNote] = useState('');
  const [followUpDate, setFollowUpDate] = useState(lead?.follow_up_date || '');
  const [updating, setUpdating] = useState(false);

  if (!isOpen || !lead) return null;

  const handleStatusChange = async (newStatus: LeadStatus) => {
    setUpdating(true);
    try {
      await api.updateLeadStatus(lead.id, newStatus);
      onLeadUpdated();
    } catch (e) {
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setUpdating(true);
    try {
      await api.addLeadNote(lead.id, newNote);
      setNewNote('');
      onLeadUpdated();
    } catch (e) {
      alert('Failed to add note');
    } finally {
      setUpdating(false);
    }
  };

  const handleSetFollowUp = async (dateVal: string) => {
    setFollowUpDate(dateVal);
    setUpdating(true);
    try {
      await api.setLeadFollowUp(lead.id, dateVal);
      onLeadUpdated();
    } catch (e) {
      alert('Failed to set follow up date');
    } finally {
      setUpdating(false);
    }
  };

  // Format phone for WhatsApp
  const cleanPhone = (lead.whatsapp || lead.phone || '').replace(/\D/g, '');
  const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const waText = encodeURIComponent(
    `Hi ${lead.name}, thank you for inquiring with ${settings.business_name || 'Rajani Sarees'}. Regarding your query for ${lead.product_name || 'our sarees'}, how may I assist you further?`
  );
  const waUrl = `https://wa.me/${waPhone}?text=${waText}`;

  const statusColors: Record<LeadStatus, string> = {
    New: 'bg-blue-100 text-blue-800 border-blue-200',
    Contacted: 'bg-purple-100 text-purple-800 border-purple-200',
    Interested: 'bg-amber-100 text-amber-900 border-amber-200',
    'Follow-up': 'bg-orange-100 text-orange-900 border-orange-200',
    Converted: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    'Not Interested': 'bg-stone-100 text-stone-700 border-stone-200',
    Lost: 'bg-rose-100 text-rose-800 border-rose-200'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col border-l border-stone-200 animate-slideInRight">
        
        {/* Drawer Header */}
        <div className="p-6 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${statusColors[lead.status]}`}>
                {lead.status}
              </span>
              <span className="text-xs text-stone-400">ID: {lead.id}</span>
            </div>
            <h2 className="font-serif text-xl font-bold text-white mt-1">{lead.name}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-4 bg-amber-50 border-b border-amber-200/80 grid grid-cols-2 gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-600 text-white" />
            <span>WhatsApp Customer</span>
          </a>

          <a
            href={`tel:${lead.phone}`}
            className="bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-semibold py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Call {lead.phone}</span>
          </a>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Status Switcher */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
              Update Lead Status
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  'New',
                  'Contacted',
                  'Interested',
                  'Follow-up',
                  'Converted',
                  'Not Interested',
                  'Lost'
                ] as LeadStatus[]
              ).map((st) => (
                <button
                  key={st}
                  disabled={updating}
                  onClick={() => handleStatusChange(st)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                    lead.status === st
                      ? 'bg-amber-900 text-amber-50 border-amber-900 shadow-xs'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Customer & Product Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs">
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Contact Number</span>
              <span className="font-semibold text-stone-800">{lead.phone}</span>
            </div>

            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Location</span>
              <span className="font-semibold text-stone-800">{lead.city || 'Not provided'}</span>
            </div>

            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Preferred Contact</span>
              <span className="font-semibold text-stone-800">{lead.preferred_contact || 'WhatsApp'}</span>
            </div>

            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Enquiry Source</span>
              <span className="font-semibold text-amber-800 flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {lead.source}
              </span>
            </div>
          </div>

          {/* Product Interested In */}
          {lead.product_name && (
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 flex items-center gap-3">
              {lead.product_image && (
                <img
                  src={lead.product_image}
                  alt={lead.product_name}
                  className="w-16 h-18 object-cover rounded-md border border-amber-200 shrink-0"
                />
              )}
              <div className="text-xs space-y-1">
                <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">
                  Product Interested In
                </span>
                <h4 className="font-serif font-bold text-stone-900">{lead.product_name}</h4>
                {lead.product_sku && <p className="text-stone-500 font-mono">SKU: {lead.product_sku}</p>}
              </div>
            </div>
          )}

          {/* Initial Customer Message */}
          {lead.message && (
            <div className="space-y-1">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                Customer Note / Requirements
              </span>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed italic">
                "{lead.message}"
              </div>
            </div>
          )}

          {/* Marketing Source & UTM Attribution */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
              Lead Source & Campaign Attribution
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-stone-400 block text-[10px]">UTM Source:</span>
                <span className="font-mono font-medium text-stone-800">{lead.utm_source || lead.source}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">UTM Medium:</span>
                <span className="font-mono font-medium text-stone-800">{lead.utm_medium || 'N/A'}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">UTM Campaign:</span>
                <span className="font-mono font-medium text-stone-800">{lead.utm_campaign || 'N/A'}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">Created Date:</span>
                <span className="font-medium text-stone-800">
                  {new Date(lead.created_at).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Follow Up Date Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
              Schedule Next Follow-Up Date
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={followUpDate ? followUpDate.split('T')[0] : ''}
                onChange={(e) => handleSetFollowUp(e.target.value)}
                className="text-xs p-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-800 outline-none flex-1 bg-white"
              />
              {lead.follow_up_date && (
                <span className="text-xs text-amber-800 font-medium px-2 py-1 bg-amber-50 rounded border border-amber-200">
                  Scheduled: {new Date(lead.follow_up_date).toLocaleDateString('en-IN')}
                </span>
              )}
            </div>
          </div>

          {/* Timeline & Notes Log */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Internal Notes & Follow-up Log
              </span>
              <span className="text-[10px] text-stone-400">{lead.notes.length} entries</span>
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                placeholder="Add internal note e.g. 'Customer requested pink color photo'..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 text-xs p-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-800 outline-none"
              />
              <button
                type="submit"
                disabled={updating || !newNote.trim()}
                className="bg-amber-900 hover:bg-amber-950 text-white px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
              >
                Add Note
              </button>
            </form>

            {/* Notes Timeline List */}
            <div className="space-y-2 pt-1">
              {lead.notes.length === 0 ? (
                <p className="text-xs text-stone-400 italic">No notes added yet.</p>
              ) : (
                lead.notes.map((note) => (
                  <div key={note.id} className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-stone-400">
                      <span className="font-semibold text-stone-600">{note.created_by}</span>
                      <span>{new Date(note.created_at).toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-stone-800 font-medium">{note.note}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
