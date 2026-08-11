import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export const AdminLoginPage: React.FC = () => {
  const { login } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@saree.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid admin login credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@saree.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl space-y-6 border border-amber-200/40">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-amber-900 text-amber-100 rounded-full flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-6 h-6 text-amber-300" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            {settings.business_name || 'Boutique Admin Portal'}
          </h1>
          <p className="text-xs text-stone-500">
            Secure login for Lead CRM, Product Management & Analytics
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1.5 text-stone-700">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-950 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              Demo Admin Credentials
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[10px] bg-amber-900 text-amber-50 px-2 py-0.5 rounded hover:bg-amber-950 font-semibold"
            >
              Autofill Demo
            </button>
          </div>
          <p className="text-[11px] text-stone-600 font-mono">Email: admin@saree.com | Pass: admin123</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-800 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-800 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-900 hover:bg-amber-950 text-amber-50 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
