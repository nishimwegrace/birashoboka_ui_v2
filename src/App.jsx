import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';
import { ApiSettingsModal } from './components/ApiSettingsModal.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { AboutPage } from './pages/AboutPage.jsx';
import { ProgramsPage } from './pages/ProgramsPage.jsx';
import { VoletDetailPage } from './pages/VoletDetailPage.jsx';
import { NewsPage } from './pages/NewsPage.jsx';
import { PostDetailPage } from './pages/PostDetailPage.jsx';
import { GalleryPage } from './pages/GalleryPage.jsx';
import { PartnersPage } from './pages/PartnersPage.jsx';
import { ContactPage } from './pages/ContactPage.jsx';
import { ApplyPage } from './pages/ApplyPage.jsx';
import { AdminDashboard } from './pages/AdminDashboard.jsx';
import { AdminLoginPage } from './pages/AdminLoginPage.jsx';
import { ApiService } from './services/api.js';
import { SEED_VOLETS, SEED_ACTIVITIES, SEED_POSTS, SEED_PARTNERS, SEED_TESTIMONIALS, 
  SEED_CAMPAIGNS, SEED_MEMBERS, SEED_STUDENTS, SEED_INSCRIPTIONS 
} from './data/seedData.js';

export function App() {
  // Navigation Path
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash) return hash;
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [searchParams, setSearchParams] = useState('');

  // Data States
  const [volets, setVolets] = useState(SEED_VOLETS);
  const [activities, setActivities] = useState(SEED_ACTIVITIES);
  const [posts, setPosts] = useState(SEED_POSTS);
  const [partners, setPartners] = useState(SEED_PARTNERS);
  const [testimonials, setTestimonials] = useState(SEED_TESTIMONIALS);
  const [campaigns, setCampaigns] = useState(SEED_CAMPAIGNS);
  const [members, setMembers] = useState(SEED_MEMBERS);
  const [students, setStudents] = useState(SEED_STUDENTS);
  const [inscriptions, setInscriptions] = useState(SEED_INSCRIPTIONS);
  
  // Auth state (Defaulted with open test admin as requested, but can log out)
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: 'Gérard Nishimwe',
    email: 'admin@birashobokacenter.org',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
  });

  const [isApiLive, setIsApiLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Router handler
  const navigate = (path) => {
    let cleanPath = path;
    let query = '';
    if (path.includes('?')) {
      const parts = path.split('?');
      cleanPath = parts[0];
      query = parts[1];
    }
    setSearchParams(query);
    setCurrentPath(cleanPath);
    if (typeof window !== 'undefined') {
      window.location.hash = query ? `${cleanPath}?${query}` : cleanPath;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Initialize AOS (Animate On Scroll)
  useEffect(() => {
    AOS.init({
      duration: 650,
      easing: 'ease-out-cubic',
      once: true,
      offset: 40,
      delay: 50,
    });
  }, []);

  // Refresh AOS triggers whenever path changes
  useEffect(() => {
    const timer = setTimeout(() => {
      AOS.refresh();
    }, 100);
    return () => clearTimeout(timer);
  }, [currentPath]);

  // Sync hash changes from browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hashWithQuery = window.location.hash.replace(/^#/, '') || '/';
      let path = hashWithQuery;
      let query = '';
      if (hashWithQuery.includes('?')) {
        const parts = hashWithQuery.split('?');
        path = parts[0];
        query = parts[1];
      }
      setCurrentPath(path || '/');
      setSearchParams(query);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch initial data from PHP API (or fallback to seed)
  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [
        voletsRes,
        activitiesRes,
        postsRes,
        partnersRes,
        testimonialsRes,
        campaignsRes,
        membersRes,
        studentsRes,
        inscriptionsRes
      ] = await Promise.all([
        ApiService.getVolets(),
        ApiService.getActivities(),
        ApiService.getPosts(1, 50),
        ApiService.getPartners(),
        ApiService.getTestimonials(),
        ApiService.getCampaigns(),
        ApiService.getMembers(),
        ApiService.getStudents(),
        ApiService.getInscriptions()
      ]);

      if (voletsRes.items && voletsRes.items.length > 0) setVolets(voletsRes.items);
      if (activitiesRes.items && activitiesRes.items.length > 0) setActivities(activitiesRes.items);
      if (postsRes.items && postsRes.items.length > 0) setPosts(postsRes.items);
      if (partnersRes.items && partnersRes.items.length > 0) setPartners(partnersRes.items);
      if (testimonialsRes.items && testimonialsRes.items.length > 0) setTestimonials(testimonialsRes.items);
      if (campaignsRes.items && campaignsRes.items.length > 0) setCampaigns(campaignsRes.items);
      if (membersRes.items && membersRes.items.length > 0) setMembers(membersRes.items);
      if (studentsRes.items && studentsRes.items.length > 0) setStudents(studentsRes.items);
      if (inscriptionsRes.items && inscriptionsRes.items.length > 0) setInscriptions(inscriptionsRes.items);

      setIsApiLive(voletsRes.isLive || postsRes.isLive || partnersRes.isLive);
    } catch (err) {
      console.warn('Using offline / seed data fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleStudentEnrolled = (newStudent, newInscription) => {
    setStudents(prev => [newStudent, ...prev]);
    setInscriptions(prev => [{ ...newInscription, student: newStudent }, ...prev]);
  };

  // Route Resolver
  const renderCurrentPage = () => {
    // 1. Admin Dashboard Route /admin
    if (currentPath === '/admin') {
      if (!currentUser) {
        return (
          <AdminLoginPage
            onLogin={(user) => setCurrentUser(user)}
            navigate={navigate}
          />
        );
      }
      return (
        <AdminDashboard
          currentUser={currentUser}
          students={students}
          inscriptions={inscriptions}
          campaigns={campaigns}
          posts={posts}
          volets={volets}
          activities={activities}
          partners={partners}
          members={members}
          testimonials={testimonials}
          onUpdateStudents={setStudents}
          onUpdateInscriptions={setInscriptions}
          onUpdateCampaigns={setCampaigns}
          onUpdatePosts={setPosts}
          onUpdateVolets={setVolets}
          onUpdateActivities={setActivities}
          onUpdatePartners={setPartners}
          onUpdateMembers={setMembers}
          onUpdateTestimonials={setTestimonials}
          onLogout={() => setCurrentUser(null)}
          navigate={navigate}
          onOpenApiSettings={() => setIsSettingsOpen(true)}
        />
      );
    }

    if (currentPath === '/admin/login') {
      return (
        <AdminLoginPage
          onLogin={(user) => {
            setCurrentUser(user);
            navigate('/admin');
          }}
          navigate={navigate}
        />
      );
    }

    // 2. Application & Inscription Route: /apply and /apply/{volet}/{activity}
    if (currentPath.startsWith('/apply')) {
      const parts = currentPath.split('/').filter(Boolean);
      const voletParam = parts[1] || '';
      const activityParam = parts[2] ? Number(parts[2]) : undefined;

      return (
        <ApplyPage
          campaigns={campaigns}
          volets={volets}
          activities={activities}
          initialVoletName={voletParam}
          initialActivityId={activityParam}
          navigate={navigate}
          onStudentEnrolled={handleStudentEnrolled}
        />
      );
    }

    // 3. Program details /program/{name}
    if (currentPath.startsWith('/program/')) {
      const voletNameOrId = currentPath.replace('/program/', '');
      return (
        <VoletDetailPage
          voletNameOrId={voletNameOrId}
          volets={volets}
          posts={posts}
          activities={activities}
          campaigns={campaigns}
          navigate={navigate}
        />
      );
    }

    // 4. Post details /news/{id}
    if (currentPath.startsWith('/news/')) {
      const postId = currentPath.replace('/news/', '');
      return (
        <PostDetailPage
          postId={postId}
          posts={posts}
          volets={volets}
          navigate={navigate}
        />
      );
    }

    // 5. Static & Main Pages
    switch (currentPath) {
      case '/about':
        return (
          <AboutPage
            members={members}
            partners={partners}
            navigate={navigate}
          />
        );

      case '/programs':
        return (
          <ProgramsPage
            volets={volets}
            activities={activities}
            campaigns={campaigns}
            navigate={navigate}
          />
        );

      case '/news':
        return (
          <NewsPage
            posts={posts}
            campaigns={campaigns}
            volets={volets}
            activities={activities}
            navigate={navigate}
          />
        );

      case '/gallery':
        return (
          <GalleryPage
            posts={posts}
            volets={volets}
            navigate={navigate}
          />
        );

      case '/partners':
        return (
          <PartnersPage
            partners={partners}
            volets={volets}
            navigate={navigate}
          />
        );

      case '/contact':
        return (
          <ContactPage
            navigate={navigate}
            currentSearch={searchParams}
          />
        );

      case '/':
      default:
        return (
          <HomePage
            posts={posts}
            partners={partners}
            testimonials={testimonials}
            volets={volets}
            campaigns={campaigns}
            activities={activities}
            navigate={navigate}
          />
        );
    }
  };

  const isAdminDashboardView = currentPath === '/admin' && !!currentUser;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Header (Hidden only on full admin view for immersive workspace) */}
      {!isAdminDashboardView && (
        <Header
          currentPath={currentPath}
          navigate={navigate}
          volets={volets}
          campaigns={campaigns}
          isApiLive={isApiLive}
          onOpenApiSettings={() => setIsSettingsOpen(true)}
        />
      )}

      {/* Main Dynamic View */}
      <main className="flex-1 w-full">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      {!isAdminDashboardView && (
        <Footer navigate={navigate} />
      )}

      {/* API Configuration & Connectivity Drawer */}
      <ApiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onRefreshData={loadAllData}
        isApiLive={isApiLive}
      />
    </div>
  );
}

export default App;
