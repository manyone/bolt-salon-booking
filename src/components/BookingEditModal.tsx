import React, { useState } from 'react';
import { X, Check, AlertCircle, Calendar, Clock, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { Booking } from '../types';
import { staffers } from '../data/staffers';
import { sendNotification } from '../utils/notifications';
import { formatDateForDisplay } from '../utils/dates';

interface BookingEditModalProps {
  booking: Booking;
  onClose: () => void;
  onUpdate: (booking: Booking) => void;
  onDelete: (id: string) => void;
}

export default function BookingEditModal({
  booking,
  onClose,
  onUpdate,
  onDelete,
}: BookingEditModalProps) {
  const [editedBooking, setEditedBooking] = useState<Booking>({ ...booking });
  const [showDeclineReason, setShowDeclineReason] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [isEditing, setIsEditing] = useState(booking.status === 'pending');

  const handleConfirm = async () => {
    if (!editedBooking.stafferId) {
      alert('Please assign a stylist before confirming the booking.');
      return;
    }

    const confirmedBooking = {
      ...editedBooking,
      status: 'confirmed'
    };

    try {
      await onUpdate(confirmedBooking);
      await sendNotification({
        to: confirmedBooking.email,
        subject: 'Booking Confirmed',
        message: `Your appointment for ${confirmedBooking.service} on ${confirmedBooking.date} at ${confirmedBooking.time} has been confirmed with ${staffers.find(s => s.id === confirmedBooking.stafferId)?.name}.`,
        type: confirmedBooking.communicationPreference
      });
      onClose();
    } catch (error) {
      console.error('Failed to confirm booking:', error);
    }
  };

  const handleDecline = async () => {
    if (!declineReason) return;
    
    const declinedBooking = {
      ...editedBooking,
      status: 'declined',
      declineReason
    };
    
    try {
      await onUpdate(declinedBooking);
      await sendNotification({
        to: declinedBooking.email,
        subject: 'Booking Declined',
        message: `Your appointment request for ${declinedBooking.service} on ${declinedBooking.date} at ${declinedBooking.time} has been declined. Reason: ${declineReason}`,
        type: declinedBooking.communicationPreference
      });
      onClose();
    } catch (error) {
      console.error('Failed to decline booking:', error);
    }
  };

  const renderField = (label: string, value: string, icon: React.ReactNode) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        <span className="flex items-center gap-2">
          {icon}
          {label}
        </span>
      </label>
      <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-700">{value}</div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            {showDeclineReason ? 'Decline Booking' : 'Booking Details'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {showDeclineReason ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Reason for Declining
                </span>
              </label>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-pink-500 focus:border-pink-500"
                rows={3}
                placeholder="Please provide a reason for declining this booking..."
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowDeclineReason(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Back
                </button>
                <button
                  onClick={handleDecline}
                  disabled={!declineReason}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                >
                  Confirm Decline
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                {renderField('Name', editedBooking.name, <User className="w-4 h-4" />)}
                {renderField('Email', editedBooking.email, <Mail className="w-4 h-4" />)}
                {editedBooking.phone && renderField('Phone', editedBooking.phone, <Phone className="w-4 h-4" />)}
                {renderField('Communication', editedBooking.communicationPreference, <MessageSquare className="w-4 h-4" />)}
                {renderField('Date', editedBooking.date, <Calendar className="w-4 h-4" />)}
                {renderField('Time', editedBooking.time, <Clock className="w-4 h-4" />)}
                {renderField('Service', editedBooking.service, <Check className="w-4 h-4" />)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Stylist</label>
                <select
                  value={editedBooking.stafferId || ''}
                  onChange={(e) => setEditedBooking(prev => ({ ...prev, stafferId: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md focus:ring-pink-500 focus:border-pink-500"
                  disabled={!isEditing}
                >
                  <option value="">Select a stylist</option>
                  {staffers.map((staffer) => (
                    <option key={staffer.id} value={staffer.id}>
                      {staffer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between pt-4">
                <div className="space-x-2">
                  {editedBooking.status === 'pending' && (
                    <button
                      onClick={() => setShowDeclineReason(true)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      Decline
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(booking.id)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                  >
                    Delete
                  </button>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                  >
                    Close
                  </button>
                  {editedBooking.status === 'pending' && (
                    <button
                      onClick={handleConfirm}
                      disabled={!editedBooking.stafferId}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Confirm Booking
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}