import React from 'react';
import { 
  Users, 
  Handshake, 
  GraduationCap, 
  Calendar, 
  ArrowRight, 
  CheckCircle,
  ShieldCheck,
  Award
} from 'lucide-react';

export const AboutHomeSection = ({
  navigate,
  partnersCount,
  studentsCount = 5000
}) => {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Representative Image + About Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Representative Image with Founded Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-4/3 lg:aspect-5/4 group">
              <img
                src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1000&q=80"
                alt="Birashoboka Vocational Training in Burundi"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
              
              {/* Overlay Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Accredited NGO</div>
                    <div className="text-sm font-bold text-slate-900">Registered since Feb 2021</div>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active in Ngozi & Bujumbura
                </span>
              </div>
            </div>

            {/* Decorative background accent */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-3xl -z-10" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-indigo-50 rounded-full -z-10" />
          </div>

          {/* Right Column: About Description & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200">
                About Birashoboka Center
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                Restoring Dignity, Hope, and Financial Independence
              </h2>
            </div>

            <blockquote className="border-l-4 border-blue-600 pl-4 py-1 text-lg font-semibold text-slate-800 italic">
              "Humanitarian wellbeing is our core priority!"
            </blockquote>

            <p className="text-slate-600 leading-relaxed text-base">
              Founded in February 2021 in Ngozi, Burundi, <strong>Centre de Réhabilitation Birashoboka de Ngozi (CRBN)</strong> and <strong>The Chris Lyricure Center</strong> work to ensure everyone deserves dignity, health, and economic independence regardless of background or gender.
            </p>

            <p className="text-slate-600 leading-relaxed text-sm">
              Through rigorous technical training (soap making, fashion design, IT, salon aesthetics), psychological rehabilitation, and family reintegration, we guide vulnerable young women and community members into sustainable livelihoods.
            </p>

            {/* Key Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-slate-700">Market-aligned vocational training</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-slate-700">Psychosocial therapy & trauma support</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-slate-700">Child protection & anti-fraud governance</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-slate-700">Micro-enterprise incubation & kits</span>
              </div>
            </div>

            {/* Read More CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('/about')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <span>Read More About Us</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Numbers Cards: Opening About Page when clicked */}
        <div className="mt-16 pt-12 border-t border-slate-100">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600">
              Our Measurable Impact
            </h3>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">
              Transforming Lives in Burundi Since 2021
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Stat 1: Beneficiaries */}
            <div
              onClick={() => navigate('/about')}
              className="p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {studentsCount.toLocaleString()}+
              </div>
              <div className="text-sm font-bold text-slate-700 mt-1">Direct Beneficiaries</div>
              <p className="text-xs text-slate-500 mt-1">
                Young women and youth trained & supported
              </p>
            </div>

            {/* Stat 2: Active Programs */}
            <div
              onClick={() => navigate('/about')}
              className="p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                2 Volets
              </div>
              <div className="text-sm font-bold text-slate-700 mt-1">Active Programs</div>
              <p className="text-xs text-slate-500 mt-1">
                10+ practical trade modules & services
              </p>
            </div>

            {/* Stat 3: Partners */}
            <div
              onClick={() => navigate('/about')}
              className="p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Handshake className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {partnersCount || 6}+
              </div>
              <div className="text-sm font-bold text-slate-700 mt-1">Institutional Partners</div>
              <p className="text-xs text-slate-500 mt-1">
                UN agencies, global funds & health bodies
              </p>
            </div>

            {/* Stat 4: Years of Impact */}
            <div
              onClick={() => navigate('/about')}
              className="p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                2021
              </div>
              <div className="text-sm font-bold text-slate-700 mt-1">Founded in Ngozi</div>
              <p className="text-xs text-slate-500 mt-1">
                5+ years of measurable grassroots impact
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
