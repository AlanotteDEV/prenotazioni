import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy, setDoc } from 'firebase/firestore';

const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Funzione per generare le opzioni di orario con intervalli di 30 minuti
const generateTimeSlots = () => {
  const slots = [];
  const addSlots = (startHour, endHour) => {
    for (let h = startHour; h < endHour; h++) {
      for (let m = 0; m < 60; m += 30) {
        slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }
  };
  addSlots(9, 12);
  addSlots(17, 20);
  return slots;
};

// Componente principale dell'App
const App = () => {
  const [reservations, setReservations] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [reservationDate, setReservationDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('09:30');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isAuthReady, setIsAuthReady] = useState(false);
  const timeSlots = generateTimeSlots();

  // Funzione per mostrare un modale personalizzato
  const showCustomModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  // Effect per inizializzare Firebase e gestire l'autenticazione
  useEffect(() => {
    const initFirebase = async () => {
      try {
        const app = initializeApp(firebaseConfig);
        const firestoreDb = getFirestore(app);
        const firebaseAuth = getAuth(app);
        setDb(firestoreDb);
        setAuth(firebaseAuth);

        if (initialAuthToken) {
          await signInWithCustomToken(firebaseAuth, initialAuthToken);
        } else {
          await signInAnonymously(firebaseAuth);
        }

        const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
          if (user) {
            setUserId(user.uid);
            console.log("User signed in with ID:", user.uid);
          } else {
            console.log("User is signed out.");
            setUserId(null);
          }
          setIsAuthReady(true);
        });

        return () => unsubscribe();
      } catch (e) {
        console.error("Error during Firebase initialization or sign-in:", e);
        showCustomModal("Errore durante l'inizializzazione dell'app. Controlla la console per i dettagli.");
        setError("Errore durante l'inizializzazione.");
      }
    };
    initFirebase();
  }, []);

  // Effect per caricare le prenotazioni
  useEffect(() => {
    if (db && isAuthReady) {
      const reservationsCollectionRef = collection(db, `artifacts/${appId}/public/data/reservations`);
      const q = query(reservationsCollectionRef);

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const reservationsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReservations(reservationsList);
        setLoading(false);
      }, (err) => {
        console.error("Errore durante la lettura delle prenotazioni:", err);
        showCustomModal("Errore durante il caricamento delle prenotazioni. Riprova.");
        setError("Impossibile caricare le prenotazioni.");
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [db, isAuthReady]);

  // Gestisce l'aggiunta di una nuova prenotazione
  const handleAddReservation = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !reservationDate || !startTime || !endTime || !db || !userId) {
      showCustomModal('Tutti i campi sono obbligatori.');
      return;
    }

    try {
      const newReservation = {
        userId: userId,
        firstName,
        lastName,
        reservationDate,
        startTime,
        endTime,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, `artifacts/${appId}/public/data/reservations`), newReservation);
      setFirstName('');
      setLastName('');
      setReservationDate('');
      setStartTime(timeSlots[0]);
      setEndTime(timeSlots[1]);
      showCustomModal('Prenotazione aggiunta con successo!');
    } catch (e) {
      console.error("Errore nell'aggiungere la prenotazione:", e);
      showCustomModal("Errore nell'aggiungere la prenotazione. Riprova.");
    }
  };

  // Gestisce l'aggiornamento dello stato
  const handleUpdateStatus = async (id, newStatus) => {
    if (!db) return;
    try {
      const reservationDocRef = doc(db, `artifacts/${appId}/public/data/reservations`, id);
      await updateDoc(reservationDocRef, { status: newStatus });
      showCustomModal(`Stato aggiornato a "${newStatus}"!`);
    } catch (e) {
      console.error("Errore nell'aggiornare lo stato:", e);
      showCustomModal("Errore nell'aggiornare lo stato. Riprova.");
    }
  };

  // Gestisce l'eliminazione della prenotazione
  const handleDeleteReservation = async (id) => {
    if (!db) return;
    try {
      const reservationDocRef = doc(db, `artifacts/${appId}/public/data/reservations`, id);
      await deleteDoc(reservationDocRef);
      showCustomModal('Prenotazione eliminata con successo!');
    } catch (e) {
      console.error("Errore nell'eliminare la prenotazione:", e);
      showCustomModal("Errore nell'eliminare la prenotazione. Riprova.");
    }
  };

  if (!isAuthReady || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-gray-900 p-4">
        <div className="text-xl">Caricamento in corso...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-gray-900 font-sans p-4 sm:p-8 bg-manga-pattern">
      {/* Aggiunge uno stile globale per il font e il pattern di sfondo a tema fumetto */}
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&display=swap');
        
        /* Stile di sfondo manga */
        .bg-manga-pattern {
          background-color: #ffffff;
          background-image: linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url('uploaded:il_1140xN.4855939279_2o7z.jpg-aa5430d5-a9c4-433f-9c8f-c8852e52a64b');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }

        /* Stile delle card con bordi e ombre a tema fumetto */
        .comic-bg-card {
          border: 4px solid #f9d849;
          box-shadow: 8px 8px 0px 0px #d32f2f;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .comic-bg-card:hover {
          transform: translate(-4px, -4px);
          box-shadow: 12px 12px 0px 0px #d32f2f;
        }

        /* Stile dei pulsanti con effetto pop-up */
        .pop-button {
          border: 4px solid #f9d849;
          box-shadow: 4px 4px 0px 0px #d32f2f;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .pop-button:hover {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0px 0px #d32f2f;
        }
        .pop-button:active {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0px 0px #d32f2f;
        }
        `}
      </style>

      {/* Modal for messages */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-300 max-w-sm w-full mx-4 comic-bg-card">
            <p className="text-center text-lg mb-4 text-gray-900">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-[#03a9f4] hover:bg-[#039be5] text-white font-bold py-2 px-4 rounded-lg border-2 border-[#f9d849] pop-button transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto max-w-4xl">
        <header className="text-center my-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#d32f2f] font-['Bangers'] tracking-wide">
            Gestione Prenotazioni
          </h1>
          <p className="mt-2 text-lg text-gray-700 font-sans">
            Aggiungi e gestisci le prenotazioni dei tuoi clienti.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            ID Utente: <span className="text-gray-600 font-mono break-all">{userId}</span>
          </div>
        </header>
        

        {/* Reservation form */}
        <section className="bg-white p-6 rounded-xl shadow-lg border-4 border-[#f9d849] comic-bg-card mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center text-[#d32f2f]">Aggiungi una nuova prenotazione</h2>
          <form onSubmit={handleAddReservation} className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Inserisci il nome"
                className="mt-1 block w-full px-4 py-2 bg-gray-100 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#03a9f4] focus:border-[#03a9f4]"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Cognome
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Inserisci il cognome"
                className="mt-1 block w-full px-4 py-2 bg-gray-100 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#03a9f4] focus:border-[#03a9f4]"
              />
            </div>
            <div>
              <label htmlFor="reservationDate" className="block text-sm font-medium text-gray-700">
                Data di prenotazione
              </label>
              <input
                type="date"
                id="reservationDate"
                value={reservationDate}
                onChange={(e) => setReservationDate(e.target.value)}
                className="mt-1 block w-full px-4 py-2 bg-gray-100 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#03a9f4] focus:border-[#03a9f4]"
              />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                  Orario di inizio
                </label>
                <select
                  id="startTime"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 bg-gray-100 border-2 border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#03a9f4] focus:border-[#03a9f4]"
                >
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                  Orario di fine
                </label>
                <select
                  id="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 bg-gray-100 border-2 border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#03a9f4] focus:border-[#03a9f4]"
                >
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#d32f2f] hover:bg-[#c62828] text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors border-4 border-[#f9d849] pop-button focus:outline-none focus:ring-2 focus:ring-[#f9d849] focus:ring-offset-2 focus:ring-offset-white"
            >
              Aggiungi Prenotazione
            </button>
          </form>
        </section>

        {/* Reservations list */}
        <section className="bg-white p-6 rounded-xl shadow-lg border-4 border-[#f9d849] comic-bg-card">
          <h2 className="text-2xl font-bold mb-6 text-center text-[#d32f2f]">Prenotazioni esistenti</h2>
          {reservations.length === 0 ? (
            <p className="text-center text-gray-500">Nessuna prenotazione trovata.</p>
          ) : (
            <div className="space-y-4">
              {reservations.map((res) => (
                <div key={res.id} className="bg-gray-100 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between shadow-sm border-2 border-[#d32f2f]">
                  <div className="flex-1 w-full sm:w-auto">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {res.firstName} {res.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Data: {new Date(res.reservationDate).toLocaleDateString('it-IT')}
                    </p>
                    <p className="text-sm text-gray-600">
                      Orario: {res.startTime} - {res.endTime}
                    </p>
                    <p className="text-sm text-gray-600">
                      Stato: <span className={`font-bold ${res.status === 'completed' ? 'text-green-500' : res.status === 'cancelled' ? 'text-red-500' : 'text-yellow-500'}`}>{res.status}</span>
                    </p>
                  </div>
                  <div className="flex space-x-2 mt-4 sm:mt-0">
                    <button
                      onClick={() => handleUpdateStatus(res.id, 'completed')}
                      className="bg-[#03a9f4] hover:bg-[#039be5] text-white font-bold py-2 px-3 rounded-lg text-sm transition-colors border-2 border-white pop-button"
                    >
                      Completata
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(res.id, 'cancelled')}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg text-sm transition-colors border-2 border-white pop-button"
                    >
                      Annullata
                    </button>
                    <button
                      onClick={() => handleDeleteReservation(res.id)}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded-lg text-sm transition-colors border-2 border-white pop-button"
                    >
                      Elimina
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Error section */}
        {error && (
          <div className="mt-8 p-4 bg-red-800 border border-red-700 rounded-xl text-red-200 text-center shadow-lg comic-bg-card">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
