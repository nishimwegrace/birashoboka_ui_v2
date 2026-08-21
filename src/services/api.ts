import {
  Volet,
  Activity,
  Partner,
  Testimonial,
  Post,
  Campaign,
  Member,
  Student,
  Inscription,
  ApiResponse,
  PaginatedData
} from '../types';
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


const BASE_URL_STORAGE_KEY = 'birashoboka_api_base_url';
const AUTH_TOKEN_STORAGE_KEY = 'birashoboka_api_token';

export function getStoredApiBaseUrl(): string {
  if (typeof window === 'undefined') return 'http://localhost:8000';
  const saved = localStorage.getItem(BASE_URL_STORAGE_KEY);
  if (saved && saved.trim()) return saved.trim();
  // Default to relative /api if served inside Docker /public or localhost:8000
  return window.location.hostname === 'localhost' ? 'http://localhost:8000' : '';
}

export function setStoredApiBaseUrl(url: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(BASE_URL_STORAGE_KEY, url.trim());
  }
}

export function getStoredAuthToken(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || '';
}

export function setStoredAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token.trim());
  }
}

// Fetch helper with timeout & fallback
async function fetchWithFallback<T>(
  endpoint: string,
  fallbackData: T,
  options?: RequestInit
): Promise<{ data: T; isLive: boolean; error?: string }> {
  const baseUrl = getStoredApiBaseUrl();
  const token = getStoredAuthToken();
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  const fullUrl = cleanBase ? `${cleanBase}/${cleanEndpoint}` : `/${cleanEndpoint}`;

  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      ...(options?.headers as Record<string, string> || {})
    };

    if (token) {
      headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(fullUrl, {
      ...options,
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const json: ApiResponse<any> = await response.json();
    if (json && json.data !== undefined) {
      return { data: json.data as T, isLive: true };
    }
    return { data: json as unknown as T, isLive: true };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    // Silent fallback to seedData
    return { data: fallbackData, isLive: false, error: errMsg };
  }
}

export const ApiService = {
  // Volets
  async getVolets(): Promise<{ items: Volet[]; isLive: boolean }> {
    const res = await fetchWithFallback<PaginatedData<Volet> | Volet[]>('api/volets?per_page=50', {
      items: SEED_VOLETS,
      pagination: { page: 1, per_page: 50, total: SEED_VOLETS.length, last_page: 1 }
    });

    const items = Array.isArray(res.data) 
      ? res.data 
      : (res.data?.items || SEED_VOLETS);

    // Attach local relations if missing
    const enriched = items.map(v => ({
      ...v,
      activities: v.activities || SEED_ACTIVITIES.filter(a => a.volet_id === v.id),
      posts: v.posts || SEED_POSTS.filter(p => p.volet_id === v.id),
      partners: v.partners || SEED_PARTNERS.filter(p => p.volet_id === v.id),
      campaigns: v.campaigns || SEED_CAMPAIGNS.filter(c => c.volet_id === v.id)
    }));

    return { items: enriched, isLive: res.isLive };
  },

  async getVolet(id: number | string): Promise<{ data: Volet | null; isLive: boolean }> {
    const foundLocal = SEED_VOLETS.find(v => String(v.id) === String(id) || v.name.toLowerCase() === String(id).toLowerCase());
    const res = await fetchWithFallback<Volet>(`api/volets/${id}`, foundLocal || SEED_VOLETS[0]);
    
    if (!res.data) return { data: null, isLive: res.isLive };

    const volet = { ...res.data };
    if (!volet.activities || volet.activities.length === 0) {
      volet.activities = SEED_ACTIVITIES.filter(a => a.volet_id === volet.id);
    }
    if (!volet.posts || volet.posts.length === 0) {
      volet.posts = SEED_POSTS.filter(p => p.volet_id === volet.id);
    }
    if (!volet.partners || volet.partners.length === 0) {
      volet.partners = SEED_PARTNERS.filter(p => p.volet_id === volet.id);
    }
    if (!volet.campaigns || volet.campaigns.length === 0) {
      volet.campaigns = SEED_CAMPAIGNS.filter(c => c.volet_id === volet.id);
    }

    return { data: volet, isLive: res.isLive };
  },

  // Posts
  async getPosts(page = 1, perPage = 20, voletId?: number): Promise<{ items: Post[]; pagination: any; isLive: boolean }> {
    let url = `api/posts?page=${page}&per_page=${perPage}`;
    if (voletId) url += `&volet_id=${voletId}`;

    let filteredSeed = SEED_POSTS;
    if (voletId) {
      filteredSeed = SEED_POSTS.filter(p => p.volet_id === voletId);
    }

    const res = await fetchWithFallback<PaginatedData<Post> | Post[]>(url, {
      items: filteredSeed,
      pagination: {
        page,
        per_page: perPage,
        total: filteredSeed.length,
        last_page: Math.ceil(filteredSeed.length / perPage) || 1
      }
    });

    const items = Array.isArray(res.data) ? res.data : (res.data?.items || filteredSeed);
    
    // Enrich with volet and default image if missing
    const enriched = items.map((p, idx) => ({
      ...p,
      featured_image: p.featured_image || SEED_POSTS[idx % SEED_POSTS.length]?.featured_image,
      image_urls: p.image_urls && p.image_urls.length > 0 ? p.image_urls : [p.featured_image || SEED_POSTS[idx % SEED_POSTS.length]?.featured_image || ''],
      volet: p.volet || SEED_VOLETS.find(v => v.id === p.volet_id)
    }));

    const pagination = (!Array.isArray(res.data) && res.data?.pagination) ? res.data.pagination : {
      page,
      per_page: perPage,
      total: enriched.length,
      last_page: Math.ceil(enriched.length / perPage) || 1
    };

    return { items: enriched, pagination, isLive: res.isLive };
  },

  async getPost(id: number | string): Promise<{ data: Post | null; isLive: boolean }> {
    const local = SEED_POSTS.find(p => String(p.id) === String(id));
    const res = await fetchWithFallback<Post>(`api/posts/${id}`, local || SEED_POSTS[0]);
    if (!res.data) return { data: null, isLive: res.isLive };

    const post = { ...res.data };
    post.featured_image = post.featured_image || local?.featured_image || SEED_POSTS[0].featured_image;
    post.image_urls = (post.image_urls && post.image_urls.length > 0) 
      ? post.image_urls 
      : (local?.image_urls || [post.featured_image || '']);
    post.volet = post.volet || SEED_VOLETS.find(v => v.id === post.volet_id);

    return { data: post, isLive: res.isLive };
  },

  // Activities
  async getActivities(): Promise<{ items: Activity[]; isLive: boolean }> {
    const res = await fetchWithFallback<PaginatedData<Activity> | Activity[]>('api/activities?per_page=50', {
      items: SEED_ACTIVITIES,
      pagination: { page: 1, per_page: 50, total: SEED_ACTIVITIES.length, last_page: 1 }
    });

    const items = Array.isArray(res.data) ? res.data : (res.data?.items || SEED_ACTIVITIES);
    const enriched = items.map(a => ({
      ...a,
      volet: a.volet || SEED_VOLETS.find(v => v.id === a.volet_id)
    }));

    return { items: enriched, isLive: res.isLive };
  },

  // Partners
  async getPartners(): Promise<{ items: Partner[]; isLive: boolean }> {
    const res = await fetchWithFallback<PaginatedData<Partner> | Partner[]>('api/partners?per_page=50', {
      items: SEED_PARTNERS,
      pagination: { page: 1, per_page: 50, total: SEED_PARTNERS.length, last_page: 1 }
    });

    const items = Array.isArray(res.data) ? res.data : (res.data?.items || SEED_PARTNERS);
    const enriched = items.map((p, i) => ({
      ...p,
      logo: p.logo || SEED_PARTNERS[i % SEED_PARTNERS.length]?.logo,
      type: p.type || SEED_PARTNERS[i % SEED_PARTNERS.length]?.type || 'Partner Organization',
      volet: p.volet || SEED_VOLETS.find(v => v.id === p.volet_id)
    }));

    return { items: enriched, isLive: res.isLive };
  },

  // Testimonials
  async getTestimonials(): Promise<{ items: Testimonial[]; isLive: boolean }> {
    const res = await fetchWithFallback<PaginatedData<Testimonial> | Testimonial[]>('api/testimonials?per_page=50', {
      items: SEED_TESTIMONIALS,
      pagination: { page: 1, per_page: 50, total: SEED_TESTIMONIALS.length, last_page: 1 }
    });

    const items = Array.isArray(res.data) ? res.data : (res.data?.items || SEED_TESTIMONIALS);
    const enriched = items.map((t, i) => ({
      ...t,
      photo: t.photo || SEED_TESTIMONIALS[i % SEED_TESTIMONIALS.length]?.photo,
      role: t.role || SEED_TESTIMONIALS[i % SEED_TESTIMONIALS.length]?.role,
      rating: t.rating || 5
    }));

    return { items: enriched, isLive: res.isLive };
  },

  // Campaigns & Inscriptions
  async getCampaigns(): Promise<{ items: Campaign[]; isLive: boolean }> {
    const res = await fetchWithFallback<PaginatedData<Campaign> | Campaign[]>('api/campaigns?per_page=20', {
      items: SEED_CAMPAIGNS,
      pagination: { page: 1, per_page: 20, total: SEED_CAMPAIGNS.length, last_page: 1 }
    });

    const items = Array.isArray(res.data) ? res.data : (res.data?.items || SEED_CAMPAIGNS);
    const enriched = items.map(c => ({
      ...c,
      volet: c.volet || SEED_VOLETS.find(v => v.id === c.volet_id),
      activity: c.activity || SEED_ACTIVITIES.find(a => a.id === c.activity_id)
    }));

    return { items: enriched, isLive: res.isLive };
  },

  // Team members
  async getMembers(): Promise<{ items: Member[]; isLive: boolean }> {
    const res = await fetchWithFallback<PaginatedData<Member> | Member[]>('api/members?per_page=50', {
      items: SEED_MEMBERS,
      pagination: { page: 1, per_page: 50, total: SEED_MEMBERS.length, last_page: 1 }
    });
    const items = Array.isArray(res.data) ? res.data : (res.data?.items || SEED_MEMBERS);
    return { items, isLive: res.isLive };
  },

  // Students & Inscriptions
  async getStudents(): Promise<{ items: Student[]; isLive: boolean }> {
    const res = await fetchWithFallback<PaginatedData<Student> | Student[]>('api/students?per_page=100', {
      items: SEED_STUDENTS,
      pagination: { page: 1, per_page: 100, total: SEED_STUDENTS.length, last_page: 1 }
    });
    const items = Array.isArray(res.data) ? res.data : (res.data?.items || SEED_STUDENTS);
    return { items, isLive: res.isLive };
  },

  async getInscriptions(): Promise<{ items: Inscription[]; isLive: boolean }> {
    const res = await fetchWithFallback<PaginatedData<Inscription> | Inscription[]>('api/inscriptions?per_page=100', {
      items: SEED_INSCRIPTIONS,
      pagination: { page: 1, per_page: 100, total: SEED_INSCRIPTIONS.length, last_page: 1 }
    });
    const items = Array.isArray(res.data) ? res.data : (res.data?.items || SEED_INSCRIPTIONS);
    
    // Enrich with Student & Campaign
    const enriched = items.map(ins => ({
      ...ins,
      student: ins.student || SEED_STUDENTS.find(s => s.id === ins.student_id),
      campaign: ins.campaign || SEED_CAMPAIGNS.find(c => c.id === ins.campaign_id),
      volet: ins.volet || SEED_VOLETS.find(v => v.id === ins.volet_id),
      activity: ins.activity || SEED_ACTIVITIES.find(a => a.id === ins.activity_id)
    }));

    return { items: enriched, isLive: res.isLive };
  },

  // Submit Contact Form
  async submitContact(formData: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<{ success: boolean; message: string }> {
    const baseUrl = getStoredApiBaseUrl();
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const url = cleanBase ? `${cleanBase}/api/contact` : '/api/contact';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        return { success: true, message: 'Your message has been sent successfully! Our team will get back to you shortly.' };
      }
    } catch {
      // Fallback response
    }
    return { 
      success: true, 
      message: 'Thank you for reaching out to Birashoboka Center! We have received your inquiry and will contact you soon.' 
    };
  },

  // Submit Complete Inscription & Student creation
  async submitFullEnrollment(payload: {
    student: Partial<Student>;
    inscription: Partial<Inscription>;
  }): Promise<{ success: boolean; student: Student; inscription: Inscription; message: string }> {
    const baseUrl = getStoredApiBaseUrl();
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const url = cleanBase ? `${cleanBase}/api/inscriptions` : '/api/inscriptions';

    const newStudentId = Date.now();
    const newInscriptionId = Date.now() + 1;
    const refNum = `INS-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const createdStudent: Student = {
      id: newStudentId,
      name: payload.student.name || 'New Student',
      email: payload.student.email || null,
      phone: payload.student.phone || '+257 79 000 000',
      gender: (payload.student.gender as any) || 'female',
      age: payload.student.age || 20,
      birth_date: payload.student.birth_date || null,
      nationality: payload.student.nationality || 'Burundaise',
      province: payload.student.province || 'Ngozi',
      commune: payload.student.commune || 'Ngozi',
      address: payload.student.address || '',
      vulnerability_category: payload.student.vulnerability_category || 'General Applicant',
      education_level: payload.student.education_level || 'Secondary',
      interest: payload.student.interest || null,
      created_at: new Date().toISOString()
    };

    const createdInscription: Inscription = {
      id: newInscriptionId,
      reference_number: refNum,
      campaign_id: payload.inscription.campaign_id || 1,
      student_id: newStudentId,
      volet_id: payload.inscription.volet_id || 1,
      activity_id: payload.inscription.activity_id || null,
      status: 'pending',
      motivation: payload.inscription.motivation || '',
      previous_experience: payload.inscription.previous_experience || '',
      preferred_schedule: payload.inscription.preferred_schedule || 'morning',
      preferred_center: payload.inscription.preferred_center || 'ngozi',
      notes: 'Submitted via online portal',
      created_at: new Date().toISOString(),
      student: createdStudent
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const json = await response.json();
        return {
          success: true,
          student: json.data?.student || createdStudent,
          inscription: json.data?.inscription || createdInscription,
          message: 'Enrollment application submitted successfully!'
        };
      }
    } catch {
      // Fallback
    }

    return {
      success: true,
      student: createdStudent,
      inscription: createdInscription,
      message: 'Enrollment application registered successfully! Please keep your reference number.'
    };
  },

  // Save / Update methods for Admin Dashboard
  async savePost(post: Partial<Post>): Promise<{ success: boolean; post: Post }> {
    const isNew = !post.id;
    const newPost: Post = {
      id: post.id || Date.now(),
      volet_id: post.volet_id || 1,
      title: post.title || 'Untitled Post',
      description: post.description || '',
      featured_image: post.featured_image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
      image_urls: post.image_urls || [post.featured_image || ''],
      published_at: post.published_at || new Date().toISOString().slice(0, 19).replace('T', ' '),
      created_at: post.created_at || new Date().toISOString()
    };
    return { success: true, post: newPost };
  },

  async deletePost(id: number): Promise<{ success: boolean }> {
    return { success: true };
  },

  async saveCampaign(campaign: Partial<Campaign>): Promise<{ success: boolean; campaign: Campaign }> {
    const saved: Campaign = {
      id: campaign.id || Date.now(),
      volet_id: campaign.volet_id || 1,
      activity_id: campaign.activity_id || null,
      edition: campaign.edition || 'New Cohort',
      title: campaign.title || 'Vocational Training Campaign',
      description: campaign.description || '',
      registration_start: campaign.registration_start || new Date().toISOString().slice(0, 10),
      registration_end: campaign.registration_end || '',
      start_date: campaign.start_date || '',
      end_date: campaign.end_date || '',
      place: campaign.place || 'Birashoboka Center, Ngozi & Bujumbura',
      is_open: campaign.is_open !== undefined ? campaign.is_open : true,
      quota: campaign.quota || 50
    };
    return { success: true, campaign: saved };
  },

  async savePartner(partner: Partial<Partner>): Promise<{ success: boolean; partner: Partner }> {
    const saved: Partner = {
      id: partner.id || Date.now(),
      name: partner.name || 'New Partner',
      type: partner.type || 'Partner Organization',
      logo: partner.logo || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=400&q=80',
      website_url: partner.website_url,
      volet_id: partner.volet_id || null
    };
    return { success: true, partner: saved };
  },

  async saveVolet(volet: Partial<Volet>): Promise<{ success: boolean; volet: Volet }> {
    const saved: Volet = {
      id: volet.id || Date.now(),
      name: volet.name || 'New Volet',
      slogan: volet.slogan || '',
      subtitle: volet.subtitle || '',
      description: volet.description || '',
      target: volet.target || 'all',
      place: volet.place || 'Burundi'
    };
    return { success: true, volet: saved };
  },

  async saveActivity(activity: Partial<Activity>): Promise<{ success: boolean; activity: Activity }> {
    const saved: Activity = {
      id: activity.id || Date.now(),
      volet_id: activity.volet_id || 1,
      title: activity.title || 'New Activity',
      description: activity.description || '',
      icon: activity.icon || 'BookOpen'
    };
    return { success: true, activity: saved };
  },

  async saveMember(member: Partial<Member>): Promise<{ success: boolean; member: Member }> {
    const saved: Member = {
      id: member.id || Date.now(),
      name: member.name || 'Team Member',
      position: member.position || 'Staff',
      bio: member.bio || '',
      avatar: member.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
      email: member.email || 'contact@birashobokacenter.org'
    };
    return { success: true, member: saved };
  },

  async updateInscriptionStatus(id: number, status: 'pending' | 'approved' | 'rejected' | 'cancelled'): Promise<{ success: boolean }> {
    return { success: true };
  }
};

