import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, Mail } from 'lucide-react';
import { Booking } from '../types';
import BookingEditModal from './BookingEditModal';
import { staffers } from '../data/staffers';

interface BookingListProps {
  bookings: Booking[];
  onUpdateBooking: (booking: Booking) => void;
  onDeleteBooking: (id: string) => void;
}

export default function BookingList({
  bookings,
  onUpdateBooking,
  onDeleteBooking
}: BookingListProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter(booking => 
    filter === 'all' ? true : booking.status === filter
  );

  const getBookingStyle = (booking: Booking) => {
    const staffer = staffers.find(s => s.id === booking.stafferId);
    return {
      backgroundColor: staffer?.color || '#F3F4F6',
      borderLeft: `4px solid ${staffer ? staffer.color.replace('E4', 'C0') : '#E5E7EB'}`
    };
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
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

      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <div
            key={booking.id}
            onClick={() => setSelectedBooking(booking)}
            className="rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow duration-200"
            style={getBookingStyle(booking)}
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
              <div className="flex items-center justify-between">
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
                {booking.stafferId && (
                  <span className="text-sm text-gray-600">
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

      {selectedBooking && (
        <BookingEditModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdate={onUpdateBooking}
          onDelete={onDeleteBooking}
        />
      )}
    </div>
  );
}