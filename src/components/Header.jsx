import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  ChevronDown, 
  Menu, 
  X, 
  Sparkles, 
  ArrowRight, 
  SlidersHorizontal,
  GraduationCap,
  Building2,
  ShieldCheck,
  UserCheck,
  PhoneCall,
  Compass,
  Home,
  Info,
  Layers,
  FileText,
  Image as ImageIcon,
  ChevronRight
} from 'lucide-react';
import birashobokaLogo from '../assets/birashoboka_logo.png';
import hvpLogo from '../assets/hvp_logo.png';

export const Header = ({
  currentPath,
  navigate,
  volets,
  campaigns = [],
  isApiLive,
  onOpenApiSettings
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProgramsOpen, setMobileProgramsOpen] = useState(true);
  const [programsDropdownOpen, setProgramsDropdownOpen] = useState(false);
  const [hoveredVoletId, setHoveredVoletId] = useState(volets[0]?.id || 1);

  const hasOpenCampaign = campaigns.some(c => c.is_open !== false);
  const activeVolet = volets.find(v => v.id === hoveredVoletId) || volets[0];

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setProgramsDropdownOpen(false);
  };

  const isActive = (path) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  // Lock body scroll when mobile off-canvas is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      {/* Main Navigation Bar */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex h-22 items-center justify-between gap-4">
          
          {/* Part 1: Logos (HVP Makebuko & Birashoboka Center) */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavClick('/')}
              className="flex items-center gap-3 sm:gap-4 transition hover:opacity-90 focus:outline-none cursor-pointer"
              aria-label="Birashoboka Center & HVP Makebuko Home"
              title="Birashoboka Center (Initié par HVP Makebuko)"
            >
              <img 
                src={hvpLogo} 
                alt="HVP Makebuko" 
                className="h-18 sm:h-18 w-auto object-contain shrink-0" 
              />
              <div className="h-8 sm:h-10 w-px bg-slate-200" />
              <img 
                src={birashobokaLogo} 
                alt="Birashoboka Center" 
                className="h-18 sm:h-18 w-auto object-contain shrink-0" 
              />
            </button>
          </div>

          {/* Part 2: Navigation Items with Enhanced Font Readability */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 text-[15px] font-semibold text-slate-700">
            <button
              onClick={() => handleNavClick('/')}
              className={`px-3 py-2 rounded-xl transition ${
                isActive('/') && currentPath === '/'
                  ? 'text-blue-600 font-bold bg-blue-50/80'
                  : 'hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('/about')}
              className={`px-3 py-2 rounded-xl transition ${
                isActive('/about')
                  ? 'text-blue-600 font-bold bg-blue-50/80'
                  : 'hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              About
            </button>

            {/* Programs with Pop-down Card on Hover */}
            <div 
              className="relative"
              onMouseEnter={() => setProgramsDropdownOpen(true)}
              onMouseLeave={() => setProgramsDropdownOpen(false)}
            >
              <button
                onClick={() => handleNavClick('/programs')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
                  isActive('/program') || isActive('/programs')
                    ? 'text-blue-600 font-bold bg-blue-50/80'
                    : 'hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <span>Programs</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${programsDropdownOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
              </button>

              {/* Pop-down Card containing {Volets} from Database */}
              {programsDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[660px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Volets de Formation & Réhabilitation</span>
                      <p className="text-xs text-slate-500 font-normal">Holistic vocational training and psychosocial therapy</p>
                    </div>
                    <button 
                      onClick={() => handleNavClick('/programs')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                    >
                      View All Programs <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-12 gap-4">
                    {/* Volets List Column */}
                    <div className="col-span-5 space-y-2 border-r border-slate-100 pr-3">
                      {volets.map((volet) => {
                        const isHovered = (activeVolet?.id === volet.id);
                        return (
                          <div
                            key={volet.id}
                            onMouseEnter={() => setHoveredVoletId(volet.id)}
                            onClick={() => handleNavClick(`/program/${encodeURIComponent(volet.name)}`)}
                            className={`p-3 rounded-xl transition cursor-pointer text-left ${
                              isHovered 
                                ? 'bg-blue-50 border border-blue-200' 
                                : 'hover:bg-slate-50 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`text-sm font-bold ${isHovered ? 'text-blue-700' : 'text-slate-900'}`}>
                                {volet.name}
                              </span>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
                                {volet.target === 'women' ? 'Women & Girls' : 'Open to All'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1 mt-1 font-normal">
                              {volet.slogan || volet.subtitle}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Volet Preview Card Column */}
                    <div className="col-span-7 pl-1">
                      {activeVolet ? (
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 flex flex-col h-full justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-blue-600 text-white">
                                {activeVolet.name}
                              </span>
                              <span className="text-xs text-slate-500 font-medium">{activeVolet.place}</span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 mt-2">
                              {activeVolet.subtitle || activeVolet.name}
                            </h4>
                            <p className="text-xs text-slate-600 mt-1 line-clamp-3 leading-relaxed font-normal">
                              {activeVolet.description}
                            </p>

                            {/* Activities from Volet */}
                            <div className="mt-3 pt-3 border-t border-slate-200/60">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                                Included Activities:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {(activeVolet.activities || []).slice(0, 4).map((act, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-medium"
                                  >
                                    <Sparkles className="w-2.5 h-2.5 text-blue-500" />
                                    {act.title}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleNavClick(`/program/${encodeURIComponent(activeVolet.name)}`)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                            >
                              Explore {activeVolet.name} <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Apply Navigation Link */}
            <button
              onClick={() => handleNavClick('/apply')}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
                isActive('/apply')
                  ? 'text-amber-700 font-bold bg-amber-50/80'
                  : 'hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-amber-600" />
              <span>Apply</span>
              {hasOpenCampaign && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase animate-pulse">
                  Open
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavClick('/news')}
              className={`px-3 py-2 rounded-xl transition ${
                isActive('/news')
                  ? 'text-blue-600 font-bold bg-blue-50/80'
                  : 'hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              News
            </button>

            <button
              onClick={() => handleNavClick('/gallery')}
              className={`px-3 py-2 rounded-xl transition ${
                isActive('/gallery')
                  ? 'text-blue-600 font-bold bg-blue-50/80'
                  : 'hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              Gallery
            </button>

            <button
              onClick={() => handleNavClick('/partners')}
              className={`px-3 py-2 rounded-xl transition ${
                isActive('/partners')
                  ? 'text-blue-600 font-bold bg-blue-50/80'
                  : 'hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              Partners
            </button>

            <button
              onClick={() => handleNavClick('/contact')}
              className={`px-3 py-2 rounded-xl transition ${
                isActive('/contact')
                  ? 'text-blue-600 font-bold bg-blue-50/80'
                  : 'hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Part 3: Action (Donate Button & Mobile Toggle) */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleNavClick('/contact?intent=donate')}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 hover:shadow-md transition active:scale-98 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white text-white" />
              <span>Donate</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* OFF-CANVAS DRAWER THAT POPS FROM RIGHT */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop Overlay */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            aria-hidden="true"
          />

          {/* Off-Canvas Panel popping from the Right */}
          <div className="fixed inset-y-0 right-0 w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-50 transform transition-transform duration-300 ease-out animate-in slide-in-from-right overflow-hidden">
            
            {/* Top Bar of Drawer */}
            <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <img 
                  src={hvpLogo} 
                  alt="HVP Makebuko" 
                  className="h-9 w-auto object-contain shrink-0" 
                />
                <div className="h-6 w-px bg-slate-200" />
                <img 
                  src={birashobokaLogo} 
                  alt="Birashoboka Center" 
                  className="h-9 w-auto object-contain shrink-0" 
                />
              </div>

              {/* Close Button */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition cursor-pointer border border-slate-200/70"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Navigation List */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-2">
              
              <button
                onClick={() => handleNavClick('/')}
                className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-base transition flex items-center justify-between cursor-pointer ${
                  currentPath === '/' ? 'bg-blue-50 text-blue-600 border border-blue-200/60' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                  <span>Home</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </button>

              <button
                onClick={() => handleNavClick('/about')}
                className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-base transition flex items-center justify-between cursor-pointer ${
                  currentPath === '/about' ? 'bg-blue-50 text-blue-600 border border-blue-200/60' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-slate-400" />
                  <span>About & Team</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </button>

              {/* Apply / Inscription Button Highlighted */}
              <button
                onClick={() => handleNavClick('/apply')}
                className={`w-full text-left px-4 py-3.5 rounded-2xl font-bold text-base transition flex items-center justify-between cursor-pointer ${
                  currentPath === '/apply' 
                    ? 'bg-amber-50 text-amber-900 border border-amber-300' 
                    : 'bg-amber-500/10 text-amber-900 hover:bg-amber-500/20 border border-amber-400/30'
                }`}
              >
                <span className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-amber-600" />
                  <span className="font-extrabold">Apply for Training</span>
                </span>
                {hasOpenCampaign ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase shadow-xs">
                    Open
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-amber-500" />
                )}
              </button>

              {/* Programs & Volets Accordion */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-2 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setMobileProgramsOpen(!mobileProgramsOpen)}
                  className="w-full flex items-center justify-between p-2.5 font-bold text-slate-900 text-sm cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>Programs & Volets</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${mobileProgramsOpen ? 'rotate-180' : ''}`} />
                </button>

                {mobileProgramsOpen && (
                  <div className="space-y-1.5 pt-2 pb-1 px-1">
                    {volets.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => handleNavClick(`/program/${encodeURIComponent(v.name)}`)}
                        className="w-full text-left p-2.5 rounded-xl bg-white border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/40 transition flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <div className="font-bold text-xs text-slate-900">{v.name}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">{v.slogan || v.subtitle}</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                      </button>
                    ))}
                    <button
                      onClick={() => handleNavClick('/programs')}
                      className="w-full text-center py-2 text-xs font-bold text-blue-600 hover:text-blue-800 transition cursor-pointer"
                    >
                      View All Programs Overview &rarr;
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleNavClick('/news')}
                className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-base transition flex items-center justify-between cursor-pointer ${
                  currentPath === '/news' ? 'bg-blue-50 text-blue-600 border border-blue-200/60' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-slate-400" />
                  <span>News & Articles</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </button>

              <button
                onClick={() => handleNavClick('/gallery')}
                className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-base transition flex items-center justify-between cursor-pointer ${
                  currentPath === '/gallery' ? 'bg-blue-50 text-blue-600 border border-blue-200/60' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <ImageIcon className="w-5 h-5 text-slate-400" />
                  <span>Media Gallery</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </button>

              <button
                onClick={() => handleNavClick('/partners')}
                className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-base transition flex items-center justify-between cursor-pointer ${
                  currentPath === '/partners' ? 'bg-blue-50 text-blue-600 border border-blue-200/60' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-slate-400" />
                  <span>Partners & Donors</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </button>

              <button
                onClick={() => handleNavClick('/contact')}
                className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-base transition flex items-center justify-between cursor-pointer ${
                  currentPath === '/contact' ? 'bg-blue-50 text-blue-600 border border-blue-200/60' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <PhoneCall className="w-5 h-5 text-slate-400" />
                  <span>Contact & Centers</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </button>
            </div>

            {/* Bottom Actions Drawer Footer */}
            <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50 space-y-3 shrink-0">
              <button
                onClick={() => handleNavClick('/contact?intent=donate')}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-md hover:from-blue-700 hover:to-indigo-700 transition cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Make a Donation</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNavClick('/admin')}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-amber-300 border border-slate-800 transition cursor-pointer hover:bg-slate-800"
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Portal</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenApiSettings();
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-white border border-slate-300 py-2.5 text-xs font-bold text-slate-700 transition cursor-pointer hover:bg-slate-100"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                  <span>API Settings</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
