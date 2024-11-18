import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { staffers } from '../data/staffers';
import { Staffer } from '../types';

const SPECIALTIES = ['Haircut', 'Color', 'Style', 'Treatment'];

export default function StaffManager() {
  const [editingStaffer, setEditingStaffer] = useState<Staffer | null>(null);
  const [newStaffer, setNewStaffer] = useState<Partial<Staffer>>({
    name: '',
    color: '#ffffff',
    specialties: []
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSave = (staffer: Staffer) => {
    // In a real app, this would update the backend
    console.log('Saving staffer:', staffer);
    setEditingStaffer(null);
  };

  const handleDelete = (stafferId: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      // In a real app, this would update the backend
      console.log('Deleting staffer:', stafferId);
    }
  };

  const handleAdd = () => {
    // In a real app, this would update the backend
    console.log('Adding new staffer:', newStaffer);
    setShowAddForm(false);
    setNewStaffer({ name: '', color: '#ffffff', specialties: [] });
  };

  const handleSpecialtyChange = (specialty: string, staffer: Staffer) => {
    const updatedSpecialties = staffer.specialties.includes(specialty)
      ? staffer.specialties.filter(s => s !== specialty)
      : [...staffer.specialties, specialty];
    
    setEditingStaffer({
      ...staffer,
      specialties: updatedSpecialties
    });
  };

  const handleNewSpecialtyChange = (specialty: string) => {
    const updatedSpecialties = newStaffer.specialties?.includes(specialty)
      ? newStaffer.specialties.filter(s => s !== specialty)
      : [...(newStaffer.specialties || []), specialty];
    
    setNewStaffer({
      ...newStaffer,
      specialties: updatedSpecialties
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Staff Management</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
        >
          <Plus className="w-4 h-4" />
          Add Staff Member
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {staffers.map((staffer) => (
          <div
            key={staffer.id}
            className="border rounded-lg p-4 flex items-center justify-between bg-white"
          >
            {editingStaffer?.id === staffer.id ? (
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    value={editingStaffer.name}
                    onChange={(e) => setEditingStaffer({ ...editingStaffer, name: e.target.value })}
                    className="flex-1 px-3 py-1 border rounded-md"
                  />
                  <input
                    type="color"
                    value={editingStaffer.color}
                    onChange={(e) => setEditingStaffer({ ...editingStaffer, color: e.target.value })}
                    className="w-10 h-10 rounded-md cursor-pointer"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {SPECIALTIES.map(specialty => (
                    <label key={specialty} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingStaffer.specialties.includes(specialty)}
                        onChange={() => handleSpecialtyChange(specialty, editingStaffer)}
                        className="rounded text-pink-500 focus:ring-pink-500"
                      />
                      {specialty}
                    </label>
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleSave(editingStaffer)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setEditingStaffer(null)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: staffer.color }} />
                  <div>
                    <h4 className="font-medium">{staffer.name}</h4>
                    <div className="text-sm text-gray-600">
                      {staffer.specialties.join(', ')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingStaffer(staffer)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(staffer.id)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Add New Staff Member</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newStaffer.name}
                  onChange={(e) => setNewStaffer({ ...newStaffer, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <input
                  type="color"
                  value={newStaffer.color}
                  onChange={(e) => setNewStaffer({ ...newStaffer, color: e.target.value })}
                  className="w-full h-10 rounded-md cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialties</label>
                <div className="flex flex-wrap gap-2">
                  {SPECIALTIES.map(specialty => (
                    <label key={specialty} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newStaffer.specialties?.includes(specialty) || false}
                        onChange={() => handleNewSpecialtyChange(specialty)}
                        className="rounded text-pink-500 focus:ring-pink-500"
                      />
                      {specialty}
                    </label>
                  ))}
                </div>
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
                  Add Staff Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}