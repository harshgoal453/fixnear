import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCategories, useTechnicians } from '../hooks/useFixNearQuery';
import TechCard from '../components/TechCard';
import BookingModal from '../components/BookingModal';
import {
  Search, MapPin, Wrench, ShieldCheck, Zap, Wind, Sparkles, Tv, Paintbrush,
  Hammer, ChevronRight, ArrowRight, Star, Clock, CheckCircle2, Award, Headphones
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: topTechs = [], isLoading: techsLoading } = useTechnicians({ verified: '1' });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('Mumbai, MH, India');
  const [selectedTechForBooking, setSelectedTechForBooking] = useState(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/services');
    }
  };

  const categoryIcons = {
    Zap: Zap,
    Wrench: Wrench,
    Wind: Wind,
    Tv: Tv,
    Sparkles: Sparkles,
    Paintbrush: Paintbrush,
    ShieldCheck: ShieldCheck,
    Hammer: Hammer
  };

  return (
    <div className="space-y-16 pb-16">
      {/* High-Craft Hero Section */}
      <section className="relative bg-slate-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 overflow-hidden border border-slate-800 shadow-2xl p-8 sm:p-14">
        {/* Background Ambient Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-4xl space-y-6">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-emerald-500/20 backdrop-blur-md shadow-inner">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>1,00,000+ Indian Homes Serviced • ₹10,000 Admin Damage Protection Guarantee</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-6xl font-black tracking-tight leading-tight">
            Expert Home Services <br />
            <span className="gradient-text">
              Delivered To Your Doorstep.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-medium leading-relaxed">
            Connect with background-verified, government-licensed local technicians across Mumbai, Bengaluru, and Delhi NCR. Instant upfront pricing in ₹ with 15-minute dispatch.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="bg-slate-900/90 p-2.5 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 text-slate-100 border border-slate-700/80 backdrop-blur-xl">
            <div className="flex-1 flex items-center gap-3 px-3 py-2 w-full">
              <Search className="w-5 h-5 text-indigo-400 shrink-0" />
              <input
                type="text"
                placeholder="What service do you need? (e.g. Electrician, AC Servicing, Plumber)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-none text-sm focus:outline-none placeholder-slate-400 font-medium text-white"
              />
            </div>

            <div className="flex items-center gap-2 px-3 py-2 border-t sm:border-t-0 sm:border-l border-slate-800 w-full sm:w-auto">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent text-xs font-bold focus:outline-none text-slate-200 cursor-pointer"
              >
                <option value="Mumbai, MH, India" className="bg-slate-900">Mumbai, MH</option>
                <option value="Bengaluru, KA, India" className="bg-slate-900">Bengaluru, KA</option>
                <option value="Delhi, DL, India" className="bg-slate-900">Delhi, DL</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-7 py-3 rounded-xl font-extrabold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
            >
              <span>Search Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-400 font-semibold">
            <span>Popular Services:</span>
            <Link to="/services?category=electrician" className="hover:text-indigo-300 bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-800 transition">⚡ Inverter Wiring Fix</Link>
            <Link to="/services?category=plumber" className="hover:text-indigo-300 bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-800 transition">🔧 Tap & Pipe Leak</Link>
            <Link to="/services?category=ac-refrigeration" className="hover:text-indigo-300 bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-800 transition">❄️ Split AC Jet Wash</Link>
          </div>
        </div>
      </section>

      {/* Service Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between border-b border-slate-800/80 pb-4">
          <div>
            <span className="text-xs font-extrabold tracking-wider text-emerald-400 uppercase">Featured Categories</span>
            <h2 className="text-3xl font-black text-white">Explore Local Home Services</h2>
          </div>
          <Link to="/services" className="text-indigo-400 hover:text-indigo-300 text-sm font-bold flex items-center gap-1">
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {categoriesLoading ? (
          <div className="text-center py-12 text-slate-500 text-xs font-semibold">Loading categories...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {categories.map((cat) => {
              const IconComp = categoryIcons[cat.icon] || Wrench;
              return (
                <Link
                  key={cat.id}
                  to={`/services?category=${cat.slug}`}
                  className="glass-card p-6 rounded-3xl border border-slate-800/80 hover:border-indigo-500/50 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                      <IconComp className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-white group-hover:text-indigo-300 transition">{cat.name}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">{cat.description}</p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-bold text-slate-300">
                    <span className="text-emerald-400">From ₹{cat.base_price}</span>
                    <span className="text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full text-[10px] border border-indigo-500/20">
                      {cat.technician_count || 3} Pros Available
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Top Rated Technicians Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between border-b border-slate-800/80 pb-4">
          <div>
            <span className="text-xs font-extrabold tracking-wider text-emerald-400 uppercase">Top Verified Pros</span>
            <h2 className="text-3xl font-black text-white">Verified Equipment & Specialists</h2>
          </div>
          <Link to="/services" className="text-indigo-400 hover:text-indigo-300 text-sm font-bold flex items-center gap-1">
            <span>Browse All Pros</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {techsLoading ? (
          <div className="text-center py-12 text-slate-500 text-xs font-semibold">Loading verified professionals...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topTechs.slice(0, 4).map((tech) => (
              <TechCard
                key={tech.id}
                tech={tech}
                onBookClick={(t) => setSelectedTechForBooking(t)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Why FixNear India Trust Grid */}
      <section className="glass-card mx-4 sm:mx-6 lg:mx-8 rounded-3xl p-8 sm:p-12 border border-slate-800">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold tracking-wider text-indigo-400 uppercase">The FixNear Quality Standard</span>
            <h2 className="text-3xl font-extrabold text-white">Why 100,000+ Indian Homes Trust FixNear</h2>
            <p className="text-slate-400 text-sm">Transparent, background-checked, and protected home services.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Government Trade Checked</h3>
              <p className="text-xs text-slate-400 leading-relaxed">All technicians submit police verification and trade licenses audited directly by Admin Harsh.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Upfront Transparent Pricing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">No hidden surcharge fees. Know the exact breakdown in ₹ before technician dispatches.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">₹10,000 Admin Protection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Every job is backed by Admin Harsh dispute resolution and service quality coverage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {selectedTechForBooking && (
        <BookingModal
          tech={selectedTechForBooking}
          onClose={() => setSelectedTechForBooking(null)}
          onBookingSuccess={() => {
            navigate('/customer/bookings');
          }}
        />
      )}
    </div>
  );
}
