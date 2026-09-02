import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiService } from '../services/api';

const GlobalContext = createContext(null);

export const GlobalProvider = ({ children }) => {
  const [volets, setVolets] = useState([]);
  const [activities, setActivities] = useState([]);
  const [posts, setPosts] = useState([]);
  const [partners, setPartners] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [members, setMembers] = useState([]);
  const [students, setStudents] = useState([]);
  const [inscriptions, setInscriptions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  // Refresh functions for all entities
  const refreshAllData = async () => {
    setLoading(true);
    setApiError(null);
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

      setVolets(voletsRes.items || []);
      setActivities(activitiesRes.items || []);
      setPosts(postsRes.items || []);
      setPartners(partnersRes.items || []);
      setTestimonials(testimonialsRes.items || []);
      setCampaigns(campaignsRes.items || []);
      setMembers(membersRes.items || []);
      setStudents(studentsRes.items || []);
      setInscriptions(inscriptionsRes.items || []);

      setIsLiveConnected(
        voletsRes.isLive ||
        postsRes.isLive ||
        campaignsRes.isLive ||
        membersRes.isLive
      );
    } catch (err) {
      setApiError(err?.message || 'Failed to fetch shared application data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const value = {
    volets,
    setVolets,
    activities,
    setActivities,
    posts,
    setPosts,
    partners,
    setPartners,
    testimonials,
    setTestimonials,
    campaigns,
    setCampaigns,
    members,
    setMembers,
    students,
    setStudents,
    inscriptions,
    setInscriptions,
    loading,
    apiError,
    isLiveConnected,
    refreshAllData
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};

export const useGlobal = useGlobalContext;
