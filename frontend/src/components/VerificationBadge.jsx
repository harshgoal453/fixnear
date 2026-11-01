import React from 'react';
import { ShieldCheck, Clock, AlertTriangle } from 'lucide-react';

export default function VerificationBadge({ status = 1, showText = true, size = 'sm' }) {
  // status: 1 = verified, 0 = pending, 2 = rejected
  if (status === 1) {
    return (
      <span className={`inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full font-bold backdrop-blur-md shadow-xs shadow-emerald-500/10 ${size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-[11px]'}`}>
        <ShieldCheck className={size === 'lg' ? 'w-4 h-4 text-emerald-400' : 'w-3.5 h-3.5 text-emerald-400'} />
        {showText && 'Verified Pro'}
      </span>
    );
  }

  if (status === 0) {
    return (
      <span className={`inline-flex items-center gap-1.5 bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-full font-bold backdrop-blur-md ${size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-[11px]'}`}>
        <Clock className={size === 'lg' ? 'w-4 h-4 text-amber-400' : 'w-3.5 h-3.5 text-amber-400'} />
        {showText && 'Pending Audit'}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 bg-rose-500/15 text-rose-400 border border-rose-500/30 rounded-full font-bold backdrop-blur-md ${size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-[11px]'}`}>
      <AlertTriangle className={size === 'lg' ? 'w-4 h-4 text-rose-400' : 'w-3.5 h-3.5 text-rose-400'} />
      {showText && 'Unverified'}
    </span>
  );
}
