import React, { useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  FileText, 
  Layers, 
  Building2, 
  Megaphone, 
  Download, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Eye, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldAlert, 
  Check, 
  X, 
  LogOut, 
  ExternalLink,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Settings,
  AlertCircle
} from 'lucide-react';
import { ApiService } from '../services/api.js';

export const AdminDashboard = ({
  currentUser,
  students,
  inscriptions,
  campaigns,
  posts,
  volets,
  activities,
  partners,
  members,
  onUpdateStudents,
  onUpdateInscriptions,
  onUpdateCampaigns,
  onUpdatePosts,
  onUpdateVolets,
  onUpdateActivities,
  onUpdatePartners,
  onUpdateMembers,
  onLogout,
  navigate,
  onOpenApiSettings
}) => {
  const [activeTab, setActiveTab] = useState('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [voletFilter, setVoletFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals state
  const [viewingStudentDossier, setViewingStudentDossier] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  
  // Post modal
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // Campaign modal
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  // Volet modal
  const [voletModalOpen, setVoletModalOpen] = useState(false);
  const [editingVolet, setEditingVolet] = useState(null);

  // Activity modal
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  // Partner modal
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);

  // Member modal
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // Success toast message
  const [notification, setNotification] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Sidebar nav items
  const navItems = [
    { key: 'students',  label: 'Enrollment',  icon: GraduationCap, count: inscriptions.length },
    { key: 'campaigns', label: 'Campaigns',   icon: Megaphone,      count: campaigns.length },
    { key: 'posts',     label: 'Articles',    icon: FileText,       count: posts.length },
    { key: 'volets',    label: 'Volet',       icon: Layers,         count: volets.length },
    { key: 'partners',  label: 'Partners',    icon: Building2,      count: partners.length },
    { key: 'members',   label: 'Team',        icon: Users,          count: members.length },
  ];

  const handleNavClick = (key) => {
    setActiveTab(key);
    setSidebarOpen(false);
  };

  // Filtered Inscriptions & Students
  const filteredInscriptions = inscriptions.filter(ins => {
    const st = ins.student || students.find(s => s.id === ins.student_id);
    const matchesStatus = statusFilter === 'all' || ins.status === statusFilter;
    const matchesVolet = voletFilter === 'all' || ins.volet_id === voletFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      st?.name.toLowerCase().includes(q) ||
      st?.phone?.toLowerCase().includes(q) ||
      ins.reference_number?.toLowerCase().includes(q) ||
      st?.commune?.toLowerCase().includes(q) ||
      st?.vulnerability_category?.toLowerCase().includes(q)
    );
    return matchesStatus && matchesVolet && matchesSearch;
  });

  // Export Data to CSV
  const exportStudentsToCSV = () => {
    const headers = [
      'Inscription Ref',
      'Student ID',
      'Full Name',
      'Gender',
      'Age',
      'Nationality',
      'Phone',
      'Email',
      'Province',
      'Commune',
      'Vulnerability Profile',
      'Education Level',
      'Volet',
      'Activity Trade',
      'Campaign Edition',
      'Center',
      'Schedule',
      'Status',
      'Application Date'
    ];

    const rows = inscriptions.map(ins => {
      const st = ins.student || students.find(s => s.id === ins.student_id);
      const volet = volets.find(v => v.id === ins.volet_id);
      const activity = activities.find(a => a.id === ins.activity_id);
      const campaign = campaigns.find(c => c.id === ins.campaign_id);

      return [
        ins.reference_number || `INS-${ins.id}`,
        st?.id || ins.student_id,
        `"${st?.name || ''}"`,
        st?.gender || '',
        st?.age || '',
        `"${st?.nationality || 'Burundaise'}"`,
        `"${st?.phone || ''}"`,
        `"${st?.email || ''}"`,
        `"${st?.province || ''}"`,
        `"${st?.commune || ''}"`,
        `"${st?.vulnerability_category || ''}"`,
        `"${st?.education_level || ''}"`,
        `"${volet?.name || ''}"`,
        `"${activity?.title || ''}"`,
        `"${campaign?.edition || ''}"`,
        ins.preferred_center || 'ngozi',
        ins.preferred_schedule || 'morning',
        ins.status,
        ins.created_at || ''
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `birashoboka_enrolled_students_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Exported enrolled students CSV successfully!');
  };

  // Change Inscription Status
  const handleUpdateStatus = async (inscriptionId, newStatus) => {
    const updated = inscriptions.map(ins => 
      ins.id === inscriptionId ? { ...ins, status: newStatus } : ins
    );
    onUpdateInscriptions(updated);
    showNotification(`Inscription updated to: ${newStatus.toUpperCase()}`);
    if (viewingStudentDossier && viewingStudentDossier.inscription.id === inscriptionId) {
      setViewingStudentDossier({
        ...viewingStudentDossier,
        inscription: { ...viewingStudentDossier.inscription, status: newStatus }
      });
    }
    await ApiService.updateInscriptionStatus(inscriptionId, newStatus);
  };

  const handleDeleteInscription = async (inscriptionId) => {
    if (window.confirm('Are you sure you want to delete this inscription?')) {
      onUpdateInscriptions(inscriptions.filter(i => i.id !== inscriptionId));
      showNotification('Inscription deleted.');
      await ApiService.deleteInscription(inscriptionId);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student and all their inscriptions?')) {
      onUpdateStudents(students.filter(s => s.id !== studentId));
      onUpdateInscriptions(inscriptions.filter(i => i.student_id !== studentId));
      showNotification('Student profile deleted.');
      await ApiService.deleteStudent(studentId);
    }
  };

  // Toggle Campaign Open/Close
  const handleToggleCampaignStatus = async (campaignId) => {
    const target = campaigns.find(c => c.id === campaignId);
    if (!target) return;
    const nextState = target.is_open === false ? true : false;

    const updated = campaigns.map(c => c.id === campaignId ? { ...c, is_open: nextState } : c);
    onUpdateCampaigns(updated);
    showNotification('Campaign admissions status updated!');
    await ApiService.saveCampaign({ ...target, is_open: nextState });
  };

  // Save Campaign Modal
  const handleSaveCampaign = async (e) => {
    e.preventDefault();
    if (!editingCampaign?.title || !editingCampaign.edition) return;

    const res = await ApiService.saveCampaign(editingCampaign);
    const saved = res.campaign || editingCampaign;

    if (editingCampaign.id) {
      const updated = campaigns.map(c => c.id === editingCampaign.id ? { ...c, ...saved } : c);
      onUpdateCampaigns(updated);
      showNotification('Campaign updated successfully!');
    } else {
      onUpdateCampaigns([saved, ...campaigns]);
      showNotification('New training campaign created!');
    }
    setCampaignModalOpen(false);
    setEditingCampaign(null);
  };

  const handleDeleteCampaign = async (id) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      onUpdateCampaigns(campaigns.filter(c => c.id !== id));
      showNotification('Campaign deleted.');
      await ApiService.deleteCampaign(id);
    }
  };

  // Save Post Modal
  const handleSavePost = async (e) => {
    e.preventDefault();
    if (!editingPost?.title || !editingPost.description) return;

    const files = {
      featured_image: featuredImageFile,
      image_urls: galleryImageFiles
    };

    const res = await ApiService.savePost(editingPost, files);
    const saved = res.post || editingPost;

    if (editingPost.id) {
      const updated = posts.map(p => p.id === editingPost.id ? { ...p, ...saved } : p);
      onUpdatePosts(updated);
      showNotification('Article updated successfully!');
    } else {
      onUpdatePosts([saved, ...posts]);
      showNotification('New article published!');
    }
    setPostModalOpen(false);
    setEditingPost(null);
    setFeaturedImageFile(null);
    setGalleryImageFiles([]);
  };

  const handleDeletePost = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      onUpdatePosts(posts.filter(p => p.id !== id));
      showNotification('Post deleted.');
      await ApiService.deletePost(id);
    }
  };

  // Save Volet Modal
  const handleSaveVolet = async (e) => {
    e.preventDefault();
    if (!editingVolet?.name) return;

    const res = await ApiService.saveVolet(editingVolet);
    const saved = res.volet || editingVolet;

    if (editingVolet.id) {
      const updated = volets.map(v => v.id === editingVolet.id ? { ...v, ...saved } : v);
      onUpdateVolets(updated);
      showNotification('Volet updated!');
    } else {
      onUpdateVolets([...volets, saved]);
      showNotification('New Volet created!');
    }
    setVoletModalOpen(false);
    setEditingVolet(null);
  };

  const handleDeleteVolet = async (id) => {
    if (window.confirm('Are you sure you want to delete this Volet?')) {
      onUpdateVolets(volets.filter(v => v.id !== id));
      showNotification('Volet deleted.');
      await ApiService.deleteVolet(id);
    }
  };

  // Save Activity Modal
  const handleSaveActivity = async (e) => {
    e.preventDefault();
    if (!editingActivity?.title) return;

    const res = await ApiService.saveActivity(editingActivity);
    const saved = res.activity || editingActivity;

    if (editingActivity.id) {
      const updated = activities.map(a => a.id === editingActivity.id ? { ...a, ...saved } : a);
      onUpdateActivities(updated);
      showNotification('Activity updated!');
    } else {
      onUpdateActivities([...activities, saved]);
      showNotification('New Activity added!');
    }
    setActivityModalOpen(false);
    setEditingActivity(null);
  };

  // Save Partner Modal
  const handleSavePartner = async (e) => {
    e.preventDefault();
    if (!editingPartner?.name) return;

    const files = { logo: partnerLogoFile };
    const res = await ApiService.savePartner(editingPartner, files);
    const saved = res.partner || editingPartner;

    if (editingPartner.id) {
      const updated = partners.map(p => p.id === editingPartner.id ? { ...p, ...saved } : p);
      onUpdatePartners(updated);
      showNotification('Partner updated!');
    } else {
      onUpdatePartners([...partners, saved]);
      showNotification('New Partner added!');
    }
    setPartnerModalOpen(false);
    setEditingPartner(null);
    setPartnerLogoFile(null);
  };

  const handleDeletePartner = async (id) => {
    if (window.confirm('Delete partner?')) {
      onUpdatePartners(partners.filter(p => p.id !== id));
      showNotification('Partner deleted.');
      await ApiService.deletePartner(id);
    }
  };

  // Save Member Modal
  const handleSaveMember = async (e) => {
    e.preventDefault();
    if (!editingMember?.name || !editingMember.position) return;

    const files = { avatar: memberAvatarFile };
    const res = await ApiService.saveMember(editingMember, files);
    const saved = res.member || editingMember;

    if (editingMember.id) {
      const updated = members.map(m => m.id === editingMember.id ? { ...m, ...saved } : m);
      onUpdateMembers(updated);
      showNotification('Team member updated!');
    } else {
      onUpdateMembers([...members, saved]);
      showNotification('New team member added!');
    }
    setMemberModalOpen(false);
    setEditingMember(null);
    setMemberAvatarFile(null);
  };

  const handleDeleteMember = async (id) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      onUpdateMembers(members.filter(m => m.id !== id));
      showNotification('Team member removed.');
      await ApiService.deleteMember(id);
    }
  };

  // Save Student Edit
  const handleSaveStudentEdit = async (e) => {
    e.preventDefault();
    if (!editingStudent) return;
    const res = await ApiService.updateStudent(editingStudent.id, editingStudent);
    const saved = res.student || editingStudent;
    const updated = students.map(s => s.id === editingStudent.id ? saved : s);
    onUpdateStudents(updated);
    showNotification('Student profile updated!');
    setEditingStudent(null);
  };

  // Stats Computations
  const totalApproved = inscriptions.filter(i => i.status === 'approved').length;
  const totalPending = inscriptions.filter(i => i.status === 'pending').length;
  const activeCampaignsCount = campaigns.filter(c => c.is_open !== false).length;

  // ─── Sidebar Content ────────────────────────────────────────────────────────
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white text-slate-900">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-slate-200">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 group cursor-pointer w-full text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-xl shadow-md flex-shrink-0">
            B
          </div>
          <div>
            <div className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition leading-tight">
              Birashoboka Admin
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-medium">CRBN · HVPM</div>
          </div>
        </button>
      </div>

      {/* User card */}
      <div className="px-4 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'}
            alt="User"
            className="w-9 h-9 rounded-full object-cover border border-slate-300 flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">{currentUser?.name || 'Administrator'}</div>
            <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Active Session
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
          Management
        </p>
        {navItems.map(({ key, label, icon: Icon, count }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => handleNavClick(key)}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`} />
                <span>{label}</span>
              </div>
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
                isActive ? 'bg-blue-500/80 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800'
              }`}>
                {count}
              </span>
            </button>
          );
        })}

        <div className="pt-4">
          <p className="px-3 mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            Settings
          </p>
          <button
            onClick={() => { onOpenApiSettings(); setSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer group"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
            <span>API Config</span>
          </button>
          <button
            onClick={() => { navigate('/'); setSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer group"
          >
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
            <span>View Live Site</span>
          </button>
        </div>
      </nav>

      {/* Logout pinned at bottom */}
      <div className="px-3 py-4 border-t border-slate-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-50 text-slate-900 flex overflow-hidden">

      {/* ── Toast Notification ── */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-[100] p-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5" />
          <span>{notification}</span>
        </div>
      )}

      {/* ── Off-canvas backdrop (mobile) ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Left Sidebar ── */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-50 bg-white border-r border-slate-200 shadow-sm
          transform transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:flex-shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <SidebarContent />
      </aside>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">

        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Open navigation menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-black text-sm text-white">B</div>
            <span className="font-extrabold text-sm text-slate-900">Admin Panel</span>
          </div>
          <button
            onClick={onLogout}
            className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 space-y-8">

        
        {/* Metric Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Total Students</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-3xl font-black text-slate-900">{inscriptions.length}</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <span className="text-[11px] text-blue-600 font-semibold mt-2 block">Dossiers registered</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Approved Cohort</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-3xl font-black text-emerald-600">{totalApproved}</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-2 block">Ready for orientation</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Pending Review</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-3xl font-black text-amber-600">{totalPending}</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <span className="text-[11px] text-amber-600 font-semibold mt-2 block">Awaiting interview</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Active Campaigns</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-3xl font-black text-purple-600">{activeCampaignsCount}</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Megaphone className="w-5 h-5" />
              </div>
            </div>
            <span className="text-[11px] text-purple-600 font-semibold mt-2 block">Ongoing admissions</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm col-span-2 lg:col-span-1">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Published News</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-3xl font-black text-slate-900">{posts.length}</span>
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <span className="text-[11px] text-slate-500 font-semibold mt-2 block">Articles & gallery</span>
          </div>
        </div>

        {/* TAB 1: ENROLLED STUDENTS & INSCRIPTIONS */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            
            {/* Action Bar: Search, Filters & CSV Export */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search student, phone, ref..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                <select
                  value={voletFilter}
                  onChange={(e) => setVoletFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white"
                >
                  <option value="all">All Volets</option>
                  {volets.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button
                  onClick={exportStudentsToCSV}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Data Tables (CSV)</span>
                </button>

                <button
                  onClick={() => navigate('/apply')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Student Inscription</span>
                </button>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-4">Ref / ID</th>
                      <th className="px-5 py-4">Applicant Student</th>
                      <th className="px-5 py-4">Target Volet & Trade</th>
                      <th className="px-5 py-4">Vulnerability Category</th>
                      <th className="px-5 py-4">Location & Center</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInscriptions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-10 text-center text-slate-400 text-sm">
                          No enrolled students match the filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredInscriptions.map((ins) => {
                        const st = ins.student || students.find(s => s.id === ins.student_id);
                        const volet = volets.find(v => v.id === ins.volet_id);
                        const activity = activities.find(a => a.id === ins.activity_id);
                        const campaign = campaigns.find(c => c.id === ins.campaign_id);

                        return (
                          <tr key={ins.id} className="hover:bg-slate-50/80 transition">
                            <td className="px-5 py-4 font-mono font-bold text-xs text-blue-600">
                              {ins.reference_number || `INS-${ins.id}`}
                            </td>
                            <td className="px-5 py-4">
                              <div className="font-bold text-slate-900 text-sm">
                                {st?.name || 'Unknown Student'}
                              </div>
                              <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                                <span>{st?.gender === 'female' ? 'Female' : 'Male'} · {st?.age} yrs</span>
                                <span>•</span>
                                <span className="text-slate-700 font-medium">{st?.phone}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                                {volet?.name || 'CRBN'}
                              </span>
                              <div className="text-xs font-semibold text-slate-800 mt-1">
                                {activity?.title || 'Vocational Training'}
                              </div>
                            </td>
                            <td className="px-5 py-4 text-xs text-slate-600">
                              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold">
                                {st?.vulnerability_category || 'General Applicant'}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-xs text-slate-600">
                              <div className="font-semibold text-slate-800">
                                {st?.commune ? `${st.commune}, ${st.province}` : 'Burundi'}
                              </div>
                              <div className="text-[11px] text-slate-400 uppercase mt-0.5">
                                Center: {ins.preferred_center || 'Ngozi'}
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              {ins.status === 'approved' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                                  <Check className="w-3 h-3" /> Approved
                                </span>
                              )}
                              {ins.status === 'pending' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                                  <Clock className="w-3 h-3" /> Pending Review
                                </span>
                              )}
                              {ins.status === 'rejected' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                                  <X className="w-3 h-3" /> Rejected
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => st && setViewingStudentDossier({ student: st, inscription: ins })}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-600 text-slate-600 hover:text-white transition cursor-pointer border border-slate-200"
                                  title="View Full Dossier"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => st && setEditingStudent(st)}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer border border-slate-200"
                                  title="Edit Student Info"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>

                                {ins.status !== 'approved' && (
                                  <button
                                    onClick={() => handleUpdateStatus(ins.id, 'approved')}
                                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white transition cursor-pointer border border-emerald-200"
                                    title="Approve Dossier"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                )}

                                {ins.status !== 'rejected' && (
                                  <button
                                    onClick={() => handleUpdateStatus(ins.id, 'rejected')}
                                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white transition cursor-pointer border border-rose-200"
                                    title="Reject Dossier"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CAMPAIGNS MANAGEMENT */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Enrollment Campaigns & Cohorts</h3>
                <p className="text-xs text-slate-500">Open or close admissions to control the Home and News banners in real time.</p>
              </div>

              <button
                onClick={() => {
                  setEditingCampaign({});
                  setCampaignModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Campaign</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {campaigns.map((camp) => {
                const isOpen = camp.is_open !== false;
                const volet = volets.find(v => v.id === camp.volet_id);
                const activity = activities.find(a => a.id === camp.activity_id);

                return (
                  <div key={camp.id} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                              {camp.edition}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[11px] bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                              Volet: {volet?.name || 'CRBN'}
                            </span>
                            {activity && (
                              <span className="px-2 py-0.5 rounded-md text-[11px] bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                                Trade: {activity.title}
                              </span>
                            )}
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 mt-2">
                            {camp.title}
                          </h4>
                        </div>

                        {/* Open/Close Toggle Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleCampaignStatus(camp.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
                            isOpen 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
                              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                          <span>{isOpen ? 'Admissions Open' : 'Closed'}</span>
                        </button>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {camp.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-slate-400">Campus Location</span>
                          <span className="text-slate-800 font-semibold">{camp.place}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-slate-400">Registration Closes</span>
                          <span className="text-amber-700 font-bold">{camp.registration_end || 'Open indefinitely'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-slate-500">
                          Target Capacity: <strong className="text-slate-900">{camp.quota || 50} seats</strong>
                        </span>
                        <button
                          onClick={() => {
                            setEditingCampaign(camp);
                            setCampaignModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 border border-slate-200"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Campaign</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: NEWS & POSTS MANAGEMENT */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-slate-900">News, Activities & Articles</h3>
                <p className="text-xs text-slate-500">Publish updates, ceremonies, bootcamps, and photo stories.</p>
              </div>

              <button
                onClick={() => {
                  setEditingPost({});
                  setPostModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Article</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                const volet = volets.find(v => v.id === post.volet_id);
                return (
                  <div key={post.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition">
                    <div>
                      <div className="relative h-44 w-full bg-slate-100">
                        <img
                          src={post.featured_image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-white/90 text-blue-700 backdrop-blur-md shadow-sm border border-slate-200">
                          {volet?.name || 'General'}
                        </span>
                      </div>

                      <div className="p-5 space-y-2">
                        <span className="text-[11px] text-slate-400 font-medium">{post.published_at || 'Recently published'}</span>
                        <h4 className="text-base font-bold text-slate-900 line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {post.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-4">
                      <button
                        onClick={() => navigate(`/news/${post.id}`)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        Preview <ExternalLink className="w-3 h-3" />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingPost(post);
                            setPostModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer border border-slate-200"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer border border-rose-200"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: VOLETS & ACTIVITIES */}
        {activeTab === 'volets' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Volets de Formation & Activités</h3>
                <p className="text-xs text-slate-500">Configure program pillars (CRBN, Lyricure) and sub-vocational trades.</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setEditingActivity({});
                    setActivityModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Trade / Activity</span>
                </button>

                <button
                  onClick={() => {
                    setEditingVolet({});
                    setVoletModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Volet</span>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {volets.map((v) => {
                const voletActivities = activities.filter(a => a.volet_id === v.id);

                return (
                  <div key={v.id} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5 shadow-sm hover:shadow-md transition">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-extrabold text-slate-900">{v.name}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-50 text-blue-700 border border-blue-200">
                            {v.target === 'women' ? 'Women & Girls' : 'General Public'}
                          </span>
                        </div>
                        <p className="text-xs text-amber-700 font-semibold mt-0.5">{v.subtitle || v.slogan}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingVolet(v);
                            setVoletModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer border border-slate-200"
                        >
                          Edit Volet
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {v.description}
                    </p>

                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                        Associated Activities & Vocational Trades ({voletActivities.length}):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {voletActivities.map((act) => (
                          <div key={act.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-2">
                            <div>
                              <div className="font-bold text-xs text-slate-900">{act.title}</div>
                              <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{act.description}</div>
                            </div>
                            <button
                              onClick={() => {
                                setEditingActivity(act);
                                setActivityModalOpen(true);
                              }}
                              className="p-1 rounded text-slate-400 hover:text-slate-900 transition cursor-pointer"
                              title="Edit Activity"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: PARTNERS MANAGEMENT */}
        {activeTab === 'partners' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Partner Institutions & Donors</h3>
                <p className="text-xs text-slate-500">Institutional, humanitarian, and technical allies supporting Birashoboka Center.</p>
              </div>

              <button
                onClick={() => {
                  setEditingPartner({});
                  setPartnerModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Partner</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {partners.map((p) => (
                <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm hover:shadow-md transition">
                  <div>
                    <div className="h-20 w-full bg-slate-50 rounded-xl p-2 flex items-center justify-center border border-slate-200">
                      <img src={p.logo} alt={p.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="mt-4">
                      <h4 className="font-bold text-slate-900 text-sm">{p.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{p.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
                    {p.website_url ? (
                      <a href={p.website_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold">
                        Link <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : <span className="text-xs text-slate-400">No link</span>}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingPartner(p);
                          setPartnerModalOpen(true);
                        }}
                        className="p-1 text-slate-500 hover:text-slate-900 transition cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePartner(p.id)}
                        className="p-1 text-rose-600 hover:text-rose-700 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: STAFF MEMBERS MANAGEMENT */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Center Leadership & Technical Staff</h3>
                <p className="text-xs text-slate-500">Coordinators, clinical psychologists, finance officers, and trainers.</p>
              </div>

              <button
                onClick={() => {
                  setEditingMember({});
                  setMemberModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Team Member</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {members.map((m) => (
                <div key={m.id} className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm hover:shadow-md transition">
                  <div className="flex items-start gap-4">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0 bg-slate-50"
                    />
                    <div className="flex-1 space-y-1">
                      <h4 className="font-bold text-slate-900 text-base">{m.name}</h4>
                      <p className="text-xs font-semibold text-blue-600">{m.position}</p>
                      {m.email && (
                        <p className="text-[11px] text-slate-400 font-mono truncate">{m.email}</p>
                      )}
                      <p className="text-xs text-slate-600 line-clamp-3 mt-1 leading-relaxed">{m.bio}</p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingMember(m);
                        setMemberModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer border border-slate-200"
                      title="Edit Member"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteMember(m.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition cursor-pointer border border-rose-200"
                      title="Delete Member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
          </div>
          </main>
        </div>

      {/* MODAL 1: VIEW STUDENT FULL DOSSIER */}
      {viewingStudentDossier && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-150 text-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 uppercase">
                  {viewingStudentDossier.inscription.reference_number || `INS-${viewingStudentDossier.inscription.id}`}
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  {viewingStudentDossier.student.name}
                </h3>
              </div>
              <button
                onClick={() => setViewingStudentDossier(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-bold uppercase block">Gender & Age</span>
                <span className="text-slate-900 font-bold text-sm mt-0.5 block">
                  {viewingStudentDossier.student.gender === 'female' ? 'Female' : 'Male'} · {viewingStudentDossier.student.age} yrs
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-bold uppercase block">Telephone Phone</span>
                <span className="text-slate-900 font-bold text-sm mt-0.5 block">
                  {viewingStudentDossier.student.phone}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-bold uppercase block">Nationality</span>
                <span className="text-slate-900 font-bold mt-0.5 block">
                  {viewingStudentDossier.student.nationality || 'Burundaise'}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-bold uppercase block">Email Address</span>
                <span className="text-slate-700 font-medium mt-0.5 block truncate">
                  {viewingStudentDossier.student.email || 'None specified'}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-bold uppercase block">Vulnerability Profile</span>
                <span className="text-amber-700 font-bold mt-0.5 block">
                  {viewingStudentDossier.student.vulnerability_category || 'Standard'}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-bold uppercase block">Residence Location</span>
                <span className="text-slate-900 font-medium mt-0.5 block">
                  {viewingStudentDossier.student.commune}, {viewingStudentDossier.student.province}
                </span>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider block">Candidate Motivation & Goals:</span>
              <p className="text-slate-800 leading-relaxed font-normal italic">
                "{viewingStudentDossier.inscription.motivation || viewingStudentDossier.student.interest || 'No motivation letter specified.'}"
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-bold">Status:</span>
                <button
                  onClick={() => handleUpdateStatus(viewingStudentDossier.inscription.id, 'approved')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    viewingStudentDossier.inscription.status === 'approved'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 hover:bg-emerald-50 text-emerald-700 border border-slate-200'
                  }`}
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus(viewingStudentDossier.inscription.id, 'pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    viewingStudentDossier.inscription.status === 'pending'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 hover:bg-amber-50 text-amber-700 border border-slate-200'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => handleUpdateStatus(viewingStudentDossier.inscription.id, 'rejected')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    viewingStudentDossier.inscription.status === 'rejected'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 hover:bg-rose-50 text-rose-700 border border-slate-200'
                  }`}
                >
                  ✕ Reject
                </button>
              </div>

              <button
                onClick={() => setViewingStudentDossier(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer border border-slate-200"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT STUDENT PROFILE */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSaveStudentEdit} className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-4 animate-in zoom-in-95 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-xl font-extrabold text-slate-900">Edit Student Details</h3>
              <button type="button" onClick={() => setEditingStudent(null)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Legal Name</label>
              <input
                type="text"
                value={editingStudent.name}
                onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nationality *</label>
                <input
                  type="text"
                  value={editingStudent.nationality || 'Burundaise'}
                  onChange={(e) => setEditingStudent({ ...editingStudent, nationality: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Age</label>
                <input
                  type="number"
                  value={editingStudent.age || 20}
                  onChange={(e) => setEditingStudent({ ...editingStudent, age: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone *</label>
                <input
                  type="text"
                  value={editingStudent.phone || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={editingStudent.email || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                  placeholder="student@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Commune</label>
                <input
                  type="text"
                  value={editingStudent.commune || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, commune: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Province</label>
                <input
                  type="text"
                  value={editingStudent.province || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, province: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Vulnerability Category</label>
              <input
                type="text"
                value={editingStudent.vulnerability_category || ''}
                onChange={(e) => setEditingStudent({ ...editingStudent, vulnerability_category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: CREATE / EDIT POST */}
      {postModalOpen && editingPost && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSavePost} className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-4 animate-in zoom-in-95 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-xl font-extrabold text-slate-900">
                {editingPost.id ? 'Edit News Article' : 'Create New Article'}
              </h3>
              <button type="button" onClick={() => setPostModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Article Title *</label>
              <input
                type="text"
                value={editingPost.title || ''}
                onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Graduation of Cohort 2026 in Ngozi..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Associated Volet *</label>
              <select
                value={editingPost.volet_id || 1}
                onChange={(e) => setEditingPost({ ...editingPost, volet_id: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
              >
                {volets.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Featured Image (Cover Photo)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFeaturedImageFile(e.target.files[0]);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
              />
              {editingPost.featured_image && typeof editingPost.featured_image === 'string' && (
                <div className="mt-1 text-[11px] text-slate-500 truncate">
                  Current image: <span className="text-slate-800 font-medium">{editingPost.featured_image}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Gallery Images (Upload Multiple)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    setGalleryImageFiles(Array.from(e.target.files));
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
              />
              {galleryImageFiles.length > 0 && (
                <div className="mt-1 text-[11px] text-emerald-600 font-semibold">
                  ✓ {galleryImageFiles.length} file(s) selected for gallery upload
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Article Content / Description *</label>
              <textarea
                rows={4}
                value={editingPost.description || ''}
                onChange={(e) => setEditingPost({ ...editingPost, description: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm leading-relaxed focus:bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="Write the full report or summary..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setPostModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer shadow-md shadow-blue-600/20"
              >
                Save & Publish
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 4: CREATE / EDIT CAMPAIGN */}
      {campaignModalOpen && editingCampaign && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSaveCampaign} className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-4 animate-in zoom-in-95 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-xl font-extrabold text-slate-900">
                {editingCampaign.id ? 'Edit Campaign' : 'Create Training Campaign'}
              </h3>
              <button type="button" onClick={() => setCampaignModalOpen(false)} className="text-slate-400 hover:text-slate-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Edition Title *</label>
                <input
                  type="text"
                  value={editingCampaign.edition || ''}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, edition: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Cohort 2026-C"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Seats Quota</label>
                <input
                  type="number"
                  value={editingCampaign.quota || 50}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, quota: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Volet and Activity Trade Linkage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-blue-600 uppercase mb-1">Program (Volet) *</label>
                <select
                  value={editingCampaign.volet_id || 1}
                  onChange={(e) => {
                    const newVoletId = Number(e.target.value);
                    setEditingCampaign({
                      ...editingCampaign,
                      volet_id: newVoletId,
                      activity_id: null
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-blue-500"
                >
                  {volets.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.target === 'women' ? 'Women' : 'General'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-700 uppercase mb-1">Vocational Trade (Activité)</label>
                <select
                  value={editingCampaign.activity_id || ''}
                  onChange={(e) => {
                    const val = e.target.value ? Number(e.target.value) : null;
                    setEditingCampaign({
                      ...editingCampaign,
                      activity_id: val
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Trades in this Volet</option>
                  {activities
                    .filter(a => a.volet_id === (editingCampaign.volet_id || 1))
                    .map(act => (
                      <option key={act.id} value={act.id}>{act.title}</option>
                    ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Campaign Headline Title *</label>
              <input
                type="text"
                value={editingCampaign.title || ''}
                onChange={(e) => setEditingCampaign({ ...editingCampaign, title: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Intensive Artisanal Soap & Business Incubation Program"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Campus Location *</label>
                <input
                  type="text"
                  value={editingCampaign.place || ''}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, place: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. CRBN Campus — Ngozi & Lyricure Maramvya"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Registration Deadline</label>
                <input
                  type="date"
                  value={editingCampaign.registration_end || ''}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, registration_end: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Campaign Description</label>
              <textarea
                rows={3}
                value={editingCampaign.description || ''}
                onChange={(e) => setEditingCampaign({ ...editingCampaign, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm leading-relaxed focus:bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="Details about eligibility, cohort focus, course dates, etc."
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingCampaign.is_open !== false}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, is_open: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <span className="text-xs font-bold text-slate-700">Admissions currently Open (Displays banner on Home & News)</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setCampaignModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer shadow-md shadow-blue-600/20"
              >
                Save Campaign
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 5: CREATE / EDIT VOLET */}
      {voletModalOpen && editingVolet && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSaveVolet} className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-4 animate-in zoom-in-95 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-xl font-extrabold text-slate-900">
                {editingVolet.id ? 'Edit Volet' : 'Create New Volet'}
              </h3>
              <button type="button" onClick={() => setVoletModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Volet Code / Name *</label>
              <input
                type="text"
                value={editingVolet.name || ''}
                onChange={(e) => setEditingVolet({ ...editingVolet, name: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. CRBN"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subtitle / Full Center Name</label>
              <input
                type="text"
                value={editingVolet.subtitle || ''}
                onChange={(e) => setEditingVolet({ ...editingVolet, subtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Centre de Réhabilitation Birashoboka de Ngozi"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Slogan</label>
              <input
                type="text"
                value={editingVolet.slogan || ''}
                onChange={(e) => setEditingVolet({ ...editingVolet, slogan: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Rebuild, Rehabilitate, Reintegrate"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
              <textarea
                rows={3}
                value={editingVolet.description || ''}
                onChange={(e) => setEditingVolet({ ...editingVolet, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm leading-relaxed focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setVoletModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer shadow-md shadow-blue-600/20"
              >
                Save Volet
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 6: CREATE / EDIT ACTIVITY */}
      {activityModalOpen && editingActivity && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSaveActivity} className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-4 animate-in zoom-in-95 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-xl font-extrabold text-slate-900">
                {editingActivity.id ? 'Edit Activity / Trade' : 'Add Activity / Trade'}
              </h3>
              <button type="button" onClick={() => setActivityModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Parent Volet *</label>
              <select
                value={editingActivity.volet_id || 1}
                onChange={(e) => setEditingActivity({ ...editingActivity, volet_id: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
              >
                {volets.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Activity Title *</label>
              <input
                type="text"
                value={editingActivity.title || ''}
                onChange={(e) => setEditingActivity({ ...editingActivity, title: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Artisanal Soap Production"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
              <textarea
                rows={3}
                value={editingActivity.description || ''}
                onChange={(e) => setEditingActivity({ ...editingActivity, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm leading-relaxed focus:bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="Details about syllabus and practical workshop..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setActivityModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer shadow-md shadow-blue-600/20"
              >
                Save Activity
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 7: CREATE / EDIT PARTNER */}
      {partnerModalOpen && editingPartner && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSavePartner} className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-4 animate-in zoom-in-95 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-xl font-extrabold text-slate-900">
                {editingPartner.id ? 'Edit Partner' : 'Add Partner'}
              </h3>
              <button type="button" onClick={() => setPartnerModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Partner Organization Name *</label>
              <input
                type="text"
                value={editingPartner.name || ''}
                onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Partner Type / Category</label>
              <input
                type="text"
                value={editingPartner.type || ''}
                onChange={(e) => setEditingPartner({ ...editingPartner, type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. UN Agency & Health Partner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Partner Logo (Upload Image)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setPartnerLogoFile(e.target.files[0]);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
              />
              {editingPartner.logo && typeof editingPartner.logo === 'string' && (
                <div className="mt-1 text-[11px] text-slate-500 truncate">
                  Current logo: <span className="text-slate-800 font-medium">{editingPartner.logo}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Website URL</label>
              <input
                type="url"
                value={editingPartner.website_url || ''}
                onChange={(e) => setEditingPartner({ ...editingPartner, website_url: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="https://burundi.unfpa.org"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setPartnerModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer shadow-md shadow-blue-600/20"
              >
                Save Partner
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 8: CREATE / EDIT MEMBER */}
      {memberModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSaveMember} className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-4 animate-in zoom-in-95 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-xl font-extrabold text-slate-900">
                {editingMember.id ? 'Edit Staff Member' : 'Add Team Member'}
              </h3>
              <button type="button" onClick={() => setMemberModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
              <input
                type="text"
                value={editingMember.name || ''}
                onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Position / Role *</label>
                <input
                  type="text"
                  value={editingMember.position || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, position: e.target.value })}
                  required
                  placeholder="e.g. Center Director & Clinical Psychologist"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  value={editingMember.email || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                  placeholder="staff@birashobokacenter.org"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Avatar Image (Upload Photo)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setMemberAvatarFile(e.target.files[0]);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
              />
              {editingMember.avatar && typeof editingMember.avatar === 'string' && (
                <div className="mt-1 text-[11px] text-slate-500 truncate">
                  Current avatar: <span className="text-slate-800 font-medium">{editingMember.avatar}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Short Biography</label>
              <textarea
                rows={3}
                value={editingMember.bio || ''}
                onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm leading-relaxed focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setMemberModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer shadow-md shadow-blue-600/20"
              >
                Save Member
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
