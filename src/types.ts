export interface Volet {
  id: number;
  name: string;
  slogan?: string | null;
  subtitle?: string | null;
  description?: string | null;
  target: 'young' | 'women' | 'all';
  place: string;
  created_at?: string;
  updated_at?: string;
  activities?: Activity[];
  partners?: Partner[];
  posts?: Post[];
  campaigns?: Campaign[];
}

export interface Activity {
  id: number;
  volet_id: number;
  title: string;
  description: string;
  icon?: string;
  created_at?: string;
  updated_at?: string;
  volet?: Volet;
}

export interface Partner {
  id: number;
  name: string;
  volet_id?: number | null;
  logo?: string;
  type?: string;
  website_url?: string;
  created_at?: string;
  updated_at?: string;
  volet?: Volet;
}

export interface Testimonial {
  id: number;
  activity_id?: number | null;
  name: string;
  photo?: string | null;
  role?: string;
  content: string;
  rating?: number;
  created_at?: string;
  updated_at?: string;
  activity?: Activity;
}

export interface Post {
  id: number;
  volet_id: number;
  title: string;
  description: string;
  featured_image?: string;
  image_urls?: string[];
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
  volet?: Volet;
}

export interface Campaign {
  id: number;
  volet_id: number;
  activity_id?: number | null;
  edition: string;
  title: string;
  description: string;
  registration_start?: string | null;
  registration_end?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  place: string;
  is_open?: boolean;
  quota?: number;
  created_at?: string;
  updated_at?: string;
  volet?: Volet;
  activity?: Activity;
}

export interface Student {
  id: number;
  name: string;
  email?: string | null;
  phone: string;
  gender?: 'male' | 'female' | 'other' | null;
  age?: number | null;
  birth_date?: string | null;
  address?: string | null;
  commune?: string | null;
  province?: string | null;
  nationality: string;
  vulnerability_category?: string | null;
  education_level?: string | null;
  interest?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Inscription {
  id: number;
  reference_number?: string;
  campaign_id: number;
  student_id: number;
  volet_id?: number;
  activity_id?: number | null;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  motivation?: string | null;
  previous_experience?: string | null;
  preferred_schedule?: 'morning' | 'afternoon' | 'evening' | 'weekend' | null;
  preferred_center?: 'ngozi' | 'bujumbura' | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  campaign?: Campaign;
  student?: Student;
  volet?: Volet;
  activity?: Activity;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'coordinator' | 'staff';
  avatar?: string;
}


export interface Member {
  id: number;
  name: string;
  position: string;
  bio?: string | null;
  avatar: string;
  email?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}
