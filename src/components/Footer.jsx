import React from 'react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import logo_birashoboka from '../assets/birashoboka_logo.png';

export const Footer = ({ navigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-900 text-slate-400 border-t border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left: Logo & Organization info */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2.5 text-left group focus:outline-hidden"
          >
            <div className="flex items-center justify-center">
              <img src={logo_birashoboka} alt="Birashoboka Logo" className="h-16 w-16 object-contain" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight group-hover:text-blue-400 transition">
                Birashoboka Center
              </span>
              <span className="text-[10px] text-slate-400 font-medium hidden md:inline">
                · CRBN & The Chris Lyricure (HVP Makebuko)
              </span>
            </div>
          </button>
        </div>

        {/* Center: Minimal Copyright & Tagline */}
        <div className="text-xs text-slate-500 text-center sm:text-left">
          &copy; {currentYear} Birashoboka Center. All rights reserved. NGO Registered in Bujumbura, Burundi.
        </div>

        {/* Right: Social Links Only */}
        <div className="flex items-center gap-4">
          <a
            href="https://www.facebook.com/TheChrisLyricureYouth"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-blue-400 transition p-1.5 rounded-full hover:bg-slate-800"
            aria-label="Facebook"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-pink-400 transition p-1.5 rounded-full hover:bg-slate-800"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="https://www.youtube.com/@CRBN-NM"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-red-400 transition p-1.5 rounded-full hover:bg-slate-800"
            aria-label="YouTube"
          >
            <Youtube className="w-4 h-4" />
          </a>
          <a
            href="https://wa.me/25761214395"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-emerald-400 transition p-1.5 rounded-full hover:bg-slate-800"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
          <a
            href="mailto:centrebirashoboka@gmail.com"
            className="text-slate-400 hover:text-blue-300 transition p-1.5 rounded-full hover:bg-slate-800"
            aria-label="Email"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};
