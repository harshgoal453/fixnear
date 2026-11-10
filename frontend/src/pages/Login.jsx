import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../api';
import { Wrench, Shield, User, Lock, Mail, ArrowRight, UserPlus, Phone, Briefcase, FileText, Upload, CheckCircle2, AlertCircle, KeyRound, RefreshCw } from 'lucide-react';

export default function Login() {
  const { loginByEmail, register } = useAuthStore();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  
  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [role, setRole] = useState('customer'); // 'customer' | 'provider'
  const [businessName, setBusinessName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [city, setCity] = useState('Mumbai, MH, India');
  const [hourlyRate, setHourlyRate] = useState(499);
  const [verificationDoc, setVerificationDoc] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Email OTP Verification State
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
  const [verifyingEmailOtp, setVerifyingEmailOtp] = useState(false);
  const [emailOtpDemo, setEmailOtpDemo] = useState('');

  // Phone OTP Verification State
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [sendingPhoneOtp, setSendingPhoneOtp] = useState(false);
  const [verifyingPhoneOtp, setVerifyingPhoneOtp] = useState(false);
  const [phoneOtpDemo, setPhoneOtpDemo] = useState('');

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Regex Patterns for Strict Client-Side Verification
  const REGEX = {
    name: /^[a-zA-Z\s.]{3,50}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^(?:\+91[\-\s]?)?[0-9]{10}$/,
    password: /^(?=.*[A-Za-z])(?=.*\d).{6,30}$/,
    businessName: /^[a-zA-Z0-9\s.,&'-]{3,60}$/,
    docLicense: /^[A-Za-z0-9\-_./]{5,40}$/
  };

  // Send Email OTP
  const handleSendEmailOtp = async () => {
    if (!REGEX.email.test(email.trim())) {
      setError('Please enter a valid email address (e.g. user@domain.com) to receive OTP.');
      return;
    }
    setError(null);
    setSendingEmailOtp(true);
    try {
      const res = await api.auth.sendOtp('email', email.trim());
      setEmailOtpSent(true);
      setEmailOtpDemo(res.otp || '123456');
    } catch (err) {
      setError(err.message || 'Failed to dispatch Email OTP.');
    } finally {
      setSendingEmailOtp(false);
    }
  };

  // Verify Email OTP
  const handleVerifyEmailOtp = async () => {
    if (!emailOtp.trim()) {
      setError('Please enter the 6-digit OTP code sent to your email.');
      return;
    }
    setError(null);
    setVerifyingEmailOtp(true);
    try {
      await api.auth.verifyOtp('email', email.trim(), emailOtp.trim());
      setEmailVerified(true);
    } catch (err) {
      setError(err.message || 'Invalid or expired Email OTP.');
    } finally {
      setVerifyingEmailOtp(false);
    }
  };

  // Send Phone OTP
  const handleSendPhoneOtp = async () => {
    if (!REGEX.phone.test(phone.trim())) {
      setError('Please enter a valid 10-digit mobile number (0 to 9) to receive OTP.');
      return;
    }
    setError(null);
    setSendingPhoneOtp(true);
    try {
      const res = await api.auth.sendOtp('phone', phone.trim());
      setPhoneOtpSent(true);
      setPhoneOtpDemo(res.otp || '123456');
    } catch (err) {
      setError(err.message || 'Failed to dispatch Mobile OTP.');
    } finally {
      setSendingPhoneOtp(false);
    }
  };

  // Verify Phone OTP
  const handleVerifyPhoneOtp = async () => {
    if (!phoneOtp.trim()) {
      setError('Please enter the 6-digit OTP code sent to your mobile.');
      return;
    }
    setError(null);
    setVerifyingPhoneOtp(true);
    try {
      await api.auth.verifyOtp('phone', phone.trim(), phoneOtp.trim());
      setPhoneVerified(true);
    } catch (err) {
      setError(err.message || 'Invalid or expired Mobile OTP.');
    } finally {
      setVerifyingPhoneOtp(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Regex check on login email
    if (!REGEX.email.test(email.trim())) {
      setError('Please enter a valid verified email address format (e.g. name@domain.com).');
      setSubmitting(false);
      return;
    }

    const res = await loginByEmail(email.trim(), password);
    if (res?.success) {
      if (res.user.role === 'admin') navigate('/admin/dashboard');
      else if (res.user.role === 'provider') navigate('/provider/dashboard');
      else navigate('/customer/bookings');
    } else {
      setError(res?.error || 'Invalid credentials. Please verify your email and password.');
    }
    setSubmitting(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setVerificationDoc(file.name);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Strict Regex Validation
    if (!REGEX.name.test(name.trim())) {
      setError('Full Name must be 3 to 50 alphabetic characters only (no unverified symbols or numbers).');
      setSubmitting(false);
      return;
    }

    if (!REGEX.email.test(email.trim())) {
      setError('Invalid Email: Please enter a verified email address (e.g. name@domain.com).');
      setSubmitting(false);
      return;
    }

    if (!emailVerified) {
      setError('Email OTP Verification Required: Please verify your email address using the Send OTP button.');
      setSubmitting(false);
      return;
    }

    if (!REGEX.phone.test(phone.trim())) {
      setError('Invalid Mobile Number: Must be a verified 10-digit mobile number (+91 9XXXXXXXXX).');
      setSubmitting(false);
      return;
    }

    if (!phoneVerified) {
      setError('Mobile OTP Verification Required: Please verify your mobile phone number using the Send OTP button.');
      setSubmitting(false);
      return;
    }

    if (!REGEX.password.test(password)) {
      setError('Password must be at least 6 characters and include at least one letter and one number.');
      setSubmitting(false);
      return;
    }

    if (role === 'provider') {
      if (!REGEX.businessName.test(businessName.trim())) {
        setError('Business Name must be 3 to 60 characters with valid letters or numbers.');
        setSubmitting(false);
        return;
      }
      if (!verificationDoc || !verificationDoc.trim()) {
        setError('Government Document Required: Technicians must upload their trade certificate or government license.');
        setSubmitting(false);
        return;
      }
    }

    const res = await register({
      name: name.trim(),
      email: email.trim(),
      password,
      phone: phone.trim(),
      role,
      business_name: role === 'provider' ? businessName.trim() : undefined,
      category_id: role === 'provider' ? Number(selectedCategory) : undefined,
      city: role === 'provider' ? city : undefined,
      hourly_rate: role === 'provider' ? Number(hourlyRate) : undefined,
      verification_doc: role === 'provider' ? verificationDoc.trim() : undefined,
      email_verified: emailVerified,
      phone_verified: phoneVerified
    });

    if (res?.success) {
      if (res.user.role === 'admin') navigate('/admin/dashboard');
      else if (res.user.role === 'provider') navigate('/provider/dashboard');
      else navigate('/customer/bookings');
    } else {
      setError(res?.error || 'Registration failed. Please check inputs.');
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-gradient-to-tr from-indigo-600 to-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-indigo-600/20">
          <Wrench className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          FixNear <span className="text-indigo-600">India</span> 🇮🇳
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Access customer bookings, provider jobs, or Admin Console.
        </p>
      </div>

      {/* Main Light Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
        
        {/* Mode Toggle */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`py-2.5 rounded-xl transition ${
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`py-2.5 rounded-xl transition ${
              mode === 'register'
                ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-2xl text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span className="font-medium leading-relaxed">{error}</span>
          </div>
        )}

        {mode === 'login' ? (
          /* Manual Login Form */
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email (e.g. user@domain.com)"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your account password"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-md shadow-indigo-600/25 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In to Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Fill for Evaluator / Teacher */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Teacher / Evaluator Demo Credentials (Click to fill):
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('harsh@fixnear.in');
                    setPassword('password123');
                  }}
                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-center font-bold transition"
                >
                  👑 Admin (Harsh)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('priya@fixnear.in');
                    setPassword('password123');
                  }}
                  className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-center font-bold transition"
                >
                  👤 Customer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('alex@apexpower.in');
                    setPassword('password123');
                  }}
                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-center font-bold transition"
                >
                  ⚡ Technician
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Register Form with Strict Regex & OTP Verification */
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Account Role</label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`p-3 rounded-2xl border text-center font-bold transition flex items-center justify-center gap-2 ${
                    role === 'customer'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('provider')}
                  className={`p-3 rounded-2xl border text-center font-bold transition flex items-center justify-center gap-2 ${
                    role === 'provider'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Wrench className="w-4 h-4" />
                  <span>Technician</span>
                </button>
              </div>
            </div>

            {/* Full Name with Regex Validation */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Full Legal Name</span>
                </span>
                {name && (
                  <span className={`text-[10px] font-bold ${REGEX.name.test(name) ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {REGEX.name.test(name) ? '✓ Verified Format' : 'Letters only (3-50 chars)'}
                  </span>
                )}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vikram Mehta"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>

            {/* Email with Regex & OTP Verification */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Email Address</span>
                </span>
                {emailVerified ? (
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Email Verified
                  </span>
                ) : (
                  email && (
                    <span className={`text-[10px] font-bold ${REGEX.email.test(email) ? 'text-indigo-600' : 'text-amber-600'}`}>
                      {REGEX.email.test(email) ? 'OTP Verification Required' : 'Invalid email syntax'}
                    </span>
                  )
                )}
              </label>
              
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  disabled={emailVerified}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailOtpSent(false);
                    setEmailVerified(false);
                  }}
                  placeholder="e.g. vikram@example.in"
                  required
                  className={`flex-1 bg-slate-50 border ${
                    emailVerified ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-300'
                  } rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition`}
                />
                {!emailVerified && (
                  <button
                    type="button"
                    onClick={handleSendEmailOtp}
                    disabled={!REGEX.email.test(email) || sendingEmailOtp}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap shadow-xs"
                  >
                    {sendingEmailOtp ? 'Sending...' : emailOtpSent ? 'Resend' : 'Send OTP'}
                  </button>
                )}
              </div>

              {/* Email OTP Drawer */}
              {emailOtpSent && !emailVerified && (
                <div className="mt-2.5 p-3 bg-indigo-50/80 border border-indigo-200 rounded-2xl space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-indigo-900 flex items-center gap-1">
                      <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Enter 6-Digit Email OTP:</span>
                    </span>
                    {emailOtpDemo && (
                      <button
                        type="button"
                        onClick={() => setEmailOtp(emailOtpDemo)}
                        className="text-indigo-700 hover:text-indigo-900 font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-indigo-200 transition"
                      >
                        Code: <strong>{emailOtpDemo}</strong> (Click to fill)
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value)}
                      placeholder="e.g. 123456"
                      className="flex-1 bg-white border border-indigo-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono tracking-widest text-center focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyEmailOtp}
                      disabled={verifyingEmailOtp || !emailOtp}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50"
                    >
                      {verifyingEmailOtp ? 'Verifying...' : 'Verify OTP'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile with Phone Regex & OTP Verification */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Mobile Number</span>
                </span>
                {phoneVerified ? (
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Mobile Verified
                  </span>
                ) : (
                  phone && phone !== '+91 ' && (
                    <span className={`text-[10px] font-bold ${REGEX.phone.test(phone) ? 'text-indigo-600' : 'text-amber-600'}`}>
                      {REGEX.phone.test(phone) ? 'OTP Verification Required' : '10 digits (0 to 9)'}
                    </span>
                  )
                )}
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={phone}
                  disabled={phoneVerified}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setPhoneOtpSent(false);
                    setPhoneVerified(false);
                  }}
                  placeholder="+91 98200 12345"
                  required
                  className={`flex-1 bg-slate-50 border ${
                    phoneVerified ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-300'
                  } rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition`}
                />
                {!phoneVerified && (
                  <button
                    type="button"
                    onClick={handleSendPhoneOtp}
                    disabled={!REGEX.phone.test(phone) || sendingPhoneOtp}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap shadow-xs"
                  >
                    {sendingPhoneOtp ? 'Sending...' : phoneOtpSent ? 'Resend' : 'Send OTP'}
                  </button>
                )}
              </div>

              {/* Phone OTP Drawer */}
              {phoneOtpSent && !phoneVerified && (
                <div className="mt-2.5 p-3 bg-indigo-50/80 border border-indigo-200 rounded-2xl space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-indigo-900 flex items-center gap-1">
                      <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Enter 6-Digit Mobile OTP:</span>
                    </span>
                    {phoneOtpDemo && (
                      <button
                        type="button"
                        onClick={() => setPhoneOtp(phoneOtpDemo)}
                        className="text-indigo-700 hover:text-indigo-900 font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-indigo-200 transition"
                      >
                        Code: <strong>{phoneOtpDemo}</strong> (Click to fill)
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={phoneOtp}
                      onChange={(e) => setPhoneOtp(e.target.value)}
                      placeholder="e.g. 123456"
                      className="flex-1 bg-white border border-indigo-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono tracking-widest text-center focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyPhoneOtp}
                      disabled={verifyingPhoneOtp || !phoneOtp}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50"
                    >
                      {verifyingPhoneOtp ? 'Verifying...' : 'Verify OTP'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Password with Strength Regex */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Password</span>
                </span>
                {password && (
                  <span className={`text-[10px] font-bold ${REGEX.password.test(password) ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {REGEX.password.test(password) ? '✓ Strong' : 'Min 6 chars (letters + numbers)'}
                  </span>
                )}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 chars with letters and numbers"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>

            {/* Technician-Specific Fields & Document Upload */}
            {role === 'provider' && (
              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3.5">
                <div className="flex items-center gap-2 border-b border-emerald-200 pb-2">
                  <Wrench className="w-4 h-4 text-emerald-700" />
                  <span className="font-extrabold text-emerald-900 text-xs">Technician Trade & Licensing Verification</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Registered Business Name</span>
                    {businessName && (
                      <span className={`text-[10px] font-bold ${REGEX.businessName.test(businessName) ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {REGEX.businessName.test(businessName) ? '✓ Valid' : '3-60 chars'}
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Mehta Heavy Electricals"
                    required
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Service Trade</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="1">Electrician Services</option>
                      <option value="2">Plumbing Repair</option>
                      <option value="3">AC Servicing & Repair</option>
                      <option value="4">Appliance Servicing</option>
                      <option value="5">Full Home Deep Clean</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Hourly Rate (₹)</label>
                    <input
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      min="199"
                      step="50"
                      className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Document Upload Input */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Upload Government Trade License / ID Proof</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold">Required for Audit</span>
                  </label>

                  <div className="border-2 border-dashed border-emerald-300 bg-white rounded-2xl p-4 text-center space-y-2 hover:bg-emerald-50/40 transition cursor-pointer relative">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Upload className="w-6 h-6 text-emerald-600 mx-auto" />
                    <div className="text-xs text-slate-700 font-bold">
                      {uploadedFileName ? (
                        <span className="text-emerald-700 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {uploadedFileName}
                        </span>
                      ) : (
                        <span>Click to choose trade license document (PDF/PNG)</span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Electrical License, ITI Certificate, Police Verification, or Aadhar/Govt ID
                    </p>
                  </div>

                  <div className="mt-2">
                    <input
                      type="text"
                      value={verificationDoc}
                      onChange={(e) => setVerificationDoc(e.target.value)}
                      placeholder="Or enter Document / License Number (e.g. DOC-ELEC-MH-2026)"
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 text-sm shadow-md ${
                emailVerified && phoneVerified
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25'
                  : 'bg-indigo-600/90 hover:bg-indigo-700 text-white shadow-indigo-600/20'
              } disabled:opacity-50`}
            >
              <span>{submitting ? 'Creating Account...' : 'Create Account'}</span>
              <UserPlus className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
