import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ShieldCheck, Clock, Headphones } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white text-slate-600 text-sm border-t border-slate-200">
      {/* Guarantees Banner */}
      <div className="border-b border-slate-200 py-8 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-sm">100% Background Verified</h4>
              <p className="text-xs text-slate-500">All local technicians undergo police and trade license checks in India.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-200">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-sm">Upfront Transparent Pricing</h4>
              <p className="text-xs text-slate-500">No hidden charges. Clear hourly rates in ₹ and upfront quotes.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl border border-amber-200">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-sm">Admin Protection (Harsh)</h4>
              <p className="text-xs text-slate-500">Dispute resolution and complaint tracking built into the platform.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-tr from-indigo-600 to-blue-600 text-white p-2 rounded-xl shadow-xs">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="text-slate-900 font-extrabold text-xl">Fix<span className="text-indigo-600">Near</span></span>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">India 🇮🇳</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-500">
            Har ghar ka trusted local service platform connecting Indian homeowners with verified local technicians.
          </p>
          <p className="text-[11px] text-slate-400">© 2026 FixNear India Platform Inc. Admin: Harsh.</p>
        </div>

        <div>
          <h5 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-4">Popular Services</h5>
          <ul className="space-y-2.5 text-xs text-slate-600">
            <li><Link to="/services?category=electrician" className="hover:text-indigo-600 transition">Licensed Electricians (Mumbai)</Link></li>
            <li><Link to="/services?category=plumber" className="hover:text-indigo-600 transition">Emergency Plumbers (Bengaluru)</Link></li>
            <li><Link to="/services?category=ac-refrigeration" className="hover:text-indigo-600 transition">Split AC Jet Wash (Delhi NCR)</Link></li>
            <li><Link to="/services?category=appliance-repair" className="hover:text-indigo-600 transition">Appliance Repair Services</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-4">Service Providers</h5>
          <ul className="space-y-2.5 text-xs text-slate-500">
            <li><span>Become a Verified Technician</span></li>
            <li><span>Provider Guidelines & Standards</span></li>
            <li><span>Verification Document Checklist</span></li>
          </ul>
        </div>

        <div>
          <h5 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-4">Customer Protection</h5>
          <ul className="space-y-2.5 text-xs text-slate-500">
            <li><span>FixNear ₹10,000 Protection Guarantee</span></li>
            <li><span>Admin Harsh Dispute Resolution</span></li>
            <li><span>Privacy Policy & Terms</span></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
