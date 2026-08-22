export const SEED_VOLETS = [
  {
    id: 1,
    name: 'CRBN',
    slogan: 'Rebuild, Rehabilitate, Reintegrate',
    subtitle: 'Centre de Réhabilitation Birashoboka de Ngozi',
    description: 'The CRBN program supports vulnerable young girls and women towards a successful and dignified reintegration into society. Our holistic approach combines market-relevant practical vocational skills with intensive psychosocial counseling to ensure lasting empowerment and family reconciliation.',
    target: 'women',
    place: 'Ngozi & Bujumbura Mairie, Burundi',
  },
  {
    id: 2,
    name: 'Lyricure',
    slogan: 'Train, Qualify, Employ',
    subtitle: 'The Chris Lyricure Professional Training Center',
    description: 'The Chris Lyricure Center provides open community vocational training sessions in Maramvya and Bujumbura. Courses deliver immediately marketable skills allowing our graduates to create self-sustaining micro-enterprises or integrate into the local formal economy.',
    target: 'all',
    place: 'Maramvya & Bujumbura Centre, Burundi',
  }
];

export const SEED_ACTIVITIES = [
  {
    id: 1,
    volet_id: 1,
    title: 'Artisanal Soap & Cosmetics Production',
    description: 'Production and marketing of natural hygiene soaps and dermatological care products for local market supply.',
    icon: 'Soap'
  },
  {
    id: 2,
    volet_id: 1,
    title: 'Essential Life Skills & Leadership',
    description: 'Civic leadership, self-esteem, personal communication, and financial literacy workshops.',
    icon: 'Brain'
  },
  {
    id: 3,
    volet_id: 1,
    title: 'Psychosocial Counseling & Therapy',
    description: 'One-on-one psychological support, safe listening groups, and trauma rehabilitation.',
    icon: 'HeartHandshake'
  },
  {
    id: 4,
    volet_id: 1,
    title: 'Family Reintegration & Mediation',
    description: 'Community mediation, family counseling, and long-term socio-economic post-training follow-up.',
    icon: 'Home'
  },
  {
    id: 5,
    volet_id: 1,
    title: 'Reproductive Health & Prevention',
    description: 'Awareness campaigns on maternal health, hygiene, and combating gender-based violence (GBV).',
    icon: 'ShieldCheck'
  },
  {
    id: 6,
    volet_id: 1,
    title: 'Addictology & Substance Recovery',
    description: 'Specialized medical and psychosocial management for individuals recovering from substance dependence.',
    icon: 'HeartPulse'
  },
  {
    id: 7,
    volet_id: 2,
    title: 'Fashion Design & Garment Tailoring',
    description: 'Contemporary fashion design, industrial tailoring, garment alterations, and textile crafts.',
    icon: 'Scissors'
  },
  {
    id: 8,
    volet_id: 2,
    title: 'Practical Computer & Digital Literacy',
    description: 'Office productivity, database essentials, digital communication, and basic bookkeeping.',
    icon: 'Laptop'
  },
  {
    id: 9,
    volet_id: 2,
    title: 'Local Entrepreneurship & Business Plans',
    description: 'Micro-enterprise launch, cost budgeting, inventory management, and market pitching.',
    icon: 'Briefcase'
  },
  {
    id: 10,
    volet_id: 2,
    title: 'Professional Hairdressing & Beauty Care',
    description: 'Men and women styling, modern braiding, aesthetics, and salon management.',
    icon: 'Sparkles'
  }
];

