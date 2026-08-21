import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Heart, Sparkles, BookOpen } from 'lucide-react';
import { Post } from '../types';

interface HeroCarouselProps {
  posts: Post[];
  navigate: (path: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ posts, navigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Use the 10 recent posts or fallbacks
  const displayPosts = posts.slice(0, 10);

  // Auto rotate every 6 seconds unless hovered
  useEffect(() => {
    if (isHovered || displayPosts.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayPosts.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered, displayPosts.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + displayPosts.length) % displayPosts.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % displayPosts.length);
  };

  const currentPost = displayPosts[currentIndex] || displayPosts[0];

  if (!currentPost) return null;

  return (
    <div 
      className="relative w-full h-[520px] md:h-[620px] bg-slate-950 overflow-hidden select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Images with Crossfade */}
      {displayPosts.map((post, idx) => (
        <div
          key={post.id || idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
        >
          <img
            src={post.featured_image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1600&q=80'}
            alt={post.title}
            className="w-full h-full object-cover object-center transform transition-transform duration-7000 ease-out"
          />
          {/* Multi-layered cinematic gradient overlays for pristine readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-2xl text-white space-y-5">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-xs font-semibold tracking-wide shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>CRBN & The Chris Lyricure Center · Bujumbura & Ngozi</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] drop-shadow-sm">
            Empowering Vulnerable Youth & Women Through Skills
          </h1>

          {/* Subtitle / Post context */}
          <p className="text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed drop-shadow-xs line-clamp-3">
            "Humanitarian wellbeing is our priority!" Holistic vocational training, psychosocial rehabilitation, and economic empowerment across Burundi.
          </p>

          {/* Interactive CTA buttons */}
          <div className="pt-3 flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => navigate('/programs')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Programs</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/about')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white backdrop-blur-md font-semibold text-sm border border-white/20 transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <span>Our Story & Mission</span>
            </button>

            <button
              onClick={() => navigate('/contact?intent=donate')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white font-semibold text-sm shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Support Us</span>
            </button>
          </div>

          {/* Active Post Snapshot Preview */}
          <div 
            onClick={() => navigate(`/news/${currentPost.id}`)}
            className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-slate-300 hover:text-white cursor-pointer group/card max-w-lg transition"
          >
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-white/20 text-[10px] font-bold uppercase tracking-wider text-blue-200">
                Featured Story {currentIndex + 1}/{displayPosts.length}
              </span>
              <span className="font-medium line-clamp-1 group-hover/card:underline text-slate-100">
                {currentPost.title}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-400 group-hover/card:translate-x-1 transition-transform shrink-0" />
          </div>
        </div>
      </div>

      {/* Carousel Controls: Arrows Only, NO DOTS (as explicitly requested) */}
      <button
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition opacity-80 hover:opacity-100 hover:scale-110 shadow-lg cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next Slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition opacity-80 hover:opacity-100 hover:scale-110 shadow-lg cursor-pointer"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};
