import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTechnicianDetail } from '../hooks/useFixNearQuery';
import RatingStars from '../components/RatingStars';
import VerificationBadge from '../components/VerificationBadge';
import BookingModal from '../components/BookingModal';
import { MapPin, Briefcase, Calendar, ShieldCheck, Check, MessageSquare, ArrowLeft, Wrench, Sparkles } from 'lucide-react';

export default function TechnicianProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useTechnicianDetail(id);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const tech = data?.technician;
  const reviews = data?.reviews || [];

  if (isLoading) {
    return (
      <div className="text-center py-24 text-slate-400 font-semibold flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span>Loading technician profile & verification records...</span>
      </div>
    );
  }

  if (!tech) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <div className="w-14 h-14 bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
          <Wrench className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Technician Profile Not Found</h2>
        <p className="text-xs text-slate-400">The requested service professional may have been moved or is currently offline.</p>
        <button
          onClick={() => navigate('/services')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs"
        >
          Return to Service Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Technicians</span>
      </button>

      {/* Main Profile Header Card */}
      <div className="glass-card bg-slate-900/60 rounded-3xl border border-slate-800/80 shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <img
                src={tech.avatar || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200'}
                alt={tech.business_name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-indigo-500/30 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{tech.business_name}</h1>
                <VerificationBadge status={tech.verified} size="lg" />
              </div>
              <p className="text-sm font-bold text-indigo-400">{tech.category_name} Specialist</p>
              <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> {tech.city}</span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-indigo-400" /> {tech.experience_years} years on-site experience</span>
              </div>
            </div>
          </div>

          <div className="glass-card bg-slate-950/70 p-5 rounded-2xl border border-slate-800 text-center sm:text-right space-y-2.5 w-full sm:w-auto">
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Standard Hourly Rate</div>
            <div className="text-3xl font-black text-emerald-400">₹{tech.hourly_rate}<span className="text-xs font-normal text-slate-500">/hr</span></div>
            <button
              onClick={() => setShowBookingModal(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-extrabold text-xs shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>

        {/* Rating summary */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20 text-xs">
          <RatingStars rating={tech.rating} count={tech.review_count} size="lg" />
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Document Check: <strong className="text-slate-100">{tech.verification_doc ? 'Govt Verified License on File' : 'Pending Verification'}</strong></span>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <h3 className="font-extrabold text-white text-sm flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-indigo-400" />
            <span>About the Business & Equipment Setup</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
            {tech.bio}
          </p>
        </div>

        {/* Skills */}
        {tech.skills && tech.skills.length > 0 && (
          <div className="space-y-2.5 pt-2">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Specialized Diagnostic Tools & Capabilities</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {tech.skills.map((skill, idx) => (
                <span key={idx} className="bg-slate-950/80 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5 shadow-xs">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Customer Reviews Section */}
      <div className="glass-card bg-slate-900/60 rounded-3xl border border-slate-800/80 shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-black text-white">Verified Customer Reviews</h2>
          </div>
          <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">{reviews.length} Verified Reviews</span>
        </div>

        {reviews.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No reviews posted yet for this provider.</p>
        ) : (
          <div className="divide-y divide-slate-800/60 space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="pt-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={r.customer_avatar || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=150'}
                      alt={r.customer_name}
                      className="w-9 h-9 rounded-xl object-cover border border-slate-700 shadow-sm"
                    />
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-200">{r.customer_name}</h4>
                      <span className="text-[10px] text-slate-500">{new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <RatingStars rating={r.rating} showCount={false} />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800/60">
                  "{r.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          tech={tech}
          onClose={() => setShowBookingModal(false)}
          onBookingSuccess={() => {
            navigate('/customer/bookings');
          }}
        />
      )}
    </div>
  );
}
