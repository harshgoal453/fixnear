import React, { useState } from 'react';
import { useSubmitComplaint } from '../hooks/useFixNearQuery';
import { X, ShieldAlert, FileText } from 'lucide-react';

export default function ComplaintModal({ booking, userId, onClose, onComplaintSuccess }) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const submitComplaintMutation = useSubmitComplaint();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    submitComplaintMutation.mutate({
      booking_id: booking.id,
      user_id: userId,
      subject,
      description
    }, {
      onSuccess: (data) => {
        if (onComplaintSuccess) onComplaintSuccess(data.complaint);
        onClose();
      },
      onError: (err) => {
        setError(err.message || 'Failed to submit complaint.');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-card bg-slate-900/95 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-rose-500/30 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-rose-500/20 flex items-center justify-between bg-rose-950/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">File Support Complaint</h3>
              <p className="text-xs text-rose-300">Booking #{booking.id} • Forwarded to Admin Harsh</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="bg-rose-500/10 text-rose-400 p-3 rounded-xl border border-rose-500/30">
              {error}
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-rose-400" />
              <span>Complaint Subject / Reason</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Late arrival, incorrect spare part, or pricing query..."
              required
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1.5">Detailed Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Explain the incident with relevant details. Admin Harsh will audit the job logs and contact both parties..."
              required
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-bold border border-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitComplaintMutation.isPending}
              className="flex-1 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-rose-600/25 transition disabled:opacity-50"
            >
              {submitComplaintMutation.isPending ? 'Filing...' : 'Submit to Admin Harsh'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
