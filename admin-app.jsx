import React, { useState, useEffect } from 'react';
import { Trash2, RefreshCw, Clock, Users } from 'lucide-react';

export default function AdminApp() {
  const [bookings, setBookings] = useState([]);
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [refreshTime, setRefreshTime] = useState(new Date());
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  const ADMIN_PASSWORD = 'fumetteria2024';

  const tables = [
    { id: 1, name: 'Tavolo Heroes' },
    { id: 2, name: 'Tavolo Villains' },
    { id: 3, name: 'Tavolo Comics' },
    { id: 4, name: 'Tavolo Legends' },
    { id: 5, name: 'Tavolo Origins' },
    { id: 6, name: 'Tavolo Powers' },
    { id: 7, name: 'Tavolo Galaxy' },
    { id: 8, name: 'Tavolo Infinity' },
    { id: 9, name: 'Tavolo Thunder' },
    { id: 10, name: 'Tavolo Shadow' },
    { id: 11, name: 'Tavolo Phoenix' },
    { id: 12, name: 'Tavolo Mystic' },
    { id: 13, name: 'Tavolo Dragon' },
    { id: 14, name: 'Tavolo Nova' },
    { id: 15, name: 'Tavolo Cosmic' },
    { id: 16, name: 'Tavolo Nexus' }
  ];

  // Carica prenotazioni da localStorage ogni secondo (aggiornamento in tempo reale)
  useEffect(() => {
    const interval = setInterval(() => {
      const savedBookings = localStorage.getItem('fumetteria_bookings');
      if (savedBookings) {
        try {
          setBookings(JSON.parse(savedBookings));
        } catch (e) {
          console.error('Errore caricamento prenotazioni', e);
        }
      }
      setRefreshTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setAdminPassword('');
    } else {
      alert('❌ Password errata!');
      setAdminPassword('');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminPassword('');
  };

  const deleteBooking = (id) => {
    const updated = bookings.filter(b => b.id !== id);
    setBookings(updated);
    localStorage.setItem('fumetteria_bookings', JSON.stringify(updated));
  };

  const getTableName = (tableId) => {
    return tables.find(t => t.id === tableId)?.name || `Tavolo ${tableId}`;
  };

  const getBookingsSorted = () => {
    return [...bookings].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA - dateB;
    });
  };

  const getTodayBookings = () => {
    return getBookingsSorted().filter(b => b.date === filterDate);
  };

  const getTablesOccupied = () => {
    return getTodayBookings().length;
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;900&display=swap');
        
        body { margin: 0; padding: 0; }
        * { box-sizing: border-box; }

        .heading-title {
          font-family: 'Fredoka One', sans-serif;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-shadow: 4px 4px 0px rgba(0,0,0,0.3);
        }

        .button-primary {
          font-family: 'Fredoka One', sans-serif;
          font-weight: bold;
          border: 3px solid #000;
          box-shadow: 4px 4px 0px rgba(0,0,0,0.2);
          transition: all 0.2s;
        }

        .button-primary:hover {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0px rgba(0,0,0,0.3);
        }

        .card {
          background: white;
          border: 4px solid #000;
          box-shadow: 6px 6px 0px rgba(0,0,0,0.2);
        }

        input, select {
          font-family: 'Nunito', sans-serif;
          border: 3px solid #000;
          padding: 10px 12px;
          font-size: 14px;
        }

        input:focus, select:focus {
          outline: none;
          box-shadow: 0 0 0 3px #FFD700;
        }

        .booking-item {
          animation: slideIn 0.3s ease-out;
          border-left: 4px solid #FF1744;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {!isLoggedIn ? (
        // Login Screen
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="text-center mb-12">
            <h1 className="heading-title text-6xl mb-4" style={{ color: '#FF1744' }}>
              🎨 FUMETTO COMICS 🎨
            </h1>
            <p className="text-white text-2xl font-bold heading-title">
              Gestione Amministratore
            </p>
          </div>

          <div className="card p-8 max-w-md w-full bg-gray-900">
            <h2 className="heading-title text-3xl mb-6 text-center" style={{ color: '#FF1744' }}>
              🔐 Accesso Admin
            </h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block font-bold mb-2 heading-title text-sm text-white">Password Admin</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Inserisci la password"
                  className="w-full rounded"
                />
              </div>

              <button
                type="submit"
                className="button-primary w-full bg-red-500 text-white py-3 rounded-lg font-bold text-lg"
              >
                🔓 Accedi
              </button>
            </form>

            <p className="text-gray-400 text-center mt-4 text-xs">
              Password: <strong>fumetteria2024</strong>
            </p>
          </div>
        </div>
      ) : (
        // Admin Dashboard
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="heading-title text-5xl" style={{ color: '#FF1744' }}>
                📊 Dashboard Prenotazioni
              </h1>
              <p className="text-gray-400 text-sm mt-2">Ultimo aggiornamento: {refreshTime.toLocaleTimeString('it-IT')}</p>
            </div>
            <button
              onClick={handleLogout}
              className="button-primary bg-red-600 text-white px-6 py-3 rounded-lg"
            >
              🔒 Logout
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card p-6 bg-gradient-to-br from-blue-100 to-blue-200">
              <div className="flex items-center gap-4">
                <div className="text-4xl">📊</div>
                <div>
                  <p className="heading-title text-sm text-gray-600">Totale Prenotazioni</p>
                  <p className="heading-title text-3xl text-blue-600">{bookings.length}</p>
                </div>
              </div>
            </div>

            <div className="card p-6 bg-gradient-to-br from-green-100 to-green-200">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🎮</div>
                <div>
                  <p className="heading-title text-sm text-gray-600">Tavoli Occupati (Oggi)</p>
                  <p className="heading-title text-3xl text-green-600">{getTablesOccupied()}/16</p>
                </div>
              </div>
            </div>

            <div className="card p-6 bg-gradient-to-br from-purple-100 to-purple-200">
              <div className="flex items-center gap-4">
                <div className="text-4xl">👥</div>
                <div>
                  <p className="heading-title text-sm text-gray-600">Persone Prenotate (Oggi)</p>
                  <p className="heading-title text-3xl text-purple-600">{getTodayBookings().reduce((sum, b) => sum + b.people, 0)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="card p-4 mb-6 bg-gray-800">
            <div className="flex items-center gap-4">
              <label className="heading-title text-white text-sm">📅 Filtra per Data:</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="rounded max-w-xs"
              />
            </div>
          </div>

          {/* Bookings List */}
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="heading-title text-2xl">📋 Prenotazioni</h2>
              <button
                onClick={() => {
                  const saved = localStorage.getItem('fumetteria_bookings');
                  if (saved) {
                    setBookings(JSON.parse(saved));
                  }
                }}
                className="button-primary bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <RefreshCw size={18} /> Aggiorna
              </button>
            </div>

            {getTodayBookings().length === 0 ? (
              <div className="text-center py-12 bg-gray-100 rounded-lg border-2 border-dashed border-gray-400">
                <p className="text-gray-600 text-xl">😴 Nessuna prenotazione per questa data</p>
              </div>
            ) : (
              <div className="space-y-3">
                {getTodayBookings().map((booking, idx) => (
                  <div key={booking.id} className="booking-item card p-4 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="heading-title text-2xl text-red-500">{idx + 1}</span>
                          <div>
                            <p className="font-bold heading-title text-lg">{booking.username}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="bg-white p-2 rounded border-2 border-blue-300">
                            <span className="font-bold heading-title text-xs">🗓️ DATA</span>
                            <p className="font-bold text-sm">{booking.date}</p>
                          </div>

                          <div className="bg-white p-2 rounded border-2 border-purple-300">
                            <span className="font-bold heading-title text-xs">⏰ ORA</span>
                            <p className="font-bold text-sm">{booking.time}</p>
                          </div>

                          <div className="bg-white p-2 rounded border-2 border-pink-300">
                            <span className="font-bold heading-title text-xs">👥 PERSONE</span>
                            <p className="font-bold text-sm">{booking.people}</p>
                          </div>

                          <div className="bg-white p-2 rounded border-2 border-orange-300">
                            <span className="font-bold heading-title text-xs">🎮 TAVOLO</span>
                            <p className="font-bold text-sm">#{booking.table}</p>
                          </div>
                        </div>

                        <p className="text-xs text-gray-600 mt-2">{getTableName(booking.table)}</p>
                      </div>

                      <button
                        onClick={() => deleteBooking(booking.id)}
                        className="button-primary bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                      >
                        <Trash2 size={16} /> Elimina
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="card p-4 mt-6 bg-yellow-100 border-2 border-yellow-400">
            <p className="heading-title text-sm text-yellow-900">
              ⚡ Aggiornamento automatico ogni secondo - Nessun refresh necessario!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}