import React, { useState } from 'react';
import {
  useBookings,
  useAdminVerifications,
  useAdminComplaints,
  useCategories,
  useAdminStats,
  useUpdateBookingStatus,
  useVerifyTechnician,
  useResolveComplaint
} from '../hooks/useFixNearQuery';
import VerificationBadge from '../components/VerificationBadge';
import StatusBadge from '../components/StatusBadge';
import { Shield, Plus, CheckCircle2, XCircle, FileText, Play, Layers, Calendar, MapPin, IndianRupee, Sparkles, X } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('bookings');

  // TanStack Query Hooks
  const { data: stats } = useAdminStats();
  const { data: bookings = [] } = useBookings();
  const { data: verifications = [] } = useAdminVerifications();
  const { data: complaints = [] } = useAdminComplaints();
  const { data: categories = [] } = useCategories();

  // TanStack Query Mutations
  const updateStatusMutation = useUpdateBookingStatus();
  const verifyTechMutation = useVerifyTechnician();
  const resolveComplaintMutation = useResolveComplaint();

  // Complaint Resolution state
  const [resolvingId, setResolvingId] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolutionStatus, setResolutionStatus] = useState('resolved');

  const handleAdminAcceptBooking = (bookingId, newStatus) => {
    updateStatusMutation.mutate({
      id: bookingId,
      statusData: { status: newStatus }
    });
  };

  const handleVerifyTechnician = (techId, newVerifiedStatus) => {
    verifyTechMutation.mutate({ techId, status: newVerifiedStatus });
  };

  const handleResolveComplaint = (e) => {
    e.preventDefault();
    if (!resolvingId) return;

    resolveComplaintMutation.mutate({
      id: resolvingId,
      resolutionData: {
        status: resolutionStatus,
        resolution_notes: resolutionNotes
      }
    }, {
      onSuccess: () => {
        setResolvingId(null);
        setResolutionNotes('');
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Console: Harsh • FixNear India Headquarters 🇮🇳</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2">
            Platform Management & Override Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Superuser control panel for booking acceptance, provider licensing audits, dispute resolution, and fleet metrics.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold text-slate-400 flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-3.5 py-2 rounded-xl transition ${activeTab === 'bookings' ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-600/20 font-extrabold' : 'hover:text-white'}`}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('verifications')}
            className={`px-3.5 py-2 rounded-xl transition ${activeTab === 'verifications' ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-600/20 font-extrabold' : 'hover:text-white'}`}
          >
            Licensing Queue ({verifications.filter(v => v.verified === 0).length})
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`px-3.5 py-2 rounded-xl transition ${activeTab === 'complaints' ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-600/20 font-extrabold' : 'hover:text-white'}`}
          >
            Disputes ({complaints.filter(c => c.status === 'open').length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3.5 py-2 rounded-xl transition ${activeTab === 'categories' ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-600/20 font-extrabold' : 'hover:text-white'}`}
          >
            Categories ({categories.length})
          </button>
        </div>
      </div>

      {/* Metric Cards Top Overview */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card bg-slate-900/60 p-5 rounded-3xl border border-slate-800/80 shadow-xl">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Revenue Paid</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">₹{stats.totalRevenue.toFixed(2)}</div>
            <div className="text-[10px] text-emerald-500 font-bold mt-1">Across Indian Metros</div>
          </div>

          <div className="glass-card bg-slate-900/60 p-5 rounded-3xl border border-slate-800/80 shadow-xl">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Licensing Audits</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">{stats.pendingVerifications}</div>
            <div className="text-[10px] text-amber-500 font-bold mt-1">Awaiting Harsh Audit</div>
          </div>

          <div className="glass-card bg-slate-900/60 p-5 rounded-3xl border border-slate-800/80 shadow-xl">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Bookings Pipeline</div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-400 mt-1">{stats.activeBookings}</div>
            <div className="text-[10px] text-indigo-400 font-bold mt-1">In progress across India</div>
          </div>

          <div className="glass-card bg-slate-900/60 p-5 rounded-3xl border border-slate-800/80 shadow-xl">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Open Disputes</div>
            <div className="text-2xl sm:text-3xl font-black text-rose-400 mt-1">{stats.openComplaints}</div>
            <div className="text-[10px] text-rose-500 font-bold mt-1">For Harsh Mediation</div>
          </div>
        </div>
      )}

      {/* Tab 0: Bookings & Request Management */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white">All Booking Requests (Admin Direct Override)</h2>
              <p className="text-xs text-slate-400">Admin Harsh can accept requests directly on behalf of providers or expedite orders.</p>
            </div>
            <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              Superuser Override Active
            </span>
          </div>

          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="glass-card bg-slate-900/60 rounded-3xl border border-slate-800/80 shadow-xl p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-extrabold text-white text-base">Booking #{booking.id}: {booking.business_name}</h3>
                      <StatusBadge status={booking.status} />
                    </div>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                      Customer: <strong className="text-slate-200">{booking.customer_name}</strong> ({booking.customer_phone}) • Category: <strong className="text-indigo-400">{booking.category_name}</strong>
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
                    <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-bold">Date & Time Slot</span>
                    <span className="font-bold text-slate-200 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      {booking.booking_date} ({booking.time_slot})
                    </span>
                  </div>
                  <div className="truncate">
                    <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-bold">Service Address</span>
                    <span className="font-bold text-slate-200 truncate flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      {booking.address}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-bold">Customer Notes</span>
                    <span className="font-medium text-slate-300 mt-0.5 block">{booking.notes || 'No extra notes provided'}</span>
                  </div>
                </div>

                {/* Admin Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-rose-400" />
                    Admin Control Direct Action:
                  </span>
                  <div className="flex items-center gap-2">
                    {booking.status === 'requested' && (
                      <button
                        onClick={() => handleAdminAcceptBooking(booking.id, 'accepted')}
                        disabled={updateStatusMutation.isPending}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accept Request (As Admin Harsh)</span>
                      </button>
                    )}

                    {booking.status === 'accepted' && (
                      <button
                        onClick={() => handleAdminAcceptBooking(booking.id, 'in_progress')}
                        disabled={updateStatusMutation.isPending}
                        className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-amber-600/20 disabled:opacity-50"
                      >
                        <Play className="w-4 h-4" />
                        <span>Advance Status to In-Progress</span>
                      </button>
                    )}

                    {booking.status === 'in_progress' && (
                      <button
                        onClick={() => handleAdminAcceptBooking(booking.id, 'completed')}
                        disabled={updateStatusMutation.isPending}
                        className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark Service Completed</span>
                      </button>
                    )}

                    {booking.status === 'completed' && (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Order Fulfilled & Closed</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 1: Verification Queue */}
      {activeTab === 'verifications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white">Provider Licensing Review Queue</h2>
              <p className="text-xs text-slate-400">Harsh inspects government trade certifications, electrical licenses, and tools.</p>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Audit Pending: {verifications.filter(v => v.verified === 0).length}
            </span>
          </div>

          <div className="glass-card bg-slate-900/60 rounded-3xl border border-slate-800/80 shadow-xl overflow-hidden divide-y divide-slate-800/80">
            {verifications.map((tech) => (
              <div key={tech.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={tech.avatar || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=150'}
                    alt={tech.owner_name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-white text-base">{tech.business_name}</h3>
                      <VerificationBadge status={tech.verified} />
                    </div>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      Owner: <strong className="text-slate-200">{tech.owner_name}</strong> ({tech.owner_email}) • Trade: <strong className="text-indigo-400">{tech.category_name}</strong> • City: {tech.city}
                    </p>
                    <div className="text-xs text-indigo-400 font-mono font-semibold mt-1 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Submitted Document: {tech.verification_doc || 'No document submitted'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {tech.verified !== 1 && (
                    <button
                      onClick={() => handleVerifyTechnician(tech.id, 1)}
                      disabled={verifyTechMutation.isPending}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve License</span>
                    </button>
                  )}

                  {tech.verified !== 2 && (
                    <button
                      onClick={() => handleVerifyTechnician(tech.id, 2)}
                      disabled={verifyTechMutation.isPending}
                      className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Application</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Disputes & Complaints Hub */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-black text-white">Customer Support & Dispute Mediation Hub</h2>
            <p className="text-xs text-slate-400">Harsh directly reviews tickets, resolves disputes, and applies adjustments.</p>
          </div>

          <div className="space-y-4">
            {complaints.map((c) => (
              <div key={c.id} className="glass-card bg-slate-900/60 rounded-3xl border border-slate-800/80 p-6 space-y-4 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-sm">Dispute Ticket #{c.id}</span>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Filed by: <strong className="text-slate-200">{c.user_name}</strong> ({c.user_role}) • Provider: <strong className="text-slate-200">{c.technician_business}</strong>
                    </p>
                  </div>

                  <div className="text-xs text-slate-500 font-mono">
                    Filed: {new Date(c.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="font-bold text-white text-sm">{c.subject}</div>
                  <p className="text-slate-300 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 leading-relaxed italic">
                    "{c.description}"
                  </p>
                </div>

                {c.resolution_notes && (
                  <div className="bg-teal-500/10 p-3.5 rounded-2xl border border-teal-500/30 text-xs text-teal-300 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                      <span>Admin Harsh Official Resolution:</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">{c.resolution_notes}</p>
                  </div>
                )}

                {/* Resolve Action */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setResolvingId(c.id);
                      setResolutionNotes(c.resolution_notes || '');
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/20"
                  >
                    Update Dispute Resolution
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Service Categories Manager */}
      {activeTab === 'categories' && (
        <div className="glass-card bg-slate-900/60 p-6 rounded-3xl border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-extrabold text-white text-base">Active Service Categories ({categories.length})</h3>
              <p className="text-xs text-slate-400">Configured trades, standardized inspection pricing, and equipment specifications.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl border border-slate-800 bg-slate-950/70 space-y-2">
                <div className="flex items-center justify-between font-bold text-white text-sm">
                  <span>{c.name}</span>
                  <span className="text-emerald-400 text-xs">₹{c.base_price}</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Complaint Resolution Modal */}
      {resolvingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form onSubmit={handleResolveComplaint} className="glass-card bg-slate-900/95 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-extrabold text-white text-base">Resolve Support Dispute #{resolvingId}</h3>
              <button type="button" onClick={() => setResolvingId(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Status Update</label>
              <select
                value={resolutionStatus}
                onChange={(e) => setResolutionStatus(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100"
              >
                <option value="open" className="bg-slate-900">Open</option>
                <option value="under_investigation" className="bg-slate-900">Under Investigation</option>
                <option value="resolved" className="bg-slate-900">Resolved</option>
                <option value="dismissed" className="bg-slate-900">Dismissed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Harsh (Admin) Action & Resolution Notes</label>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                rows={4}
                placeholder="Explain the mediation ruling, refund adjustments, or technician warning..."
                required
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setResolvingId(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl text-xs font-bold border border-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={resolveComplaintMutation.isPending}
                className="flex-1 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white py-3 rounded-xl text-xs font-bold shadow-lg shadow-rose-600/25 disabled:opacity-50"
              >
                Save Resolution
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
