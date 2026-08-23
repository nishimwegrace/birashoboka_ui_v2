import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  ShieldCheck, 
  HeartHandshake, 
  ArrowRight, 
  FileText, 
  Printer, 
  Check, 
  AlertCircle,
  HelpCircle,
  Clock,
  Briefcase,
  Layers,
  ChevronRight
} from 'lucide-react';
import { ApiService } from '../services/api.js';

export const ApplyPage = ({
  campaigns,
  volets,
  activities,
  initialVoletName,
  initialActivityId,
  navigate,
  onStudentEnrolled
}) => {
  // Find open campaigns
  const openCampaigns = campaigns.filter(c => c.is_open !== false);
  const defaultCampaign = openCampaigns[0] || campaigns[0];

  // Resolve initial Volet & Activity
  const matchedVolet = volets.find(v => 
    initialVoletName && v.name.toLowerCase() === decodeURIComponent(initialVoletName).toLowerCase()
  ) || volets[0];

  // Form State: Student fields (only personal info of student)
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('female');
  const [age, setAge] = useState(20);
  const [birthDate, setBirthDate] = useState('');
  const [nationality, setNationality] = useState('Burundaise');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [province, setProvince] = useState('Ngozi');
  const [commune, setCommune] = useState('Ngozi');
  const [address, setAddress] = useState('');
  const [vulnerabilityCategory, setVulnerabilityCategory] = useState('Young Mother / Solo Parent');
  const [educationLevel, setEducationLevel] = useState('Fundamental School (9ème)');

  // Form State: Inscription fields
  const [selectedCampaignId, setSelectedCampaignId] = useState(defaultCampaign?.id || 1);
  const [selectedVoletId, setSelectedVoletId] = useState(
    defaultCampaign?.volet_id || matchedVolet?.id || 1
  );
  const [selectedActivityId, setSelectedActivityId] = useState(
    defaultCampaign?.activity_id || initialActivityId || null
  );
  const [preferredCenter, setPreferredCenter] = useState('ngozi');
  const [preferredSchedule, setPreferredSchedule] = useState('morning');
  const [motivation, setMotivation] = useState('');
  const [previousExperience, setPreviousExperience] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Submission UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // When selected campaign changes, sync volet and activity if set on campaign
  const handleCampaignChange = (campaignId) => {
    setSelectedCampaignId(campaignId);
    const camp = campaigns.find(c => c.id === campaignId);
    if (camp) {
      if (camp.volet_id) {
        setSelectedVoletId(camp.volet_id);
      }
      if (camp.activity_id) {
        setSelectedActivityId(camp.activity_id);
      }
    }
  };

  // Auto-select activity if volet changes and current activity not under volet
  const availableActivities = activities.filter(a => a.volet_id === Number(selectedVoletId));

  useEffect(() => {
    if (availableActivities.length > 0 && (!selectedActivityId || !availableActivities.some(a => a.id === selectedActivityId))) {
      setSelectedActivityId(availableActivities[0].id);
    }
  }, [selectedVoletId, availableActivities, selectedActivityId]);

  const activeCampaign = campaigns.find(c => c.id === Number(selectedCampaignId)) || defaultCampaign;
  const currentVolet = volets.find(v => v.id === (activeCampaign?.volet_id || selectedVoletId)) || volets[0];
  const currentActivity = activities.find(a => a.id === (activeCampaign?.activity_id || selectedActivityId)) || availableActivities[0] || activities[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter the student full legal name.');
      return;
    }
    if (!nationality.trim()) {
      setErrorMessage('Please provide the nationality (e.g. Burundaise).');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please provide a valid contact telephone number.');
      return;
    }
    const finalVoletId = Number(activeCampaign?.volet_id || selectedVoletId || currentVolet?.id || 1);
    const finalActivityId = Number(activeCampaign?.activity_id || selectedActivityId || currentActivity?.id || 1);

    setIsSubmitting(true);

    try {
      const payload = {
        student: {
          name: fullName.trim(),
          gender,
          age: Number(age) || 20,
          birth_date: birthDate || null,
          nationality: nationality.trim(),
          phone: phone.trim(),
          email: email.trim() ? email.trim() : null,
          province,
          commune,
          address: address.trim(),
          vulnerability_category: vulnerabilityCategory,
          education_level: educationLevel,
          interest: motivation.trim()
        },
        inscription: {
          campaign_id: Number(activeCampaign?.id || selectedCampaignId),
          volet_id: finalVoletId,
          activity_id: finalActivityId,
          preferred_center: preferredCenter,
          preferred_schedule: preferredSchedule,
          motivation: motivation.trim(),
          previous_experience: previousExperience.trim()
        }
      };

      const result = await ApiService.submitFullEnrollment(payload);
      if (result.success && result.student && result.inscription) {
        setSubmissionResult({
          student: result.student,
          inscription: result.inscription
        });
        if (onStudentEnrolled) {
          onStudentEnrolled(result.student, result.inscription);
        }
      } else {
        setErrorMessage(result.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      setErrorMessage(err?.message || 'Error occurred while saving enrollment application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Header Breadcrumb & Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider border border-amber-300">
            <GraduationCap className="w-4 h-4 text-amber-700" />
            <span>Admissions & Inscriptions Portal · Birashoboka Center</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Apply for Vocational Training & Empowerment
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Join the upcoming cohort at <strong>Birashoboka Center (CRBN & The Chris Lyricure)</strong>, an initiative established by <strong>HVP Makebuko</strong>. Free vocational trades, starter equipment kits, and full psychosocial support.
          </p>
        </div>

        {/* Section 1: Introduction to Enrollment & Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">100% Free & Certified</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              State-recognized professional certificates upon graduation, practical workshop hours, and subsidized training materials.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-4">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Starter Equipment Kits</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Eligible graduates receive startup toolkits (sewing machines, hairdressing sets, or soap molds) to launch viable micro-enterprises.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-4">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Psychosocial & Family Care</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Individual and group therapy, trauma rehabilitation, child daycare access during training, and family mediation.
            </p>
          </div>
        </div>

        {/* Section 2: Ongoing Campaign Highlight Card */}
        {activeCampaign && (
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-700/40 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider">
                    Target Cohort · {activeCampaign.edition}
                  </span>
                  <span className="text-xs text-blue-200 font-medium">
                    {activeCampaign.place}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {activeCampaign.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed">
                  {activeCampaign.description}
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-blue-200 pt-2">
                  {activeCampaign.registration_end && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-amber-300" />
                      <span>Registration Closes: <strong>{activeCampaign.registration_end}</strong></span>
                    </div>
                  )}
                  {activeCampaign.start_date && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-300" />
                      <span>Classes Start: <strong>{activeCampaign.start_date}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              <div className="shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center">
                <span className="text-xs text-slate-300 uppercase tracking-wider font-semibold block">Available Seats</span>
                <span className="text-3xl font-black text-amber-300 block my-1">
                  {activeCampaign.quota || 50}
                </span>
                <span className="text-xs text-slate-300">Free Full Sponsorship</span>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: The Enrollment Form / Success Dossier Receipt */}
        {submissionResult ? (
          /* Confirmation & Registration Receipt */
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-200 shadow-xl space-y-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Enrollment Application Submitted!
              </h2>
              <p className="text-base text-slate-600 max-w-xl mx-auto font-normal">
                Your dossier has been registered in the Birashoboka Center admissions database. Please save or print your confirmation card below.
              </p>
            </div>

            {/* Official Registration Receipt Card */}
            <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border-2 border-dashed border-slate-300 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Reference Number</span>
                  <span className="text-2xl font-black text-blue-700 tracking-tight">
                    {submissionResult.inscription.reference_number || `INS-2026-${submissionResult.inscription.id}`}
                  </span>
                </div>
                <div className="text-right sm:text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Application Status</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    Pending Dossier Review
                  </span>
                </div>
              </div>

              {/* Student and Inscription Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase block">Applicant Name</span>
                  <span className="font-bold text-slate-900 text-base">{submissionResult.student.name}</span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase block">Contact Phone</span>
                  <span className="font-bold text-slate-900">{submissionResult.student.phone}</span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase block">Vulnerability Profile</span>
                  <span className="font-semibold text-slate-800">{submissionResult.student.vulnerability_category || 'Standard'}</span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase block">Assigned Volet</span>
                  <span className="font-bold text-blue-700">
                    {volets.find(v => v.id === submissionResult.inscription.volet_id)?.name || 'CRBN'}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase block">Chosen Trade / Activity</span>
                  <span className="font-bold text-slate-900">
                    {activities.find(a => a.id === submissionResult.inscription.activity_id)?.title || 'Vocational Training'}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase block">Preferred Center</span>
                  <span className="font-bold text-slate-900 uppercase">
                    {submissionResult.inscription.preferred_center === 'bujumbura' ? 'Bujumbura / Lyricure' : 'Ngozi CRBN Campus'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-1">
                <p>📍 <strong>Next Steps:</strong> Our technical training committee will review your application. You will receive an SMS and WhatsApp invitation before the orientation session.</p>
                <p>📞 <strong>Admissions Office:</strong> (+257) 79 123 456 / (+257) 68 456 789 · Email: <em>direction@birashobokacenter.org</em></p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save Registration Card</span>
              </button>

              <button
                onClick={() => {
                  setSubmissionResult(null);
                  setFullName('');
                  setPhone('');
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition cursor-pointer"
              >
                <span>Submit Another Application</span>
              </button>

              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition cursor-pointer"
              >
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        ) : (
          /* The Form */
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Admissions Registration Form
              </h2>
              <p className="text-sm text-slate-600 mt-1 font-normal">
                Please complete all required fields accurately. One student profile is created and linked directly to this inscription campaign.
              </p>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800 text-sm font-semibold">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Campaign & Program Information (Specified by Admin on Campaign Creation) */}
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white p-5 sm:p-7 shadow-md border border-indigo-800/40 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-800/60">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    <Layers className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 block">
                      Assigned Program & Vocational Trade
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {activeCampaign?.title || 'Vocational Admissions Cohort'}
                    </h3>
                  </div>
                </div>

                {campaigns.length > 1 && (
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-300 font-semibold shrink-0">Switch Campaign:</label>
                    <select
                      value={selectedCampaignId}
                      onChange={(e) => handleCampaignChange(Number(e.target.value))}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-semibold border border-slate-700 focus:ring-2 focus:ring-blue-400"
                    >
                      {campaigns.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.edition} ({c.place})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Read-Only Campaign & Volet/Activity details card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block">
                    Admission Campaign
                  </span>
                  <div className="font-bold text-sm text-amber-300">
                    {activeCampaign?.edition || 'New Cohort'}
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    {activeCampaign?.title}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block">
                    Volet de Formation
                  </span>
                  <div className="font-bold text-sm text-blue-200">
                    {currentVolet?.name || 'CRBN'}
                  </div>
                  <div className="text-slate-300 text-[11px] line-clamp-1">
                    {currentVolet?.subtitle || currentVolet?.slogan || 'Centre de Réhabilitation Birashoboka'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1 sm:col-span-2 lg:col-span-1">
                  <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block">
                    Specific Vocational Trade / Activity
                  </span>
                  <div className="font-bold text-sm text-emerald-300">
                    {currentActivity?.title || 'Vocational Trade & Therapy'}
                  </div>
                  <div className="text-slate-300 text-[11px] line-clamp-2">
                    {currentActivity?.description || 'Hands-on training, starter kits & psychosocial counseling.'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block">
                    Training Center Location
                  </span>
                  <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{activeCampaign?.place || 'CRBN Campus — Ngozi (Rusuguti)'}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block">
                    Preferred Time Slot / Schedule
                  </span>
                  <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Morning Cohort (08:00 - 12:00)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block">
                    Registration Window & Quota
                  </span>
                  <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Open (Quota: {activeCampaign?.quota || 50} Beneficiaries)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Personal & Demographic Details (Student fills only info related to them) */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Student Personal & Demographic Information
                  </h3>
                  <p className="text-xs text-slate-500 font-normal">
                    Please provide the student's personal details to complete the inscription dossier.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Student Full Legal Name (Nom et Prénom) *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Aline IRAKOZE"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Gender *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="female">Female (Femme)</option>
                    <option value="male">Male (Homme)</option>
                    <option value="other">Other / Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Date of Birth (Date de Naissance) *
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => {
                      const dob = e.target.value;
                      setBirthDate(dob);
                      if (dob) {
                        const calculated = Math.max(0, new Date().getFullYear() - new Date(dob).getFullYear());
                        setAge(calculated);
                      }
                    }}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-500"
                  />
                  {birthDate && (
                    <span className="text-xs text-slate-500 font-medium mt-1 block">
                      Calculated Age: <strong className="text-slate-800">{Math.max(0, new Date().getFullYear() - new Date(birthDate).getFullYear())} years old</strong>
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Nationality (Nationalité) *
                  </label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="e.g. Burundaise"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Telephone Phone *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +257 79 123 456"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com (optional)"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Province *
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Ngozi">Ngozi</option>
                    <option value="Bujumbura Mairie">Bujumbura Mairie</option>
                    <option value="Bujumbura Rural">Bujumbura Rural</option>
                    <option value="Gitega">Gitega</option>
                    <option value="Kayanza">Kayanza</option>
                    <option value="Bubanza">Bubanza</option>
                    <option value="Other Province">Other Province</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Commune / Zone *
                  </label>
                  <input
                    type="text"
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    placeholder="e.g. Ntahangwa, Ngozi, Mwumba"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Residential Address / Colline
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Quartier Rusuguti, Av. des Artisans"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Vulnerability Profile & Educational Background */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Vulnerability Profile & Educational Background
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Beneficiary Target Category *
                  </label>
                  <select
                    value={vulnerabilityCategory}
                    onChange={(e) => setVulnerabilityCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Young Mother / Solo Parent">Young Mother / Solo Parent</option>
                    <option value="Out-of-school Girl / Youth">Out-of-school Girl / Youth</option>
                    <option value="GBV Survivor / Psychosocial Support Need">GBV Survivor / Psychosocial Support Need</option>
                    <option value="Unemployed Youth Seeking Trade">Unemployed Youth Seeking Trade</option>
                    <option value="Person with Mild Disability / Vulnerable Family">Person with Mild Disability / Vulnerable Family</option>
                    <option value="General Community Applicant">General Community Applicant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Highest Educational Level *
                  </label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="None / Basic Literacy">None / Basic Literacy</option>
                    <option value="Primary Completed">Primary Completed</option>
                    <option value="Fundamental School (9ème)">Fundamental School (9ème)</option>
                    <option value="Secondary Level (Humanités)">Secondary Level (Humanités)</option>
                    <option value="University / Professional">University / Professional</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Motivation & Personal Goals
                  </label>
                  <textarea
                    rows={3}
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    placeholder="Why do you wish to join this training program? What are your plans after obtaining your certificate?"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-500 leading-relaxed"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Previous Practical Experience (Optional)
                  </label>
                  <input
                    type="text"
                    value={previousExperience}
                    onChange={(e) => setPreviousExperience(e.target.value)}
                    placeholder="e.g. 6 months assistant in tailoring shop, basic computer usage, none"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Terms & Submit Action */}
            <div className="pt-6 border-t border-slate-200 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                  className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span>
                  I certify that the provided information is true and accurate. I commit to respecting the internal rules of <strong>Birashoboka Center / HVPM</strong> and attending training sessions diligently.
                </span>
              </label>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/programs')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-sm transition cursor-pointer"
                >
                  &larr; Back to Programs
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !agreeTerms}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base shadow-lg shadow-blue-600/30 transition-transform active:scale-98 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Inscription Dossier</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
