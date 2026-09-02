import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Handshake, ArrowRight } from 'lucide-react';

export const PartnersCarousel = ({ partners, navigate }) => {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 md:py-20 bg-white border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with manual controllers */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Our Trusted Partners & Supporters
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl">
              Working hand in hand with institutional donors, UN bodies, and health initiatives.
            </p>
          </div>

          {/* Carousel Manual Controllers */}
          <div className="flex items-center gap-2">
            <button
              onClick={scrollLeft}
              aria-label="Scroll Partners Left"
              className="p-2.5 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 transition active:scale-95 shadow-xs cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              aria-label="Scroll Partners Right"
              className="p-2.5 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 transition active:scale-95 shadow-xs cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/partners')}
              className="ml-2 text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              All Partners <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Continuous Auto-Scroll Track + Manual Scroll Area */}
        {/* Rule requirement: No cards, fixed height with relative width to make logos fully visible */}
        {partners.length > 0 ? (
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto no-scrollbar py-4 -mx-4 px-4 scroll-smooth"
          >
            <div className="flex items-center gap-10 sm:gap-14 animate-marquee min-w-full">
              {/* Duplicated list for seamless infinite loop */}
              {[...partners, ...partners, ...partners].map((partner, index) => (
                <div
                  key={`${partner.id}-${index}`}
                  onClick={() => navigate('/partners')}
                  className="shrink-0 flex items-center justify-center transition-all duration-300 cursor-pointer group"
                >
                  {partner.logo ? (
                    <div className="flex items-center justify-center p-2 rounded-xl hover:bg-slate-50 transition">
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        loading="lazy"
                        className="h-16 md:h-20 w-auto object-contain max-w-[200px] transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="h-16 md:h-20 px-6 py-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-700 hover:text-blue-600 transition shadow-2xs whitespace-nowrap">
                      {partner.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-14 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Handshake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No partners listed yet</h3>
            <p className="text-sm text-slate-500 mt-1">
              Our supporting partners will be showcased here.
            </p>
          </div>
        )}

        {/* Bottom invitation */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>Interested in partnering with Birashoboka Center to empower more vulnerable women?</span>
          <button
            type="button"
            onClick={() => navigate('/contact?subject=Partnership')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 underline underline-offset-4 cursor-pointer"
          >
            Propose a Partnership &rarr;
          </button>
        </div>

      </div>
    </section>
  );
};
