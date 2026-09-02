import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Users, 
  Tag, 
  Calendar, 
   
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Scissors,
  Laptop,
  Briefcase,
  HeartPulse,
  HeartHandshake,
  Home,
  ShieldCheck,
  Brain,
  Layers,
  GraduationCap
} from 'lucide-react';

export const VoletDetailPage = ({
  voletNameOrId,
  volets,
  posts,
  activities,
  campaigns,
  navigate
}) => {
  // Find volet by name (case-insensitive) or ID
  const decoded = decodeURIComponent(voletNameOrId).toLowerCase();
  const volet = volets.find(
    v => String(v.id) === decoded || v.name.toLowerCase() === decoded
  ) || volets[0];

  const voletPosts = posts.filter(p => p.volet_id === volet.id);
  const voletActivities = activities.filter(a => a.volet_id === volet.id);
  const voletCampaigns = campaigns.filter(c => c.volet_id === volet.id);

  // Carousel images from the volet's own carousel_images array
  const carouselImages = (volet.carousel_images && volet.carousel_images.length > 0
    ? volet.carousel_images
    : []
  ).filter(Boolean);

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    setActiveSlide(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [volet.id]);

  const handlePrevSlide = () => {
    if (carouselImages.length === 0) return;
    setActiveSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const handleNextSlide = () => {
    if (carouselImages.length === 0) return;
    setActiveSlide((prev) => (prev + 1) % carouselImages.length);
  };

  return (
    <div className="w-full bg-slate-50">
      
      {/* Top Banner Carousel with Volet carousel_images */}
      <div className="relative w-full h-[400px] sm:h-[480px] bg-slate-950 overflow-hidden">
        {carouselImages.length > 0 ? (
          carouselImages.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-700 ${
                idx === activeSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <img
                src={img}
                alt={`${volet.name} training photo`}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/30" />
            </div>
          ))
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-950" />
        )}

        {/* Overlay Content */}
        <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
            <button 
              onClick={() => navigate('/programs')}
              className="hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> All Programs
            </button>
            <span>/</span>
            <span className="text-blue-400 font-bold">{volet.name}</span>
          </div>

          {/* Banner Volet Title & Slogan */}
          <div className="max-w-2xl text-white space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600 text-white shadow-sm">
                Volet: {volet.name}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-xs">
                Target: {volet.target === 'women' ? 'Vulnerable Young Women & Girls' : 'Open to All Community Youth'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              {volet.subtitle || volet.name}
            </h1>

            {volet.slogan && (
              <p className="text-lg sm:text-xl text-blue-200 font-medium italic">
                "{volet.slogan}"
              </p>
            )}

            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 pt-1">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{volet.place}</span>
            </div>
          </div>

          {/* Carousel Arrows if multiple images */}
          {carouselImages.length > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Photo {activeSlide + 1} of {carouselImages.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevSlide}
                  aria-label="Previous Slide"
                  className="p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white border border-white/20 backdrop-blur-xs"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextSlide}
                  aria-label="Next Slide"
                  className="p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white border border-white/20 backdrop-blur-xs"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        
        {/* Volet Description & Target Overview */}
        <section className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Program Mission & Scope
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                About the {volet.name}
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                {volet.description}
              </p>
            </div>

            <div className="lg:col-span-4 p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3.5">
              <h3 className="font-bold text-slate-900 text-sm">Key Program Details</h3>
              <div className="text-xs space-y-2 text-slate-600">
                <div><strong>Primary Beneficiaries:</strong> {volet.target === 'women' ? 'Young women, teenage mothers, & GBV survivors' : 'Youth, adults & career seekers'}</div>
                <div><strong>Campus Locations:</strong> {volet.place}</div>
                <div><strong>Graduation Certification:</strong> Recognized vocational qualification</div>
                <div><strong>Starter Kits:</strong> Provided upon successful module completion</div>
              </div>
              <button
                onClick={() => navigate('/contact?intent=enroll')}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition"
              >
                Apply for Enrollment
              </button>
            </div>
          </div>
        </section>

        {/* Active Open Campaigns / Registration Banner if available */}
        {voletCampaigns.length > 0 && (
          <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
                </div>
                <h3 className="text-2xl text-white font-extrabold">{voletCampaigns[0].title}</h3>
                <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl">{voletCampaigns[0].description}</p>
                <div className="text-xs text-white/90 pt-1">
                  <strong>Registration:</strong> {voletCampaigns[0].registration_start} to {voletCampaigns[0].registration_end} · <strong>Location:</strong> {voletCampaigns[0].place}
                </div>
              </div>
              <button
                onClick={() => navigate(`/contact?campaign=${voletCampaigns[0].id}`)}
                className="px-6 py-3 rounded-2xl bg-white text-emerald-950 font-bold text-sm shadow-md hover:bg-emerald-50 transition shrink-0"
              >
                Register Now
              </button>
            </div>
          </section>
        )}

        {/* Services & Activities Cards from that Volet */}
        <section className="space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Modules & Services
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Practical Activities in {volet.name}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Every course combines hands-on trade practice with mentorship and life skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {voletActivities.map((act) => (
              <div
                key={act.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {act.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {act.description}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                  <span>Certified Module</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Related News Posts for this Volet */}
        {voletPosts.length > 0 && (
          <section className="space-y-8 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Field Dispatches
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Recent Stories from {volet.name}
                </h2>
              </div>
              <button
                onClick={() => navigate('/news')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                All News <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {voletPosts.slice(0, 3).map((post) => (
                <article
                  key={post.id}
                  onClick={() => navigate(`/news/${post.id}`)}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition cursor-pointer group flex flex-col justify-between"
                >
                  <div className="aspect-16/10 overflow-hidden bg-slate-100">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">
                        {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Recent'}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {post.description}
                      </p>
                    </div>
                    <div className="mt-4 text-xs font-bold text-blue-600 flex items-center gap-1">
                      Read Full Post <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
