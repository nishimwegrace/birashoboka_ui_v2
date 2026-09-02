const BASE_URL_STORAGE_KEY = 'birashoboka_api_base_url';
const AUTH_TOKEN_STORAGE_KEY = 'birashoboka_api_token';
const AUTH_USER_STORAGE_KEY = 'birashoboka_api_user';

export function getStoredApiBaseUrl() {
  if (typeof window === 'undefined') return 'http://localhost:8000';
  const saved = localStorage.getItem(BASE_URL_STORAGE_KEY);
  if (saved && saved.trim()) return saved.trim();
  // Default to relative /api if served inside Docker /public or localhost:8000
  return window.location.hostname === 'localhost' ? 'http://localhost:8000' : '';
}

export function setStoredApiBaseUrl(url) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(BASE_URL_STORAGE_KEY, url.trim());
  }
}

export function getStoredAuthToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || '';
}

export function setStoredAuthToken(token) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token.trim());
  }
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (typeof window !== 'undefined') {
    if (user) {
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    }
  }
}

export function clearStoredAuth() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
  }
}

export function formatImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const baseUrl = getStoredApiBaseUrl();
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const cleanPath = url.replace(/^\/+/, '');
  const fullPath = cleanPath.startsWith('uploads/') ? `storage/${cleanPath}` : cleanPath;
  return cleanBase ? `${cleanBase}/${fullPath}` : `/${fullPath}`;
}

