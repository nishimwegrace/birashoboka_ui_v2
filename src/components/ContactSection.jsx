import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Heart,
  Building,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { ApiService } from '../services/api.js';

export const ContactSection = ({ 
  navigate,
  isFullPage = false,
  initialIntent = ''
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: initialIntent === 'donate' ? 'Donation / Support Inquiry' : 'General Inquiry',
    message: initialIntent === 'donate' 
      ? 'I would like to support the vocational training programs of Birashoboka Center. Please provide details on direct bank transfers or material contributions.'
      : ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    const res = await ApiService.submitContact(formData);
    setIsSubmitting(false);
    setSubmitResult(res);

    if (res.success) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
      });
    }
  };

  return (
    <section className={`bg-white ${isFullPage ? 'py-12' : 'py-16 md:py-24'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200">
            <Mail className="w-3.5 h-3.5" />
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Contact Birashoboka Center
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Have questions about our training courses, partnerships, or donations? Send us a message or visit our main center.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Direct Contact Details & Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Headquarters Card */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Central Coordination Office</h3>
                  <p className="text-xs text-slate-400">CRBN & The Chris Lyricure Center</p>
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-800 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Address:</strong>
                    <span className="text-slate-300 text-xs">
                      Commune Ntahangwa, RN5 Avenue 16<br />
                      Bujumbura, Burundi (Postal Code: 2021)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Ngozi Regional Campus:</strong>
                    <span className="text-slate-300 text-xs">
                      Rusuguti, Ngozi Center, Burundi
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Telephone / WhatsApp:</strong>
                    <a href="tel:+25761214395" className="text-slate-300 hover:text-blue-300 text-xs block">
                      +257 61 21 43 95 / +257 79 98 12 34
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Email Addresses:</strong>
                    <span className="text-slate-300 text-xs block">
                      contact@birashoboka.org / centrebirashoboka@gmail.com
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Working Hours:</strong>
                    <span className="text-slate-300 text-xs block">
                      Monday to Friday: 08:00 AM – 05:00 PM (CAT)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Donation / Support Quick Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/80">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center">
                  <Heart className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Direct Donation & Bank Info</h4>
                  <p className="text-xs text-slate-500">Support a vulnerable trainee cohort</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bank transfers and mobile money donations directly fund sewing machines, soap supplies, and student meals.
              </p>
              <div className="mt-3 p-3 bg-white rounded-xl border border-blue-200/60 text-[11px] font-mono text-slate-700 space-y-1">
                <div><strong>Bank:</strong> BANCOBU / BCB Burundi</div>
                <div><strong>Account:</strong> Birashoboka Center CRBN</div>
                <div><strong>Mobile Money:</strong> Ecocash / Lumicash: +257 61 21 43 95</div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Send Us a Message
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                Fill out the form below. We usually reply within 24 hours.
              </p>

              {submitResult && (
                <div className={`p-4 rounded-2xl mb-6 flex items-start gap-3 text-sm ${
                  submitResult.success 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {submitResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold">{submitResult.success ? 'Message Sent!' : 'Error'}</div>
                    <div className="text-xs mt-0.5">{submitResult.message}</div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Marie Kwizera"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm outline-hidden transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. marie@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm outline-hidden transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+257 ..."
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm outline-hidden transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm outline-hidden transition"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Training Enrollment / Student Application">Training Enrollment / Student Application</option>
                      <option value="Partnership Proposal">Partnership Proposal</option>
                      <option value="Donation / Support Inquiry">Donation / Support Inquiry</option>
                      <option value="Media / Press">Media / Press</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry or how you would like to collaborate..."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm outline-hidden transition resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Message...' : 'Send Message to Birashoboka'}</span>
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
