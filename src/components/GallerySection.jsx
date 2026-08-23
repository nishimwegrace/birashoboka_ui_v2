import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';

export const GallerySection = ({ 
  posts, 
  navigate, 
  isFullPage = false 
}) => {
  // Extract all images from posts (both featured_image and image_urls array)
  const galleryItems = [];

  posts.forEach((post) => {
    const urls = (post.image_urls && post.image_urls.length > 0)
      ? post.image_urls
      : [post.featured_image || ''];

    urls.forEach((url, imgIdx) => {
      if (url && !galleryItems.some(item => item.imageUrl === url)) {
        galleryItems.push({
          imageUrl: url,
          post,
          index: imgIdx
        });
      }
    });
  });

  const displayItems = isFullPage ? galleryItems : galleryItems.slice(0, 8);

  return (
    <section className={`bg-white ${isFullPage ? 'py-12' : 'py-16 md:py-24 border-b border-slate-200/80'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        {!isFullPage && (
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                Photo Gallery of Life at Birashoboka
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-1 max-w-xl">
                Moments captured during hands-on training workshops, community outreach, and ceremonies.
              </p>
            </div>

            <button
              onClick={() => navigate('/gallery')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-sm font-semibold shadow-xs transition self-start sm:self-auto cursor-pointer"
            >
              <span>Explore Full Gallery</span>
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayItems.map((item, idx) => (
            <div
              key={`${item.post.id}-${idx}`}
              onClick={() => navigate(`/news/${item.post.id}`)}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-xs border border-slate-200/80 cursor-pointer"
            >
              <img
                src={item.imageUrl}
                alt={item.post.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Hover overlay with post title and link */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 mb-1">
                  {item.post.volet?.name || 'Birashoboka'}
                </span>
                <p className="text-xs font-bold line-clamp-2 leading-snug">
                  {item.post.title}
                </p>
                <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-300 font-medium">
                  <span>View Story</span>
                  <ArrowRight className="w-3 h-3 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Read More button on Home */}
        {!isFullPage && (
          <div className="mt-10 text-center">
            <button
              onClick={() => navigate('/gallery')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition"
            >
              <span>View All {galleryItems.length} Gallery Photos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
