import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ShieldCheck, Clock, Headphones } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-800/80">
      {/* Guarantees Banner */}
      <div className="border-b border-slate-800/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold">100% Background Verified</h4>
              <p className="text-xs text-slate-400">All local technicians undergo police and license checks in India.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold">Upfront Transparent Pricing</h4>
              <p className="text-xs text-slate-400">No hidden charges. Clear hourly rates in ₹ and estimate quotes.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold">Admin Protection (Harsh)</h4>
              <p className="text-xs text-slate-400">Dispute resolution and complaint tracking built into the platform.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-tr from-indigo-600 to-blue-500 text-white p-2 rounded-xl">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="text-white font-extrabold text-xl">Fix<span className="text-indigo-400">Near</span></span>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">India 🇮🇳</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Har ghar ka trusted local service platform connecting Indian homeowners with verified local technicians.
          </p>
          <p className="text-[11px] text-slate-500">© 2026 FixNear India Platform Inc. Admin: Harsh.</p>
        </div>

        <div>
          <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Popular Services</h5>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/services?category=electrician" className="hover:text-indigo-400 transition">Licensed Electricians (Mumbai)</Link></li>
            <li><Link to="/services?category=plumber" className="hover:text-indigo-400 transition">Emergency Plumbers (Bengaluru)</Link></li>
            <li><Link to="/services?category=ac-refrigeration" className="hover:text-indigo-400 transition">Split AC Jet Wash (Delhi NCR)</Link></li>
            <li><Link to="/services?category=appliance-repair" className="hover:text-indigo-400 transition">Appliance Repair Services</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Service Providers</h5>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li><span>Become a Verified Technician</span></li>
            <li><span>Provider Guidelines & Standards</span></li>
            <li><span>Verification Document Checklist</span></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Customer Protection</h5>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li><span>FixNear ₹10,000 Protection Guarantee</span></li>
            <li><span>Admin Harsh Dispute Resolution</span></li>
            <li><span>Privacy Policy & Terms</span></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
