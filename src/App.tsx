import React from 'react';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import AdminDashboard from './pages/AdminDashboard';
import BookingPage from './pages/BookingPage';
import { Database } from './db';

// Initialize database
const db = new Database();

function App() {
  const [view, setView] = useState<'booking' | 'admin'>('booking');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check for admin parameter in URL
    const params = new URLSearchParams(window.location.search);
    setIsAdmin(params.get('admin') === 'true');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <button
                onClick={() => setView('booking')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  view === 'booking'
                    ? 'border-pink-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Book Appointment
              </button>
              {isAdmin && (
                <button
                  onClick={() => setView('admin')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    view === 'admin'
                      ? 'border-pink-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Admin Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'booking' ? (
          <BookingPage db={db} />
        ) : isAdmin ? (
          <AdminDashboard db={db} />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
            <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;