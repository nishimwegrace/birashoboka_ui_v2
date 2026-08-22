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
  const handleUpdateStatus = (inscriptionId, newStatus) => {
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
  };

  // Toggle Campaign Open/Close
  const handleToggleCampaignStatus = (campaignId) => {
    const updated = campaigns.map(c => {
      if (c.id === campaignId) {
        const nextState = c.is_open === false ? true : false;
        return { ...c, is_open: nextState };
      }
      return c;
    });
    onUpdateCampaigns(updated);
    showNotification('Campaign admissions status updated!');
  };

  // Save Campaign Modal
  const handleSaveCampaign = (e) => {
    e.preventDefault();
    if (!editingCampaign?.title || !editingCampaign.edition) return;

    if (editingCampaign.id) {
      const updated = campaigns.map(c => c.id === editingCampaign.id ? { ...c, ...editingCampaign } : c);
      onUpdateCampaigns(updated);
      showNotification('Campaign updated successfully!');
    } else {
      const newCamp = {
        id: Date.now(),
        edition: editingCampaign.edition,
        title: editingCampaign.title,
        description: editingCampaign.description || '',
        volet_id: editingCampaign.volet_id || 1,
        activity_id: editingCampaign.activity_id || null,
        registration_start: editingCampaign.registration_start || new Date().toISOString().slice(0, 10),
        registration_end: editingCampaign.registration_end || '',
        start_date: editingCampaign.start_date || '',
        end_date: editingCampaign.end_date || '',
        place: editingCampaign.place || 'Birashoboka Center Campus',
        is_open: editingCampaign.is_open !== undefined ? editingCampaign.is_open : true,
        quota: editingCampaign.quota || 50
      };
      onUpdateCampaigns([newCamp, ...campaigns]);
      showNotification('New training campaign created!');
    }
    setCampaignModalOpen(false);
    setEditingCampaign(null);
  };

  // Save Post Modal
  const handleSavePost = (e) => {
    e.preventDefault();
    if (!editingPost?.title || !editingPost.description) return;

    if (editingPost.id) {
      const updated = posts.map(p => p.id === editingPost.id ? { ...p, ...editingPost } : p);
      onUpdatePosts(updated);
      showNotification('Article updated successfully!');
    } else {
      const newPost = {
        id: Date.now(),
        volet_id: editingPost.volet_id || 1,
        title: editingPost.title,
        description: editingPost.description,
        featured_image: editingPost.featured_image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
        image_urls: editingPost.image_urls || [editingPost.featured_image || ''],
        published_at: editingPost.published_at || new Date().toISOString().slice(0, 19).replace('T', ' '),
        created_at: new Date().toISOString()
      };
      onUpdatePosts([newPost, ...posts]);
      showNotification('New article published!');
    }
    setPostModalOpen(false);
    setEditingPost(null);
  };

  const handleDeletePost = (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      onUpdatePosts(posts.filter(p => p.id !== id));
      showNotification('Post deleted.');
    }
  };

  // Save Volet Modal
  const handleSaveVolet = (e) => {
    e.preventDefault();
    if (!editingVolet?.name) return;

    if (editingVolet.id) {
      const updated = volets.map(v => v.id === editingVolet.id ? { ...v, ...editingVolet } : v);
      onUpdateVolets(updated);
      showNotification('Volet updated!');
    } else {
      const newVolet = {
        id: Date.now(),
        name: editingVolet.name,
        slogan: editingVolet.slogan || '',
        subtitle: editingVolet.subtitle || '',
        description: editingVolet.description || '',
        target: editingVolet.target || 'all',
        place: editingVolet.place || 'Burundi'
      };
      onUpdateVolets([...volets, newVolet]);
      showNotification('New Volet created!');
    }
    setVoletModalOpen(false);
    setEditingVolet(null);
  };

  // Save Activity Modal
  const handleSaveActivity = (e) => {
    e.preventDefault();
    if (!editingActivity?.title) return;

    if (editingActivity.id) {
      const updated = activities.map(a => a.id === editingActivity.id ? { ...a, ...editingActivity } : a);
      onUpdateActivities(updated);
      showNotification('Activity updated!');
    } else {
      const newAct = {
        id: Date.now(),
        volet_id: editingActivity.volet_id || 1,
        title: editingActivity.title,
        description: editingActivity.description || '',
        icon: editingActivity.icon || 'Sparkles'
      };
      onUpdateActivities([...activities, newAct]);
      showNotification('New Activity added!');
    }
    setActivityModalOpen(false);
    setEditingActivity(null);
  };

  // Save Partner Modal
  const handleSavePartner = (e) => {
    e.preventDefault();
    if (!editingPartner?.name) return;

    if (editingPartner.id) {
      const updated = partners.map(p => p.id === editingPartner.id ? { ...p, ...editingPartner } : p);
      onUpdatePartners(updated);
      showNotification('Partner updated!');
    } else {
      const newPartner = {
        id: Date.now(),
        name: editingPartner.name,
        type: editingPartner.type || 'Partner Organization',
        logo: editingPartner.logo || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=400&q=80',
        website_url: editingPartner.website_url,
        volet_id: editingPartner.volet_id || null
      };
      onUpdatePartners([...partners, newPartner]);
      showNotification('New Partner added!');
    }
    setPartnerModalOpen(false);
    setEditingPartner(null);
  };

  const handleDeletePartner = (id) => {
    if (window.confirm('Delete partner?')) {
      onUpdatePartners(partners.filter(p => p.id !== id));
      showNotification('Partner deleted.');
    }
  };

  // Save Member Modal
  const handleSaveMember = (e) => {
    e.preventDefault();
    if (!editingMember?.name || !editingMember.position) return;

    if (editingMember.id) {
      const updated = members.map(m => m.id === editingMember.id ? { ...m, ...editingMember } : m);
      onUpdateMembers(updated);
      showNotification('Team member updated!');
    } else {
      const newM = {
        id: Date.now(),
        name: editingMember.name,
        position: editingMember.position,
        bio: editingMember.bio || '',
        avatar: editingMember.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
        email: editingMember.email || 'direction@birashobokacenter.org'
      };
      onUpdateMembers([...members, newM]);
      showNotification('New team member added!');
    }
    setMemberModalOpen(false);
    setEditingMember(null);
  };

  const handleDeleteMember = (id) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      onUpdateMembers(members.filter(m => m.id !== id));
      showNotification('Team member removed.');
    }
  };

  // Save Student Edit
  const handleSaveStudentEdit = (e) => {
    e.preventDefault();
    if (!editingStudent) return;
    const updated = students.map(s => s.id === editingStudent.id ? editingStudent : s);
    onUpdateStudents(updated);
    showNotification('Student profile updated!');
    setEditingStudent(null);
  };

  // Stats Computations
  const totalApproved = inscriptions.filter(i => i.status === 'approved').length;
  const totalPending = inscriptions.filter(i => i.status === 'pending').length;
  const activeCampaignsCount = campaigns.filter(c => c.is_open !== false).length;

  return (
    <div className="w-full bg-slate-950 min-h-screen text-slate-100 flex flex-col">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Administrative Navigation Bar */}
      <header className="w-full bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-xl shadow-md">
                B
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg text-white group-hover:text-blue-400 transition">
                    Birashoboka Admin
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                    CRBN · HVPM
                  </span>
                </div>
                <span className="text-xs text-slate-400">Institutional Governance & Admissions</span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Website</span>
            </button>

            <button
              onClick={onOpenApiSettings}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden md:inline">API Config</span>
            </button>

            <div className="h-6 w-px bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2 pl-1">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'}
                alt="User"
                className="w-8 h-8 rounded-full object-cover border border-slate-700"
              />
              <span className="text-xs font-bold text-slate-200 hidden md:inline">
                {currentUser?.name || 'Administrator'}
              </span>
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        
        {/* Metric Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Total Students</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-3xl font-black text-white">{inscriptions.length}</span>
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <span className="text-[11px] text-blue-400 font-semibold mt-2 block">Dossiers registered</span>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Approved Cohort</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-3xl font-black text-emerald-400">{totalApproved}</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold mt-2 block">Ready for orientation</span>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Pending Review</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-3xl font-black text-amber-400">{totalPending}</span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <span className="text-[11px] text-amber-400 font-semibold mt-2 block">Awaiting interview</span>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Active Campaigns</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-3xl font-black text-purple-400">{activeCampaignsCount}</span>
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                <Megaphone className="w-5 h-5" />
              </div>
            </div>
            <span className="text-[11px] text-purple-400 font-semibold mt-2 block">Ongoing admissions</span>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 col-span-2 lg:col-span-1">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Published News</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-3xl font-black text-slate-200">{posts.length}</span>
              <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold mt-2 block">Articles & gallery</span>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition cursor-pointer shrink-0 ${
              activeTab === 'students'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Enrolled Students & Inscriptions</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-slate-950/60 text-blue-200">
              {inscriptions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('campaigns')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition cursor-pointer shrink-0 ${
              activeTab === 'campaigns'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Campaigns & Admissions</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-slate-950/60 text-blue-200">
              {campaigns.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition cursor-pointer shrink-0 ${
              activeTab === 'posts'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Articles & News Posts</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-slate-950/60 text-blue-200">
              {posts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('volets')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition cursor-pointer shrink-0 ${
              activeTab === 'volets'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Volets & Activities</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-slate-950/60 text-blue-200">
              {volets.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('partners')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition cursor-pointer shrink-0 ${
              activeTab === 'partners'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Partners</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-slate-950/60 text-blue-200">
              {partners.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition cursor-pointer shrink-0 ${
              activeTab === 'members'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Staff Members</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-slate-950/60 text-blue-200">
              {members.length}
            </span>
          </button>
        </div>

        {/* TAB 1: ENROLLED STUDENTS & INSCRIPTIONS */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            
            {/* Action Bar: Search, Filters & CSV Export */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search student, phone, ref..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                <select
                  value={voletFilter}
                  onChange={(e) => setVoletFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Data Tables (CSV)</span>
                </button>

                <button
                  onClick={() => navigate('/apply')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Student Inscription</span>
                </button>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-800">
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
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredInscriptions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-10 text-center text-slate-500 text-sm">
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
                          <tr key={ins.id} className="hover:bg-slate-850/60 transition">
                            <td className="px-5 py-4 font-mono font-bold text-xs text-blue-400">
                              {ins.reference_number || `INS-${ins.id}`}
                            </td>
                            <td className="px-5 py-4">
                              <div className="font-bold text-white text-sm">
                                {st?.name || 'Unknown Student'}
                              </div>
                              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                                <span>{st?.gender === 'female' ? 'Female' : 'Male'} · {st?.age} yrs</span>
                                <span>•</span>
                                <span className="text-slate-300">{st?.phone}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-900/60 text-blue-300 border border-blue-700/50">
                                {volet?.name || 'CRBN'}
                              </span>
                              <div className="text-xs font-semibold text-slate-200 mt-1">
                                {activity?.title || 'Vocational Training'}
                              </div>
                            </td>
                            <td className="px-5 py-4 text-xs text-slate-300">
                              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-medium">
                                {st?.vulnerability_category || 'General Applicant'}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-xs text-slate-400">
                              <div className="font-semibold text-slate-200">
                                {st?.commune ? `${st.commune}, ${st.province}` : 'Burundi'}
                              </div>
                              <div className="text-[11px] text-slate-500 uppercase mt-0.5">
                                Center: {ins.preferred_center || 'Ngozi'}
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              {ins.status === 'approved' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold">
                                  <Check className="w-3 h-3" /> Approved
                                </span>
                              )}
                              {ins.status === 'pending' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950 text-amber-400 border border-amber-800 text-xs font-bold">
                                  <Clock className="w-3 h-3" /> Pending Review
                                </span>
                              )}
                              {ins.status === 'rejected' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-950 text-rose-400 border border-rose-800 text-xs font-bold">
                                  <X className="w-3 h-3" /> Rejected
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => st && setViewingStudentDossier({ student: st, inscription: ins })}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition cursor-pointer"
                                  title="View Full Dossier"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => st && setEditingStudent(st)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                                  title="Edit Student Info"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>

                                {ins.status !== 'approved' && (
                                  <button
                                    onClick={() => handleUpdateStatus(ins.id, 'approved')}
                                    className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-700 text-emerald-300 hover:text-white transition cursor-pointer"
                                    title="Approve Dossier"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                )}

                                {ins.status !== 'rejected' && (
                                  <button
                                    onClick={() => handleUpdateStatus(ins.id, 'rejected')}
                                    className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-700 text-rose-300 hover:text-white transition cursor-pointer"
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
            <div className="flex items-center justify-between bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">Enrollment Campaigns & Cohorts</h3>
                <p className="text-xs text-slate-400">Open or close admissions to control the Home and News banners in real time.</p>
              </div>

              <button
                onClick={() => {
                  setEditingCampaign({});
                  setCampaignModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
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
                  <div key={camp.id} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-md flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-900/60 text-blue-300 border border-blue-700">
                              {camp.edition}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[11px] bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                              Volet: {volet?.name || 'CRBN'}
                            </span>
                            {activity && (
                              <span className="px-2 py-0.5 rounded-md text-[11px] bg-amber-950/60 text-amber-300 border border-amber-800 font-semibold">
                                Trade: {activity.title}
                              </span>
                            )}
                          </div>
                          <h4 className="text-lg font-bold text-white mt-2">
                            {camp.title}
                          </h4>
                        </div>

                        {/* Open/Close Toggle Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleCampaignStatus(camp.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
                            isOpen 
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 hover:bg-emerald-900' 
                              : 'bg-rose-950 text-rose-300 border border-rose-700 hover:bg-rose-900'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                          <span>{isOpen ? 'Admissions Open' : 'Closed'}</span>
                        </button>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {camp.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-800">
                      <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-slate-500">Campus Location</span>
                          <span className="text-slate-200 font-medium">{camp.place}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-slate-500">Registration Closes</span>
                          <span className="text-amber-400 font-semibold">{camp.registration_end || 'Open indefinitely'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-slate-400">
                          Target Capacity: <strong className="text-white">{camp.quota || 50} seats</strong>
                        </span>
                        <button
                          onClick={() => {
                            setEditingCampaign(camp);
                            setCampaignModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
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
            <div className="flex items-center justify-between bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">News, Activities & Articles</h3>
                <p className="text-xs text-slate-400">Publish updates, ceremonies, bootcamps, and photo stories.</p>
              </div>

              <button
                onClick={() => {
                  setEditingPost({});
                  setPostModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Article</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                const volet = volets.find(v => v.id === post.volet_id);
                return (
                  <div key={post.id} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between shadow-md">
                    <div>
                      <div className="relative h-44 w-full bg-slate-800">
                        <img
                          src={post.featured_image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-slate-900/90 text-blue-300 backdrop-blur-md">
                          {volet?.name || 'General'}
                        </span>
                      </div>

                      <div className="p-5 space-y-2">
                        <span className="text-[11px] text-slate-400 font-medium">{post.published_at || 'Recently published'}</span>
                        <h4 className="text-base font-bold text-white line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                          {post.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/60 mt-4">
                      <button
                        onClick={() => navigate(`/news/${post.id}`)}
                        className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        Preview <ExternalLink className="w-3 h-3" />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingPost(post);
                            setPostModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-400 transition cursor-pointer"
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
            <div className="flex items-center justify-between bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">Volets de Formation & Activités</h3>
                <p className="text-xs text-slate-400">Configure program pillars (CRBN, Lyricure) and sub-vocational trades.</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setEditingActivity({});
                    setActivityModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Trade / Activity</span>
                </button>

                <button
                  onClick={() => {
                    setEditingVolet({});
                    setVoletModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
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
                  <div key={v.id} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-5 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-extrabold text-white">{v.name}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-900/60 text-blue-300 border border-blue-700">
                            {v.target === 'women' ? 'Women & Girls' : 'General Public'}
                          </span>
                        </div>
                        <p className="text-xs text-amber-400 font-semibold mt-0.5">{v.subtitle || v.slogan}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingVolet(v);
                            setVoletModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                        >
                          Edit Volet
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {v.description}
                    </p>

                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                        Associated Activities & Vocational Trades ({voletActivities.length}):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {voletActivities.map((act) => (
                          <div key={act.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-2">
                            <div>
                              <div className="font-bold text-xs text-white">{act.title}</div>
                              <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{act.description}</div>
                            </div>
                            <button
                              onClick={() => {
                                setEditingActivity(act);
                                setActivityModalOpen(true);
                              }}
                              className="p-1 rounded text-slate-500 hover:text-white transition cursor-pointer"
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
            <div className="flex items-center justify-between bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">Partner Institutions & Donors</h3>
                <p className="text-xs text-slate-400">Institutional, humanitarian, and technical allies supporting Birashoboka Center.</p>
              </div>

              <button
                onClick={() => {
                  setEditingPartner({});
                  setPartnerModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Partner</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {partners.map((p) => (
                <div key={p.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-md">
                  <div>
                    <div className="h-20 w-full bg-slate-950 rounded-xl p-2 flex items-center justify-center border border-slate-800">
                      <img src={p.logo} alt={p.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="mt-4">
                      <h4 className="font-bold text-white text-sm">{p.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{p.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-4">
                    {p.website_url ? (
                      <a href={p.website_url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                        Link <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : <span className="text-xs text-slate-600">No link</span>}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingPartner(p);
                          setPartnerModalOpen(true);
                        }}
                        className="p-1 text-slate-400 hover:text-white transition cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePartner(p.id)}
                        className="p-1 text-rose-400 hover:text-rose-300 transition cursor-pointer"
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
            <div className="flex items-center justify-between bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">Center Leadership & Technical Staff</h3>
                <p className="text-xs text-slate-400">Coordinators, clinical psychologists, finance officers, and trainers.</p>
              </div>

              <button
                onClick={() => {
                  setEditingMember({});
                  setMemberModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Team Member</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {members.map((m) => (
                <div key={m.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-md">
                  <div className="flex items-start gap-4">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shrink-0 bg-slate-800"
                    />
                    <div className="flex-1 space-y-1">
                      <h4 className="font-bold text-white text-base">{m.name}</h4>
                      <p className="text-xs font-semibold text-blue-400">{m.position}</p>
                      {m.email && (
                        <p className="text-[11px] text-slate-400 font-mono truncate">{m.email}</p>
                      )}
                      <p className="text-xs text-slate-300 line-clamp-3 mt-1 leading-relaxed">{m.bio}</p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingMember(m);
                        setMemberModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
                      title="Edit Member"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteMember(m.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-xs font-bold transition cursor-pointer border border-rose-800/60"
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

      {/* MODAL 1: VIEW STUDENT FULL DOSSIER */}
      {viewingStudentDossier && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-blue-400 uppercase">
                  {viewingStudentDossier.inscription.reference_number || `INS-${viewingStudentDossier.inscription.id}`}
                </span>
                <h3 className="text-2xl font-extrabold text-white">
                  {viewingStudentDossier.student.name}
                </h3>
              </div>
              <button
                onClick={() => setViewingStudentDossier(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 font-bold uppercase block">Gender & Age</span>
                <span className="text-white font-bold text-sm mt-0.5 block">
                  {viewingStudentDossier.student.gender === 'female' ? 'Female' : 'Male'} · {viewingStudentDossier.student.age} yrs
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 font-bold uppercase block">Telephone Phone</span>
                <span className="text-white font-bold text-sm mt-0.5 block">
                  {viewingStudentDossier.student.phone}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 font-bold uppercase block">Nationality</span>
                <span className="text-white font-bold mt-0.5 block">
                  {viewingStudentDossier.student.nationality || 'Burundaise'}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 font-bold uppercase block">Email Address</span>
                <span className="text-slate-300 font-medium mt-0.5 block truncate">
                  {viewingStudentDossier.student.email || 'None specified'}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 font-bold uppercase block">Vulnerability Profile</span>
                <span className="text-amber-400 font-bold mt-0.5 block">
                  {viewingStudentDossier.student.vulnerability_category || 'Standard'}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 font-bold uppercase block">Residence Location</span>
                <span className="text-white font-medium mt-0.5 block">
                  {viewingStudentDossier.student.commune}, {viewingStudentDossier.student.province}
                </span>
              </div>
            </div>

            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider block">Candidate Motivation & Goals:</span>
              <p className="text-slate-200 leading-relaxed font-normal italic">
                "{viewingStudentDossier.inscription.motivation || viewingStudentDossier.student.interest || 'No motivation letter specified.'}"
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold">Status:</span>
                <button
                  onClick={() => handleUpdateStatus(viewingStudentDossier.inscription.id, 'approved')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    viewingStudentDossier.inscription.status === 'approved'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 hover:bg-emerald-900 text-emerald-400'
                  }`}
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus(viewingStudentDossier.inscription.id, 'pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    viewingStudentDossier.inscription.status === 'pending'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-800 hover:bg-amber-900 text-amber-400'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => handleUpdateStatus(viewingStudentDossier.inscription.id, 'rejected')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    viewingStudentDossier.inscription.status === 'rejected'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-800 hover:bg-rose-900 text-rose-400'
                  }`}
                >
                  ✕ Reject
                </button>
              </div>

              <button
                onClick={() => setViewingStudentDossier(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT STUDENT PROFILE */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSaveStudentEdit} className="bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xl font-extrabold text-white">Edit Student Details</h3>
              <button type="button" onClick={() => setEditingStudent(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Full Legal Name</label>
              <input
                type="text"
                value={editingStudent.name}
                onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Nationality *</label>
                <input
                  type="text"
                  value={editingStudent.nationality || 'Burundaise'}
                  onChange={(e) => setEditingStudent({ ...editingStudent, nationality: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Age</label>
                <input
                  type="number"
                  value={editingStudent.age || 20}
                  onChange={(e) => setEditingStudent({ ...editingStudent, age: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Phone *</label>
                <input
                  type="text"
                  value={editingStudent.phone || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={editingStudent.email || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                  placeholder="student@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Commune</label>
                <input
                  type="text"
                  value={editingStudent.commune || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, commune: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Province</label>
                <input
                  type="text"
                  value={editingStudent.province || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, province: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Vulnerability Category</label>
              <input
                type="text"
                value={editingStudent.vulnerability_category || ''}
                onChange={(e) => setEditingStudent({ ...editingStudent, vulnerability_category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: CREATE / EDIT POST */}
      {postModalOpen && editingPost && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSavePost} className="bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xl font-extrabold text-white">
                {editingPost.id ? 'Edit News Article' : 'Create New Article'}
              </h3>
              <button type="button" onClick={() => setPostModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Article Title *</label>
              <input
                type="text"
                value={editingPost.title || ''}
                onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-medium"
                placeholder="e.g. Graduation of Cohort 2026 in Ngozi..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Associated Volet *</label>
              <select
                value={editingPost.volet_id || 1}
                onChange={(e) => setEditingPost({ ...editingPost, volet_id: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-medium"
              >
                {volets.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Featured Image URL</label>
              <input
                type="url"
                value={editingPost.featured_image || ''}
                onChange={(e) => setEditingPost({ ...editingPost, featured_image: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Article Content / Description *</label>
              <textarea
                rows={4}
                value={editingPost.description || ''}
                onChange={(e) => setEditingPost({ ...editingPost, description: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm leading-relaxed"
                placeholder="Write the full report or summary..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setPostModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
              >
                Save & Publish
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 4: CREATE / EDIT CAMPAIGN */}
      {campaignModalOpen && editingCampaign && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSaveCampaign} className="bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xl font-extrabold text-white">
                {editingCampaign.id ? 'Edit Campaign' : 'Create Training Campaign'}
              </h3>
              <button type="button" onClick={() => setCampaignModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Edition Title *</label>
                <input
                  type="text"
                  value={editingCampaign.edition || ''}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, edition: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-medium"
                  placeholder="e.g. Cohort 2026-C"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Target Seats Quota</label>
                <input
                  type="number"
                  value={editingCampaign.quota || 50}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, quota: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                />
              </div>
            </div>

            {/* Volet and Activity Trade Linkage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
              <div>
                <label className="block text-xs font-bold text-blue-400 uppercase mb-1">Program (Volet) *</label>
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
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-semibold"
                >
                  {volets.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.target === 'women' ? 'Women' : 'General'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-400 uppercase mb-1">Vocational Trade (Activité)</label>
                <select
                  value={editingCampaign.activity_id || ''}
                  onChange={(e) => {
                    const val = e.target.value ? Number(e.target.value) : null;
                    setEditingCampaign({
                      ...editingCampaign,
                      activity_id: val
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-semibold"
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
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Campaign Headline Title *</label>
              <input
                type="text"
                value={editingCampaign.title || ''}
                onChange={(e) => setEditingCampaign({ ...editingCampaign, title: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-medium"
                placeholder="e.g. Intensive Artisanal Soap & Business Incubation Program"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Campus Location *</label>
                <input
                  type="text"
                  value={editingCampaign.place || ''}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, place: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                  placeholder="e.g. CRBN Campus — Ngozi & Lyricure Maramvya"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Registration Deadline</label>
                <input
                  type="date"
                  value={editingCampaign.registration_end || ''}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, registration_end: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Campaign Description</label>
              <textarea
                rows={3}
                value={editingCampaign.description || ''}
                onChange={(e) => setEditingCampaign({ ...editingCampaign, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm leading-relaxed"
                placeholder="Details about eligibility, cohort focus, course dates, etc."
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingCampaign.is_open !== false}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, is_open: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-700"
                />
                <span className="text-xs font-bold text-slate-200">Admissions currently Open (Displays banner on Home & News)</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setCampaignModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
              >
                Save Campaign
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 5: CREATE / EDIT VOLET */}
      {voletModalOpen && editingVolet && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSaveVolet} className="bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xl font-extrabold text-white">
                {editingVolet.id ? 'Edit Volet' : 'Create New Volet'}
              </h3>
              <button type="button" onClick={() => setVoletModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Volet Code / Name *</label>
              <input
                type="text"
                value={editingVolet.name || ''}
                onChange={(e) => setEditingVolet({ ...editingVolet, name: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-bold"
                placeholder="e.g. CRBN"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Subtitle / Full Center Name</label>
              <input
                type="text"
                value={editingVolet.subtitle || ''}
                onChange={(e) => setEditingVolet({ ...editingVolet, subtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                placeholder="e.g. Centre de Réhabilitation Birashoboka de Ngozi"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Slogan</label>
              <input
                type="text"
                value={editingVolet.slogan || ''}
                onChange={(e) => setEditingVolet({ ...editingVolet, slogan: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                placeholder="e.g. Rebuild, Rehabilitate, Reintegrate"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Description</label>
              <textarea
                rows={3}
                value={editingVolet.description || ''}
                onChange={(e) => setEditingVolet({ ...editingVolet, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setVoletModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
              >
                Save Volet
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 6: CREATE / EDIT ACTIVITY */}
      {activityModalOpen && editingActivity && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSaveActivity} className="bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xl font-extrabold text-white">
                {editingActivity.id ? 'Edit Activity / Trade' : 'Add Activity / Trade'}
              </h3>
              <button type="button" onClick={() => setActivityModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Parent Volet *</label>
              <select
                value={editingActivity.volet_id || 1}
                onChange={(e) => setEditingActivity({ ...editingActivity, volet_id: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-medium"
              >
                {volets.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Activity Title *</label>
              <input
                type="text"
                value={editingActivity.title || ''}
                onChange={(e) => setEditingActivity({ ...editingActivity, title: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-bold"
                placeholder="e.g. Artisanal Soap Production"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Description</label>
              <textarea
                rows={3}
                value={editingActivity.description || ''}
                onChange={(e) => setEditingActivity({ ...editingActivity, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm leading-relaxed"
                placeholder="Details about syllabus and practical workshop..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setActivityModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
              >
                Save Activity
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 7: CREATE / EDIT PARTNER */}
      {partnerModalOpen && editingPartner && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSavePartner} className="bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xl font-extrabold text-white">
                {editingPartner.id ? 'Edit Partner' : 'Add Partner'}
              </h3>
              <button type="button" onClick={() => setPartnerModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Partner Organization Name *</label>
              <input
                type="text"
                value={editingPartner.name || ''}
                onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Partner Type / Category</label>
              <input
                type="text"
                value={editingPartner.type || ''}
                onChange={(e) => setEditingPartner({ ...editingPartner, type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                placeholder="e.g. UN Agency & Health Partner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Logo Image URL</label>
              <input
                type="url"
                value={editingPartner.logo || ''}
                onChange={(e) => setEditingPartner({ ...editingPartner, logo: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Website URL</label>
              <input
                type="url"
                value={editingPartner.website_url || ''}
                onChange={(e) => setEditingPartner({ ...editingPartner, website_url: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                placeholder="https://burundi.unfpa.org"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setPartnerModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
              >
                Save Partner
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 8: CREATE / EDIT MEMBER */}
      {memberModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSaveMember} className="bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xl font-extrabold text-white">
                {editingMember.id ? 'Edit Staff Member' : 'Add Team Member'}
              </h3>
              <button type="button" onClick={() => setMemberModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Full Name *</label>
              <input
                type="text"
                value={editingMember.name || ''}
                onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Position / Role *</label>
                <input
                  type="text"
                  value={editingMember.position || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, position: e.target.value })}
                  required
                  placeholder="e.g. Center Director & Clinical Psychologist"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  value={editingMember.email || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                  placeholder="staff@birashobokacenter.org"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Avatar Image URL</label>
              <input
                type="url"
                value={editingMember.avatar || ''}
                onChange={(e) => setEditingMember({ ...editingMember, avatar: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Short Biography</label>
              <textarea
                rows={3}
                value={editingMember.bio || ''}
                onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setMemberModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
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
