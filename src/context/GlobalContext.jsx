import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import {
  SEED_VOLETS,
  SEED_ACTIVITIES,
  SEED_POSTS,
  SEED_PARTNERS,
  SEED_TESTIMONIALS,
  SEED_CAMPAIGNS,
  SEED_MEMBERS,
  SEED_STUDENTS,
  SEED_INSCRIPTIONS
} from '../data/seedData';

const GlobalContext = createContext(null);

export const GlobalProvider = ({ children }) => {
  const [volets, setVolets] = useState(SEED_VOLETS);
  const [activities, setActivities] = useState(SEED_ACTIVITIES);
  const [posts, setPosts] = useState(SEED_POSTS);
  const [partners, setPartners] = useState(SEED_PARTNERS);
  const [testimonials, setTestimonials] = useState(SEED_TESTIMONIALS);
  const [campaigns, setCampaigns] = useState(SEED_CAMPAIGNS);
  const [members, setMembers] = useState(SEED_MEMBERS);
  const [students, setStudents] = useState(SEED_STUDENTS);
  const [inscriptions, setInscriptions] = useState(SEED_INSCRIPTIONS);

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

      if (voletsRes.isLive && Array.isArray(voletsRes.items)) setVolets(voletsRes.items);
      else if (voletsRes.items?.length) setVolets(voletsRes.items);

      if (activitiesRes.isLive && Array.isArray(activitiesRes.items)) setActivities(activitiesRes.items);
      else if (activitiesRes.items?.length) setActivities(activitiesRes.items);

      if (postsRes.isLive && Array.isArray(postsRes.items)) setPosts(postsRes.items);
      else if (postsRes.items?.length) setPosts(postsRes.items);

      if (partnersRes.isLive && Array.isArray(partnersRes.items)) setPartners(partnersRes.items);
      else if (partnersRes.items?.length) setPartners(partnersRes.items);

      if (testimonialsRes.isLive && Array.isArray(testimonialsRes.items)) setTestimonials(testimonialsRes.items);
      else if (testimonialsRes.items?.length) setTestimonials(testimonialsRes.items);

      if (campaignsRes.isLive && Array.isArray(campaignsRes.items)) setCampaigns(campaignsRes.items);
      else if (campaignsRes.items?.length) setCampaigns(campaignsRes.items);

      if (membersRes.isLive && Array.isArray(membersRes.items)) setMembers(membersRes.items);
      else if (membersRes.items?.length) setMembers(membersRes.items);

      if (studentsRes.isLive && Array.isArray(studentsRes.items)) setStudents(studentsRes.items);
      else if (studentsRes.items?.length) setStudents(studentsRes.items);

      if (inscriptionsRes.isLive && Array.isArray(inscriptionsRes.items)) setInscriptions(inscriptionsRes.items);
      else if (inscriptionsRes.items?.length) setInscriptions(inscriptionsRes.items);

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
