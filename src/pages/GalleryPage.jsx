import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight,  Filter, Eye } from 'lucide-react';

export const GalleryPage = ({ posts, volets, navigate }) => {
  const [selectedVoletId, setSelectedVoletId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loaderRef = useRef(null);

  // Extract all images from posts with their associated post reference
  const allImages = [];

  posts.forEach((post) => {
    const urls = (post.image_urls && post.image_urls.length > 0)
      ? post.image_urls
      : [post.featured_image || ''];

    urls.forEach((url, index) => {
      if (url && !allImages.some(item => item.imageUrl === url)) {
        allImages.push({
          imageUrl: url,
          post,
          id: `${post.id}-${index}`
        });
      }
    });
  });

  const filteredImages = selectedVoletId === null
    ? allImages
    : allImages.filter(item => item.post.volet_id === selectedVoletId);

  const displayedImages = filteredImages.slice(0, visibleCount);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && visibleCount < filteredImages.length && !isLoadingMore) {
        setIsLoadingMore(true);
        setTimeout(() => {
          setVisibleCount(prev => prev + 8);
          setIsLoadingMore(false);
        }, 500);
      }
    }, { threshold: 0.1 });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [visibleCount, filteredImages.length, isLoadingMore]);

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      
      {/* Header */}
      <div className="bg-slate-900 text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Moments from the Field
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mt-3 leading-relaxed">
              Explore photo highlights from vocational workshops, graduation ceremonies, and community health interventions across Burundi. Click any image to read the full story.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => { setSelectedVoletId(null); setVisibleCount(12); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedVoletId === null
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Photos ({allImages.length})
            </button>
            {volets.map((v) => {
              const count = allImages.filter(item => item.post.volet_id === v.id).length;
              return (
                <button
                  key={v.id}
                  onClick={() => { setSelectedVoletId(v.id); setVisibleCount(12); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
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

          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Showing {displayedImages.length} of {filteredImages.length} photos
          </span>
        </div>

        {/* Gallery Grid with Infinite Scroll */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayedImages.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/news/${item.post.id}`)}
              className="group relative aspect-square rounded-3xl overflow-hidden bg-slate-200 shadow-xs border border-slate-200/90 cursor-pointer hover:shadow-xl transition-all duration-300"
            >
              <img
                src={item.imageUrl}
                alt={item.post.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Hover Details Card */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 mb-1">
                  {item.post.volet?.name || 'Birashoboka'}
                </span>
                <h4 className="text-xs sm:text-sm text-white font-bold line-clamp-2 leading-snug">
                  {item.post.title}
                </h4>
                <div className="mt-2.5 flex items-center gap-1 text-xs text-blue-400 font-bold">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Infinite Scroll Trigger */}
        <div ref={loaderRef} className="py-10 text-center">
          {isLoadingMore ? (
            <div className="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>Loading more photos...</span>
            </div>
          ) : visibleCount < filteredImages.length ? (
            <button
              onClick={() => setVisibleCount(prev => prev + 8)}
              className="px-6 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs transition"
            >
              Load More Photos
            </button>
          ) : (
            <span className="text-xs text-slate-400 font-medium">
              You have viewed all {filteredImages.length} gallery photos.
            </span>
          )}
        </div>

      </div>
    </div>
  );
};