export const SEED_POSTS = [
  {
    id: 1,
    volet_id: 1,
    title: 'Graduation of 85 Young Women in Artisanal Soap Making and Financial Literacy',
    description: 'A vibrant graduation ceremony was celebrated at the CRBN campus in Ngozi. Eighty-five graduates completed a comprehensive 6-month curriculum encompassing practical soap manufacturing, micro-credit basics, and psychosocial resilience.',
    featured_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
    image_urls: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80'
    ],
    published_at: '2026-08-15 10:00:00',
    created_at: '2026-08-15 10:00:00'
  },
  {
    id: 2,
    volet_id: 2,
    title: 'New Digital Literacy Lab Inauguration at The Chris Lyricure Center',
    description: 'Equipped with 30 modern workstations, the new computer lab will provide youth and adults with hands-on training in office computing, web research, and digital accounting to boost their employability in Bujumbura.',
    featured_image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    image_urls: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80'
    ],
    published_at: '2026-08-10 14:30:00',
    created_at: '2026-08-10 14:30:00'
  },
  {
    id: 3,
    volet_id: 1,
    title: 'Community Dialogue on Psychosocial Rehabilitation and Family Mediation',
    description: 'Birashoboka Center brought together local community leaders, religious figures, and families in Ntahangwa to discuss sustainable pathways for welcoming young mothers back into their home environments.',
    featured_image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
    image_urls: [
      'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1200&q=80'
    ],
    published_at: '2026-08-01 09:15:00',
    created_at: '2026-08-01 09:15:00'
  },
  {
    id: 4,
    volet_id: 2,
    title: 'Fashion and Textile Exhibition: Showcasing Works by Tailoring Apprentices',
    description: 'Apprentices of the Lyricure Center presented their bespoke clothing designs, wedding attires, and traditional creations to local buyers and fashion retailers in Burundi.',
    featured_image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
    image_urls: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80'
    ],
    published_at: '2026-07-22 16:00:00',
    created_at: '2026-07-22 16:00:00'
  },
  {
    id: 5,
    volet_id: 1,
    title: 'Health and Reproductive Rights Workshop Held in Partnership with UNFPA',
    description: 'Over 150 young women participated in awareness sessions focusing on menstrual hygiene, family planning, and legal protection against domestic violence and abuse.',
    featured_image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
    image_urls: [
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80'
    ],
    published_at: '2026-07-15 11:00:00',
    created_at: '2026-07-15 11:00:00'
  },
  {
    id: 6,
    volet_id: 2,
    title: 'Micro-Enterprise Pitch Day: 12 Graduate Teams Receive Starter Kits',
    description: 'Birashoboka Center and its partners distributed startup equipment kits (sewing machines, hairdressing sets, and soap molds) to promising micro-enterprises launched by our cohort.',
    featured_image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    image_urls: [
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80'
    ],
    published_at: '2026-07-04 13:20:00',
    created_at: '2026-07-04 13:20:00'
  },
  {
    id: 7,
    volet_id: 1,
    title: 'Psychological Support Groups: Fostering Safe Spaces for Vulnerable Youth',
    description: 'Every week, qualified counselors at CRBN conduct group therapy circles where participants rebuild their self-confidence and develop collaborative conflict-resolution methods.',
    featured_image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1200&q=80',
    image_urls: [
      'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1200&q=80'
    ],
    published_at: '2026-06-20 15:45:00',
    created_at: '2026-06-20 15:45:00'
  },
  {
    id: 8,
    volet_id: 2,
    title: 'Professional Hairdressing and Aesthetics Bootcamp in Maramvya',
    description: 'Intensive practical session covering contemporary styles, scalp treatments, hygiene protocols, and customer relationship management for beauty salon owners.',
    featured_image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
    image_urls: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80'
    ],
    published_at: '2026-06-12 10:10:00',
    created_at: '2026-06-12 10:10:00'
  },
  {
    id: 9,
    volet_id: 1,
    title: 'Annual Review: Over 5,000 Direct Beneficiaries Empowered Since 2021',
    description: 'Looking back at 5 years of field achievements across Ngozi and Bujumbura. The report highlights increased economic self-sufficiency and reduced gender violence in target areas.',
    featured_image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
    image_urls: [
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80'
    ],
    published_at: '2026-05-30 08:30:00',
    created_at: '2026-05-30 08:30:00'
  },
  {
    id: 10,
    volet_id: 2,
    title: 'Youth Leadership and Civic Engagement Seminar',
    description: 'Fostering active citizenship, community responsibility, and peer mentorship among young Burundians through interactive workshops and real-world civic initiatives.',
    featured_image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80',
    image_urls: [
      'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80'
    ],
    published_at: '2026-05-18 12:00:00',
    created_at: '2026-05-18 12:00:00'
  }
];

export const SEED_PARTNERS = [
  {
    id: 1,
    name: 'UNFPA Burundi',
    type: 'UN Agency & Health Partner',
    logo: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=400&q=80',
    website_url: 'https://burundi.unfpa.org/fr',
    volet_id: 1
  },
  {
    id: 2,
    name: 'Resilience Fund',
    type: 'International Development Fund',
    logo: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=400&q=80',
    volet_id: null
  },
  {
    id: 3,
    name: 'PNILMCNT Burundi',
    type: 'National Health Program',
    logo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80',
    volet_id: 1
  },
  {
    id: 4,
    name: 'ABS (Alliance Burundaise)',
    type: 'Local Community Health Partner',
    logo: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=400&q=80',
    volet_id: 1
  },
  {
    id: 5,
    name: 'Global gGmbH (EG)',
    type: 'International NGO Partner',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
    volet_id: 2
  },
  {
    id: 6,
    name: 'HVP Makebuko Foundation',
    type: 'Institutional Partner',
    logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
    volet_id: null
  }
];

