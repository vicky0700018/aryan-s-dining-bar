export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  showOnHome: boolean;
  order: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  isVeg: boolean;
  isFeatured: boolean;
  isChefSpecial: boolean;
  available: boolean;
  image: string;
}

export const RESERVATION_STATUSES = ["Pending", "Confirmed", "Cancelled", "Completed"] as const;
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

export const DINING_PREFERENCES = [
  "Family Dining",
  "Bar Area",
  "General Dining",
  "Special Occasion",
  "Candlelight Dinner",
] as const;
export type DiningPreference = (typeof DINING_PREFERENCES)[number];

export interface Reservation {
  id: string;
  name: string;
  mobile: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  preference: DiningPreference;
  requests: string;
  status: ReservationStatus;
  createdAt: string;
}

export const GALLERY_CATEGORIES = [
  "Restaurant Interior",
  "Food & Dishes",
  "Family Dining",
  "Bar Area",
  "Sports Bar",
  "Special Events",
  "Live Entertainment",
] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export interface GalleryImage {
  id: string;
  title: string;
  category: GalleryCategory;
  image: string;
  caption: string;
}

export const EVENT_CATEGORIES = [
  "Live Music",
  "Sports Screening",
  "Karaoke",
  "Candlelight Dinner",
  "Celebration",
  "Group Dining",
] as const;
export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export const EVENT_STATUSES = ["Upcoming", "Recurring", "Completed", "Draft"] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];

export interface EventItem {
  id: string;
  title: string;
  category: EventCategory;
  description: string;
  date: string;
  time: string;
  image: string;
  status: EventStatus;
}

export const ENQUIRY_STATUSES = ["New", "In Progress", "Resolved", "Closed"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export interface Enquiry {
  id: string;
  name: string;
  mobile: string;
  email: string;
  subject: string;
  message: string;
  status: EnquiryStatus;
  notes: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  occasion: string;
  quote: string;
  rating: number;
  visible: boolean;
}

export interface FeatureBlock {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface HomepageContent {
  heroBrand: string;
  heroHeading: string;
  heroDescription: string;
  heroImage: string;
  welcomeTitle: string;
  welcomeText: string;
  welcomeImage: string;
  diningExperiences: FeatureBlock[];
  whyChoose: FeatureBlock[];
  featuredDishIds: string[];
  reservationHeading: string;
  reservationDescription: string;
  reservationButton: string;
  reservationImage: string;
}

export interface AboutContent {
  bannerImage: string;
  heading: string;
  intro: string;
  story: string;
  storyImage: string;
  philosophy: string;
  familyDining: string;
  barExperience: string;
  ambience: string;
  ambienceImage: string;
  highlights: FeatureBlock[];
  images: FeatureBlock[];
}

export interface BusinessSettings {
  name: string;
  tagline: string;
  address: string;
  phone1: string;
  phone2: string;
  email: string;
  whatsapp: string;
  hours: string;
  about: string;
  instagram: string;
  facebook: string;
  youtube: string;
  google: string;
}

export interface AdminProfile {
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
}

export interface Activity {
  id: string;
  message: string;
  at: string;
}

export interface StoreData {
  categories: MenuCategory[];
  menu: MenuItem[];
  reservations: Reservation[];
  gallery: GalleryImage[];
  events: EventItem[];
  enquiries: Enquiry[];
  testimonials: Testimonial[];
  homepage: HomepageContent;
  about: AboutContent;
  settings: BusinessSettings;
  profile: AdminProfile;
  activity: Activity[];
}

export type CollectionKey =
  | "categories"
  | "menu"
  | "reservations"
  | "gallery"
  | "events"
  | "enquiries"
  | "testimonials";

export type SingletonKey = "homepage" | "about" | "settings" | "profile";
