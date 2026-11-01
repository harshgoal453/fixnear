import React from 'react';
import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';
import VerificationBadge from './VerificationBadge';
import { MapPin, Briefcase, Calendar, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function TechCard({ tech, onBookClick }) {
  const isAvailable = tech.availability_status === 'available';

  return (
    <div className="glass-card rounded-3xl border border-slate-800/80 hover:border-indigo-500/50 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Card Top Image / Banner */}
        <div className="relative h-40 overflow-hidden bg-slate-900">
          <img
            src={tech.avatar || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500'}
            alt={tech.business_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Verification Badge */}
          <div className="absolute top-3 left-3">
            <VerificationBadge status={tech.verified} />
          </div>

          {/* Availability Pulse Pill */}
          <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-800 text-[10px] font-semibold text-slate-300 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${
              isAvailable ? 'bg-emerald-400 animate-ping' : tech.availability_status === 'busy' ? 'bg-amber-400' : 'bg-slate-400'
            }`} />
            <span className="capitalize">{tech.availability_status}</span>
          </div>

          {/* Category & Name overlay */}
          <div className="absolute bottom-3 left-4 right-4">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30 backdrop-blur-md">
              {tech.category_name}
            </span>
            <h3 className="font-extrabold text-base text-white mt-1 group-hover:text-indigo-300 transition line-clamp-1">
              {tech.business_name}
            </h3>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <RatingStars rating={tech.rating} count={tech.review_count} />
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-normal">Standard Rate</span>
              <span className="text-emerald-400 font-extrabold text-base">₹{tech.hourly_rate}<span className="text-xs font-normal text-slate-400">/hr</span></span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>{tech.city}</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              <span>{tech.experience_years} yrs exp</span>
            </div>
          </div>

          {tech.bio && (
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {tech.bio}
            </p>
          )}

          {/* Skills tags */}
          {tech.skills && tech.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tech.skills.slice(0, 3).map((skill, idx) => (
                <span key={idx} className="bg-slate-900 text-slate-300 text-[10px] font-medium px-2 py-0.5 rounded-md border border-slate-800">
                  {skill}
                </span>
              ))}
              {tech.skills.length > 3 && (
                <span className="text-[10px] text-slate-500 px-1 py-0.5">+{tech.skills.length - 3} more</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 bg-slate-900/60 border-t border-slate-800/80 flex items-center gap-2">
        <Link
          to={`/technician/${tech.id}`}
          className="flex-1 text-center bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
        >
          <span>View Profile</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
        <button
          onClick={() => onBookClick && onBookClick(tech)}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-3 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-1.5"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book Now</span>
        </button>
      </div>
    </div>
  );
}
