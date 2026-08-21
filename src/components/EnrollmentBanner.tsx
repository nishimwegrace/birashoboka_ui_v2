import React from 'react';
import { Megaphone, ArrowRight, Calendar, Sparkles, X } from 'lucide-react';
import { Campaign, Volet, Activity } from '../types';

interface EnrollmentBannerProps {
  campaign: Campaign;
  volets: Volet[];
  activities: Activity[];
  navigate: (path: string) => void;
  onDismiss?: () => void;
  floating?: boolean;
}

export const EnrollmentBanner: React.FC<EnrollmentBannerProps> = ({
  campaign,
  volets,
  activities,
  navigate,
  onDismiss,
  floating = false
}) => {
  // If campaign is explicitly closed, do not render
  if (campaign.is_open === false) return null;

  const targetVolet = volets.find(v => v.id === campaign.volet_id);
  const targetActivity = activities.find(a => a.id === campaign.activity_id);

  const voletNameParam = encodeURIComponent(targetVolet?.name || 'CRBN');
  const activityIdParam = campaign.activity_id || targetActivity?.id || 1;
  const applyPath = `/apply/${voletNameParam}/${activityIdParam}`;

  return (
    <div 
      className={`w-full z-40 transition-all duration-300 ${
        floating 
          ? 'relative bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white shadow-xl border-b border-blue-500' 
          : 'w-full bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-3 px-4 sm:px-6 lg:px-8 border-b border-indigo-700/50 shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3.5 py-2">
        <div className="flex items-center gap-3.5 text-left w-full md:w-auto">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-400/20 animate-pulse">
              <Megaphone className="w-5 h-5 text-slate-950" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950">
                Enrollment Open · {campaign.edition}
              </span>
              {campaign.place && (
                <span className="text-xs text-blue-200 font-medium hidden sm:inline">
                  📍 {campaign.place}
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-white mt-0.5 line-clamp-1">
              {campaign.title}
            </p>
            {campaign.registration_end && (
              <div className="flex items-center gap-2 text-xs text-blue-200 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                <span>Admissions close: <strong className="text-white">{campaign.registration_end}</strong></span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={() => navigate(applyPath)}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-400/30 transition-transform active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>Apply Online Now</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-2 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="Close Banner"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
