import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Wrench, Shield, MapPin, LogOut, LogIn, Sparkles, PhoneCall } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-slate-800/80">
      {/* Top Emergency & Trust Bar */}
      <div className="bg-slate-900/90 text-slate-300 text-[11px] py-1.5 px-4 sm:px-6 flex items-center justify-between border-b border-slate-800/60">
        <div className="flex items-center gap-3 font-medium">
          <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 text-[10px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            Live 15-Min Response
          </span>
          <span className="hidden md:inline text-slate-400">FixNear India — Har Ghar Ka Trusted Local Service Platform 🇮🇳</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1 text-slate-300">
            <PhoneCall className="w-3 h-3 text-emerald-400" />
            <span>Support: 1800-FIX-NEAR</span>
          </div>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">
            Admin: <strong className="text-emerald-400">Harsh</strong>
          </span>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-tr from-emerald-500 via-indigo-600 to-blue-500 text-white p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-indigo-400 transition">
                  Fix<span className="text-indigo-400">Near</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-wider">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:block">Verified Local Technicians</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-300">
            <Link to="/" className="hover:text-indigo-400 transition flex items-center gap-1">
              <span>Home</span>
            </Link>
            <Link to="/services" className="hover:text-indigo-400 transition flex items-center gap-1">
              <span>Find Services</span>
            </Link>

            {user?.role === 'customer' && (
              <Link to="/customer/bookings" className="text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1.5 font-bold bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>My Bookings</span>
              </Link>
            )}

            {user?.role === 'provider' && (
              <Link to="/provider/dashboard" className="text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1.5 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                <span>Provider Hub</span>
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link to="/admin/dashboard" className="text-rose-400 hover:text-rose-300 transition flex items-center gap-1.5 font-bold bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20">
                <Shield className="w-3.5 h-3.5 text-rose-400" />
                <span>Admin Console (Harsh)</span>
              </Link>
            )}
          </nav>

          {/* Right Actions / User Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mumbai / Bengaluru / Delhi</span>
            </div>

            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
                <div className="flex items-center gap-2">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-700 shadow-sm"
                  />
                  <div className="hidden sm:block text-left text-xs">
                    <div className="font-bold text-white leading-tight">{user.name}</div>
                    <div className="text-slate-400 text-[10px] capitalize">{user.role}</div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-rose-400 p-2 rounded-xl text-xs font-semibold transition border border-slate-800 flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span>Login Account</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
