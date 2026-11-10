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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 relative border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <img
              src={tech?.avatar || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=150'}
              alt={tech?.business_name}
              className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-sm"
            />
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{tech?.business_name}</h3>
              <p className="text-xs text-indigo-600 font-semibold">{tech?.category_name} Service Appointment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State */}
        {createdBooking ? (
          <div className="p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">Booking Request Placed!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Your service appointment has been reserved for <strong className="text-slate-900">{createdBooking.booking_date} ({createdBooking.time_slot})</strong>.
                Booking Ticket ID: <span className="font-mono text-indigo-600 font-bold">#{createdBooking.id}</span>
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Total Payable Amount:</span>
              <span className="text-lg font-black text-emerald-600">₹{createdBooking.total_price.toFixed(2)}</span>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay Online (UPI / GPay / PhonePe / Card)</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  window.location.href = '/customer/bookings';
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 border border-slate-200"
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
              <div className="bg-rose-50 text-rose-700 p-3 rounded-xl border border-rose-200 font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>Select Service Date</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Preferred Time Slot</span>
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                <span>Service Location Address</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Flat/House No., Society/Street, City, Pin"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>Job Details / Issue Description</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Describe the issue, specific machinery, or access instructions..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Transparent Pricing Breakdown Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 pb-1.5 border-b border-slate-200 flex items-center justify-between">
                <span>Transparent Price Summary</span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> FixNear Guaranteed
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Inspection & Visit Charge</span>
                <span className="font-semibold text-slate-800">₹{basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Technician Estimated Labor Rate</span>
                <span className="font-semibold text-slate-800">₹{hourlyRate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Platform Insurance & Guarantee Fee</span>
                <span className="font-semibold text-slate-800">₹{platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-slate-200">
                <span>Total Estimated Price</span>
                <span className="text-emerald-700 font-black">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition text-xs border border-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createBookingMutation.isPending}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-md shadow-indigo-600/20 transition text-xs disabled:opacity-50"
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
