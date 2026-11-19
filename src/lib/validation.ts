export type Errors<T> = Partial<Record<keyof T, string>>;

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

/** Indian mobile: 10 digits starting 6–9, optional +91 / 91 / 0 prefix, spaces or dashes allowed. */
export function isValidIndianMobile(mobile: string): boolean {
  const digits = mobile.replace(/[\s-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, "");
  return /^[6-9]\d{9}$/.test(digits);
}

export interface ReservationInput {
  name: string;
  mobile: string;
  email: string;
  date: string;
  time: string;
  guests: string;
  preference: string;
  requests: string;
}

export function validateReservation(v: ReservationInput, today: string): Errors<ReservationInput> {
  const e: Errors<ReservationInput> = {};
  if (v.name.trim().length < 2) e.name = "Please enter your full name.";
  if (!v.mobile.trim()) e.mobile = "Mobile number is required.";
  else if (!isValidIndianMobile(v.mobile)) e.mobile = "Enter a valid 10-digit Indian mobile number.";
  if (!v.email.trim()) e.email = "Email address is required.";
  else if (!isValidEmail(v.email)) e.email = "Enter a valid email address.";
  if (!v.date) e.date = "Choose a reservation date.";
  else if (v.date < today) e.date = "Date cannot be in the past.";
  if (!v.time) e.time = "Choose a preferred time.";
  const g = Number(v.guests);
  if (!v.guests) e.guests = "Select number of guests.";
  else if (!Number.isInteger(g) || g < 1 || g > 50) e.guests = "Guests must be between 1 and 50.";
  if (!v.preference) e.preference = "Select a dining preference.";
  if (v.requests.length > 500) e.requests = "Keep special requests under 500 characters.";
  return e;
}

export interface EnquiryInput {
  name: string;
  mobile: string;
  email: string;
  subject: string;
  message: string;
}

export function validateEnquiry(v: EnquiryInput): Errors<EnquiryInput> {
  const e: Errors<EnquiryInput> = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!v.mobile.trim()) e.mobile = "Mobile number is required.";
  else if (!isValidIndianMobile(v.mobile)) e.mobile = "Enter a valid 10-digit Indian mobile number.";
  if (!v.email.trim()) e.email = "Email address is required.";
  else if (!isValidEmail(v.email)) e.email = "Enter a valid email address.";
  if (v.subject.trim().length < 3) e.subject = "Please add a subject.";
  if (v.message.trim().length < 10) e.message = "Message should be at least 10 characters.";
  return e;
}

export function checkAdminCredentials(
  email: string,
  password: string,
  profile: { email: string; password: string },
): boolean {
  return email.trim().toLowerCase() === profile.email.trim().toLowerCase() && password === profile.password;
}

export function hasErrors<T>(e: Errors<T>): boolean {
  return Object.values(e).some(Boolean);
}
