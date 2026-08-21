import React from 'react';
import { ContactSection } from '../components/ContactSection';

interface ContactPageProps {
  navigate: (path: string) => void;
  currentSearch?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigate, currentSearch = '' }) => {
  const isDonation = currentSearch.includes('intent=donate');

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      
      {/* Header */}
      <div className="bg-slate-900 text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/30 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-500/30 mb-4">
              {isDonation ? 'Support Birashoboka Center' : 'Contact & Admissions'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              {isDonation ? 'Donate & Support Our Programs' : 'Get in Touch with Us'}
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mt-3 leading-relaxed">
              {isDonation 
                ? 'Your direct financial or material contributions directly fund sewing machines, soap supplies, and student meals for vulnerable youth in Burundi.'
                : 'Reach out to our administrative coordination team, visit our training campuses in Ngozi or Bujumbura, or register for upcoming cohorts.'}
            </p>
          </div>
        </div>
      </div>

      <ContactSection 
        navigate={navigate} 
        isFullPage={true} 
        initialIntent={isDonation ? 'donate' : ''} 
      />
    </div>
  );
};
