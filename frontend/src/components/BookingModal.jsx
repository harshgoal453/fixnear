import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useCreateBooking } from '../hooks/useFixNearQuery';
import { X, Calendar, Clock, MapPin, FileText, ShieldCheck, CheckCircle2, CreditCard, ArrowRight } from 'lucide-react';
import PaymentModal from './PaymentModal';

export default function BookingModal({ tech, onClose, onBookingSuccess }) {
  const { user } = useAuthStore();
  const createBookingMutation = useCreateBooking();

  const [date, setDate] = useState('2026-10-05');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [address, setAddress] = useState('Flat 402, Sea Breeze Apartments, Bandra West, Mumbai, MH, India');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState(null);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const basePrice = tech?.base_price || 499.0;
  const hourlyRate = tech?.hourly_rate || 499.0;
  const platformFee = 99.0;
  const totalPrice = basePrice + hourlyRate + platformFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const customerId = user ? user.id : 1; // Fallback to Priya Sharma

    createBookingMutation.mutate({
      customer_id: customerId,
      technician_id: tech.id,
      service_category_id: tech.category_id,
      booking_date: date,
      time_slot: timeSlot,
      address,
      notes,
      total_price: totalPrice
    }, {
      onSuccess: (data) => {
        setCreatedBooking(data.booking);
        if (onBookingSuccess) onBookingSuccess(data.booking);
      },
      onError: (err) => {
        setError(err.message || 'Failed to submit booking request.');
      }
    });
  };

  const timeSlots = [
    '08:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '01:00 PM - 03:00 PM',
    '03:00 PM - 05:00 PM',
    '05:00 PM - 07:00 PM'
  ];

  if (showPaymentModal && createdBooking) {
    return (
      <PaymentModal
        booking={{ ...createdBooking, business_name: tech.business_name, category_name: tech.category_name }}
        onClose={() => {
          setShowPaymentModal(false);
          onClose();
          window.location.href = '/customer/bookings';
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-card bg-slate-900/95 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 relative border-b border-slate-800/80 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <img
              src={tech?.avatar || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=150'}
              alt={tech?.business_name}
              className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shadow-md"
            />
            <div>
              <h3 className="font-extrabold text-white text-lg leading-tight">{tech?.business_name}</h3>
              <p className="text-xs text-indigo-400 font-semibold">{tech?.category_name} Service Appointment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State */}
        {createdBooking ? (
          <div className="p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-white">Booking Request Placed!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Your service appointment has been reserved for <strong className="text-slate-200">{createdBooking.booking_date} ({createdBooking.time_slot})</strong>.
                Booking Ticket ID: <span className="font-mono text-indigo-400 font-bold">#{createdBooking.id}</span>
              </p>
            </div>

            <div className="glass-card bg-slate-950/60 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Payable Amount:</span>
              <span className="text-lg font-black text-emerald-400">₹{createdBooking.total_price.toFixed(2)}</span>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white py-3.5 rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay Online (UPI / GPay / PhonePe / Card)</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  window.location.href = '/customer/bookings';
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <span>Track in Customer Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Form Body */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {error && (
              <div className="bg-rose-500/10 text-rose-400 p-3 rounded-xl border border-rose-500/30">
                {error}
              </div>
            )}

            <div>
              <label className="font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Select Service Date</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Preferred Time Slot</span>
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot} className="bg-slate-900 text-slate-100">{slot}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>Service Location Address</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Flat/House No., Society/Street, City, Pin"
                required
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Job Details / Issue Description</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Describe the issue, specific machinery, or access instructions..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Transparent Pricing Breakdown Card */}
            <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800/80 space-y-2">
              <div className="font-bold text-slate-200 pb-1.5 border-b border-slate-800/80 flex items-center justify-between">
                <span>Transparent Price Summary</span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> FixNear Guaranteed
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Inspection & Visit Charge</span>
                <span className="font-semibold text-slate-300">₹{basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Technician Estimated Labor Rate</span>
                <span className="font-semibold text-slate-300">₹{hourlyRate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Platform Insurance & Guarantee Fee</span>
                <span className="font-semibold text-slate-300">₹{platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-extrabold text-sm pt-2 border-t border-slate-800">
                <span>Total Estimated Price</span>
                <span className="text-emerald-400">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-bold transition text-xs border border-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createBookingMutation.isPending}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/25 transition text-xs disabled:opacity-50"
              >
                {createBookingMutation.isPending ? 'Confirming...' : 'Confirm & Request Service'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
