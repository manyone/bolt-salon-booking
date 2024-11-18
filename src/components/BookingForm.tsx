import React from 'react';
import { Calendar, Clock, User, Mail, Phone, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { BookingFormData } from '../types';
import { formatDateForDisplay } from '../utils/dates';

interface BookingFormProps {
  formData: BookingFormData;
  onFormChange: (data: Partial<BookingFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export default function BookingForm({ 
  formData, 
  onFormChange, 
  onSubmit, 
  onBack,
  isSubmitting 
}: BookingFormProps) {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedDate = formatDateForDisplay(e.target.value);
    onFormChange({ date: formattedDate });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show loading toast
    toast.loading('Submitting your booking...', {
      id: 'booking-submit',
    });
    
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <span className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Full Name
          </span>
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => onFormChange({ name: e.target.value })}
          className="w-full px-3 py-2 border rounded-md focus:ring-pink-500 focus:border-pink-500"
          placeholder="Enter your name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <span className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </span>
        </label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => onFormChange({ email: e.target.value })}
          className="w-full px-3 py-2 border rounded-md focus:ring-pink-500 focus:border-pink-500"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <span className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Phone Number (Optional)
          </span>
        </label>
        <input
          type="tel"
          value={formData.phone || ''}
          onChange={(e) => onFormChange({ phone: e.target.value })}
          className="w-full px-3 py-2 border rounded-md focus:ring-pink-500 focus:border-pink-500"
          placeholder="Enter your phone number"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <span className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Preferred Communication Method
          </span>
        </label>
        <select
          required
          value={formData.communicationPreference}
          onChange={(e) => onFormChange({ communicationPreference: e.target.value })}
          className="w-full px-3 py-2 border rounded-md focus:ring-pink-500 focus:border-pink-500"
        >
          <option value="">Select communication preference</option>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="both">Both Email & SMS</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date
          </span>
        </label>
        <input
          type="date"
          required
          value={formData.date}
          onChange={handleDateChange}
          className="w-full px-3 py-2 border rounded-md focus:ring-pink-500 focus:border-pink-500"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Time
          </span>
        </label>
        <input
          type="time"
          required
          value={formData.time}
          onChange={(e) => onFormChange({ time: e.target.value })}
          className="w-full px-3 py-2 border rounded-md focus:ring-pink-500 focus:border-pink-500"
          min="09:00"
          max="17:00"
        />
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Back to services
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors duration-300 disabled:opacity-50"
        >
          {isSubmitting ? 'Booking...' : 'Book Appointment'}
        </button>
      </div>
    </form>
  );
}