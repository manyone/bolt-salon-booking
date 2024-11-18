import React, { useState, useEffect } from 'react';
import { Database } from '../db';
import { Booking } from '../types';
import StaffManager from '../components/StaffManager';
import ServiceManager from '../components/ServiceManager';
import BookingList from '../components/BookingList';
import CalendarView from '../components/CalendarView';
import { Calendar as CalendarIcon, Users, Scissors, List } from 'lucide-react';

interface AdminDashboardProps {
  db: Database;
}

type AdminView = 'bookings' | 'calendar' | 'staff' | 'services';

export default function AdminDashboard({ db }: AdminDashboardProps) {
  const [view, setView] = useState<AdminView>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const loadedBookings = await db.getBookings();
    setBookings(loadedBookings);
  };

  const handleUpdateBooking = async (booking: Booking) => {
    await db.updateBooking(booking.id, booking);
    await loadBookings();
  };

  const handleDeleteBooking = async (id: string) => {
    await db.deleteBooking(id);
    await loadBookings();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setView('bookings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              view === 'bookings' 
                ? 'bg-pink-100 text-pink-800' 
                : 'hover:bg-gray-100'
            }`}
          >
            <List className="w-4 h-4" />
            Bookings List
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              view === 'calendar' 
                ? 'bg-pink-100 text-pink-800' 
                : 'hover:bg-gray-100'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            Calendar
          </button>
          <button
            onClick={() => setView('staff')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              view === 'staff' 
                ? 'bg-pink-100 text-pink-800' 
                : 'hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4" />
            Staff
          </button>
          <button
            onClick={() => setView('services')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              view === 'services' 
                ? 'bg-pink-100 text-pink-800' 
                : 'hover:bg-gray-100'
            }`}
          >
            <Scissors className="w-4 h-4" />
            Services
          </button>
        </div>
      </div>

      {view === 'bookings' && (
        <BookingList
          bookings={bookings}
          onUpdateBooking={handleUpdateBooking}
          onDeleteBooking={handleDeleteBooking}
        />
      )}

      {view === 'calendar' && (
        <CalendarView
          bookings={bookings}
          onUpdateBooking={handleUpdateBooking}
          onDeleteBooking={handleDeleteBooking}
        />
      )}

      {view === 'staff' && (
        <StaffManager db={db} />
      )}

      {view === 'services' && (
        <ServiceManager db={db} />
      )}
    </div>
  );
}