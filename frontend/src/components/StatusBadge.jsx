import React from 'react';
import { Clock, CheckCircle2, PlayCircle, CheckCheck, XCircle } from 'lucide-react';

export default function StatusBadge({ status }) {
  const configs = {
    requested: {
      label: 'Requested',
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Clock
    },
    accepted: {
      label: 'Accepted',
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: CheckCircle2
    },
    in_progress: {
      label: 'In Progress',
      bg: 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse',
      icon: PlayCircle
    },
    completed: {
      label: 'Completed',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      icon: CheckCheck
    },
    cancelled: {
      label: 'Cancelled',
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
      icon: XCircle
    },
    open: {
      label: 'Open Complaint',
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: XCircle
    },
    resolved: {
      label: 'Resolved Dispute',
      bg: 'bg-teal-50 text-teal-800 border-teal-200',
      icon: CheckCheck
    }
  };

  const config = configs[status] || {
    label: status,
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Clock
  };

  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border shadow-2xs ${config.bg}`}>
      <IconComponent className="w-3.5 h-3.5 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
}
