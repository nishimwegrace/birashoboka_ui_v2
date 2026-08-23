import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
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

function AppContent() {
  const routerNavigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname || '/';
  const searchParams = location.search ? location.search.replace(/^\?/, '') : '';

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
  
  // Auth state (Requires authentication to access admin portal)
  const [currentUser, setCurrentUser] = useState(null);

  const [isApiLive, setIsApiLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Router handler - Clean HTML5 History API navigation
  const navigate = (path) => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    routerNavigate(path);
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
  }, [location.pathname]);

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
        <Routes>
          <Route path="/" element={
            <HomePage
              posts={posts}
              partners={partners}
              testimonials={testimonials}
              volets={volets}
              campaigns={campaigns}
              activities={activities}
              navigate={navigate}
            />
          } />

          <Route path="/about" element={
            <AboutPage
              members={members}
              partners={partners}
              navigate={navigate}
            />
          } />

          <Route path="/programs" element={
            <ProgramsPage
              volets={volets}
              activities={activities}
              campaigns={campaigns}
              navigate={navigate}
            />
          } />

          <Route path="/program/:voletNameOrId" element={
            <VoletDetailPageWrapper
              volets={volets}
              posts={posts}
              activities={activities}
              campaigns={campaigns}
              navigate={navigate}
            />
          } />

          <Route path="/news" element={
            <NewsPage
              posts={posts}
              campaigns={campaigns}
              volets={volets}
              activities={activities}
              navigate={navigate}
            />
          } />

          <Route path="/news/:postId" element={
            <PostDetailPageWrapper
              posts={posts}
              volets={volets}
              navigate={navigate}
            />
          } />

          <Route path="/gallery" element={
            <GalleryPage
              posts={posts}
              volets={volets}
              navigate={navigate}
            />
          } />

          <Route path="/partners" element={
            <PartnersPage
              partners={partners}
              volets={volets}
              navigate={navigate}
            />
          } />

          <Route path="/contact" element={
            <ContactPage
              navigate={navigate}
              currentSearch={searchParams}
            />
          } />

          <Route path="/apply" element={
            <ApplyPage
              campaigns={campaigns}
              volets={volets}
              activities={activities}
              navigate={navigate}
              onStudentEnrolled={handleStudentEnrolled}
            />
          } />

          <Route path="/apply/:voletName" element={
            <ApplyPageWrapper
              campaigns={campaigns}
              volets={volets}
              activities={activities}
              navigate={navigate}
              onStudentEnrolled={handleStudentEnrolled}
            />
          } />

          <Route path="/apply/:voletName/:activityId" element={
            <ApplyPageWrapper
              campaigns={campaigns}
              volets={volets}
              activities={activities}
              navigate={navigate}
              onStudentEnrolled={handleStudentEnrolled}
            />
          } />

          <Route path="/admin" element={
            !currentUser ? (
              <AdminLoginPage
                onLogin={(user) => setCurrentUser(user)}
                navigate={navigate}
              />
            ) : (
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
            )
          } />

          <Route path="/admin/login" element={
            <AdminLoginPage
              onLogin={(user) => {
                setCurrentUser(user);
                navigate('/admin');
              }}
              navigate={navigate}
            />
          } />

          {/* Catch-all fallback */}
          <Route path="*" element={
            <HomePage
              posts={posts}
              partners={partners}
              testimonials={testimonials}
              volets={volets}
              campaigns={campaigns}
              activities={activities}
              navigate={navigate}
            />
          } />
        </Routes>
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

// Params Wrappers
function VoletDetailPageWrapper({ volets, posts, activities, campaigns, navigate }) {
  const { voletNameOrId } = useParams();
  return (
    <VoletDetailPage
      voletNameOrId={decodeURIComponent(voletNameOrId || '')}
      volets={volets}
      posts={posts}
      activities={activities}
      campaigns={campaigns}
      navigate={navigate}
    />
  );
}

function PostDetailPageWrapper({ posts, volets, navigate }) {
  const { postId } = useParams();
  return (
    <PostDetailPage
      postId={postId}
      posts={posts}
      volets={volets}
      navigate={navigate}
    />
  );
}

function ApplyPageWrapper({ campaigns, volets, activities, navigate, onStudentEnrolled }) {
  const { voletName, activityId } = useParams();
  return (
    <ApplyPage
      campaigns={campaigns}
      volets={volets}
      activities={activities}
      initialVoletName={decodeURIComponent(voletName || '')}
      initialActivityId={activityId ? Number(activityId) : undefined}
      navigate={navigate}
      onStudentEnrolled={onStudentEnrolled}
    />
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
