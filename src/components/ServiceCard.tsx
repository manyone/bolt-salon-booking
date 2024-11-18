import React from 'react';
import { Clock, DollarSign } from 'lucide-react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onSelect: () => void;
}

export default function ServiceCard({ service, onSelect }: ServiceCardProps) {
  return (
    <div
      onClick={onSelect}
      className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-pink-200"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.name}</h3>
      <div className="space-y-2 text-gray-600">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{service.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          <span className="text-lg font-bold text-pink-600">{service.price}</span>
        </div>
      </div>
    </div>
  );
}