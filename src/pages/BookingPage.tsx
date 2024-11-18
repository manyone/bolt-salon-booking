import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import { Database } from '../db';
import { Service, Staffer, BookingFormData } from '../types';
import ServiceCard from '../components/ServiceCard';
import BookingForm from '../components/BookingForm';
import { sendNotification } from '../utils/notifications';

interface BookingPageProps {
  db: Database;
}

export default function BookingPage({ db }: BookingPageProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [staffers, setStaffers] = useState<Staffer[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    communicationPreference: '',
    date: '',
    time: '',
    service: '',
    stafferId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [loadedServices, loadedStaffers] = await Promise.all([
        db.getServices(),
        db.getStaffers()
      ]);
      setServices(loadedServices);
      setStaffers(loadedStaffers);
    };
    loadData();
  }, [db]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const booking = await db.addBooking(formData);
      toast.success('Booking submitted successfully! We will confirm your appointment soon.', {
        duration: 5000,
      });
      await sendNotification({
        to: formData.email,
        subject: 'Booking Received',
        message: `Your appointment request for ${formData.service} on ${formData.date} at ${formData.time} has been received. We will confirm your booking shortly.`,
        type: formData.communicationPreference
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        communicationPreference: '',
        date: '',
        time: '',
        service: '',
        stafferId: ''
      });
      setSelectedService(null);
    } catch (error) {
      toast.error('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
      toast.dismiss('booking-submit');
    }
  };

  const handleServiceSelect = (serviceName: string) => {
    setSelectedService(serviceName);
    setFormData(prev => ({ ...prev, service: serviceName }));
  };

  const handleFormChange = (updates: Partial<BookingFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Book an Appointment</h2>
        <a 
          href="?admin=true" 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          title="Admin Dashboard"
        >
          <Settings className="w-6 h-6 text-gray-600" />
        </a>
      </div>

      {!selectedService ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelect={() => handleServiceSelect(service.name)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <BookingForm
            formData={formData}
            onFormChange={handleFormChange}
            onSubmit={handleSubmit}
            onBack={() => setSelectedService(null)}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </div>
  );
}