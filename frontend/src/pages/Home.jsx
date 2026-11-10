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
      {/* Light Hero Section */}
      <section className="relative bg-gradient-to-b from-indigo-50/80 via-white to-slate-50 text-slate-900 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 overflow-hidden border border-slate-200 shadow-sm p-8 sm:p-14">
        {/* Ambient Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-4xl space-y-6">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-bold border border-emerald-300 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>1,00,000+ Indian Homes Serviced • ₹10,000 Admin Damage Protection Guarantee</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-6xl font-black tracking-tight leading-tight text-slate-900">
            Expert Home Services <br />
            <span className="text-indigo-600">
              Delivered To Your Doorstep.
            </span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl font-medium leading-relaxed">
            Connect with background-verified, government-licensed local technicians across Mumbai, Bengaluru, and Delhi NCR. Upfront pricing in ₹ with 15-minute response.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="bg-white p-2.5 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center gap-2 text-slate-900 border border-slate-200">
            <div className="flex-1 flex items-center gap-3 px-3 py-2 w-full">
              <Search className="w-5 h-5 text-indigo-600 shrink-0" />
              <input
                type="text"
                placeholder="What service do you need? (e.g. Electrician, AC Servicing, Plumber)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-none text-sm focus:outline-none placeholder-slate-400 font-medium text-slate-900"
              />
            </div>

            <div className="flex items-center gap-2 px-3 py-2 border-t sm:border-t-0 sm:border-l border-slate-200 w-full sm:w-auto">
              <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent text-xs font-bold focus:outline-none text-slate-800 cursor-pointer"
              >
                <option value="Mumbai, MH, India">Mumbai, MH</option>
                <option value="Bengaluru, KA, India">Bengaluru, KA</option>
                <option value="Delhi, DL, India">Delhi NCR, DL</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3 rounded-xl font-bold text-sm shadow-md shadow-indigo-600/25 transition flex items-center justify-center gap-2"
            >
              <span>Search Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-600 font-semibold">
            <span className="text-slate-500">Popular Services:</span>
            <Link to="/services?category=electrician" className="hover:text-indigo-600 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs transition">⚡ Inverter Wiring Fix</Link>
            <Link to="/services?category=plumber" className="hover:text-indigo-600 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs transition">🔧 Tap & Pipe Leak</Link>
            <Link to="/services?category=ac-refrigeration" className="hover:text-indigo-600 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs transition">❄️ Split AC Jet Wash</Link>
          </div>
        </div>
      </section>

      {/* Service Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-extrabold tracking-wider text-emerald-700 uppercase">Featured Categories</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Explore Local Home Services</h2>
          </div>
          <Link to="/services" className="text-indigo-600 hover:text-indigo-700 text-sm font-bold flex items-center gap-1">
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
                  className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-indigo-400 shadow-xs hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                      <IconComp className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 group-hover:text-indigo-600 transition">{cat.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">{cat.description}</p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="text-emerald-700 font-extrabold">From ₹{cat.base_price}</span>
                    <span className="text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full text-[10px] border border-indigo-200">
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
        <div className="flex items-end justify-between border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-extrabold tracking-wider text-emerald-700 uppercase">Top Verified Pros</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Verified Equipment & Specialists</h2>
          </div>
          <Link to="/services" className="text-indigo-600 hover:text-indigo-700 text-sm font-bold flex items-center gap-1">
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
      <section className="bg-white mx-4 sm:mx-6 lg:mx-8 rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold tracking-wider text-indigo-600 uppercase">The FixNear Quality Standard</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Why 100,000+ Indian Homes Trust FixNear</h2>
            <p className="text-slate-500 text-sm">Transparent, background-checked, and protected home services.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Government Trade Checked</h3>
              <p className="text-xs text-slate-500 leading-relaxed">All technicians submit police verification and trade licenses audited directly by Admin Harsh.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Upfront Transparent Pricing</h3>
              <p className="text-xs text-slate-500 leading-relaxed">No hidden surcharge fees. Know the exact breakdown in ₹ before technician dispatches.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">₹10,000 Admin Protection</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Every job is backed by Admin Harsh dispute resolution and service quality coverage.</p>
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
