import React from 'react';
import { Handshake, Globe2, ExternalLink, ArrowRight, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { Partner, Volet } from '../types';

interface PartnersPageProps {
  partners: Partner[];
  volets: Volet[];
  navigate: (path: string) => void;
}

export const PartnersPage: React.FC<PartnersPageProps> = ({ partners, volets, navigate }) => {
  return (
    <div className="w-full bg-slate-50 min-h-screen">
      
      {/* Header */}
      <div className="bg-slate-900 text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/30 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-500/30 mb-4">
              <Handshake className="w-3.5 h-3.5" />
              Collaborative Ecosystem
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Our Valued Partners
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mt-3 leading-relaxed">
              We collaborate with international agencies, health institutions, and grassroots foundations to maximize life-changing impact across Burundi.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        
        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Logo Wrap */}
                <div className="h-24 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-4 mb-6">
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-lg font-bold text-slate-800">{partner.name}</span>
                  )}
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    {partner.type || 'Institutional Partner'}
                  </span>
                  {partner.volet && (
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                      Volet: {partner.volet.name}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900">
                  {partner.name}
                </h3>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                {partner.website_url ? (
                  <a
                    href={partner.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
                  >
                    <span>Visit Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">Strategic Supporter</span>
                )}

                <button
                  onClick={() => navigate('/contact?subject=Partnership')}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Inquire
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Partner Banner */}
        <section className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Join Our Mission
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">Become an Institutional or Funding Partner</h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Help us expand vocational training infrastructure, supply essential equipment starter kits, and sponsor vulnerable trainee cohorts in Ngozi and Bujumbura.
            </p>
          </div>

          <button
            onClick={() => navigate('/contact?subject=Partnership%20Inquiry')}
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-blue-50 text-blue-950 font-bold text-sm shadow-md transition shrink-0 cursor-pointer"
          >
            Propose Partnership &rarr;
          </button>
        </section>

      </div>
    </div>
  );
};
