export interface Booking {
  id: string;
  name: string;
  email: string;
  phone?: string;
  communicationPreference: 'email' | 'sms' | 'both';
  date: string;
  time: string;
  service: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'declined';
  createdAt: string;
  stafferId: string | null;
  declineReason?: string;
}

export interface Service {
  id: string;
  name: string;
  duration: string;
  price: number;
}

export interface Staffer {
  id: string;
  name: string;
  color: string;
  specialties: string[];
}

export interface BookingFormData {
  name: string;
  email: string;
  phone?: string;
  communicationPreference: string;
  date: string;
  time: string;
  service: string;
  stafferId: string;
}