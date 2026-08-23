import React, { useState, useEffect, useRef } from 'react';
import { 
   
  Calendar, 
  ArrowRight, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Megaphone,
  CheckCircle2,
  Clock,
  MapPin
} from 'lucide-react';
import { EnrollmentBanner } from '../components/EnrollmentBanner.jsx';

export const NewsPage = ({
  posts,
  campaigns,
  volets,
  activities = [],
  navigate
}) => {
  const [selectedVoletId, setSelectedVoletId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  
  // Infinite scroll simulation state
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loaderRef = useRef(null);

  // Carousel banner posts (top 5 posts)
  const carouselPosts = posts.slice(0, 5);

  // Active campaign in progress
  const activeCampaign = campaigns[0];

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesVolet = selectedVoletId === null || post.volet_id === selectedVoletId;
    const matchesQuery = !searchQuery.trim() || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesVolet && matchesQuery;
  });

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && visibleCount < filteredPosts.length && !isLoadingMore) {
        setIsLoadingMore(true);
        setTimeout(() => {
          setVisibleCount(prev => prev + 6);
          setIsLoadingMore(false);
        }, 600);
      }
    }, { threshold: 0.1 });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [visibleCount, filteredPosts.length, isLoadingMore]);

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      
      {/* 1. Open Campaign / Registration Notification Banner if active */}
      {activeCampaign && (
        <EnrollmentBanner
          campaign={activeCampaign}
          volets={volets}
          activities={activities}
          navigate={navigate}
          floating={false}
        />
      )}

      {/* 2. Dynamic Posts Carousel Banner */}
      {carouselPosts.length > 0 && (
        <div className="relative w-full h-[360px] sm:h-[440px] bg-slate-950 overflow-hidden">
          {carouselPosts.map((post, idx) => (
            <div
              key={post.id || idx}
              className={`absolute inset-0 transition-opacity duration-700 ${
                idx === activeBannerIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <img
                src={post.featured_image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1400&q=80'}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/30" />
            </div>
          ))}

          {/* Banner content */}
          <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
            <div className="max-w-2xl text-white space-y-3">
              <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider">
                Breaking Update · {carouselPosts[activeBannerIndex]?.volet?.name || 'Birashoboka'}
              </span>
              <h2 
                onClick={() => navigate(`/news/${carouselPosts[activeBannerIndex]?.id}`)}
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight cursor-pointer hover:text-blue-200 transition line-clamp-2"
              >
                {carouselPosts[activeBannerIndex]?.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-xl">
                {carouselPosts[activeBannerIndex]?.description}
              </p>
            </div>

            {/* Controls */}
            <div className="absolute right-4 sm:right-8 bottom-8 flex items-center gap-2">
              <button
                onClick={() => setActiveBannerIndex(prev => (prev - 1 + carouselPosts.length) % carouselPosts.length)}
                aria-label="Previous News"
                className="p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-xs transition cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveBannerIndex(prev => (prev + 1) % carouselPosts.length)}
                aria-label="Next News"
                className="p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-xs transition cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Articles Stream with Infinite Scroll & Lazy Loading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Volet filter tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <button
              onClick={() => setSelectedVoletId(null)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                selectedVoletId === null
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Volets ({posts.length})
            </button>
            {volets.map((v) => {
              const count = posts.filter(p => p.volet_id === v.id).length;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVoletId(v.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                    selectedVoletId === v.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {v.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news or topics..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-hidden transition"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Posts Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {visiblePosts.map((post, index) => {
            const formattedDate = post.published_at
              ? new Date(post.published_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : 'Recent';

            return (
              <article
                key={post.id || index}
                onClick={() => navigate(`/news/${post.id}`)}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                  <img
                    src={post.featured_image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3.5 left-3.5">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/95 backdrop-blur-md text-blue-700 shadow-sm border border-slate-100">
                      {post.volet?.name || 'Birashoboka'}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-2.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formattedDate}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {post.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Infinite Scroll Trigger / Loading Indicator */}
        <div ref={loaderRef} className="py-8 text-center">
          {isLoadingMore ? (
            <div className="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>Loading more articles...</span>
            </div>
          ) : visibleCount < filteredPosts.length ? (
            <button
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="px-6 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs transition"
            >
              Load More News Stories ({filteredPosts.length - visibleCount} remaining)
            </button>
          ) : (
            <span className="text-xs text-slate-400 font-medium">
              You have viewed all {filteredPosts.length} articles.
            </span>
          )}
        </div>

      </div>
    </div>
  );
};
