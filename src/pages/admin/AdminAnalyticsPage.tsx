import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Globe, ShoppingBag } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { AnalyticsOverview } from '../../types';
import { api } from '../../lib/api';

export const AdminAnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getAnalytics()
      .then((a) => setAnalytics(a))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !analytics) {
    return (
      <AdminLayout title="Analytics & Marketing Metrics">
        <div className="p-8 text-center text-xs text-stone-400">Loading metrics...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Analytics & Lead Performance">
      <div className="space-y-8">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-1">
            <span className="text-xs text-stone-500 font-bold uppercase">Total Leads Received</span>
            <div className="text-2xl font-bold text-stone-900">{analytics.total_leads}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-1">
            <span className="text-xs text-stone-500 font-bold uppercase">Today's New Enquiries</span>
            <div className="text-2xl font-bold text-emerald-700">+{analytics.new_leads_today}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-1">
            <span className="text-xs text-stone-500 font-bold uppercase">Converted Customers</span>
            <div className="text-2xl font-bold text-stone-900">{analytics.converted_leads}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-1">
            <span className="text-xs text-stone-500 font-bold uppercase">Conversion Rate</span>
            <div className="text-2xl font-bold text-amber-900">{analytics.conversion_rate}%</div>
          </div>
        </div>

        {/* Lead Source Breakdown */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
          <h3 className="font-serif font-bold text-stone-900 text-base border-b border-stone-100 pb-3">
            Traffic & Marketing Channel Sources
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(analytics.leads_by_source).map(([source, count]) => {
              const pct = Math.round((count / (analytics.total_leads || 1)) * 100);
              return (
                <div key={source} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-stone-800">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-amber-800" />
                      {source}
                    </span>
                    <span>{count} Leads ({pct}%)</span>
                  </div>
                  <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-900 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
