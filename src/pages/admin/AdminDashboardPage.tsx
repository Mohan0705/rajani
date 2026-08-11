import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Clock,
  CheckCircle2,
  TrendingUp,
  ShoppingBag,
  MessageCircle,
  Phone,
  Plus,
  ArrowRight,
  Globe,
  Sparkles
} from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { AnalyticsOverview, Lead } from '../../types';
import { api } from '../../lib/api';
import { AdminLeadDrawer } from '../../components/AdminLeadDrawer';

export const AdminDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const loadData = async () => {
    try {
      const data = await api.getAnalytics();
      setAnalytics(data);
    } catch (e) {
      console.error('Failed to load analytics:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AdminLayout title="Boutique Overview & CRM">
      <div className="space-y-8">
        
        {/* KPI Stat Cards */}
        {loading || !analytics ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-white rounded-xl border border-stone-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Total Leads Card */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-xs font-bold uppercase tracking-wider">Total Enquiries</span>
                <Users className="w-4 h-4 text-amber-800" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-bold text-stone-900">{analytics.total_leads}</span>
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  +{analytics.new_leads_today} Today
                </span>
              </div>
            </div>

            {/* Pending Follow-ups */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-xs font-bold uppercase tracking-wider">Follow-Ups Pending</span>
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-bold text-stone-900">{analytics.follow_ups_pending}</span>
                <span className="text-xs text-orange-800 font-semibold bg-orange-50 px-2 py-0.5 rounded">
                  Scheduled
                </span>
              </div>
            </div>

            {/* Converted Leads */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-xs font-bold uppercase tracking-wider">Converted Clients</span>
                <UserCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-bold text-stone-900">{analytics.converted_leads}</span>
                <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  {analytics.conversion_rate}% Conv.
                </span>
              </div>
            </div>

            {/* Total Products */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-xs font-bold uppercase tracking-wider">Active Products</span>
                <ShoppingBag className="w-4 h-4 text-amber-800" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-bold text-stone-900">{analytics.total_products}</span>
                <Link to="/admin/products" className="text-xs text-amber-900 hover:underline font-semibold">
                  Manage →
                </Link>
              </div>
            </div>

          </div>
        )}

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 bg-amber-50 p-4 rounded-xl border border-amber-200/80">
          <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">Quick Actions:</span>
          <Link
            to="/admin/leads"
            className="bg-amber-900 hover:bg-amber-950 text-white font-semibold text-xs py-2 px-3.5 rounded-lg shadow-xs flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Open Full Lead CRM</span>
          </Link>

          <Link
            to="/admin/products"
            className="bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs py-2 px-3.5 rounded-lg border border-stone-300 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Product</span>
          </Link>

          <Link
            to="/admin/settings"
            className="bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs py-2 px-3.5 rounded-lg border border-stone-300 flex items-center gap-1.5"
          >
            <span>Configure WhatsApp & Store Info</span>
          </Link>
        </div>

        {/* Grid: Recent Leads Feed + Lead Source Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Leads Feed (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-base">Recent Enquiries</h3>
                <p className="text-xs text-stone-500">Incoming leads from Instagram, WhatsApp, & Website</p>
              </div>
              <Link to="/admin/leads" className="text-xs font-bold text-amber-900 hover:underline">
                View All ({analytics?.total_leads || 0})
              </Link>
            </div>

            <div className="space-y-3">
              {analytics?.recent_leads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className="p-4 bg-stone-50 hover:bg-amber-50/60 rounded-xl border border-stone-200/80 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-stone-900">{lead.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                        {lead.status}
                      </span>
                    </div>

                    <div className="text-xs text-stone-600 flex flex-wrap items-center gap-3">
                      <span>📞 {lead.phone}</span>
                      <span>📍 {lead.city || 'Location N/A'}</span>
                      <span className="text-amber-800 font-semibold">🌐 {lead.source}</span>
                    </div>

                    {lead.product_name && (
                      <p className="text-xs text-stone-500 truncate max-w-md">
                        Interested in: <strong className="text-stone-800">{lead.product_name}</strong>
                      </p>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLead(lead);
                    }}
                    className="bg-white hover:bg-amber-100 text-amber-900 font-bold text-xs px-3 py-1.5 rounded-lg border border-amber-300 shrink-0 self-start sm:self-center"
                  >
                    Open Details
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Source Breakdown (1 col) */}
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs p-6 space-y-4 h-fit">
            <h3 className="font-serif font-bold text-stone-900 text-base border-b border-stone-100 pb-3">
              Enquiries by Source
            </h3>

            <div className="space-y-3 text-xs">
              {analytics &&
                Object.entries(analytics.leads_by_source).map(([source, count]) => {
                  const pct = Math.round((count / (analytics.total_leads || 1)) * 100);
                  return (
                    <div key={source} className="space-y-1">
                      <div className="flex justify-between font-semibold text-stone-700">
                        <span>{source}</span>
                        <span>{count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-800 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

        </div>

      </div>

      <AdminLeadDrawer
        lead={selectedLead}
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        onLeadUpdated={loadData}
      />
    </AdminLayout>
  );
};
