import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useBookings, useTechnicianDetail, useUpdateBookingStatus } from '../hooks/useFixNearQuery';
import VerificationBadge from '../components/VerificationBadge';
import StatusBadge from '../components/StatusBadge';
import { CheckCircle2, Clock, Play, Upload, ShieldCheck, DollarSign, Calendar, MapPin, Wrench, Sparkles, X } from 'lucide-react';

export default function ProviderDashboard() {
  const { user } = useAuthStore();
  const providerTechId = user?.technician_id || 1; // Fallback to Alex Vance

  const { data: techData } = useTechnicianDetail(providerTechId);
  const { data: bookings = [], isLoading: bookingsLoading } = useBookings({ technician_id: providerTechId });

  const updateStatusMutation = useUpdateBookingStatus();

  const [completingBookingId, setCompletingBookingId] = useState(null);
  const [completionNotes, setCompletionNotes] = useState('');

  const providerProfile = techData?.technician;

  const handleUpdateBookingStatus = (bookingId, newStatus, notes = '') => {
    updateStatusMutation.mutate({
      id: bookingId,
      statusData: { status: newStatus, completion_notes: notes }
    }, {
      onSuccess: () => {
        setCompletingBookingId(null);
        setCompletionNotes('');
      }
    });
  };

  const totalEarnings = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.total_price, 0);

  const activeJobs = bookings.filter(b => ['requested', 'accepted', 'in_progress'].includes(b.status));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Bar */}
      <div className="glass-card bg-slate-900/60 rounded-3xl border border-slate-800/80 shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <img
                src={user?.avatar || providerProfile?.avatar || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=150'}
                alt={user?.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/30 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-black text-white">
                  {providerProfile?.business_name || user?.name}
                </h1>
                <VerificationBadge status={providerProfile?.verified ?? 1} size="lg" />
              </div>
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                Fleet Category: {providerProfile?.category_name || 'Electrical Specialist'}
              </p>
              <div className="text-xs text-slate-400">
                Rate: <strong className="text-emerald-400">₹{providerProfile?.hourly_rate || 499}/hr</strong> • Operating: <span className="text-slate-300">{providerProfile?.city || 'Mumbai, MH, India'}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-2xl text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Govt License Active</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card bg-indigo-500/10 p-5 rounded-2xl border border-indigo-500/20 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Active Job Queue</div>
              <div className="text-3xl font-black text-white mt-1">{activeJobs.length}</div>
            </div>
            <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="glass-card bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Completed Revenue</div>
              <div className="text-3xl font-black text-emerald-400 mt-1">₹{totalEarnings.toFixed(2)}</div>
            </div>
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30 text-xl font-black">
              ₹
            </div>
          </div>

          <div className="glass-card bg-amber-500/10 p-5 rounded-2xl border border-amber-500/20 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Customer Score</div>
              <div className="text-3xl font-black text-white mt-1">{providerProfile?.rating || 4.9} ⭐</div>
            </div>
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Job Requests Management Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">Job Requests & Schedule</h2>
            <p className="text-xs text-slate-400">Accept requests, launch live visits, and submit completion reports.</p>
          </div>
          <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
            {bookings.length} Total Bookings
          </span>
        </div>

        {bookingsLoading ? (
          <div className="text-center py-16 text-slate-400 font-semibold flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span>Loading active technician bookings...</span>
          </div>
        ) : bookings.length === 0 ? (
          <div className="glass-card bg-slate-900/60 rounded-3xl border border-slate-800 p-16 text-center text-slate-400 text-xs">
            No booking requests received yet for your service account.
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="glass-card bg-slate-900/60 rounded-3xl border border-slate-800/80 shadow-xl p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-extrabold text-white text-base">Booking #{booking.id}: {booking.customer_name}</h3>
                      <StatusBadge status={booking.status} />
                    </div>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                      Phone: <strong className="text-slate-200">{booking.customer_phone}</strong> • Email: <strong className="text-slate-200">{booking.customer_email}</strong>
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total Service Fee</div>
                    <div className="text-xl font-black text-emerald-400">₹{booking.total_price.toFixed(2)}</div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      booking.payment_status === 'paid' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      Payment: {booking.payment_status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-bold">Requested Date & Slot</span>
                    <span className="font-bold text-slate-200 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      {booking.booking_date} ({booking.time_slot})
                    </span>
                  </div>
                  <div className="truncate">
                    <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-bold">Customer Address</span>
                    <span className="font-bold text-slate-200 truncate flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      {booking.address}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-bold">Reported Problem</span>
                    <span className="font-medium text-slate-300 mt-0.5 block">{booking.notes || 'Standard routine service'}</span>
                  </div>
                </div>

                {/* Workflow Actions */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  {booking.status === 'requested' && (
                    <button
                      onClick={() => handleUpdateBookingStatus(booking.id, 'accepted')}
                      disabled={updateStatusMutation.isPending}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 transition flex items-center gap-2 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accept Booking Request</span>
                    </button>
                  )}

                  {booking.status === 'accepted' && (
                    <button
                      onClick={() => handleUpdateBookingStatus(booking.id, 'in_progress')}
                      disabled={updateStatusMutation.isPending}
                      className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-amber-600/20 transition flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Play className="w-4 h-4" />
                      <span>Start On-Site Job</span>
                    </button>
                  )}

                  {booking.status === 'in_progress' && (
                    <button
                      onClick={() => setCompletingBookingId(booking.id)}
                      disabled={updateStatusMutation.isPending}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 transition flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Job Completed</span>
                    </button>
                  )}

                  {booking.status === 'completed' && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Job Completed & Invoiced</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completion Modal */}
      {completingBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card bg-slate-900/95 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-extrabold text-white text-base">Submit Completion Proof & Invoice Notes</h3>
              <button onClick={() => setCompletingBookingId(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              rows={4}
              placeholder="Describe work completed, replacement parts used, pressure/continuity test results..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setCompletingBookingId(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl text-xs font-bold border border-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateBookingStatus(completingBookingId, 'completed', completionNotes)}
                disabled={updateStatusMutation.isPending}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/25 disabled:opacity-50"
              >
                Confirm Job Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
