import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useBookings, useTechnicianDetail, useUpdateBookingStatus } from '../hooks/useFixNearQuery';
import { api } from '../api';
import VerificationBadge from '../components/VerificationBadge';
import StatusBadge from '../components/StatusBadge';
import { CheckCircle2, Clock, Play, Upload, ShieldCheck, DollarSign, Calendar, MapPin, Wrench, Sparkles, X, FileText, AlertCircle } from 'lucide-react';

export default function ProviderDashboard() {
  const { user } = useAuthStore();
  const providerTechId = user?.technician_id || 1; // Fallback to Alex Vance

  const { data: techData, refetch: refetchTech } = useTechnicianDetail(providerTechId);
  const { data: bookings = [], isLoading: bookingsLoading, refetch: refetchBookings } = useBookings({ technician_id: providerTechId });

  const updateStatusMutation = useUpdateBookingStatus();

  const [completingBookingId, setCompletingBookingId] = useState(null);
  const [completionNotes, setCompletionNotes] = useState('');

  // Document Upload State
  const [docNumber, setDocNumber] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [docUploadSuccess, setDocUploadSuccess] = useState(false);
  const [docUploading, setDocUploading] = useState(false);

  const providerProfile = techData?.technician;

  const handleUpdateBookingStatus = (bookingId, newStatus, notes = '') => {
    updateStatusMutation.mutate({
      id: bookingId,
      statusData: { status: newStatus, completion_notes: notes }
    }, {
      onSuccess: () => {
        setCompletingBookingId(null);
        setCompletionNotes('');
        refetchBookings();
      }
    });
  };

  const handleFileSelection = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFileName(file.name);
      setDocNumber(file.name);
    }
  };

  const handleSubmitDocument = async (e) => {
    e.preventDefault();
    if (!docNumber.trim()) return;

    setDocUploading(true);
    try {
      await api.technicians.update(providerTechId, {
        verification_doc: docNumber.trim(),
        verified: 0 // Mark as pending audit by Harsh
      });
      setDocUploadSuccess(true);
      refetchTech();
      setTimeout(() => setDocUploadSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to submit verification document:', err);
    }
    setDocUploading(false);
  };

  const totalEarnings = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.total_price, 0);

  const activeJobs = bookings.filter(b => ['requested', 'accepted', 'in_progress'].includes(b.status));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <img
                src={user?.avatar || providerProfile?.avatar || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=150'}
                alt={user?.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-100 shadow-xs"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-black text-slate-900">
                  {providerProfile?.business_name || user?.name}
                </h1>
                <VerificationBadge status={providerProfile?.verified ?? 1} size="lg" />
              </div>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Fleet Category: {providerProfile?.category_name || 'Electrical Specialist'}
              </p>
              <div className="text-xs text-slate-500 font-medium">
                Rate: <strong className="text-emerald-700 font-bold">₹{providerProfile?.hourly_rate || 499}/hr</strong> • Operating: <span className="text-slate-700">{providerProfile?.city || 'Mumbai, MH, India'}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl text-xs text-slate-600 flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Govt Trade Registry Active</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-indigo-50/70 p-5 rounded-2xl border border-indigo-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Active Job Queue</div>
              <div className="text-3xl font-black text-slate-900 mt-1">{activeJobs.length}</div>
            </div>
            <div className="p-3 bg-indigo-100 text-indigo-700 rounded-2xl border border-indigo-200">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Completed Revenue</div>
              <div className="text-3xl font-black text-emerald-800 mt-1">₹{totalEarnings.toFixed(2)}</div>
            </div>
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl border border-emerald-200 text-xl font-black">
              ₹
            </div>
          </div>

          <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">Customer Score</div>
              <div className="text-3xl font-black text-slate-900 mt-1">{providerProfile?.rating || 4.9} ⭐</div>
            </div>
            <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl border border-amber-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Technician Document Upload & Verification Management Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Trade License & Verification Documents</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload your government electrical license, ITI trade certificate, or police verification for Admin Harsh audit.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            <VerificationBadge status={providerProfile?.verified ?? 1} size="lg" />
          </div>
        </div>

        {docUploadSuccess && (
          <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-2xl border border-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Document submitted successfully! Admin Harsh has placed your trade certificate in the Licensing Queue.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="font-bold text-slate-800">Current Document on File:</div>
            <div className="font-mono bg-white p-2.5 rounded-xl border border-slate-200 text-indigo-700 flex items-center justify-between">
              <span className="truncate">{providerProfile?.verification_doc || 'No document on file'}</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>
            <p className="text-[11px] text-slate-500">
              Verified providers get the green <strong>Verified Pro</strong> badge and 3x more bookings across Mumbai, Bengaluru, and Delhi.
            </p>
          </div>

          {/* Upload Form */}
          <form onSubmit={handleSubmitDocument} className="space-y-3 text-xs">
            <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-2xl p-4 text-center space-y-2 hover:bg-indigo-50/60 transition cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileSelection}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload className="w-6 h-6 text-indigo-600 mx-auto" />
              <div className="text-xs font-bold text-slate-800">
                {uploadFileName ? (
                  <span className="text-emerald-700 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Selected: {uploadFileName}
                  </span>
                ) : (
                  <span>Click to choose trade certificate (PDF / Image)</span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                placeholder="Or enter Document ID (e.g. DOC_ELEC_LIC_2026.pdf)"
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={docUploading || !docNumber.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition disabled:opacity-50 flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{docUploading ? 'Submitting...' : 'Upload & Update'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Job Requests Management Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Job Requests & Schedule</h2>
            <p className="text-xs text-slate-500">Accept requests, launch live visits, and submit completion reports.</p>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-200">
            {bookings.length} Total Bookings
          </span>
        </div>

        {bookingsLoading ? (
          <div className="text-center py-16 text-slate-500 font-semibold flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span>Loading active technician bookings...</span>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center text-slate-500 text-xs shadow-xs">
            No booking requests received yet for your service account.
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-base">Booking #{booking.id}: {booking.customer_name}</h3>
                      <StatusBadge status={booking.status} />
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Phone: <strong className="text-slate-800">{booking.customer_phone}</strong> • Email: <strong className="text-slate-800">{booking.customer_email}</strong>
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total Service Fee</div>
                    <div className="text-xl font-black text-indigo-700">₹{booking.total_price.toFixed(2)}</div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      booking.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      Payment: {booking.payment_status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-bold">Requested Date & Slot</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      {booking.booking_date} ({booking.time_slot})
                    </span>
                  </div>
                  <div className="truncate">
                    <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-bold">Customer Address</span>
                    <span className="font-bold text-slate-800 truncate flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                      {booking.address}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-bold">Reported Problem</span>
                    <span className="font-medium text-slate-700 mt-0.5 block">{booking.notes || 'Standard routine service'}</span>
                  </div>
                </div>

                {/* Workflow Actions */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  {booking.status === 'requested' && (
                    <button
                      onClick={() => handleUpdateBookingStatus(booking.id, 'accepted')}
                      disabled={updateStatusMutation.isPending}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-2 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accept Booking Request</span>
                    </button>
                  )}

                  {booking.status === 'accepted' && (
                    <button
                      onClick={() => handleUpdateBookingStatus(booking.id, 'in_progress')}
                      disabled={updateStatusMutation.isPending}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-amber-600/20 transition flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Play className="w-4 h-4" />
                      <span>Start On-Site Job</span>
                    </button>
                  )}

                  {booking.status === 'in_progress' && (
                    <button
                      onClick={() => setCompletingBookingId(booking.id)}
                      disabled={updateStatusMutation.isPending}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Job Completed</span>
                    </button>
                  )}

                  {booking.status === 'completed' && (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Submit Completion Proof & Invoice Notes</h3>
              <button onClick={() => setCompletingBookingId(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              rows={4}
              placeholder="Describe work completed, replacement parts used, pressure/continuity test results..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setCompletingBookingId(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold border border-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateBookingStatus(completingBookingId, 'completed', completionNotes)}
                disabled={updateStatusMutation.isPending}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/25 disabled:opacity-50"
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
