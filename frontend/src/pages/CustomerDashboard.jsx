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
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customer Service Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
            Service Tracking & Invoices
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Track technician dispatch progress, pay upfront via UPI or card, and submit verified reviews.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-2 rounded-xl transition ${filter === 'all' ? 'bg-white text-indigo-600 shadow-xs font-extrabold' : 'hover:text-slate-900'}`}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3.5 py-2 rounded-xl transition ${filter === 'active' ? 'bg-white text-indigo-600 shadow-xs font-extrabold' : 'hover:text-slate-900'}`}
          >
            Active Pipeline
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3.5 py-2 rounded-xl transition ${filter === 'completed' ? 'bg-white text-indigo-600 shadow-xs font-extrabold' : 'hover:text-slate-900'}`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="text-center py-24 text-slate-500 font-semibold flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading your service bookings & job status...</span>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-lg">No Service Bookings Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            You don't have any bookings matching this filter category. Find trusted technicians in your area to get started!
          </p>
          <a
            href="/services"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-indigo-600/20 transition"
          >
            Explore Service Professionals
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Card Header */}
              <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-2xl">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-base">{booking.business_name}</h3>
                      <StatusBadge status={booking.status} />
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Fleet Category: <strong className="text-indigo-600">{booking.category_name}</strong></p>
                  </div>
                </div>

                <div className="text-right flex items-center gap-4 flex-wrap">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Service Price</div>
                    <div className="text-2xl font-black text-indigo-700">₹{booking.total_price.toFixed(2)}</div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md inline-block mt-0.5 ${
                      booking.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      Payment: {booking.payment_status}
                    </span>
                  </div>

                  {booking.payment_status === 'pending' && (
                    <button
                      onClick={() => setSelectedBookingForPayment(booking)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-2"
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-bold">Scheduled Date</span>
                      <span className="font-bold text-slate-900">{booking.booking_date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-700">
                    <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-bold">Time Window</span>
                      <span className="font-bold text-slate-900">{booking.time_slot}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-700">
                    <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div className="truncate">
                      <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-bold">Service Address</span>
                      <span className="font-bold text-slate-900 truncate block">{booking.address}</span>
                    </div>
                  </div>
                </div>

                {booking.notes && (
                  <div className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 leading-relaxed">
                    <strong className="text-indigo-600">Problem Description: </strong>
                    {booking.notes}
                  </div>
                )}

                {/* Service Status Tracking Pipeline */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Live Service Dispatch Progress
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">Ticket ID #{booking.id}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    {/* Step 1 */}
                    <div className={`p-3 rounded-2xl border transition-all ${
                      getStepState(booking.status, 1) === 'completed' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
                      getStepState(booking.status, 1) === 'current' ? 'bg-indigo-50 border-indigo-400 font-bold text-indigo-900' : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}>
                      <div className="font-bold">1. Requested</div>
                      <div className="text-[10px]">Order Placed</div>
                    </div>

                    {/* Step 2 */}
                    <div className={`p-3 rounded-2xl border transition-all ${
                      getStepState(booking.status, 2) === 'completed' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
                      getStepState(booking.status, 2) === 'current' ? 'bg-indigo-50 border-indigo-400 font-bold text-indigo-900' : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}>
                      <div className="font-bold">2. Accepted</div>
                      <div className="text-[10px]">Confirmed</div>
                    </div>

                    {/* Step 3 */}
                    <div className={`p-3 rounded-2xl border transition-all ${
                      getStepState(booking.status, 3) === 'completed' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
                      getStepState(booking.status, 3) === 'current' ? 'bg-amber-50 border-amber-400 font-bold text-amber-900 animate-pulse' : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}>
                      <div className="font-bold">3. In Progress</div>
                      <div className="text-[10px]">On-Site Work</div>
                    </div>

                    {/* Step 4 */}
                    <div className={`p-3 rounded-2xl border transition-all ${
                      getStepState(booking.status, 4) === 'completed' ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold' : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}>
                      <div className="font-bold">4. Completed</div>
                      <div className="text-[10px]">Work Finished</div>
                    </div>
                  </div>
                </div>

                {/* Technician Completion Notes */}
                {booking.completion_notes && (
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Technician Proof of Work & Completion Notes:</span>
                    </div>
                    <p className="leading-relaxed">{booking.completion_notes}</p>
                  </div>
                )}

                {/* Complaint Status Banner */}
                {booking.complaint_id && (
                  <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 text-xs text-rose-900 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                      <div>
                        <span className="font-bold">Active Dispute Ticket #{booking.complaint_id}: </span>
                        <span>{booking.complaint_subject}</span>
                      </div>
                    </div>
                    <span className="bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded text-[10px] uppercase border border-rose-200">
                      {booking.complaint_status}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <span>Need help with this order?</span>
                  <button
                    onClick={() => setSelectedBookingForComplaint(booking)}
                    className="text-rose-600 hover:text-rose-800 font-bold underline flex items-center gap-1 transition"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>File Support Ticket (To Admin Harsh)</span>
                  </button>
                </div>

                {booking.status === 'completed' && (
                  <div>
                    {booking.review_id ? (
                      <div className="flex items-center gap-1 text-amber-800 font-bold bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>You rated {booking.review_rating}/5 Stars</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedBookingForReview(booking)}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl font-bold shadow-xs transition flex items-center gap-1.5"
                      >
                        <Star className="w-4 h-4 fill-slate-950" />
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
