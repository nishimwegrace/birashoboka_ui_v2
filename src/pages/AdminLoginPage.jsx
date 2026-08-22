import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, ArrowRight, Sparkles, Building2, UserCheck, AlertCircle } from 'lucide-react';

export const AdminLoginPage = ({ onLogin, navigate }) => {
  const [email, setEmail] = useState('admin@birashobokacenter.org');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Authenticate user
      const authUser = {
        id: 1,
        name: 'Gérard Nishimwe',
        email: email.trim(),
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
      };
      onLogin(authUser);
      navigate('/admin');
    }, 400);
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
    <div className="min-h-[85vh] bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-600/30">
              B
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-800/80 text-emerald-200 flex items-center justify-center font-bold text-xs border border-emerald-600/50">
              HVPM
            </div>
          </div>

          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Birashoboka Center Portal
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Administrative Management Hub · CRBN & The Chris Lyricure
          </p>
        </div>

        {/* Instant Access Banner for Testing */}
        <div className="p-4 rounded-2xl bg-blue-950/70 border border-blue-800 text-blue-200 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-blue-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Test Mode / Open Access Active</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            As requested, admin access is open for testing. You can use the quick login button below to immediately access the management dashboard.
          </p>
          <button
            type="button"
            onClick={handleInstantDemoLogin}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-blue-600/30 cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>Instant One-Click Login (Test Mode)</span>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-500"
                placeholder="admin@birashobokacenter.org"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Security Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
              />
              <span>Remember session</span>
            </label>
            <span className="text-blue-400 hover:text-blue-300 cursor-pointer">
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/30 cursor-pointer disabled:opacity-50"
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
            className="text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
          >
            &larr; Return to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};