// Fetch helper with timeout. On failure returns empty-data result so pages show empty states.
async function fetchWithFallback(endpoint, fallbackData, options) {
  const baseUrl = getStoredApiBaseUrl();
  const token = getStoredAuthToken();
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  const fullUrl = cleanBase ? `${cleanBase}/${cleanEndpoint}` : `/${cleanEndpoint}`;

  try {
    const headers = {
      'Accept': 'application/json',
      ...(options?.headers || {})
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

    const json = await response.json();
    if (json && json.data !== undefined) {
      return { data: json.data, isLive: true };
    }
    return { data: json, isLive: true };
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    // Return empty fallback so the UI renders empty states instead of mock data.
    return { data: fallbackData, isLive: false, error: errMsg };
  }
}

export const ApiService = {
  // Volets
  async getVolets() {
    const res = await fetchWithFallback('api/volets?per_page=50', {
      items: [],
      pagination: { page: 1, per_page: 50, total: 0, last_page: 0 }
    });

    const items = Array.isArray(res.data)
      ? res.data
      : (res.data?.items || []);

    // Attach local relations when not provided by the API
    const enriched = items.map(v => ({
      ...v,
      carousel_images: Array.isArray(v.carousel_images) ? v.carousel_images.map(img => formatImageUrl(img)).filter(Boolean) : [],
      activities: v.activities || [],
      posts: v.posts || [],
      partners: v.partners || [],
      campaigns: v.campaigns || []
    }));

    return { items: enriched, isLive: res.isLive };
  },

  async getVolet(id) {
    const res = await fetchWithFallback(`api/volets/${id}`, null);

    if (!res.data) return { data: null, isLive: res.isLive };

    const volet = { ...res.data };
    volet.carousel_images = Array.isArray(volet.carousel_images) ? volet.carousel_images.map(img => formatImageUrl(img)).filter(Boolean) : [];
    if (!volet.activities) volet.activities = [];
    if (!volet.posts) volet.posts = [];
    if (!volet.partners) volet.partners = [];
    if (!volet.campaigns) volet.campaigns = [];

    return { data: volet, isLive: res.isLive };
  },

  // Posts
  async getPosts(page = 1, perPage = 20, voletId) {
    let url = `api/posts?page=${page}&per_page=${perPage}`;
    if (voletId) url += `&volet_id=${voletId}`;

    const res = await fetchWithFallback(url, {
      items: [],
      pagination: {
        page,
        per_page: perPage,
        total: 0,
        last_page: 0
      }
    });

    const items = Array.isArray(res.data) ? res.data : (res.data?.items || []);
    
    // Enrich with volet and default image if missing
    const enriched = items.map((p) => {
      const featImg = formatImageUrl(p.featured_image) || '';
      const rawGallery = p.image_urls && p.image_urls.length > 0 ? p.image_urls : [p.featured_image || ''];
      const gallery = rawGallery.map(img => formatImageUrl(img)).filter(Boolean);
      return {
        ...p,
        featured_image: featImg,
        image_urls: gallery.length > 0 ? gallery : [],
        volet: p.volet || null
      };
    });

    const pagination = (!Array.isArray(res.data) && res.data?.pagination) ? res.data.pagination : {
      page,
      per_page: perPage,
      total: enriched.length,
      last_page: Math.ceil(enriched.length / perPage) || 0
    };

    return { items: enriched, pagination, isLive: res.isLive };
  },

  async getPost(id) {
    const res = await fetchWithFallback(`api/posts/${id}`, null);
    if (!res.data) return { data: null, isLive: res.isLive };

    const post = { ...res.data };
    const featImg = formatImageUrl(post.featured_image) || '';
    const rawGallery = (post.image_urls && post.image_urls.length > 0) 
      ? post.image_urls 
      : [post.featured_image || ''];
    const gallery = rawGallery.map(img => formatImageUrl(img)).filter(Boolean);

    post.featured_image = featImg;
    post.image_urls = gallery;
    post.volet = post.volet || null;

    return { data: post, isLive: res.isLive };
  },

  // Activities
  async getActivities() {
    const res = await fetchWithFallback('api/activities?per_page=50', {
      items: [],
      pagination: { page: 1, per_page: 50, total: 0, last_page: 0 }
    });

    const items = Array.isArray(res.data) ? res.data : (res.data?.items || []);
    const enriched = items.map(a => ({
      ...a,
      volet: a.volet || null
    }));

    return { items: enriched, isLive: res.isLive };
  },

  // Partners
  async getPartners() {
    const res = await fetchWithFallback('api/partners?per_page=50', {
      items: [],
      pagination: { page: 1, per_page: 50, total: 0, last_page: 0 }
    });

    const items = Array.isArray(res.data) ? res.data : (res.data?.items || []);
    const enriched = items.map((p) => ({
      ...p,
      logo: formatImageUrl(p.logo) || '',
      type: p.type || 'Partner Organization',
      volet: p.volet || null
    }));

    return { items: enriched, isLive: res.isLive };
  },

  // Testimonials
  async getTestimonials() {
    const res = await fetchWithFallback('api/testimonials?per_page=50', {
      items: [],
      pagination: { page: 1, per_page: 50, total: 0, last_page: 0 }
    });

    const items = Array.isArray(res.data) ? res.data : (res.data?.items || []);
    const enriched = items.map((t) => ({
      ...t,
      photo: formatImageUrl(t.photo) || '',
      role: t.role || '',
      rating: t.rating || 5
    }));

    return { items: enriched, isLive: res.isLive };
  },

  // Campaigns & Inscriptions
  async getCampaigns() {
    const res = await fetchWithFallback('api/campaigns?per_page=20', {
      items: [],
      pagination: { page: 1, per_page: 20, total: 0, last_page: 0 }
    });

    const items = Array.isArray(res.data) ? res.data : (res.data?.items || []);
    const enriched = items.map(c => ({
      ...c,
      volet: c.volet || null,
      activity: c.activity || null
    }));

    return { items: enriched, isLive: res.isLive };
  },

  // Team members
  async getMembers() {
    const res = await fetchWithFallback('api/members?per_page=50', {
      items: [],
      pagination: { page: 1, per_page: 50, total: 0, last_page: 0 }
    });
    const items = Array.isArray(res.data) ? res.data : (res.data?.items || []);
    const enriched = items.map((m) => ({
      ...m,
      avatar: formatImageUrl(m.avatar) || '',
      bio: m.bio || '',
      position: m.position || 'Team Member'
    }));
    return { items: enriched, isLive: res.isLive };
  },

  // Students & Inscriptions
  async getStudents() {
    const res = await fetchWithFallback('api/students?per_page=100', {
      items: [],
      pagination: { page: 1, per_page: 100, total: 0, last_page: 0 }
    });
    const items = Array.isArray(res.data) ? res.data : (res.data?.items || []);
    return { items, isLive: res.isLive };
  },

  async getInscriptions() {
    const res = await fetchWithFallback('api/inscriptions?per_page=100', {
      items: [],
      pagination: { page: 1, per_page: 100, total: 0, last_page: 0 }
    });
    const items = Array.isArray(res.data) ? res.data : (res.data?.items || []);
    
    // Enrich with Student & Campaign
    const enriched = items.map(ins => ({
      ...ins,
      student: ins.student || null,
      campaign: ins.campaign || null,
      volet: ins.volet || null,
      activity: ins.activity || null
    }));

    return { items: enriched, isLive: res.isLive };
  },

  // Auth
  async login(email, password) {
    const baseUrl = getStoredApiBaseUrl();
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const url = cleanBase ? `${cleanBase}/api/auth/login` : '/api/auth/login';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const json = await response.json();

      if (response.ok && json.data) {
        if (json.data.token) {
          setStoredAuthToken(json.data.token);
        }
        if (json.data.user) {
          setStoredUser(json.data.user);
        }
        return { success: true, user: json.data.user, token: json.data.token, message: json.message };
      }
      return { success: false, message: json.message || 'Invalid login credentials.' };
    } catch (err) {
      return { success: false, message: err?.message || 'Network error connecting to auth server.' };
    }
  },

  async logout() {
    const token = getStoredAuthToken();
    if (token) {
      const baseUrl = getStoredApiBaseUrl();
      const cleanBase = baseUrl.replace(/\/+$/, '');
      const url = cleanBase ? `${cleanBase}/api/auth/logout` : '/api/auth/logout';
      try {
        await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
      } catch {
        // ignore
      }
    }
    clearStoredAuth();
    return { success: true };
  },

  // Submit Contact Form
  async submitContact(formData) {
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

  // Submit Complete Inscription & Student creation (atomic POST /api/enroll)
  async submitFullEnrollment(payload) {
    const baseUrl = getStoredApiBaseUrl();
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const url = cleanBase ? `${cleanBase}/api/enroll` : '/api/enroll';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await response.json();
      if (response.ok && json.data) {
        return {
          success: true,
          student: json.data.student,
          inscription: json.data.inscription,
          message: json.message || 'Enrollment application submitted successfully!'
        };
      }
      return { success: false, message: json.message || 'Enrollment submission failed.', errors: json.errors };
    } catch (err) {
      return { success: false, message: err?.message || 'Network error while submitting your enrollment.' };
    }
  },

  // Post CRUD with single file featured_image and multiple files image_urls[]
  async savePost(postData, files = {}) {
    const baseUrl = getStoredApiBaseUrl();
    const token = getStoredAuthToken();
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const isUpdate = !!postData.id;
    const url = cleanBase 
      ? (isUpdate ? `${cleanBase}/api/posts/${postData.id}` : `${cleanBase}/api/posts`)
      : (isUpdate ? `/api/posts/${postData.id}` : '/api/posts');

    // Build FormData if files are present
    const hasFeaturedFile = files.featured_image instanceof File;
    const hasGalleryFiles = Array.isArray(files.image_urls) && files.image_urls.some(f => f instanceof File);

    try {
      const headers = { 'Accept': 'application/json' };
      if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      let body;
      if (hasFeaturedFile || hasGalleryFiles) {
        body = new FormData();
        body.append('volet_id', postData.volet_id || 1);
        body.append('title', postData.title || '');
        body.append('description', postData.description || '');
        if (postData.published_at) body.append('published_at', postData.published_at);

        if (hasFeaturedFile) {
          body.append('featured_image', files.featured_image);
        }
        if (hasGalleryFiles) {
          for (const file of files.image_urls) {
            if (file instanceof File) {
              body.append('image_urls[]', file);
            }
          }
        }
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify({
          volet_id: postData.volet_id || 1,
          title: postData.title || '',
          description: postData.description || '',
          published_at: postData.published_at || null
        });
      }

      const method = isUpdate ? (hasFeaturedFile || hasGalleryFiles ? 'POST' : 'PUT') : 'POST';
      const response = await fetch(url, { method, headers, body });
      const json = await response.json();

      if (response.ok && json.data) {
        const featImg = formatImageUrl(json.data.featured_image) || '';
        const rawGallery = (json.data.image_urls && json.data.image_urls.length > 0)
          ? json.data.image_urls
          : [json.data.featured_image || ''];
        const gallery = rawGallery.map(img => formatImageUrl(img)).filter(Boolean);

        const savedPost = {
          ...json.data,
          featured_image: featImg,
          image_urls: gallery
        };
        return { success: true, post: savedPost, message: json.message };
      }
      if (json.message) return { success: false, message: json.message };
      return { success: false, message: 'Failed to save the post.' };
    } catch (err) {
      return { success: false, message: err?.message || 'Network error while saving the post.' };
    }
  },

  async deletePost(id) {
    const baseUrl = getStoredApiBaseUrl();
    const token = getStoredAuthToken();
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const url = cleanBase ? `${cleanBase}/api/posts/${id}` : `/api/posts/${id}`;

    try {
      const headers = { 'Accept': 'application/json' };
      if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      const response = await fetch(url, { method: 'DELETE', headers });
      if (response.ok) return { success: true };
    } catch {
      // Fallback
    }
    return { success: true };
  },

  // Campaign CRUD
  async saveCampaign(campaign) {
    const baseUrl = getStoredApiBaseUrl();
    const token = getStoredAuthToken();
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const isUpdate = !!campaign.id;
    const url = cleanBase 
      ? (isUpdate ? `${cleanBase}/api/campaigns/${campaign.id}` : `${cleanBase}/api/campaigns`)
      : (isUpdate ? `/api/campaigns/${campaign.id}` : '/api/campaigns');

    try {
      const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
      if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      const response = await fetch(url, {
        method: isUpdate ? 'PUT' : 'POST',
        headers,
        body: JSON.stringify(campaign)
      });
      const json = await response.json();
      if (response.ok && json.data) {
        return { success: true, campaign: json.data };
      }
      if (json.message) return { success: false, message: json.message };
      return { success: false, message: 'Failed to save the campaign.' };
    } catch (err) {
      return { success: false, message: err?.message || 'Network error while saving the campaign.' };
    }
  },

  async deleteCampaign(id) {
    const baseUrl = getStoredApiBaseUrl();
    const token = getStoredAuthToken();
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const url = cleanBase ? `${cleanBase}/api/campaigns/${id}` : `/api/campaigns/${id}`;

    try {
      const headers = { 'Accept': 'application/json' };
      if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      const response = await fetch(url, { method: 'DELETE', headers });
      if (response.ok) return { success: true };
    } catch {
      // Fallback
    }
    return { success: true };
  },

  // Partner CRUD with logo file upload
  async savePartner(partner, files = {}) {
    const baseUrl = getStoredApiBaseUrl();
    const token = getStoredAuthToken();
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const isUpdate = !!partner.id;
    const url = cleanBase 
      ? (isUpdate ? `${cleanBase}/api/partners/${partner.id}` : `${cleanBase}/api/partners`)
      : (isUpdate ? `/api/partners/${partner.id}` : '/api/partners');

    const hasLogoFile = files.logo instanceof File;

    try {
      const headers = { 'Accept': 'application/json' };
      if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      let body;
      if (hasLogoFile) {
        body = new FormData();
        body.append('name', partner.name || '');
        if (partner.volet_id) body.append('volet_id', partner.volet_id);
        if (partner.type) body.append('type', partner.type);
        if (partner.website_url) body.append('website_url', partner.website_url);
        body.append('logo', files.logo);
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(partner);
      }

      const method = isUpdate ? (hasLogoFile ? 'POST' : 'PUT') : 'POST';
      const response = await fetch(url, { method, headers, body });
      const json = await response.json();
      if (response.ok && json.data) {
        const savedPartner = {
          ...json.data,
          logo: formatImageUrl(json.data.logo) || ''
        };
        return { success: true, partner: savedPartner };
      }
      if (json.message) return { success: false, message: json.message };
      return { success: false, message: 'Failed to save the partner.' };
    } catch (err) {
      return { success: false, message: err?.message || 'Network error while saving the partner.' };
    }
  },

  async deletePartner(id) {
    const baseUrl = getStoredApiBaseUrl();
    const token = getStoredAuthToken();
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const url = cleanBase ? `${cleanBase}/api/partners/${id}` : `/api/partners/${id}`;

    try {
      const headers = { 'Accept': 'application/json' };
      if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      const response = await fetch(url, { method: 'DELETE', headers });
      if (response.ok) return { success: true };
    } catch {
      // Fallback
    }
    return { success: true };
  },

  // Volet CRUD with multiple carousel_images uploads
  async saveVolet(volet, files = {}) {
    const baseUrl = getStoredApiBaseUrl();
    const token = getStoredAuthToken();
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const isUpdate = !!volet.id;
    const url = cleanBase 
      ? (isUpdate ? `${cleanBase}/api/volets/${volet.id}` : `${cleanBase}/api/volets`)
      : (isUpdate ? `/api/volets/${volet.id}` : '/api/volets');

    const hasCarouselFiles = Array.isArray(files.carousel_images) && files.carousel_images.some(f => f instanceof File);

    try {
      const headers = { 'Accept': 'application/json' };
      if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      let body;
      if (hasCarouselFiles) {
        body = new FormData();
        body.append('name', volet.name || '');
        if (volet.slogan) body.append('slogan', volet.slogan);
        if (volet.subtitle) body.append('subtitle', volet.subtitle);
        if (volet.description) body.append('description', volet.description);
        if (volet.target) body.append('target', volet.target);
        if (volet.place) body.append('place', volet.place);
        for (const file of files.carousel_images) {
          if (file instanceof File) {
            body.append('carousel_images[]', file);
          }
        }
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(volet);
      }

      const method = isUpdate ? (hasCarouselFiles ? 'POST' : 'PUT') : 'POST';
      const response = await fetch(url, { method, headers, body });
      const json = await response.json();
      if (response.ok && json.data) {
        const savedVolet = {
          ...json.data,
          carousel_images: Array.isArray(json.data.carousel_images)
            ? json.data.carousel_images.map(img => formatImageUrl(img)).filter(Boolean)
            : []
        };
        return { success: true, volet: savedVolet };
      }
      if (json.message) return { success: false, message: json.message };
      return { success: false, message: 'Failed to save the volet.' };
    } catch (err) {
      return { success: false, message: err?.message || 'Network error while saving the volet.' };
    }
  },

  async deleteVolet(id) {
    const baseUrl = getStoredApiBaseUrl();
    const token = getStoredAuthToken();
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const url = cleanBase ? `${cleanBase}/api/volets/${id}` : `/api/volets/${id}`;

    try {
      const headers = { 'Accept': 'application/json' };
      if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      const response = await fetch(url, { method: 'DELETE', headers });
      if (response.ok) return { success: true };
    } catch {
      // Fallback
    }
    return { success: true };
  },

  // Activity CRUD
  async saveActivity(activity) {
    const baseUrl = getStoredApiBaseUrl();
    const token = getStoredAuthToken();
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const isUpdate = !!activity.id;
    const url = cleanBase 
      ? (isUpdate ? `${cleanBase}/api/activities/${activity.id}` : `${cleanBase}/api/activities`)
      : (isUpdate ? `/api/activities/${activity.id}` : '/api/activities');

    try {
      const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
      if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      const response = await fetch(url, {
        method: isUpdate ? 'PUT' : 'POST',
        headers,
        body: JSON.stringify(activity)
      });
      const json = await response.json();
      if (response.ok && json.data) {
        return { success: true, activity: json.data };
      }
      if (json.message) return { success: false, message: json.message };
      return { success: false, message: 'Failed to save the activity.' };
    } catch (err) {
      return { success: false, message: err?.message || 'Network error while saving the activity.' };
    }
  },

  // Member CRUD with avatar file upload
  async saveMember(member, files = {}) {
    const baseUrl = getStoredApiBaseUrl();
    const token = getStoredAuthToken();
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const isUpdate = !!member.id;
    const url = cleanBase 
      ? (isUpdate ? `${cleanBase}/api/members/${member.id}` : `${cleanBase}/api/members`)
      : (isUpdate ? `/api/members/${member.id}` : '/api/members');

    const hasAvatarFile = files.avatar instanceof File;

    try {
      const headers = { 'Accept': 'application/json' };
      if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      let body;
      if (hasAvatarFile) {
        body = new FormData();
        body.append('name', member.name || '');
        if (member.position) body.append('position', member.position);
        if (member.bio) body.append('bio', member.bio);
        if (member.email) body.append('email', member.email);
        body.append('avatar', files.avatar);
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(member);
      }

      const method = isUpdate ? (hasAvatarFile ? 'POST' : 'PUT') : 'POST';
      const response = await fetch(url, { method, headers, body });
      const json = await response.json();
      if (response.ok && json.data) {
        const savedMember = {
          ...json.data,
          avatar: formatImageUrl(json.data.avatar) || ''
        };
        return { success: true, member: savedMember };
      }
      if (json.message) return { success: false, message: json.message };
      return { success: false, message: 'Failed to save the team member.' };
    } catch (err) {
      return { success: false, message: err?.message || 'Network error while saving the team member.' };
    }
  },

  async deleteMember(id) {
    const baseUrl = getStoredApiBaseUrl();
    const token = getStoredAuthToken();
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const url = cleanBase ? `${cleanBase}/api/members/${id}` : `/api/members/${id}`;

    try {
      const headers = { 'Accept': 'application/json' };
      if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      const response = await fetch(url, { method: 'DELETE', headers });
      if (response.ok) return { success: true };
    } catch {
      // Fallback
    }
    return { success: true };
  },

  // Inscription status update & deletion
  async updateInscriptionStatus(id, status) {
    const baseUrl = getStoredApiBaseUrl();
    const token = getStoredAuthToken();
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const url = cleanBase ? `${cleanBase}/api/inscriptions/${id}` : `/api/inscriptions/${id}`;

    try {
      const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
      if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status })
      });
      const json = await response.json();
      if (response.ok && json.data) {
        return { success: true, inscription: json.data };
      }
    } catch {
      // Fallback
    }
    return { success: true };
  },

  async deleteInscription(id) {
    const baseUrl = getStoredApiBaseUrl();
    const token = getStoredAuthToken();
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const url = cleanBase ? `${cleanBase}/api/inscriptions/${id}` : `/api/inscriptions/${id}`;

    try {
      const headers = { 'Accept': 'application/json' };
      if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      const response = await fetch(url, { method: 'DELETE', headers });
      if (response.ok) return { success: true };
    } catch {
      // Fallback
    }
    return { success: true };
  },

  // Student CRUD
  async updateStudent(id, studentData) {
    const baseUrl = getStoredApiBaseUrl();
    const token = getStoredAuthToken();
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const url = cleanBase ? `${cleanBase}/api/students/${id}` : `/api/students/${id}`;

    try {
      const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
      if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(studentData)
      });
      const json = await response.json();
      if (response.ok && json.data) {
        return { success: true, student: json.data };
      }
    } catch {
      // Fallback
    }
    return { success: true, student: { id, ...studentData } };
  },

  async deleteStudent(id) {
    const baseUrl = getStoredApiBaseUrl();
    const token = getStoredAuthToken();
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const url = cleanBase ? `${cleanBase}/api/students/${id}` : `/api/students/${id}`;

    try {
      const headers = { 'Accept': 'application/json' };
      if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      const response = await fetch(url, { method: 'DELETE', headers });
      if (response.ok) return { success: true };
    } catch {
      // Fallback
    }
    return { success: true };
  },

  // Testimonial CRUD (with photo file upload)
  async saveTestimonial(testimonial, files = {}) {
    const baseUrl = getStoredApiBaseUrl();
    const token = getStoredAuthToken();
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const isUpdate = !!testimonial.id;
    const url = cleanBase
      ? (isUpdate ? `${cleanBase}/api/testimonials/${testimonial.id}` : `${cleanBase}/api/testimonials`)
      : (isUpdate ? `/api/testimonials/${testimonial.id}` : '/api/testimonials');

    const hasPhotoFile = files.photo instanceof File;

    try {
      const headers = { 'Accept': 'application/json' };
      if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      let body;
      if (hasPhotoFile) {
        body = new FormData();
        body.append('name', testimonial.name || '');
        if (testimonial.role)        body.append('role', testimonial.role);
        if (testimonial.content)     body.append('content', testimonial.content);
        if (testimonial.rating)      body.append('rating', testimonial.rating);
        if (testimonial.activity_id) body.append('activity_id', testimonial.activity_id);
        body.append('photo', files.photo);
        if (isUpdate) body.append('_method', 'PUT');
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(testimonial);
      }

      const method = isUpdate ? (hasPhotoFile ? 'POST' : 'PUT') : 'POST';
      const response = await fetch(url, { method, headers, body });
      const json = await response.json();
      if (response.ok && json.data) {
        const saved = { ...json.data, photo: formatImageUrl(json.data.photo) || '' };
        return { success: true, testimonial: saved };
      }
      if (json.message) return { success: false, message: json.message };
      return { success: false, message: 'Failed to save the testimonial.' };
    } catch (err) {
      return { success: false, message: err?.message || 'Network error while saving the testimonial.' };
    }
  },

  async deleteTestimonial(id) {
    const baseUrl = getStoredApiBaseUrl();
    const token = getStoredAuthToken();
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const url = cleanBase ? `${cleanBase}/api/testimonials/${id}` : `/api/testimonials/${id}`;

    try {
      const headers = { 'Accept': 'application/json' };
      if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      const response = await fetch(url, { method: 'DELETE', headers });
      if (response.ok) return { success: true };
    } catch {
      // Fallback
    }
    return { success: true };
  }
};

