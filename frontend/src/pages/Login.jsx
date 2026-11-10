import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Wrench, Shield, User, Lock, Mail, ArrowRight, UserPlus, Phone, Briefcase, FileText, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

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

    if (!REGEX.phone.test(phone.trim())) {
      setError('Invalid Mobile Number: Must be a verified 10-digit Indian phone number (+91 9XXXXXXXXX).');
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
      verification_doc: role === 'provider' ? verificationDoc.trim() : undefined
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
              mode === 'login' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`py-2.5 rounded-xl transition ${
              mode === 'register' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-700 p-3.5 rounded-2xl border border-rose-200 text-xs flex items-start gap-2 shadow-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {mode === 'login' ? (
          /* Login Form - Manual Email and Password Entry */
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Email Address</span>
                </span>
                {email && REGEX.email.test(email) && (
                  <span className="text-emerald-600 text-[11px] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Valid Email
                  </span>
                )}
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
          </form>
        ) : (
          /* Register Form with Strict Regex & Technician Document Upload */
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

            {/* Email with Regex Validation */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Email Address</span>
                </span>
                {email && (
                  <span className={`text-[10px] font-bold ${REGEX.email.test(email) ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {REGEX.email.test(email) ? '✓ Verified Format' : 'Invalid email syntax'}
                  </span>
                )}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. vikram@example.in"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>

            {/* Mobile with Phone Regex Validation */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Mobile Number</span>
                </span>
                {phone && phone !== '+91 ' && (
                  <span className={`text-[10px] font-bold ${REGEX.phone.test(phone) ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {REGEX.phone.test(phone) ? '✓ Valid 10-Digit Mobile' : '10 digits (0 to 9)'}
                  </span>
                )}
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98200 12345"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
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
                <div className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Technician Trade Licensing & Document Upload</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Business / Trade Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Apex Electrical Solutions"
                    required
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
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
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-md shadow-indigo-600/25 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
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
