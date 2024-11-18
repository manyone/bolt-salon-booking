import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check, Clock, DollarSign } from 'lucide-react';
import { Service } from '../types';

export default function ServiceManager() {
  const [services, setServices] = useState<Service[]>([
    { id: 1, name: 'Haircut & Styling', duration: '60 min', price: 80 },
    { id: 2, name: 'Hair Coloring', duration: '120 min', price: 150 },
    { id: 3, name: 'Facial Treatment', duration: '45 min', price: 65 },
    { id: 4, name: 'Manicure & Pedicure', duration: '90 min', price: 95 },
  ]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState<Partial<Service>>({
    name: '',
    duration: '',
    price: 0
  });

  const handleSave = (service: Service) => {
    // In a real app, this would update the backend
    setServices(services.map(s => s.id === service.id ? service : s));
    setEditingService(null);
  };

  const handleDelete = (serviceId: number) => {
    if (confirm('Are you sure you want to delete this service?')) {
      // In a real app, this would update the backend
      setServices(services.filter(s => s.id !== serviceId));
    }
  };

  const handleAdd = () => {
    // In a real app, this would update the backend
    const newId = Math.max(...services.map(s => s.id)) + 1;
    setServices([...services, { ...newService, id: newId } as Service]);
    setShowAddForm(false);
    setNewService({ name: '', duration: '', price: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Service Management</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50"
          >
            {editingService?.id === service.id ? (
              <div className="flex-1 grid grid-cols-3 gap-4">
                <input
                  type="text"
                  value={editingService.name}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  className="px-3 py-1 border rounded-md"
                  placeholder="Service name"
                />
                <input
                  type="text"
                  value={editingService.duration}
                  onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
                  className="px-3 py-1 border rounded-md"
                  placeholder="Duration (e.g., 60 min)"
                />
                <input
                  type="number"
                  value={editingService.price}
                  onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                  className="px-3 py-1 border rounded-md"
                  placeholder="Price"
                />
                <div className="col-span-3 flex justify-end gap-2">
                  <button
                    onClick={() => handleSave(editingService)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setEditingService(null)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <h4 className="font-medium">{service.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {service.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {service.price}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingService(service)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Add New Service</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input
                  type="text"
                  value={newService.duration}
                  onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g., 60 min"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
                >
                  Add Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}