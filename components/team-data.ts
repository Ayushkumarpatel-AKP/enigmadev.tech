/* Team data — server + client dono se import kar sakte ho (isme 'use client' nahi hai) */

export type Member = {
  name: string;
  title: string;
  role: string;
  bio: string;
  tags: string[];
  tracks: string[];
  initials: string;
  photo?: string;
  pos?: string;
  fit?: 'cover' | 'contain';
  zoom?: number;
  links?: { linkedin?: string; github?: string };
};

export const TEAM: Member[] = [
  {
    name: 'Ayush Kumar Patel',
    title: 'Founder',
    role: 'Full-Stack Developer',
    bio: 'Full-stack developer with hands-on hardware experience. Built the ISL Glove and eRakshak. 3× hackathon winner and Toastmaster.',
    tags: ['Full-Stack', 'Hardware', 'ISL Glove', '3× Hackathon Winner'],
    tracks: ['Full-Stack', 'Hardware'],
    initials: 'AP',
    photo: '/images/team/ayush-new.jpg',
    pos: '50% 12%',
    fit: 'contain',
    zoom: 1.35,
    links: { linkedin: 'https://www.linkedin.com/in/ayush-kumar-patel-50276a281/', github: 'https://github.com/Ayushkumarpatel-AKP' },
  },
  {
    name: 'Shriyansh Upadhyay',
    title: 'Co-Founder & COO',
    role: 'Backend Developer',
    bio: 'Backend developer who writes research papers, not just APIs. Runs operations and keeps ambitious builds shippable.',
    tags: ['Backend', 'Research', 'Operations'],
    tracks: ['Backend'],
    initials: 'SU',
    photo: '/images/team/shreyansh.png',
    links: { linkedin: 'https://www.linkedin.com/in/shriyansh-upadhyay-a89b37344/', github: 'https://github.com/cse-ai-shriyansh' },
  },
  {
    name: 'T. Prashant',
    title: 'Co-Founder & CFO',
    role: 'Backend Developer',
    bio: 'Backend developer with real hardware experience. Owns the numbers and the systems thinking behind every build.',
    tags: ['Backend', 'Hardware', 'Finance'],
    tracks: ['Backend', 'Hardware'],
    initials: 'TP',
    photo: '/images/team/prashant.png',
    links: { linkedin: 'https://www.linkedin.com/in/t-prashant-b59160334', github: 'https://github.com/prashant847' },
  },
  {
    name: 'Suraj Jangde',
    title: 'Co-Founder & CTO',
    role: 'Hardware Lead',
    bio: 'Deep hardware experience, MSME-selected builder. Leads the technical vision across embedded systems and product.',
    tags: ['Hardware', 'Embedded', 'MSME Selected'],
    tracks: ['Hardware'],
    initials: 'SJ',
    photo: '/images/team/suraj.png',
    links: { linkedin: 'https://www.linkedin.com/in/-surajjangde/', github: 'https://github.com/wintereason' },
  },
  {
    name: 'Vaibhav Sharma',
    title: 'Co-Founder & CHRO',
    role: 'Full-Stack Developer',
    bio: 'Full-stack developer with hardware experience. 3× hackathon winner and MANAK National Award recipient.',
    tags: ['Full-Stack', 'Hardware', 'MANAK Awardee'],
    tracks: ['Full-Stack', 'Hardware'],
    initials: 'VS',
    photo: '/images/team/vaibhav.png',
    zoom: 1.15,
    links: { linkedin: 'https://www.linkedin.com/in/vaibhav-sharma0230/', github: 'https://github.com/Vaibhav9526' },
  },
];
