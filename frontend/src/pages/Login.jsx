import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Wrench, Shield, User, Lock, Mail, ArrowRight, Sparkles, UserPlus, Phone, Briefcase } from 'lucide-react';

export default function Login() {
  const { loginByEmail, register } = useAuthStore();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [role, setRole] = useState('customer'); // 'customer' | 'provider'
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await loginByEmail(email, password);
    if (res?.success) {
      if (res.user.role === 'admin') navigate('/admin/dashboard');
      else if (res.user.role === 'provider') navigate('/provider/dashboard');
      else navigate('/customer/bookings');
    } else {
      setError(res?.error || 'Invalid credentials or user email not found.');
    }
    setSubmitting(false);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await register({
      name,
      email,
      password,
      phone,
      role,
      business_name: role === 'provider' ? businessName : undefined
    });

    if (res?.success) {
      if (res.user.role === 'admin') navigate('/admin/dashboard');
      else if (res.user.role === 'provider') navigate('/provider/dashboard');
      else navigate('/customer/bookings');
    } else {
      setError(res?.error || 'Registration failed.');
    }
    setSubmitting(false);
  };

  const handleQuickLogin = async (presetEmail) => {
    setEmail(presetEmail);
    setSubmitting(true);
    setError(null);
    const res = await loginByEmail(presetEmail, 'password123');
    if (res?.success) {
      if (res.user.role === 'admin') navigate('/admin/dashboard');
      else if (res.user.role === 'provider') navigate('/provider/dashboard');
      else navigate('/customer/bookings');
    } else {
      setError(res?.error || 'Failed to log in.');
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-gradient-to-tr from-indigo-600 to-blue-500 text-white p-3 rounded-2xl shadow-lg shadow-indigo-600/30">
          <Wrench className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          FixNear <span className="gradient-text">India</span> 🇮🇳
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          Access customer bookings, provider work requests, or Admin Console.
        </p>
      </div>

      {/* Main Glass Card */}
      <div className="glass-card rounded-3xl border border-slate-800/80 shadow-2xl p-6 sm:p-7 space-y-6">
        
        {/* Mode Toggle */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`py-2 rounded-xl transition ${
              mode === 'login' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`py-2 rounded-xl transition ${
              mode === 'register' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="bg-rose-500/10 text-rose-400 p-3 rounded-xl border border-rose-500/20 text-xs">
            {error}
          </div>
        )}

        {mode === 'login' ? (
          /* Login Form */
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. harsh@fixnear.in"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Account Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`p-2.5 rounded-xl border text-center font-bold transition flex items-center justify-center gap-1.5 ${
                    role === 'customer'
                      ? 'border-indigo-500 bg-indigo-500/10 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('provider')}
                  className={`p-2.5 rounded-xl border text-center font-bold transition flex items-center justify-center gap-1.5 ${
                    role === 'provider'
                      ? 'border-emerald-500 bg-emerald-500/10 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Technician</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vikram Mehta"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. vikram@example.in"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {role === 'provider' && (
              <div>
                <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Business / Trade Name</span>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Apex Electricals"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                <span>Mobile Number</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98200 12345"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Create Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <span>{submitting ? 'Registering...' : 'Create Account'}</span>
              <UserPlus className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 1-Click Sandbox Presets */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Fast Prototype Login (1-Click Test):</span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Admin Harsh */}
            <button
              type="button"
              onClick={() => handleQuickLogin('harsh@fixnear.in')}
              className="w-full text-left p-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-600 text-white rounded-xl">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white group-hover:text-rose-300">Harsh (Platform Admin)</div>
                  <div className="text-[10px] text-slate-400">harsh@fixnear.in • Admin Console & Verification Hub</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Customer Priya */}
            <button
              type="button"
              onClick={() => handleQuickLogin('priya@fixnear.in')}
              className="w-full text-left p-3 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/20 transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-600 text-white rounded-xl">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white group-hover:text-indigo-300">Priya Sharma (Customer)</div>
                  <div className="text-[10px] text-slate-400">priya@fixnear.in • Bookings & Service Tracking</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Provider Alex */}
            <button
              type="button"
              onClick={() => handleQuickLogin('alex@apexpower.in')}
              className="w-full text-left p-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-600 text-white rounded-xl">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white group-hover:text-emerald-300">Alex Vance (Provider / Electrician)</div>
                  <div className="text-[10px] text-slate-400">alex@apexpower.in • Accept Requests & Job Schedule</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
