import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  ArrowLeft, 
  Share2, 
  Check, 
  MapPin, 
   
  Clock, 
  ChevronRight,
  ArrowRight,
  Heart,
  Eye,
  Tag
} from 'lucide-react';

export const PostDetailPage = ({
  postId,
  posts,
  volets,
  navigate
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [copiedShare, setCopiedShare] = useState(false);

  const currentPost = posts.find(p => String(p.id) === String(postId)) || posts[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImage(null);
  }, [postId]);

  if (!currentPost) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Article not found</h2>
        <button
          onClick={() => navigate('/news')}
          className="mt-4 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold"
        >
          Back to News
        </button>
      </div>
    );
  }

  // 5 recent related posts from the same {volet}
  const relatedPosts = posts
    .filter(p => p.id !== currentPost.id && p.volet_id === currentPost.volet_id)
    .slice(0, 5);

  // If less than 5, fill with general other posts
  const otherPosts = relatedPosts.length < 5
    ? [...relatedPosts, ...posts.filter(p => p.id !== currentPost.id && !relatedPosts.some(r => r.id === p.id))].slice(0, 5)
    : relatedPosts;

  const imagesList = (currentPost.image_urls && currentPost.image_urls.length > 0)
    ? currentPost.image_urls
    : [currentPost.featured_image || ''];

  const activeMainImage = selectedImage || currentPost.featured_image || imagesList[0];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 3000);
  };

  const formattedDate = currentPost.published_at
    ? new Date(currentPost.published_at).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recent Story';

  return (
    <div className="w-full bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/news')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All News</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs transition"
          >
            {copiedShare ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedShare ? 'Link Copied!' : 'Share Article'}</span>
          </button>
        </div>

        {/* Two-Column Grid: Main Post Content + Aside with 5 Related Posts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Article Column */}
          <main className="lg:col-span-8 space-y-8">
            
            <article className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
              
              {/* Category & Date */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600 text-white shadow-2xs">
                  {currentPost.volet?.name || 'Birashoboka Program'}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formattedDate}</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {currentPost.title}
              </h1>

              {/* Featured Image */}
              <div className="relative rounded-2xl overflow-hidden aspect-16/10 bg-slate-900 shadow-md">
                <img
                  src={activeMainImage}
                  alt={currentPost.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Multi-Image Gallery Thumbnails (if array of image_urls exists) */}
              {imagesList.length > 1 && (
                <div className="pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Event Photo Gallery ({imagesList.length} photos) — Click to view:
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {imagesList.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedImage(img)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition ${
                          activeMainImage === img ? 'border-blue-600 scale-102 shadow-md' : 'border-transparent opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Formatted Article Body */}
              <div className="pt-4 border-t border-slate-100 text-slate-700 text-base leading-relaxed space-y-4">
                <p className="text-lg font-medium text-slate-800 leading-relaxed">
                  {currentPost.description}
                </p>
                <p>
                  At Birashoboka Center, each training milestone represents a tangible step toward community resilience in Burundi. Beneficiaries receive continuous hands-on apprenticeship combined with tailored psychosocial counseling to guarantee long-term success.
                </p>
                <p>
                  Through institutional collaborations with local community leaders, donors, and the Ministry of Public Health, our teams in Ngozi and Bujumbura ensure inclusive environments where vulnerable young women and marginalized youth regain their autonomy and dignity.
                </p>
              </div>

              {/* Program Callout Box inside post */}
              {currentPost.volet && (
                <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-blue-700">
                      Learn More About This Program
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      {currentPost.volet.subtitle || currentPost.volet.name}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-1">{currentPost.volet.description}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/program/${encodeURIComponent(currentPost.volet?.name || '')}`)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition shrink-0"
                  >
                    View Volet Details
                  </button>
                </div>
              )}

            </article>

          </main>

          {/* Aside Column: 5 Recent Related {Posts} from the same {Volet} in a row/list */}
          <aside className="lg:col-span-4 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-slate-900">
                    Related Stories
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {currentPost.volet?.name || 'Birashoboka'}
                </span>
              </div>

              {/* 5 Related Posts in a row with image, title, date */}
              <div className="space-y-4">
                {otherPosts.map((rel) => {
                  const relDate = rel.published_at
                    ? new Date(rel.published_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })
                    : 'Recent';

                  return (
                    <div
                      key={rel.id}
                      onClick={() => navigate(`/news/${rel.id}`)}
                      className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-slate-50 transition cursor-pointer group"
                    >
                      {/* Image */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <img
                          src={rel.featured_image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                          <Calendar className="w-3 h-3" />
                          <span>{relDate}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2 leading-snug mt-0.5">
                          {rel.title}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* View all button */}
              <button
                onClick={() => navigate('/news')}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Browse All News Articles &rarr;
              </button>
            </div>

            {/* Support CTA card */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-3 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-white text-white" />
              </div>
              <h4 className="font-bold text-base">Make a Direct Difference</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your donations sponsor sewing equipment kits, soap chemical ingredients, and student transport allowances.
              </p>
              <button
                onClick={() => navigate('/contact?intent=donate')}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
              >
                Donate to Birashoboka
              </button>
            </div>

          </aside>

        </div>

      </div>
    </div>
  );
};
