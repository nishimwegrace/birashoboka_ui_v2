import React from 'react';
import { Quote, Star,  CheckCircle2 } from 'lucide-react';

export const TestimonialsSection = ({ testimonials, navigate }) => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200">
            Voices of Transformation
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Real Stories from Our Graduates
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Hear directly from the young women and youth whose lives have been transformed through Birashoboka's vocational cohorts.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testi, index) => (
            <div
              key={testi.id || index}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Top Quote Icon & Stars */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Quote className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(testi.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Quote Content from {Testimonial.content} */}
                <p className="text-sm text-slate-700 italic leading-relaxed line-clamp-5">
                  "{testi.content}"
                </p>
              </div>

              {/* Author Details */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                {testi.photo ? (
                  <img
                    src={testi.photo}
                    alt={testi.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-blue-100 shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {testi.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-900 truncate">
                    {testi.name}
                  </div>
                  <div className="text-xs text-blue-600 font-medium truncate">
                    {testi.role || 'Program Alumnus'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Impact Guarantee Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-blue-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="font-bold text-sm sm:text-base">92% Sustainable Employment Rate</div>
              <div className="text-xs text-blue-200">Our graduates either start their own micro-workshop or get hired locally within 6 months.</div>
            </div>
          </div>
          <button
            onClick={() => navigate('/programs')}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-blue-950 font-bold text-xs shrink-0 transition"
          >
            Discover All Programs
          </button>
        </div>

      </div>
    </section>
  );
};
