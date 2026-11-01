import React, { useState } from 'react';
import { useCreatePaymentOrder, useVerifyPayment } from '../hooks/useFixNearQuery';
import { X, ShieldCheck, CheckCircle2, QrCode, CreditCard, Building2, Smartphone, ArrowRight, Loader2, Lock } from 'lucide-react';

export default function PaymentModal({ booking, onClose, onPaymentSuccess }) {
  const [activeTab, setActiveTab] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [order, setOrder] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');

  // Card form state
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('821');

  const createOrderMutation = useCreatePaymentOrder();
  const verifyPaymentMutation = useVerifyPayment();

  // Initialize order on mount
  React.useEffect(() => {
    createOrderMutation.mutate({
      booking_id: booking.id,
      amount: booking.total_price
    }, {
      onSuccess: (data) => {
        setOrder(data);
        setIsInitializing(false);
      },
      onError: (err) => {
        console.error('Order creation error:', err);
        setIsInitializing(false);
      }
    });
  }, [booking.id]);

  const handleSimulatePayment = (methodName) => {
    setIsProcessing(true);

    setTimeout(() => {
      verifyPaymentMutation.mutate({
        booking_id: booking.id,
        razorpay_order_id: order?.order_id || `order_${Date.now()}`,
        razorpay_payment_id: `pay_rzp_${Math.random().toString(36).substring(2, 11)}`,
        payment_method: methodName
      }, {
        onSuccess: (data) => {
          setIsProcessing(false);
          setPaymentSuccess(data);
          if (onPaymentSuccess) onPaymentSuccess(data.booking);
        },
        onError: (err) => {
          setIsProcessing(false);
          alert('Payment verification failed: ' + err.message);
        }
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white">FixNear Secure Checkout</h3>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Razorpay Sandbox
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Order #{booking.id} • {booking.category_name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentSuccess ? (
          /* Payment Success View */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/40 animate-pulse">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-white">Payment Received!</h2>
              <p className="text-xs text-slate-400">Transaction ID: <span className="font-mono text-emerald-400 font-bold">{paymentSuccess.payment_id}</span></p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs text-left">
              <div className="flex justify-between text-slate-400">
                <span>Amount Paid</span>
                <span className="font-bold text-white">₹{booking.total_price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment Mode</span>
                <span className="font-semibold text-emerald-400">{paymentSuccess.payment_method}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment Status</span>
                <span className="text-emerald-400 font-bold uppercase text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded">PAID & VERIFIED</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-xs shadow-lg transition"
            >
              Done & View Live Booking Pipeline
            </button>
          </div>
        ) : isInitializing ? (
          /* Loading State */
          <div className="p-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Connecting to Secure Payment Gateway...</p>
          </div>
        ) : (
          /* Payment Options View */
          <div className="p-6 space-y-5">
            {/* Amount Banner */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Total Payable Amount</span>
                <span className="text-2xl font-black text-white">₹{booking.total_price.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-bit Encrypted</span>
              </div>
            </div>

            {/* Method Tabs */}
            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('upi')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
                  activeTab === 'upi' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>UPI / QR</span>
              </button>
              <button
                onClick={() => setActiveTab('card')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
                  activeTab === 'card' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Card</span>
              </button>
              <button
                onClick={() => setActiveTab('netbanking')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
                  activeTab === 'netbanking' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>NetBanking</span>
              </button>
            </div>

            {/* Tab 1: UPI Options */}
            {activeTab === 'upi' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'gpay', name: 'Google Pay', icon: '🟢 GPay' },
                    { id: 'phonepe', name: 'PhonePe', icon: '🟣 PhonePe' },
                    { id: 'paytm', name: 'Paytm', icon: '🔵 Paytm' }
                  ].map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setSelectedUpiApp(app.id)}
                      className={`p-2.5 rounded-xl border text-center text-xs font-bold transition ${
                        selectedUpiApp === app.id
                          ? 'border-indigo-500 bg-indigo-500/10 text-white'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-sm mb-0.5">{app.icon}</div>
                    </button>
                  ))}
                </div>

                {/* QR Code Demo Box */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-2">
                  <div className="w-32 h-32 bg-white p-2 rounded-xl mx-auto flex items-center justify-center shadow-md">
                    <QrCode className="w-28 h-28 text-slate-950" />
                  </div>
                  <p className="text-[10px] text-slate-400">Scan using any UPI App (GPay / PhonePe / Paytm / BHIM)</p>
                </div>

                <button
                  onClick={() => handleSimulatePayment(`UPI (${selectedUpiApp.toUpperCase()})`)}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 rounded-xl font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying UPI Payment...</span>
                    </>
                  ) : (
                    <>
                      <span>Simulate UPI Payment (₹{booking.total_price.toFixed(2)})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Tab 2: Card Payment */}
            {activeTab === 'card' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Valid Thru</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">CVV</label>
                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleSimulatePayment('Credit/Debit Card')}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white py-3 rounded-xl font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 pt-3"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Card Payment...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay ₹{booking.total_price.toFixed(2)} with Card</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Tab 3: NetBanking */}
            {activeTab === 'netbanking' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((bank) => (
                    <button
                      key={bank}
                      onClick={() => handleSimulatePayment(`NetBanking (${bank})`)}
                      disabled={isProcessing}
                      className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-left text-slate-300 transition"
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
