import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useBookings } from '../hooks/useFixNearQuery';
import StatusBadge from '../components/StatusBadge';
import ReviewModal from '../components/ReviewModal';
import ComplaintModal from '../components/ComplaintModal';
import PaymentModal from '../components/PaymentModal';
import { Calendar, Clock, MapPin, Wrench, ShieldAlert, Star, CheckCircle2, CreditCard, Sparkles, AlertCircle } from 'lucide-react';

export default function CustomerDashboard() {
  const { user } = useAuthStore();
  const customerId = user ? user.id : 1; // Priya Sharma fallback

  const [filter, setFilter] = useState('all');
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [selectedBookingForComplaint, setSelectedBookingForComplaint] = useState(null);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);

  const { data: bookings = [], isLoading } = useBookings({ customer_id: customerId });

  const filteredBookings = bookings.filter(b => {
    if (filter === 'active') return ['requested', 'accepted', 'in_progress'].includes(b.status);
    if (filter === 'completed') return b.status === 'completed';
    return true;
  });

  const getStepState = (status, stepIndex) => {
    const statusMap = { requested: 1, accepted: 2, in_progress: 3, completed: 4 };
    const currentStep = statusMap[status] || 1;
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customer Service Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2">
            Service Tracking & Invoices
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track technician dispatch progress, pay upfront via UPI or card, and submit verified reviews.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold text-slate-400">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-2 rounded-xl transition ${filter === 'all' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-extrabold' : 'hover:text-white'}`}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3.5 py-2 rounded-xl transition ${filter === 'active' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-extrabold' : 'hover:text-white'}`}
          >
            Active Pipeline
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3.5 py-2 rounded-xl transition ${filter === 'completed' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-extrabold' : 'hover:text-white'}`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="text-center py-24 text-slate-400 font-semibold flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading your service bookings & job status...</span>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="glass-card bg-slate-900/60 rounded-3xl border border-slate-800 p-16 text-center space-y-4">
          <div className="w-14 h-14 bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-white text-lg">No Service Bookings Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            You don't have any bookings matching this filter category. Find trusted technicians in your area to get started!
          </p>
          <a
            href="/services"
            className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-indigo-600/20 transition"
          >
            Explore Service Professionals
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="glass-card bg-slate-900/60 rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden">
              {/* Card Header */}
              <div className="p-6 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4 bg-slate-950/40">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-2xl">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-extrabold text-white text-base">{booking.business_name}</h3>
                      <StatusBadge status={booking.status} />
                    </div>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Fleet Category: <strong className="text-indigo-400">{booking.category_name}</strong></p>
                  </div>
                </div>

                <div className="text-right flex items-center gap-4 flex-wrap">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Service Price</div>
                    <div className="text-2xl font-black text-emerald-400">₹{booking.total_price.toFixed(2)}</div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md inline-block mt-0.5 ${
                      booking.payment_status === 'paid' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      Payment: {booking.payment_status}
                    </span>
                  </div>

                  {booking.payment_status === 'pending' && (
                    <button
                      onClick={() => setSelectedBookingForPayment(booking)}
                      className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-lg shadow-emerald-600/20 transition flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pay Online (UPI / Card)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 space-y-6">
                {/* Details Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-bold">Scheduled Date</span>
                      <span className="font-bold text-white">{booking.booking_date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-bold">Time Window</span>
                      <span className="font-bold text-white">{booking.time_slot}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-300">
                    <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div className="truncate">
                      <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-bold">Service Address</span>
                      <span className="font-bold text-white truncate block">{booking.address}</span>
                    </div>
                  </div>
                </div>

                {booking.notes && (
                  <div className="text-xs text-slate-300 bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800/60 leading-relaxed">
                    <strong className="text-indigo-400">Problem Description: </strong>
                    {booking.notes}
                  </div>
                )}

                {/* Service Status Tracking Pipeline */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      Live Service Dispatch Progress
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">Ticket ID #{booking.id}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    {/* Step 1 */}
                    <div className={`p-3 rounded-2xl border transition-all ${
                      getStepState(booking.status, 1) === 'completed' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                      getStepState(booking.status, 1) === 'current' ? 'bg-blue-500/20 border-blue-500/50 font-bold text-blue-300' : 'bg-slate-950/40 text-slate-600 border-slate-800/60'
                    }`}>
                      <div className="font-bold">1. Requested</div>
                      <div className="text-[10px] text-slate-400">Order Placed</div>
                    </div>

                    {/* Step 2 */}
                    <div className={`p-3 rounded-2xl border transition-all ${
                      getStepState(booking.status, 2) === 'completed' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                      getStepState(booking.status, 2) === 'current' ? 'bg-indigo-500/20 border-indigo-500/50 font-bold text-indigo-300' : 'bg-slate-950/40 text-slate-600 border-slate-800/60'
                    }`}>
                      <div className="font-bold">2. Accepted</div>
                      <div className="text-[10px] text-slate-400">Confirmed</div>
                    </div>

                    {/* Step 3 */}
                    <div className={`p-3 rounded-2xl border transition-all ${
                      getStepState(booking.status, 3) === 'completed' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                      getStepState(booking.status, 3) === 'current' ? 'bg-amber-500/20 border-amber-500/50 font-bold text-amber-300 animate-pulse' : 'bg-slate-950/40 text-slate-600 border-slate-800/60'
                    }`}>
                      <div className="font-bold">3. In Progress</div>
                      <div className="text-[10px] text-slate-400">On-Site Work</div>
                    </div>

                    {/* Step 4 */}
                    <div className={`p-3 rounded-2xl border transition-all ${
                      getStepState(booking.status, 4) === 'completed' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 font-bold' : 'bg-slate-950/40 text-slate-600 border-slate-800/60'
                    }`}>
                      <div className="font-bold">4. Completed</div>
                      <div className="text-[10px] text-slate-400">Work Finished</div>
                    </div>
                  </div>
                </div>

                {/* Technician Completion Notes */}
                {booking.completion_notes && (
                  <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Technician Proof of Work & Completion Notes:</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">{booking.completion_notes}</p>
                  </div>
                )}

                {/* Complaint Status Banner */}
                {booking.complaint_id && (
                  <div className="bg-rose-500/10 p-4 rounded-2xl border border-rose-500/30 text-xs text-rose-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                      <div>
                        <span className="font-bold">Active Dispute Ticket #{booking.complaint_id}: </span>
                        <span>{booking.complaint_subject}</span>
                      </div>
                    </div>
                    <span className="bg-rose-500/20 text-rose-300 font-bold px-2.5 py-0.5 rounded text-[10px] uppercase border border-rose-500/30">
                      {booking.complaint_status}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-400 font-medium">
                  <span>Need help with this order?</span>
                  <button
                    onClick={() => setSelectedBookingForComplaint(booking)}
                    className="text-rose-400 hover:text-rose-300 font-bold underline flex items-center gap-1 transition"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>File Support Ticket (To Admin Harsh)</span>
                  </button>
                </div>

                {booking.status === 'completed' && (
                  <div>
                    {booking.review_id ? (
                      <div className="flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 px-3.5 py-1.5 rounded-xl border border-amber-500/20">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span>You rated {booking.review_rating}/5 Stars</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedBookingForReview(booking)}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-4 py-2 rounded-xl font-extrabold shadow-md shadow-amber-500/20 transition flex items-center gap-1.5"
                      >
                        <Star className="w-4 h-4" />
                        <span>Leave Service Review</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Gateway Modal */}
      {selectedBookingForPayment && (
        <PaymentModal
          booking={selectedBookingForPayment}
          onClose={() => setSelectedBookingForPayment(null)}
        />
      )}

      {/* Review Modal */}
      {selectedBookingForReview && (
        <ReviewModal
          booking={selectedBookingForReview}
          onClose={() => setSelectedBookingForReview(null)}
        />
      )}

      {/* Complaint Modal */}
      {selectedBookingForComplaint && (
        <ComplaintModal
          booking={selectedBookingForComplaint}
          userId={customerId}
          onClose={() => setSelectedBookingForComplaint(null)}
        />
      )}
    </div>
  );
}
