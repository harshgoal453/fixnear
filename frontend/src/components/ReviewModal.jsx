import React, { useState } from 'react';
import { useSubmitReview } from '../hooks/useFixNearQuery';
import { X, Star, MessageSquare } from 'lucide-react';

export default function ReviewModal({ booking, onClose, onReviewSuccess }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const submitReviewMutation = useSubmitReview();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    submitReviewMutation.mutate({
      booking_id: booking.id,
      customer_id: booking.customer_id,
      rating,
      comment
    }, {
      onSuccess: (data) => {
        if (onReviewSuccess) onReviewSuccess(data.review);
        onClose();
      },
      onError: (err) => {
        setError(err.message || 'Failed to submit review.');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-card bg-slate-900/95 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Rate Service Provider</h3>
              <p className="text-xs text-slate-400">{booking.business_name} • {booking.category_name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {error && (
            <div className="bg-rose-500/10 text-rose-400 p-3 rounded-xl border border-rose-500/30">
              {error}
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-300 mb-2">Service Quality Rating</label>
            <div className="flex items-center gap-3 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                    }`}
                  />
                </button>
              ))}
              <span className="font-extrabold text-amber-400 text-sm ml-2">{rating}/5 Stars</span>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span>Your Review & Feedback</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="How was the equipment handling, punctuality, and service quality?..."
              required
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
              disabled={submitReviewMutation.isPending}
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 py-3 rounded-xl font-extrabold shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
            >
              {submitReviewMutation.isPending ? 'Submitting...' : 'Post Verified Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