export const SEED_TESTIMONIALS = [
  {
    id: 1,
    activity_id: 7,
    name: 'Espérance N.',
    role: 'Lyricure Graduate · Class of 2022',
    content: 'The tailoring training at Lyricure turned my passion into a sustainable business. I opened my own workshop in Ngagara and now proudly employ two other young women from my neighborhood.',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 2,
    activity_id: 1,
    name: 'Chantal M.',
    role: 'CRBN Soap Making Graduate · Ngozi',
    content: 'Before arriving at CRBN, I had no income and struggled to support my children. The combination of soap-making crafts and psychological coaching gave me back my dignity and self-reliance.',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 3,
    activity_id: 8,
    name: 'Jean-Claude K.',
    role: 'Lyricure Digital Literacy Alumnus',
    content: 'Learning office computing and accounting gave me the exact skills needed to secure a position as administrative assistant at a local trading firm. It completely changed my family’s future.',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 4,
    activity_id: 10,
    name: 'Francine B.',
    role: 'Beauty Care Graduate · Maramvya',
    content: 'The apprenticeship gave me technical salon skills and financial management habits. I was able to buy my initial kit and now run a steady salon serving dozens of clients weekly.',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80'
  }
];

export const SEED_CAMPAIGNS = [
  {
    id: 1,
    volet_id: 1,
    activity_id: 1,
    edition: 'Cohort 2026-B',
    title: 'Intensive Artisanal Soap & Business Incubation Program',
    description: 'Free vocational training and psychosocial rehabilitation enrollment for vulnerable young women in Ngozi and Bujumbura. Includes starter kit and mentorship.',
    registration_start: '2026-08-01',
    registration_end: '2026-09-30',
    start_date: '2026-10-05',
    end_date: '2027-04-05',
    place: 'CRBN Campus — Rusuguti, Ngozi & Ntahangwa, Bujumbura',
    is_open: true,
    quota: 100
  },
  {
    id: 2,
    volet_id: 2,
    activity_id: 8,
    edition: 'Fall 2026',
    title: 'Computer Essentials & Office Automation Training',
    description: 'Evening and weekend courses open to youth and professionals seeking digital proficiency and micro-business accounting.',
    registration_start: '2026-08-15',
    registration_end: '2026-09-15',
    start_date: '2026-09-20',
    end_date: '2026-12-20',
    place: 'The Chris Lyricure Center — Maramvya',
    is_open: true,
    quota: 45
  }
];

export const SEED_STUDENTS = [
  {
    id: 1,
    name: 'Aline Irakoze',
    gender: 'female',
    age: 21,
    birth_date: '2005-04-12',
    phone: '+257 79 123 456',
    email: 'aline.irakoze@example.bi',
    nationality: 'Burundaise',
    province: 'Ngozi',
    commune: 'Ngozi',
    address: 'Quartier Rusuguti, Av. des Artisans',
    vulnerability_category: 'Young Mother / Unemployed',
    education_level: 'Fundamental School (9ème)',
    interest: 'Soap Manufacturing and Micro-business management',
    created_at: '2026-08-18 09:30:00'
  },
  {
    id: 2,
    name: 'Diane Niyonsaba',
    gender: 'female',
    age: 19,
    birth_date: '2007-02-28',
    phone: '+257 68 456 789',
    email: 'diane.niyonsaba@example.bi',
    nationality: 'Burundaise',
    province: 'Bujumbura Mairie',
    commune: 'Ntahangwa',
    address: 'Quartier Kamenge, 8ème Avenue',
    vulnerability_category: 'Out of School Girl',
    education_level: 'Primary Completed',
    interest: 'Fashion Design & Tailoring',
    created_at: '2026-08-19 11:15:00'
  },
  {
    id: 3,
    name: 'Jean-Claude Ndayiragije',
    gender: 'male',
    age: 23,
    birth_date: '2003-09-14',
    phone: '+257 71 908 123',
    email: null,
    nationality: 'Burundaise',
    province: 'Bujumbura Rural',
    commune: 'Mutimbuzi',
    address: 'Maramvya, Zone Rukaramu',
    vulnerability_category: 'Unemployed Youth',
    education_level: 'Secondary Completed (Humanités Générales)',
    interest: 'Computer & Digital Office Management',
    created_at: '2026-08-20 14:00:00'
  },
  {
    id: 4,
    name: 'Chantal Nahimana',
    gender: 'female',
    age: 24,
    birth_date: '2002-11-03',
    phone: '+257 76 345 890',
    email: null,
    nationality: 'Burundaise',
    province: 'Ngozi',
    commune: 'Mwumba',
    address: 'Colline Buye, Ngozi',
    vulnerability_category: 'GBV Survivor / Solo Parent',
    education_level: 'Fundamental 7ème',
    interest: 'Artisanal Soap, Cosmetology & Mental Health Support',
    created_at: '2026-08-20 16:45:00'
  },
  {
    id: 5,
    name: 'Fabrice Nkurunziza',
    gender: 'male',
    age: 22,
    birth_date: '2004-06-19',
    phone: '+257 79 881 234',
    email: 'fabrice.nkurunziza@example.bi',
    nationality: 'Burundaise',
    province: 'Bujumbura Mairie',
    commune: 'Mukaza',
    address: 'Quartier Bwiza, 4ème Avenue',
    vulnerability_category: 'Career Seeker',
    education_level: 'Secondary Technical (D7)',
    interest: 'Professional Hairdressing & Salon Aesthetics',
    created_at: '2026-08-21 08:20:00'
  }
];

