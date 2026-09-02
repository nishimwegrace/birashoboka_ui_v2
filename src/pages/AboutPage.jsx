import React from 'react';
import { 
  Target, 
  Eye, 
  Heart, 
  ShieldCheck, 
  Sparkles,
  Users, 
  CheckCircle2, 
  Globe2, 
  Mail,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import team from "../assets/team.png";
export const AboutPage = ({ members, partners, navigate }) => {
  const coreValues = [
    {
      title: 'Integrity & Transparency',
      desc: 'We adhere to uncompromised financial governance, strict anti-fraud policies, and honest stewardship of donor funds.',
      icon: ShieldCheck
    },
    {
      title: 'Human Dignity & Care',
      desc: 'Every individual—regardless of background, vulnerability, or past trauma—deserves unconditional respect and compassionate listening.',
      icon: Heart
    },
    {
      title: 'Innovation & Excellence',
      desc: 'Developing market-relevant, modern curricula in artisanal soap manufacturing, fashion tailoring, and computer technologies.',
      icon: Sparkles
    },
    {
      title: 'Collaboration & Partnerships',
      desc: 'Working closely with local health authorities, international UN agencies, and grassroots community leaders.',
      icon: Users
    },
    {
      title: 'Commitment to Empowerment',
      desc: 'Fostering long-term financial self-reliance rather than temporary dependency, equipping graduates with lifelong marketable skills.',
      icon: Target
    },
    {
      title: 'Community Inclusion',
      desc: 'Ensuring safe, accessible spaces for vulnerable young mothers, school dropouts, and youth recovering from substance dependence.',
      icon: Globe2
    }
  ];

  return (
    <div className="w-full bg-slate-50">
      
      {/* Page Header */}
      <div className="bg-slate-900 text-white py-16 sm:py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              About Birashoboka Center
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed">
              Centre de Réhabilitation Birashoboka de Ngozi (CRBN) and The Chris Lyricure Center are dedicated to holistic psychosocial healing and vocational training in Burundi.
            </p>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        
        {/* 1. Detailed About Description & Background */}
        <section data-aos="fade-up" data-aos-duration="600" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              A Safe Haven for Renewal and Economic Autonomy
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Founded on February 10, 2021, <strong>Birashoboka Center</strong> was created in response to the pressing socio-economic challenges faced by vulnerable young women, teenage mothers, and youth in Ngozi and Bujumbura.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              The name <em>"Birashoboka"</em> in Kirundi translates to <strong>"It is Possible"</strong>—a conviction that drives our team every single day. We operate two complementary pillars:
            </p>
            <ul className="space-y-2.5 pt-1 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>CRBN (Centre de Réhabilitation Birashoboka de Ngozi):</strong> Focused on psychosocial therapy, addictology recovery, family mediation, and hygiene cosmetics production.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>The Chris Lyricure Center:</strong> Open technical vocational institute in Maramvya & Bujumbura specializing in modern tailoring, computer literacy,culinary arts and beauty salon entrepreneurship.</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-200 aspect-4/3">
              <img
                src={team}
                alt="Birashoboka Center training session"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/85 backdrop-blur-md p-4 rounded-2xl text-white">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-400">Our Slogan</div>
                <div className="text-sm font-semibold italic mt-0.5">"Humanitarian wellbeing is our priority!"</div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Mission & Vision */}
        <section data-aos="fade-up" data-aos-duration="600" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mission Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4 relative overflow-hidden group hover:border-blue-300 transition">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">Our Mission</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              To accompany vulnerable young girls, women, and marginalized youth through holistic rehabilitation—combining specialized psychological care, social mediation, and certified technical vocational education—empowering them to achieve lasting financial independence and constructive reintegration into family and community life.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-blue-600">
              <CheckCircle2 className="w-4 h-4" /> <span>Holistic Support · Practical Skills · Reintegration</span>
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4 relative overflow-hidden group hover:border-blue-300 transition">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">Our Vision</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              A Burundian society where every vulnerable individual, irrespective of past hardships or socio-economic barriers, enjoys full human dignity, equitable access to quality vocational skills, and the capacity to build a prosperous, self-reliant livelihood for themselves and future generations.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-indigo-600">
              <CheckCircle2 className="w-4 h-4" /> <span>Dignity · Resilience · Sustainable Growth</span>
            </div>
          </div>

        </section>

        {/* 3. HVPM and its details (Static from online version) */}
        <section data-aos="fade-up" data-aos-duration="600" className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-800">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              HVP Makebuko (HVPM) Collaboration
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Birashoboka Center maintains deep institutional roots and active partnerships with <strong>HVP Makebuko (Hôpital / Centre de Réadaptation pour Personnes Vulnérables)</strong>.
            </p>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Originally founded to provide orthopedic care, medical rehabilitation, and socio-educational assistance to individuals with physical impairments, the HVPM network has been a pillar of community solidarity in Gitega and across Burundi. Through shared expertise, Birashoboka Center extends this humanitarian legacy into urban and rural vocational hubs, ensuring inclusive access to training and mental wellness for all beneficiaries.
            </p>
            <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Inclusive Physical & Vocational Training</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Medical & Psychological Coordination</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Shared Community Legacy</span>
            </div>
          </div>
        </section>

        {/* 4. Team Section: Circular shape photos, name, position ({Member} entity) */}
        <section data-aos="fade-up" data-aos-duration="600" className="space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Our Leadership & Staff
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Meet the Dedicated Team
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Passionate educators, clinical psychologists, and program coordinators driving community change.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {members.map((member, idx) => (
              <div 
                key={member.id} 
                data-aos="zoom-in" 
                data-aos-delay={idx * 50} 
                className="flex flex-col items-center text-center group"
              >
                {/* Circular photo as explicitly requested */}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100 group-hover:scale-105 group-hover:border-blue-500 transition-all duration-300">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-3xl font-bold">
                      {(member.name || '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h4 className="text-base font-bold text-slate-900 mt-4 leading-snug">
                  {member.name}
                </h4>
                <p className="text-xs font-semibold text-blue-600 mt-1 line-clamp-2">
                  {member.position}
                </p>
                {member.bio && (
                  <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-3 leading-relaxed">
                    {member.bio}
                  </p>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="mt-2 text-[11px] text-slate-400 hover:text-blue-600 flex items-center gap-1 transition"
                  >
                    <Mail className="w-3 h-3" /> Contact
                  </a>
                )}
              </div>
            ))}
          </div>
          {members.length === 0 && (
            <div className="text-center py-14 bg-slate-50 rounded-3xl border border-slate-200">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No team members listed yet</h3>
              <p className="text-sm text-slate-500 mt-1">
                Our leadership and staff profiles will appear here.
              </p>
            </div>
          )}
        </section>

        {/* 5. Core Values */}
        <section data-aos="fade-up" data-aos-duration="600" className="space-y-8 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Guiding Principles
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Our Core Organizational Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{val.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{val.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom Call to Action */}
        <section data-aos="fade-up" data-aos-duration="600" className="text-center p-10 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100">Ready to Support or Join Our Programs?</h3>
          <p className="text-blue-100 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Explore our open training cohorts or get in touch to propose institutional partnerships.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/programs')}
              className="px-6 py-3 rounded-xl bg-white hover:bg-blue-50 text-blue-900 font-bold text-sm shadow-md transition"
            >
              Explore Vocational Programs
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-3 rounded-xl bg-blue-900/60 hover:bg-blue-900 text-white font-semibold text-sm border border-blue-400/40 transition"
            >
              Contact Our Team
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
