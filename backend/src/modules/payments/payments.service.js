const paymentsRepository = require('./payments.repository');
const crypto = require('crypto');

class PaymentsService {
  async createOrder({ booking_id, amount }) {
    if (!booking_id) {
      throw new Error('Booking ID is required');
    }

    const booking = paymentsRepository.findBookingById(booking_id);
    if (!booking) {
      throw new Error('Booking not found');
    }

    const finalAmount = amount || booking.total_price;
    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_fixnear_demo_2026';
    const isLiveRazorpay = !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

    if (isLiveRazorpay) {
      try {
        // Dynamic import / require if installed, or direct API call
        const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');
        const res = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${auth}`
          },
          body: JSON.stringify({
            amount: Math.round(finalAmount * 100), // amount in paise
            currency: 'INR',
            receipt: `rcpt_booking_${booking_id}`,
            notes: {
              booking_id,
              service: booking.category_name
            }
          })
        });
        const orderData = await res.json();
        return {
          order_id: orderData.id,
          amount: finalAmount,
          currency: 'INR',
          key_id: keyId,
          is_simulation: false,
          booking
        };
      } catch (err) {
        console.warn('Razorpay live order creation failed, falling back to sandbox simulator:', err.message);
      }
    }

    // Built-in Developer/Prototype Simulator
    const simulatedOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
    return {
      order_id: simulatedOrderId,
      amount: finalAmount,
      currency: 'INR',
      key_id: keyId,
      is_simulation: true,
      booking
    };
  }

  async verifyPayment({ booking_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, payment_method }) {
    if (!booking_id) {
      throw new Error('Booking ID is required');
    }

    const booking = paymentsRepository.findBookingById(booking_id);
    if (!booking) {
      throw new Error('Booking not found');
    }

    const isLiveRazorpay = !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
    const paymentId = razorpay_payment_id || `pay_${crypto.randomBytes(8).toString('hex')}`;

    if (isLiveRazorpay && razorpay_signature && razorpay_order_id) {
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        throw new Error('Invalid Razorpay signature. Payment verification failed.');
      }
    }

    // Record success in repository
    const updatedBooking = paymentsRepository.recordPaymentSuccess(booking_id, {
      payment_id: paymentId,
      payment_method: payment_method || 'UPI'
    });

    return {
      success: true,
      message: 'Payment verified and confirmed successfully!',
      payment_id: paymentId,
      payment_method: payment_method || 'UPI',
      booking: updatedBooking
    };
  }
}

module.exports = new PaymentsService();