export const SEED_INSCRIPTIONS = [
  {
    id: 1,
    reference_number: 'INS-2026-001',
    campaign_id: 1,
    student_id: 1,
    volet_id: 1,
    activity_id: 1,
    status: 'approved',
    motivation: 'I wish to master the craft of organic dermatological soaps so I can generate stable income for my baby daughter and achieve financial autonomy.',
    previous_experience: 'Assisted in local family palm oil processing for 6 months.',
    preferred_schedule: 'morning',
    preferred_center: 'ngozi',
    notes: 'Dossier complete. Starter kit reserved.',
    created_at: '2026-08-18 09:30:00'
  },
  {
    id: 2,
    reference_number: 'INS-2026-002',
    campaign_id: 1,
    student_id: 2,
    volet_id: 2,
    activity_id: 7,
    status: 'pending',
    motivation: 'Passionate about tailoring and modern garment design. Would like to launch an atelier with my sister in Kamenge.',
    previous_experience: 'Basic hand stitching skills.',
    preferred_schedule: 'morning',
    preferred_center: 'bujumbura',
    notes: 'Interview scheduled with Technical Coordinator.',
    created_at: '2026-08-19 11:15:00'
  },
  {
    id: 3,
    reference_number: 'INS-2026-003',
    campaign_id: 2,
    student_id: 3,
    volet_id: 2,
    activity_id: 8,
    status: 'approved',
    motivation: 'Seeking digital tools expertise to manage business bookkeeping and improve my job readiness.',
    previous_experience: 'Basic smartphone usage and typing.',
    preferred_schedule: 'evening',
    preferred_center: 'bujumbura',
    notes: 'Approved for Fall 2026 cohort evening batch.',
    created_at: '2026-08-20 14:00:00'
  },
  {
    id: 4,
    reference_number: 'INS-2026-004',
    campaign_id: 1,
    student_id: 4,
    volet_id: 1,
    activity_id: 1,
    status: 'approved',
    motivation: 'Need urgent economic empowerment and emotional healing support after difficult domestic circumstances.',
    previous_experience: 'None, very eager to learn from scratch.',
    preferred_schedule: 'morning',
    preferred_center: 'ngozi',
    notes: 'Assigned to Dr. Sylvie Bukuru counseling cohort as well.',
    created_at: '2026-08-20 16:45:00'
  },
  {
    id: 5,
    reference_number: 'INS-2026-005',
    campaign_id: 2,
    student_id: 5,
    volet_id: 2,
    activity_id: 10,
    status: 'pending',
    motivation: 'I plan to open an urban salon providing hygienic haircutting and beauty care services for young professionals.',
    previous_experience: 'Apprentice for 3 months at local barbershop.',
    preferred_schedule: 'afternoon',
    preferred_center: 'bujumbura',
    notes: 'Awaiting national ID verification copy.',
    created_at: '2026-08-21 08:20:00'
  }
];

export const SEED_MEMBERS = [
  {
    id: 1,
    name: 'Gérard Nishimwe',
    position: 'Executive Director & General Coordinator',
    bio: 'Guiding strategic programs, institutional partnerships, and community health interventions across Burundi.',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    email: 'direction@birashobokacenter.org'
  },
  {
    id: 2,
    name: 'Marie-Rose Nizigiyimana',
    position: 'Technical & Operational Coordinator',
    bio: 'Oversees daily vocational workshops, curriculum design, trainer accreditation, and field evaluations.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    email: 'operations@birashobokacenter.org'
  },
  {
    id: 3,
    name: 'Jean-Baptiste Hakizimana',
    position: 'Finance & Administration Officer',
    bio: 'Ensuring rigorous financial governance, procurement integrity, anti-fraud compliance, and donor reporting.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    email: 'finance@birashobokacenter.org'
  },
  {
    id: 4,
    name: 'Dr. Sylvie Bukuru',
    position: 'Head of Psychosocial & Health Care',
    bio: 'Clinical psychologist specializing in trauma rehabilitation, family mediation, and youth addictology support.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    email: 'sante@birashobokacenter.org'
  },
  {
    id: 5,
    name: 'Aimable Nduwayo',
    position: 'Logistics & Resource Management',
    bio: 'Manages workshop equipment supplies, quality control for artisanal products, and infrastructure maintenance.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    email: 'logistique@birashobokacenter.org'
  }
];
