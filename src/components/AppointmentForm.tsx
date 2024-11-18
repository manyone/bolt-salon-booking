import React, { useState } from 'react';
import { Calendar, Clock, User, Mail, Users } from 'lucide-react';
import { staffers } from '../data/staffers';

interface AppointmentFormProps {
  onSubmit: (data: any) => void;
  selectedService?: string;
  onBack?: () => void;
}

export default function AppointmentForm({ onSubmit, selectedService, onBack }: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    service: selectedService || '',
    stafferId: 'open'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedDate = new Date(formData.date + 'T00:00:00').toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    onSubmit({
      ...formData,
      date: formattedDate
    });
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
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border rounded-md focus:ring-pink-500 focus:border-pink-500"
          placeholder="Enter your email"
        />
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
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          className="w-full px-3 py-2 border rounded-md focus:ring-pink-500 focus:border-pink-500"
          min="09:00"
          max="17:00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Preferred Stylist
          </span>
        </label>
        <select
          value={formData.stafferId}
          onChange={(e) => setFormData({ ...formData, stafferId: e.target.value })}
          className="w-full px-3 py-2 border rounded-md focus:ring-pink-500 focus:border-pink-500"
        >
          <option value="open">Select stylist (optional)</option>
          {staffers
            .filter(s => s.id !== 'open')
            .map((staffer) => (
              <option
                key={staffer.id}
                value={staffer.id}
                style={{ backgroundColor: staffer.color }}
              >
                {staffer.name}
              </option>
            ))}
        </select>
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
          className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors duration-300"
        >
          Book Appointment
        </button>
      </div>
    </form>
  );
}