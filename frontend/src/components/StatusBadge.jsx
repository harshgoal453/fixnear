import React from 'react';
import { Clock, CheckCircle2, PlayCircle, CheckCheck, XCircle } from 'lucide-react';

export default function StatusBadge({ status }) {
  const configs = {
    requested: {
      label: 'Requested',
      bg: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      icon: Clock
    },
    accepted: {
      label: 'Accepted',
      bg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
      icon: CheckCircle2
    },
    in_progress: {
      label: 'In Progress',
      bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30 animate-pulse',
      icon: PlayCircle
    },
    completed: {
      label: 'Completed',
      bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      icon: CheckCheck
    },
    cancelled: {
      label: 'Cancelled',
      bg: 'bg-slate-800 text-slate-400 border-slate-700',
      icon: XCircle
    },
    open: {
      label: 'Open Complaint',
      bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      icon: XCircle
    },
    resolved: {
      label: 'Resolved Dispute',
      bg: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
      icon: CheckCheck
    }
  };

  const config = configs[status] || {
    label: status,
    bg: 'bg-slate-800 text-slate-300 border-slate-700',
    icon: Clock
  };

  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${config.bg}`}>
      <IconComponent className="w-3.5 h-3.5 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
}
