import React from 'react';
import { Calendar, ArrowRight, Sparkles, Tag } from 'lucide-react';

export const LatestNewsSection = ({ posts, navigate }) => {
  // Show 10 latest posts
  const latestPosts = posts.slice(0, 10);

  return (
    <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200">
              <Sparkles className="w-3.5 h-3.5" />
              Latest News & Field Updates
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Stories of Impact & Training Highlights
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1 max-w-2xl">
              Stay informed with recent activities, graduation ceremonies, and community initiatives from CRBN and The Chris Lyricure Center.
            </p>
          </div>

          <button
            onClick={() => navigate('/news')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-sm font-semibold shadow-xs transition hover:border-slate-400 self-start md:self-auto cursor-pointer"
          >
            <span>View All News</span>
            <ArrowRight className="w-4 h-4 text-blue-600" />
          </button>
        </div>

        {/* 10 Latest Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {latestPosts.map((post, idx) => {
            const formattedDate = post.published_at 
              ? new Date(post.published_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : 'Recent Update';

            return (
              <article
                key={post.id || idx}
                onClick={() => navigate(`/news/${post.id}`)}
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
              >
                {/* Image Wrap */}
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

                {/* Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Meta info */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-2.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formattedDate}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {post.description}
                    </p>
                  </div>

                  {/* Read story footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                    <span>Read Full Article</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom View All CTA */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => navigate('/news')}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 hover:shadow-lg transition active:scale-98 cursor-pointer"
          >
            <span>View All News & Announcements</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
