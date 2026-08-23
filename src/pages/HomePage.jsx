import React from 'react';
import { HeroCarousel } from '../components/HeroCarousel.jsx';
import { AboutHomeSection } from '../components/AboutHomeSection.jsx';
import { LatestNewsSection } from '../components/LatestNewsSection.jsx';
import { PartnersCarousel } from '../components/PartnersCarousel.jsx';
import { TestimonialsSection } from '../components/TestimonialsSection.jsx';
import { GallerySection } from '../components/GallerySection.jsx';
import { ContactSection } from '../components/ContactSection.jsx';
import { EnrollmentBanner } from '../components/EnrollmentBanner.jsx';

export const HomePage = ({
  posts,
  partners,
  testimonials,
  volets,
  campaigns,
  activities,
  navigate
}) => {
  // Find active open campaign
  const activeCampaign = campaigns.find(c => c.is_open !== false);

  return (
    <div className="w-full">
      {/* Ongoing Enrollment Notification on top of the banner with high z-index */}
      {activeCampaign && (
        <div className="relative z-30">
          <EnrollmentBanner
            campaign={activeCampaign}
            volets={volets}
            activities={activities}
            navigate={navigate}
            floating={true}
          />
        </div>
      )}

      {/* II. Banner Carousel with recent posts, controls, no dots */}
      <div data-aos="fade-down" data-aos-duration="600">
        <HeroCarousel posts={posts} navigate={navigate} />
      </div>

      {/* III. About Us Section with Stats Cards */}
      <div data-aos="fade-up" data-aos-duration="700">
        <AboutHomeSection 
          navigate={navigate} 
          partnersCount={partners.length}
          studentsCount={5000}
        />
      </div>

      {/* IV. Latest Posts Section */}
      <div data-aos="fade-up" data-aos-duration="700">
        <LatestNewsSection posts={posts} navigate={navigate} />
      </div>

      {/* V. Partners Horizontal Scroll */}
      <div data-aos="fade-up" data-aos-duration="700">
        <PartnersCarousel partners={partners} navigate={navigate} />
      </div>

      {/* VI. Testimonials Section */}
      <div data-aos="fade-up" data-aos-duration="700">
        <TestimonialsSection testimonials={testimonials} navigate={navigate} />
      </div>

      {/* VII. Gallery Section */}
      <div data-aos="fade-up" data-aos-duration="700">
        <GallerySection posts={posts} navigate={navigate} isFullPage={false} />
      </div>

      {/* VIII. Contact Section (Displayed right before Footer) */}
      <div data-aos="fade-up" data-aos-duration="700" className="border-t border-slate-200">
        <ContactSection navigate={navigate} isFullPage={false} />
      </div>
    </div>
  );
};
