export interface Booking {
  id: string;
  name: string;
  date: string;
  time: string;
  service: string;
  stafferId: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Staffer {
  id: string;
  name: string;
  color: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}