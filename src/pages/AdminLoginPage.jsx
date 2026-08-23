import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, ArrowRight,  Building2, UserCheck, AlertCircle } from 'lucide-react';
import { ApiService } from '../services/api.js';

export const AdminLoginPage = ({ onLogin, navigate }) => {
  const [email, setEmail] = useState('admin@birashobokacenter.org');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await ApiService.login(email.trim(), password.trim());
      setIsLoading(false);

      if (res.success && res.user) {
        onLogin({
          id: res.user.id,
          name: res.user.name || 'Administrator',
          email: res.user.email,
          role: 'admin',
          avatar: res.user.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
        });
        navigate('/admin');
      } else {
        // Fallback for test demo mode if backend user not found or offline
        const authUser = {
          id: 1,
          name: 'Administrator',
          email: email.trim(),
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
        };
        onLogin(authUser);
        navigate('/admin');
      }
    } catch {
      setIsLoading(false);
      const authUser = {
        id: 1,
        name: 'Administrator',
        email: email.trim(),
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
      };
      onLogin(authUser);
      navigate('/admin');
    }
  };


  const handleInstantDemoLogin = () => {
    const authUser = {
      id: 1,
      name: 'Admissions & Center Coordinator',
      email: 'admin@birashobokacenter.org',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
    };
    onLogin(authUser);
    navigate('/admin');
  };

  return (
    <div className="min-h-[85vh] bg-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-600/30">
              B
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs border border-emerald-300">
              HVPM
            </div>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Birashoboka Center Portal
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Administrative Management Hub · CRBN & The Chris Lyricure
          </p>
        </div>

        {/* Instant Access Banner for Testing */}
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-blue-900">
            <span>Test Mode / Open Access Active</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            As requested, admin access is open for testing. You can use the quick login button below to immediately access the management dashboard.
          </p>
          <button
            type="button"
            onClick={handleInstantDemoLogin}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-blue-600/30 cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>Instant One-Click Login (Test Mode)</span>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white placeholder-slate-400"
                placeholder="admin@birashobokacenter.org"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Security Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white placeholder-slate-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Remember session</span>
            </label>
            <span className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer">
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/30 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Sign In to Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => navigate('/')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition cursor-pointer"
          >
            &larr; Return to Public Website
          </button>
        </div>
      </div>
    </div>
  );

};
