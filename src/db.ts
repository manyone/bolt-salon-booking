import { Booking, Service, Staffer } from './types';
import { formatDateForDisplay } from './utils/dates';

export class Database {
  private storage = localStorage;
  private readonly BOOKINGS_KEY = 'bookings';
  private readonly SERVICES_KEY = 'services';
  private readonly STAFFERS_KEY = 'staffers';

  constructor() {
    // Initialize with default data if empty
    if (!this.storage.getItem(this.SERVICES_KEY)) {
      this.storage.setItem(this.SERVICES_KEY, JSON.stringify(this.getDefaultServices()));
    }
    if (!this.storage.getItem(this.STAFFERS_KEY)) {
      this.storage.setItem(this.STAFFERS_KEY, JSON.stringify(this.getDefaultStaffers()));
    }
    if (!this.storage.getItem(this.BOOKINGS_KEY)) {
      this.storage.setItem(this.BOOKINGS_KEY, JSON.stringify([]));
    }
  }

  // Bookings
  async getBookings(): Promise<Booking[]> {
    return JSON.parse(this.storage.getItem(this.BOOKINGS_KEY) || '[]');
  }

  async addBooking(booking: Omit<Booking, 'id' | 'status' | 'createdAt'>): Promise<Booking> {
    const bookings = await this.getBookings();
    const newBooking: Booking = {
      ...booking,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      date: formatDateForDisplay(booking.date),
      createdAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    this.storage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings));
    return newBooking;
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
    const bookings = await this.getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Booking not found');
    
    bookings[index] = { ...bookings[index], ...updates };
    this.storage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings));
    return bookings[index];
  }

  async deleteBooking(id: string): Promise<void> {
    const bookings = await this.getBookings();
    const filtered = bookings.filter(b => b.id !== id);
    this.storage.setItem(this.BOOKINGS_KEY, JSON.stringify(filtered));
  }

  // Services
  async getServices(): Promise<Service[]> {
    return JSON.parse(this.storage.getItem(this.SERVICES_KEY) || '[]');
  }

  async updateServices(services: Service[]): Promise<void> {
    this.storage.setItem(this.SERVICES_KEY, JSON.stringify(services));
  }

  // Staffers
  async getStaffers(): Promise<Staffer[]> {
    return JSON.parse(this.storage.getItem(this.STAFFERS_KEY) || '[]');
  }

  async updateStaffers(staffers: Staffer[]): Promise<void> {
    this.storage.setItem(this.STAFFERS_KEY, JSON.stringify(staffers));
  }

  private getDefaultServices(): Service[] {
    return [
      { id: '1', name: 'Haircut & Styling', duration: '60 min', price: 80 },
      { id: '2', name: 'Hair Coloring', duration: '120 min', price: 150 },
      { id: '3', name: 'Facial Treatment', duration: '45 min', price: 65 },
      { id: '4', name: 'Manicure & Pedicure', duration: '90 min', price: 95 },
    ];
  }

  private getDefaultStaffers(): Staffer[] {
    return [
      { 
        id: '1', 
        name: 'Sarah Johnson', 
        color: '#FFE4E8',
        specialties: ['Haircut', 'Color', 'Style']
      },
      { 
        id: '2', 
        name: 'Michael Chen', 
        color: '#E8E4FF',
        specialties: ['Color', 'Treatment', 'Style']
      },
      { 
        id: '3', 
        name: 'Emily Davis', 
        color: '#E4FFF9',
        specialties: ['Haircut', 'Style', 'Treatment']
      },
      { 
        id: '4', 
        name: 'David Wilson', 
        color: '#FFE4E1',
        specialties: ['Color', 'Treatment', 'Style']
      },
    ];
  }
}