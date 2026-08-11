import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Store,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

export const AdminLayout: React.FC<{ children: React.ReactNode; title?: string }> = ({
  children,
  title
}) => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Lead CRM', path: '/admin/leads', icon: Users },
    { name: 'Saree Products', path: '/admin/products', icon: ShoppingBag },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Business Settings', path: '/admin/settings', icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin/dashboard' && (location.pathname === '/admin' || location.pathname === '/admin/dashboard')) {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] flex flex-col md:flex-row">
      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-[#1A1A1A] text-white p-4 flex items-center justify-between border-b border-[#E5E1D8]/20 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-sm bg-[#C5A059] flex items-center justify-center font-bold text-xs text-white">
            CRM
          </div>
          <span className="font-serif italic font-bold text-base">{settings.business_name || 'Boutique Admin'}</span>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-sm text-stone-300 hover:text-white hover:bg-stone-800"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#1A1A1A]/60 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#1A1A1A] text-stone-300 flex flex-col justify-between transition-transform duration-300 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } shrink-0 border-r border-[#E5E1D8]/20`}
      >
        <div>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-[#E5E1D8]/15 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C5A059]">
                  Management Suite
                </span>
              </div>
              <h1 className="font-serif italic text-lg font-bold text-white leading-tight mt-1">
                {settings.business_name || 'Rajani Sarees'}
              </h1>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-2xs text-[10px] uppercase tracking-widest font-bold transition-all ${
                    active
                      ? 'bg-[#C5A059] text-white shadow-2xs'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-stone-500'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#E5E1D8]/15 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3.5 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-2xs text-[10px] uppercase tracking-wider font-bold transition-colors border border-stone-800"
          >
            <span className="flex items-center gap-2">
              <Store className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Live Website</span>
            </span>
            <ExternalLink className="w-3 h-3 text-stone-500" />
          </Link>

          <div className="pt-2 flex items-center justify-between border-t border-stone-800/60 text-xs text-stone-400">
            <div className="truncate pr-2">
              <span className="block font-medium text-stone-200 text-xs truncate">
                {user?.name || 'Administrator'}
              </span>
              <span className="text-[10px] text-stone-500 truncate block font-mono">{user?.email}</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-sm hover:bg-stone-800 text-stone-400 hover:text-rose-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#F9F7F2]">
        {/* Top bar for desktop */}
        <header className="hidden md:flex items-center justify-between px-8 py-5 bg-[#F2EEE4] border-b border-[#E5E1D8]">
          <div>
            <h2 className="font-serif italic text-xl font-bold text-[#1A1A1A]">
              {title || 'CRM & Analytics'}
            </h2>
            <p className="text-xs text-stone-600">
              Manage product catalog, track incoming customer enquiries, and monitor business analytics.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`https://wa.me/${settings.whatsapp_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-100/80 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-2xs flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>WhatsApp Live</span>
            </a>

            <div className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-bold">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </div>
          </div>
        </header>

        {/* Page Children Container */}
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};
