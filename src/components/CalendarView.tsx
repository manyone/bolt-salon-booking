import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import { Booking } from '../types';
import BookingEditModal from './BookingEditModal';
import { staffers } from '../data/staffers';
import { formatDateForCalendar } from '../utils/dates';

interface CalendarViewProps {
  bookings: Booking[];
  onUpdateBooking: (booking: Booking) => void;
  onDeleteBooking: (id: string) => void;
}

export default function CalendarView({
  bookings,
  onUpdateBooking,
  onDeleteBooking,
}: CalendarViewProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => {
      const bookingDate = formatDateForCalendar(booking.date);
      return bookingDate.toDateString() === date.toDateString();
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'month':
        newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'day':
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
    }
    setCurrentDate(newDate);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Add padding days from previous month
    for (let i = 0; i < firstDay.getDay(); i++) {
      const prevDate = new Date(year, month, -i);
      days.unshift({ date: prevDate, isPadding: true });
    }
    
    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isPadding: false });
    }
    
    // Add padding days from next month
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isPadding: true });
    }
    
    return days;
  };

  const getDaysInWeek = (date: Date) => {
    const days = [];
    const firstDayOfWeek = new Date(date);
    firstDayOfWeek.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(firstDayOfWeek);
      currentDate.setDate(firstDayOfWeek.getDate() + i);
      days.push({ date: currentDate, isPadding: false });
    }
    
    return days;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: viewMode === 'month' ? 'long' : 'short',
      year: 'numeric',
      day: viewMode !== 'month' ? 'numeric' : undefined,
    }).format(date);
  };

  const getBookingStyle = (booking: Booking) => {
    const staffer = staffers.find(s => s.id === booking.stafferId);
    const baseStyle = staffer ? { backgroundColor: staffer.color } : { backgroundColor: '#F3F4F6' };
    
    switch (booking.status) {
      case 'confirmed':
        return { ...baseStyle, borderLeft: '3px solid #059669' }; // Green border
      case 'pending':
        return { ...baseStyle, borderLeft: '3px solid #D97706' }; // Yellow border
      case 'declined':
        return { ...baseStyle, borderLeft: '3px solid #DC2626' }; // Red border
      default:
        return baseStyle;
    }
  };

  const renderBookingItem = (booking: Booking) => (
    <div
      key={booking.id}
      onClick={() => setSelectedBooking(booking)}
      className="text-xs p-1 rounded cursor-pointer truncate"
      style={getBookingStyle(booking)}
    >
      <div className="font-medium">{booking.time}</div>
      <div className="truncate">{booking.name}</div>
      {booking.status !== 'confirmed' && (
        <div className="text-xs italic">
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </div>
      )}
    </div>
  );

  const renderDayCell = (dayInfo: { date: Date; isPadding: boolean }) => {
    const dayBookings = getBookingsForDate(dayInfo.date);
    const isToday = dayInfo.date.toDateString() === new Date().toDateString();

    return (
      <div
        className={`${
          dayInfo.isPadding ? 'bg-gray-50' : 'bg-white'
        } ${
          isToday ? 'ring-2 ring-pink-500' : ''
        } min-h-[100px] border p-1`}
      >
        <div className="text-sm font-medium mb-1">
          {dayInfo.date.getDate()}
        </div>
        <div className="space-y-1">
          {dayBookings.map(booking => renderBookingItem(booking))}
        </div>
      </div>
    );
  };

  const renderTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      const dayBookings = bookings.filter(booking => {
        const bookingDate = formatDateForCalendar(booking.date);
        const bookingHour = parseInt(booking.time.split(':')[0]);
        return bookingDate.toDateString() === currentDate.toDateString() && 
               bookingHour === hour;
      });

      slots.push(
        <div key={hour} className="flex border-t">
          <div className="w-20 py-2 px-2 text-sm text-gray-500">{time}</div>
          <div className="flex-1 min-h-[60px] relative">
            {dayBookings.map(booking => (
              <div
                key={booking.id}
                onClick={() => setSelectedBooking(booking)}
                className="absolute left-0 right-0 m-1 p-2 rounded cursor-pointer"
                style={getBookingStyle(booking)}
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{booking.name}</span>
                  {booking.status !== 'confirmed' && (
                    <span className="text-xs italic">
                      ({booking.status.charAt(0).toUpperCase() + booking.status.slice(1)})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-3 h-3" />
                  <span>{booking.service}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return slots;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 bg-pink-600 text-white rounded-md"
          >
            Today
          </button>
          <button
            onClick={() => navigateDate('next')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold">{formatDate(currentDate)}</h2>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('month')}
            className={`px-4 py-2 rounded-md ${
              viewMode === 'month' ? 'bg-pink-600 text-white' : 'bg-gray-100'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-4 py-2 rounded-md ${
              viewMode === 'week' ? 'bg-pink-600 text-white' : 'bg-gray-100'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode('day')}
            className={`px-4 py-2 rounded-md ${
              viewMode === 'day' ? 'bg-pink-600 text-white' : 'bg-gray-100'
            }`}
          >
            Day
          </button>
        </div>
      </div>

      <div className="border rounded-lg bg-white">
        {viewMode === 'month' && (
          <div className="grid grid-cols-7">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center font-medium border-b">
                {day}
              </div>
            ))}
            {getDaysInMonth(currentDate).map((dayInfo, index) => (
              <div key={index}>
                {renderDayCell(dayInfo)}
              </div>
            ))}
          </div>
        )}

        {viewMode === 'week' && (
          <div>
            <div className="grid grid-cols-7">
              {getDaysInWeek(currentDate).map((dayInfo, index) => (
                <div key={index} className="border-b p-2 text-center font-medium">
                  {new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(dayInfo.date)}
                  <br />
                  {dayInfo.date.getDate()}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {getDaysInWeek(currentDate).map((dayInfo, index) => (
                <div key={index} className="min-h-[600px] border-r">
                  {renderDayCell(dayInfo)}
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'day' && (
          <div className="min-h-[600px]">
            {renderTimeSlots()}
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