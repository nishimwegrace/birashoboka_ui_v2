import React, { useState } from 'react';
import { 
  Handshake, 
  Globe2, 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck, 
  Heart, 
  Sparkles,
  Building2,
  CheckCircle2,
  Users,
  Award,
  Layers,
  Filter,
  Search
} from 'lucide-react';

export const PartnersPage = ({ partners = [], volets = [], navigate }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeVoletFilter, setActiveVoletFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract categories dynamically
  const categories = ['all', ...new Set(partners.map(p => p.type).filter(Boolean))];

  // Filter partners
  const filteredPartners = partners.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.type === activeCategory;
    const matchesVolet = activeVoletFilter === 'all' || String(p.volet_id) === String(activeVoletFilter);
    const matchesSearch = searchQuery === '' || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.type && p.type.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesVolet && matchesSearch;
  });

  return (
    <div className="w-full bg-slate-50 min-h-screen font-sans">
      
      {/* Premium Hero Header */}
      <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-20 sm:py-24 overflow-hidden border-b border-slate-800">
        {/* Ambient background glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none">
              Our Valued Partners
            </h1>

            <p className="text-slate-300 text-base sm:text-xl font-normal leading-relaxed">
              Together with UN agencies, international development funds, health institutions, and local foundations, we drive sustainable socio-economic impact across Burundi.
            </p>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-400 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xl font-extrabold text-white block leading-none">{partners.length}+</span>
                  <span className="text-xs text-slate-400 font-medium">Strategic Partners</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xl font-extrabold text-white block leading-none">100%</span>
                  <span className="text-xs text-slate-400 font-medium">Transparency & Governance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Filter Controls Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search partner organization by name or sector..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            {/* Volet Filter Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                Program Volet:
              </span>
              <select
                value={activeVoletFilter}
                onChange={(e) => setActiveVoletFilter(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white"
              >
                <option value="all">All Volets & Centers</option>
                {volets.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.subtitle || v.slogan})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Partners Grid */}
        {filteredPartners.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No partners found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              No matching partners fit your search criteria. Try clearing the filter or search term.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); setActiveVoletFilter('all'); }}
              className="mt-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs hover:bg-blue-100 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPartners.map((partner) => {
              const matchedVolet = volets.find(v => String(v.id) === String(partner.volet_id)) || partner.volet;

              return (
                <div
                  key={partner.id}
                  className="group bg-white rounded-3xl p-7 border border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Subtle top accent gradient */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-white" />

                  <div>
                    {/* Partner Logo Card Container */}
                    <div className="h-28 rounded-2xl bg-transparent border border-slate-200/80 flex items-center justify-center p-5 mb-6 group-hover:bg-white group-hover:shadow-inner transition">
                      {partner.logo ? (
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-center space-y-1">
                          <Building2 className="w-8 h-8 text-blue-600 mx-auto opacity-70" />
                          <span className="text-sm font-extrabold text-slate-800 block leading-tight">{partner.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Metadata Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200/80">
                        {partner.type || 'Institutional Partner'}
                      </span>
                      {matchedVolet && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                          {matchedVolet.name}
                        </span>
                      )}
                    </div>

                    {/* Organization Title */}
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                      {partner.name}
                    </h3>
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                    {partner.website_url ? (
                      <a
                        href={partner.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition"
                      >
                        <span>Visit Official Site</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Verified Alliance
                      </span>
                    )}

                    <button
                      onClick={() => navigate(`/contact?subject=Partnership%20Inquiry%20-${encodeURIComponent(partner.name)}`)}
                      className="text-xs font-bold text-slate-500 hover:text-blue-600 transition cursor-pointer"
                    >
                      Collaborate &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

