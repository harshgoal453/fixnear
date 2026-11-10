import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCategories, useTechnicians } from '../hooks/useFixNearQuery';
import TechCard from '../components/TechCard';
import BookingModal from '../components/BookingModal';
import PaymentModal from '../components/PaymentModal';
import { Search, ShieldCheck, RotateCcw, Sparkles } from 'lucide-react';

export default function ServiceCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  // Filters state
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minRating, setMinRating] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedTechForBooking, setSelectedTechForBooking] = useState(null);
  const [immediatePaymentBooking, setImmediatePaymentBooking] = useState(null);

  // TanStack Query Hooks
  const { data: categories = [] } = useCategories();
  const { data: technicians = [], isLoading: techsLoading } = useTechnicians({
    search: searchTerm,
    category: selectedCategory,
    verified: verifiedOnly ? '1' : undefined,
    min_rating: minRating,
    city: selectedCity
  });

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setVerifiedOnly(false);
    setMinRating('');
    setSelectedCity('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>India Verified Equipment Fleet</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Find Certified Technicians Near You
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl font-medium">
          Compare upfront hourly rates, inspect specialized equipment & tool specs, and book licensed local professionals with FixNear guarantees.
        </p>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search text */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search technician name, skill, equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Min Rating Dropdown */}
          <div>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            >
              <option value="">Any Rating</option>
              <option value="4.8">4.8+ Stars (Top Rated)</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
            </select>
          </div>

          {/* City Selector */}
          <div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            >
              <option value="">All Cities</option>
              <option value="Mumbai">Mumbai, MH</option>
              <option value="Bengaluru">Bengaluru, KA</option>
              <option value="Delhi">Delhi NCR, DL</option>
            </select>
          </div>
        </div>

        {/* Toggles & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Government License & Trade Document Verified Only
            </span>
          </label>

          <button
            onClick={resetFilters}
            className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      </div>

      {/* Results Grid */}
      {techsLoading ? (
        <div className="text-center py-16 text-slate-500 font-semibold flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span>Searching local service professionals...</span>
        </div>
      ) : technicians.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-xl">No Technicians Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Try adjusting your search filters or clearing city selections to see more available providers across India.
          </p>
          <button
            onClick={resetFilters}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technicians.map((tech) => (
            <TechCard
              key={tech.id}
              tech={tech}
              onBookClick={(t) => setSelectedTechForBooking(t)}
            />
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedTechForBooking && (
        <BookingModal
          tech={selectedTechForBooking}
          onClose={() => setSelectedTechForBooking(null)}
          onBookingSuccess={() => {
            // Handled inside BookingModal with direct pay / track action
          }}
        />
      )}

      {/* Direct Payment Modal (if launched directly) */}
      {immediatePaymentBooking && (
        <PaymentModal
          booking={immediatePaymentBooking}
          onClose={() => setImmediatePaymentBooking(null)}
        />
      )}
    </div>
  );
}
