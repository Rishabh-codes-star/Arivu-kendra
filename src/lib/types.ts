export type Language = "English" | "Kannada" | "Hindi";
export type AgeGroup = "3+" | "6+" | "8+" | "10+" | "12+" | "14+" | "16+" | "All ages";
export type CoverStyle = "band" | "block" | "circle" | "stripe" | "frame" | "sun" | "stars" | "grid" | "arch";
export type Motif = "stars" | "books" | "leaves" | "kites" | "rockets" | "map" | "pencil" | "bridge" | "lantern" | "placeholder";

export interface Organization {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  focus: string[];
  website?: string;
  color: string;
  color2: string;
  ink: "light" | "dark";
  motif: Motif;
  languages: Language[];
  image?: string;
  imagePrompt: string;
  placeholder?: boolean;
  noApprovalRequired?: boolean;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explain?: string;
}

export interface DiscussionPost {
  id: string;
  author: string;
  role: string;
  when: string;
  text: string;
  likes?: number;
  replies?: DiscussionPost[];
}

export interface Review {
  author: string;
  role: string;
  rating: number;
  title: string;
  text: string;
  when: string;
}

export interface BookCover {
  bg: string;
  fg: string;
  accent: string;
  style: CoverStyle;
}

export interface Book {
  slug: string;
  title: string;
  titleLatin?: string;
  subtitle?: string;
  author: string;
  illustrator?: string;
  org: string;
  genre: string;
  tags: string[];
  language: Language;
  ageGroup: AgeGroup;
  pages: number;
  year: number;
  readingTime: number;
  rating: number;
  ratingsCount: number;
  description: string;
  editorsNote?: string;
  hasAudio: boolean;
  license: string;
  isbn?: string;
  trending?: number;
  cover: BookCover;
  chapters: string[];
  quiz: QuizQuestion[];
  discussion: DiscussionPost[];
  reviews?: Review[];
}
