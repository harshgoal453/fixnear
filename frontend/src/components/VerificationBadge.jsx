import React from 'react';
import { ShieldCheck, Clock, AlertTriangle } from 'lucide-react';

export default function VerificationBadge({ status = 1, showText = true, size = 'sm' }) {
  // status: 1 = verified, 0 = pending, 2 = rejected
  if (status === 1) {
    return (
      <span className={`inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full font-bold shadow-2xs ${size === 'lg' ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-[11px]'}`}>
        <ShieldCheck className={size === 'lg' ? 'w-4 h-4 text-emerald-600' : 'w-3.5 h-3.5 text-emerald-600'} />
        {showText && 'Verified Pro'}
      </span>
    );
  }

  if (status === 0) {
    return (
      <span className={`inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-300 rounded-full font-bold shadow-2xs ${size === 'lg' ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-[11px]'}`}>
        <Clock className={size === 'lg' ? 'w-4 h-4 text-amber-600' : 'w-3.5 h-3.5 text-amber-600'} />
        {showText && 'Pending Audit'}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 bg-rose-50 text-rose-800 border border-rose-300 rounded-full font-bold shadow-2xs ${size === 'lg' ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-[11px]'}`}>
      <AlertTriangle className={size === 'lg' ? 'w-4 h-4 text-rose-600' : 'w-3.5 h-3.5 text-rose-600'} />
      {showText && 'Unverified'}
    </span>
  );
}
