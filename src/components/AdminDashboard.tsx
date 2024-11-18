import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, Filter, Calendar as CalendarViewIcon, Users, Scissors } from 'lucide-react';
import { Booking } from '../types';
import { staffers } from '../data/staffers';
import CalendarView from './CalendarView';
import StaffManager from './StaffManager';
import ServiceManager from './ServiceManager';
import BookingEditModal from './BookingEditModal';

interface AdminDashboardProps {
  bookings: Booking[];
  onUpdateBooking: (id: string, status: 'confirmed' | 'cancelled' | 'pending', updates?: Partial<Booking>) => void;
}

type AdminView = 'bookings' | 'staff' | 'services';

export default function AdminDashboard({ bookings, onUpdateBooking }: AdminDashboardProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [view, setView] = useState<'list' | 'calendar'>('calendar');
  const [adminView, setAdminView] = useState<AdminView>('bookings');
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter(booking => 
    filter === 'all' ? true : booking.status === filter
  );

  const handleUpdateBooking = (id: string, status: 'confirmed' | 'cancelled' | 'pending', updates?: Partial<Booking>) => {
    onUpdateBooking(id, status, updates);
    setEditingBooking(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setAdminView('bookings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              adminView === 'bookings' 
                ? 'bg-pink-100 text-pink-800' 
                : 'hover:bg-gray-100'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            Bookings
          </button>
          <button
            onClick={() => setAdminView('staff')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              adminView === 'staff' 
                ? 'bg-pink-100 text-pink-800' 
                : 'hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4" />
            Staff
          </button>
          <button
            onClick={() => setAdminView('services')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              adminView === 'services' 
                ? 'bg-pink-100 text-pink-800' 
                : 'hover:bg-gray-100'
            }`}
          >
            <Scissors className="w-4 h-4" />
            Services
          </button>
        </div>
      </div>

      {adminView === 'bookings' && (
        <>
          <div className="flex justify-end items-center gap-4 mb-6">
            <button
              onClick={() => setView(view === 'list' ? 'calendar' : 'list')}
              className="flex items-center gap-2 px-3 py-1 border rounded-md hover:bg-gray-50"
            >
              {view === 'list' ? <CalendarViewIcon className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
              {view === 'list' ? 'Calendar View' : 'List View'}
            </button>
            
            {view === 'list' && (
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  className="border rounded-md px-3 py-1"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                >
                  <option value="all">All Bookings</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            )}
          </div>

          {view === 'calendar' ? (
            <CalendarView 
              bookings={bookings.filter(b => b.status !== 'cancelled')} 
              onEditBooking={setEditingBooking}
            />
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setEditingBooking(booking)}
                  style={{
                    backgroundColor: booking.status === 'confirmed' && booking.stafferId
                      ? staffers.find(s => s.id === booking.stafferId)?.color
                      : undefined
                  }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{booking.name}</span>
                      <span className="text-gray-500">({booking.email})</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        {booking.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {booking.time}
                      </div>
                      <div className="font-medium text-pink-600">{booking.service}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${
                          booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                      {booking.stafferId !== 'open' && (
                        <span className="text-sm text-gray-500">
                          Stylist: {staffers.find(s => s.id === booking.stafferId)?.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredBookings.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  No bookings found for the selected filter.
                </div>
              )}
            </div>
          )}
        </>
      )}

      {adminView === 'staff' && <StaffManager />}
      {adminView === 'services' && <ServiceManager />}

      {editingBooking && (
        <BookingEditModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onUpdate={handleUpdateBooking}
        />
      )}
    </div>
  );
}