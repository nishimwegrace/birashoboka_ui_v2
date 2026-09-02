import React, { useState } from 'react';
import { 
  BookOpen, 
  MapPin, 
  Users, 
  ArrowRight, 
   
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

export const ProgramsPage = ({
  volets,
  activities,
  campaigns,
  navigate
}) => {
  const [selectedTarget, setSelectedTarget] = useState('all');

  const filteredVolets = selectedTarget === 'all'
    ? volets
    : volets.filter(v => v.target === selectedTarget || v.target === 'all');

  return (
    <div className="w-full bg-slate-50">
      
      {/* Header */}
      <div className="bg-slate-900 text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/30 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-500/30 mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              Vocational & Psychosocial
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Our Training Programs & Volets
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mt-3 leading-relaxed">
              Empowering vulnerable youth, women, and community members with certified practical trades, life skills, and psychological support across Burundi.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        
        {/* Volet Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredVolets.map((volet) => {
            const voletActs = activities.filter(a => a.volet_id === volet.id);
            const featuredImage = (volet.carousel_images && volet.carousel_images.length > 0)
              ? volet.carousel_images[0]
              : null;

            return (
              <div
                key={volet.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all overflow-hidden flex flex-col justify-between"
              >
                {featuredImage && (
                  <div className="aspect-16/10 overflow-hidden bg-slate-100">
                    <img
                      src={featuredImage}
                      alt={volet.name}
                      className="w-full h-full object-cover object-center hover:scale-105 transition duration-300"
                    />
                  </div>
                )}

                <div className="p-8 flex flex-col flex-1">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-blue-600 text-white">
                      Volet: {volet.name}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {volet.target === 'women' ? 'Women & Girls' : 'Open to All'}
                    </span>
                  </div>

                  <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
                    {volet.subtitle || volet.name}
                  </h2>

                  {volet.slogan && (
                    <p className="text-sm font-semibold text-blue-600 italic mt-1">
                      "{volet.slogan}"
                    </p>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{volet.place}</span>
                  </div>

                  <p className="text-sm text-slate-600 mt-4 leading-relaxed line-clamp-3">
                    {volet.description}
                  </p>

                  {/* Included Activities list */}
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Key Modules:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {voletActs.slice(0, 6).map((act) => (
                        <div key={act.id} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">{act.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => navigate(`/program/${encodeURIComponent(volet.name)}`)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition"
                  >
                    <span>Explore Full {volet.name} Program</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/contact?volet=${volet.id}`)}
                    className="text-xs font-bold text-slate-600 hover:text-blue-600 transition"
                  >
                    Inquire / Enroll &rarr;
                  </button>
                </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* All Activities Catalog */}
        <section className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xs space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Complete Catalog
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              All Vocational & Support Modules
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              Comprehensive overview of all trades and specialized health interventions taught across our centers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map((act) => (
              <div key={act.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{act.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{act.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
