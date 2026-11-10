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
    <header className="sticky top-0 z-50 glass-nav border-b border-slate-200/90 shadow-xs">
      {/* Top Emergency & Trust Bar */}
      <div className="bg-slate-100/90 text-slate-700 text-[11px] py-1.5 px-4 sm:px-6 flex items-center justify-between border-b border-slate-200/80">
        <div className="flex items-center gap-3 font-medium">
          <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
            Live 15-Min Response
          </span>
          <span className="hidden md:inline text-slate-600 font-medium">FixNear India — Har Ghar Ka Trusted Local Service Platform 🇮🇳</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1 text-slate-700">
            <PhoneCall className="w-3 h-3 text-emerald-600" />
            <span>Support: 1800-FIX-NEAR</span>
          </div>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="hidden sm:inline text-slate-600">
            Admin: <strong className="text-indigo-700">Harsh</strong>
          </span>
        </div>
      </div>

      {/* Main Light Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-tr from-emerald-600 via-indigo-600 to-blue-600 text-white p-2.5 rounded-2xl shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition">
                  Fix<span className="text-indigo-600">Near</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                  INDIA
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:block">Verified Local Technicians</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
            <Link to="/" className="hover:text-indigo-600 transition">
              Home
            </Link>
            <Link to="/services" className="hover:text-indigo-600 transition">
              Find Services
            </Link>

            {user?.role === 'customer' && (
              <Link to="/customer/bookings" className="text-indigo-700 hover:text-indigo-800 transition flex items-center gap-1.5 font-bold bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>My Bookings</span>
              </Link>
            )}

            {user?.role === 'provider' && (
              <Link to="/provider/dashboard" className="text-emerald-700 hover:text-emerald-800 transition flex items-center gap-1.5 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 shadow-xs">
                <Wrench className="w-3.5 h-3.5 text-emerald-600" />
                <span>Provider Hub</span>
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link to="/admin/dashboard" className="text-rose-700 hover:text-rose-800 transition flex items-center gap-1.5 font-bold bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 shadow-xs">
                <Shield className="w-3.5 h-3.5 text-rose-600" />
                <span>Admin Console (Harsh)</span>
              </Link>
            )}
          </nav>

          {/* Right Actions / User Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mumbai / Bengaluru / Delhi</span>
            </div>

            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="flex items-center gap-2">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=150'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs"
                  />
                  <div className="hidden sm:block text-left text-xs">
                    <div className="font-bold text-slate-900 leading-tight">{user.name}</div>
                    <div className="text-slate-500 text-[10px] capitalize font-medium">{user.role}</div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 p-2 rounded-xl text-xs font-bold transition border border-slate-200 hover:border-rose-200 flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
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
