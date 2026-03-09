import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, List, Grid3x3, LogOut } from 'lucide-react';

export default function TavoliPrenotazione() {
  const [firebase, setFirebase] = useState(null);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  
  // Autenticazione
  const [utenteLoggato, setUtenteLoggato] = useState(null);
  const [showAuth, setShowAuth] = useState(true);
  const [isRegistrazione, setIsRegistrazione] = useState(false);
  const [authData, setAuthData] = useState({ email: '', password: '', nome: '' });
  const [authError, setAuthError] = useState('');

  // Tavoli e prenotazioni
  const [tavoli, setTavoli] = useState(
    Array(16).fill(null).map((_, i) => ({
      id: i + 1,
      disponibile: true,
      prenotazione: null
    }))
  );

  const [prenotazioni, setPrenotazioni] = useState([]);
  const [activeTab, setActiveTab] = useState('tavoli');
  const [formData, setFormData] = useState({
    nome: '',
    orario: '',
    persone: '1',
    note: ''
  });
  const [tavoloSelezionato, setTavoloSelezionato] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Inizializza Firebase
  useEffect(() => {
    // Carica Firebase via CDN
    const script1 = document.createElement('script');
    script1.src = 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
    
    const script2 = document.createElement('script');
    script2.src = 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js';
    
    const script3 = document.createElement('script');
    script3.src = 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
    
    script1.onload = () => {
      script2.onload = () => {
        script3.onload = () => {
          // Firebase è caricato, inizializzalo
          const firebaseConfig = {
            apiKey: "AIzaSyCG0-J2wxZGSz6eDh_E-aAe2uvpTGLmXz0",
            authDomain: "prenotazioninegozio-65eb1.firebaseapp.com",
            projectId: "prenotazioninegozio-65eb1",
            storageBucket: "prenotazioninegozio-65eb1.firebasestorage.app",
            messagingSenderId: "466874129336",
            appId: "1:466874129336:web:fd07925523c35921fe8d4d"
          };

          const fbApp = window.firebase.initializeApp(firebaseConfig);
          const fbDb = window.firebase.database();
          const fbAuth = window.firebase.auth();
          
          setFirebase(fbApp);
          setDb(fbDb);
          setAuth(fbAuth);

          // Carica prenotazioni da Firebase
          fbDb.ref('prenotazioni').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const prenotazioniArray = Object.values(data);
              setPrenotazioni(prenotazioniArray);

              // Aggiorna tavoli
              const nuoviTavoli = Array(16).fill(null).map((_, i) => {
                const id = i + 1;
                const prenotazione = prenotazioniArray.find(p => p.tavolo === id);
                
                if (prenotazione) {
                  return {
                    id,
                    disponibile: false,
                    prenotazione: {
                      nome: prenotazione.nome,
                      orario: prenotazione.orario,
                      persone: prenotazione.persone,
                      note: prenotazione.note
                    }
                  };
                }
                
                return {
                  id,
                  disponibile: true,
                  prenotazione: null
                };
              });
              
              setTavoli(nuoviTavoli);
            }
          });
        };
        document.head.appendChild(script3);
      };
      document.head.appendChild(script2);
    };
    document.head.appendChild(script1);

    // CSS
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Playfair+Display:wght@400;600&display=swap');

      @keyframes fadeInStagger {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes glowPulse {
        0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.1), 0 0 0 1px rgba(239, 68, 68, 0.2); }
        50% { box-shadow: 0 0 30px rgba(239, 68, 68, 0.2), 0 0 0 1px rgba(239, 68, 68, 0.3); }
      }

      @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .tavolo-item {
        animation: fadeInStagger 0.6s ease-out forwards;
      }

      .tavolo-item:nth-child(1) { animation-delay: 0.05s; }
      .tavolo-item:nth-child(2) { animation-delay: 0.1s; }
      .tavolo-item:nth-child(3) { animation-delay: 0.15s; }
      .tavolo-item:nth-child(4) { animation-delay: 0.2s; }
      .tavolo-item:nth-child(5) { animation-delay: 0.25s; }
      .tavolo-item:nth-child(6) { animation-delay: 0.3s; }
      .tavolo-item:nth-child(7) { animation-delay: 0.35s; }
      .tavolo-item:nth-child(8) { animation-delay: 0.4s; }
      .tavolo-item:nth-child(9) { animation-delay: 0.45s; }
      .tavolo-item:nth-child(10) { animation-delay: 0.5s; }
      .tavolo-item:nth-child(11) { animation-delay: 0.55s; }
      .tavolo-item:nth-child(12) { animation-delay: 0.6s; }
      .tavolo-item:nth-child(13) { animation-delay: 0.65s; }
      .tavolo-item:nth-child(14) { animation-delay: 0.7s; }
      .tavolo-item:nth-child(15) { animation-delay: 0.75s; }
      .tavolo-item:nth-child(16) { animation-delay: 0.8s; }

      .tavolo-prenotato {
        animation: glowPulse 3s ease-in-out infinite;
      }

      .form-modal {
        animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      .success-message {
        animation: slideUp 0.3s ease-out;
      }

      .prenotazione-item {
        animation: fadeInStagger 0.4s ease-out forwards;
      }

      .header-title {
        font-family: 'Playfair Display', serif;
        font-size: 3.5rem;
        font-weight: 600;
        letter-spacing: -2px;
      }

      .stat-number {
        font-family: 'JetBrains Mono', monospace;
        font-size: 2rem;
        font-weight: 600;
        letter-spacing: 2px;
      }

      .tavolo-numero {
        font-family: 'JetBrains Mono', monospace;
        font-weight: 600;
        letter-spacing: 1px;
      }

      .grain {
        background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" /></filter><rect width="400" height="400" fill="%23050505" filter="url(%23noise)" opacity="0.03"/></svg>');
        background-size: 200px 200px;
      }

      input:focus, select:focus, textarea:focus {
        outline: none;
      }
    `;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  // ===== AUTENTICAZIONE =====
  const handleLogin = () => {
    setAuthError('');
    
    if (!authData.email || !authData.password) {
      setAuthError('Compila email e password');
      return;
    }

    if (!auth) {
      setAuthError('Firebase non è pronto');
      return;
    }

    auth.signInWithEmailAndPassword(authData.email, authData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        db.ref('utenti/' + user.uid).once('value', (snapshot) => {
          const userData = snapshot.val();
          if (userData) {
            setUtenteLoggato({ id: user.uid, ...userData });
            setShowAuth(false);
            setAuthData({ email: '', password: '', nome: '' });
          }
        });
      })
      .catch((error) => {
        setAuthError('Email o password non corretti');
      });
  };

  const handleRegistrazione = () => {
    setAuthError('');
    
    if (!authData.email || !authData.password || !authData.nome) {
      setAuthError('Compila tutti i campi');
      return;
    }

    if (!auth) {
      setAuthError('Firebase non è pronto');
      return;
    }

    auth.createUserWithEmailAndPassword(authData.email, authData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        db.ref('utenti/' + user.uid).set({
          nome: authData.nome,
          email: authData.email
        }).then(() => {
          setUtenteLoggato({ id: user.uid, nome: authData.nome, email: authData.email });
          setShowAuth(false);
          setAuthData({ email: '', password: '', nome: '' });
        });
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          setAuthError('Email già registrata');
        } else {
          setAuthError(error.message);
        }
      });
  };

  const handleLogout = () => {
    if (auth) {
      auth.signOut().then(() => {
        setUtenteLoggato(null);
        setShowAuth(true);
        setAuthData({ email: '', password: '', nome: '' });
        setIsRegistrazione(false);
      });
    }
  };

  // ===== TAVOLI E PRENOTAZIONI =====
  const handleTavoloClick = (id) => {
    const tavolo = tavoli.find(t => t.id === id);
    if (tavolo.disponibile) {
      setTavoloSelezionato(id);
      setShowForm(true);
      setFormData({ nome: '', orario: '', persone: '1', note: '' });
    }
  };

  const handleSubmit = () => {
    if (!formData.nome.trim() || !formData.orario) {
      alert('Compila nome e orario');
      return;
    }

    if (!db || !utenteLoggato) return;

    const prenotazioneId = Date.now().toString();
    const prenotazione = {
      id: prenotazioneId,
      tavolo: tavoloSelezionato,
      utenteId: utenteLoggato.id,
      utenteNome: utenteLoggato.nome,
      nome: formData.nome,
      orario: formData.orario,
      persone: formData.persone,
      note: formData.note,
      timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
    };

    db.ref('prenotazioni/' + prenotazioneId).set(prenotazione).then(() => {
      setSuccessMessage(`✓ Tavolo ${tavoloSelezionato} prenotato per ${formData.nome}`);
      setShowForm(false);
      setTavoloSelezionato(null);
      setFormData({ nome: '', orario: '', persone: '1', note: '' });

      setTimeout(() => setSuccessMessage(''), 4000);
    });
  };

  const cancellaPrenotazione = (prenotazioneId) => {
    if (!db) return;
    db.ref('prenotazioni/' + prenotazioneId).remove();
  };

  const tavoliDisponibili = tavoli.filter(t => t.disponibile).length;
  const percentualeDisponibili = Math.round((tavoliDisponibili / 16) * 100);

  // ===== SCHERMATA LOGIN/REGISTRAZIONE =====
  if (showAuth) {
    return (
      <div className="grain min-h-screen" style={{ background: '#050505', color: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="form-modal" style={{
          width: '100%',
          maxWidth: '400px',
          padding: '40px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(5, 5, 5, 0.95) 0%, rgba(20, 20, 20, 0.8) 100%)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              fontSize: '42px',
              fontWeight: '900',
              fontStyle: 'italic',
              letterSpacing: '-3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0px',
              marginBottom: '16px'
            }}>
              <span style={{ color: '#f5f5f5' }}>MAN</span>
              <span style={{ color: '#ef4444' }}>B</span>
              <span style={{ color: '#f5f5f5' }}>AGA</span>
            </div>
            <p style={{ color: '#888', fontSize: '12px', letterSpacing: '2px', fontFamily: '"JetBrains Mono", monospace' }}>
              {isRegistrazione ? 'CREA ACCOUNT' : 'ACCEDI'}
            </p>
          </div>

          {authError && (
            <div style={{
              marginBottom: '16px',
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '6px',
              display: 'flex',
              gap: '8px'
            }}>
              <AlertCircle size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
              <span style={{ color: '#ef4444', fontSize: '12px' }}>{authError}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {isRegistrazione && (
              <div>
                <label style={{ display: 'block', color: '#ef4444', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px', fontFamily: '"JetBrains Mono", monospace', fontWeight: '500' }}>
                  NOME
                </label>
                <input
                  type="text"
                  value={authData.nome}
                  onChange={(e) => setAuthData({ ...authData, nome: e.target.value })}
                  placeholder="Il tuo nome"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    borderRadius: '6px',
                    background: 'rgba(20, 20, 20, 0.6)',
                    border: '1px solid rgba(100, 100, 100, 0.2)',
                    color: '#f5f5f5',
                    fontFamily: '"JetBrains Mono", monospace',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                    e.target.style.background = 'rgba(20, 20, 20, 0.9)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(100, 100, 100, 0.2)';
                    e.target.style.background = 'rgba(20, 20, 20, 0.6)';
                  }}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', color: '#ef4444', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px', fontFamily: '"JetBrains Mono", monospace', fontWeight: '500' }}>
                EMAIL
              </label>
              <input
                type="email"
                value={authData.email}
                onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                placeholder="tuo@email.com"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  borderRadius: '6px',
                  background: 'rgba(20, 20, 20, 0.6)',
                  border: '1px solid rgba(100, 100, 100, 0.2)',
                  color: '#f5f5f5',
                  fontFamily: '"JetBrains Mono", monospace',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                  e.target.style.background = 'rgba(20, 20, 20, 0.9)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(100, 100, 100, 0.2)';
                  e.target.style.background = 'rgba(20, 20, 20, 0.6)';
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#ef4444', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px', fontFamily: '"JetBrains Mono", monospace', fontWeight: '500' }}>
                PASSWORD
              </label>
              <input
                type="password"
                value={authData.password}
                onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  borderRadius: '6px',
                  background: 'rgba(20, 20, 20, 0.6)',
                  border: '1px solid rgba(100, 100, 100, 0.2)',
                  color: '#f5f5f5',
                  fontFamily: '"JetBrains Mono", monospace',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                  e.target.style.background = 'rgba(20, 20, 20, 0.9)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(100, 100, 100, 0.2)';
                  e.target.style.background = 'rgba(20, 20, 20, 0.6)';
                }}
              />
            </div>

            <button
              onClick={isRegistrazione ? handleRegistrazione : handleLogin}
              style={{
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                border: 'none',
                color: '#050505',
                cursor: 'pointer',
                letterSpacing: '2px',
                fontFamily: '"JetBrains Mono", monospace',
                boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)',
                transition: 'all 0.2s',
                marginTop: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(239, 68, 68, 0.5)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.3)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {isRegistrazione ? 'REGISTRATI' : 'ACCEDI'}
            </button>

            <button
              onClick={() => {
                setIsRegistrazione(!isRegistrazione);
                setAuthError('');
                setAuthData({ email: '', password: '', nome: '' });
              }}
              style={{
                padding: '12px',
                fontSize: '12px',
                fontWeight: '500',
                borderRadius: '6px',
                background: 'rgba(40, 40, 40, 0.6)',
                border: '1px solid rgba(100, 100, 100, 0.2)',
                color: '#888',
                cursor: 'pointer',
                letterSpacing: '1px',
                fontFamily: '"JetBrains Mono", monospace',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(100, 100, 100, 0.4)';
                e.currentTarget.style.color = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(100, 100, 100, 0.2)';
                e.currentTarget.style.color = '#888';
              }}
            >
              {isRegistrazione ? 'HAI GIÀ UN ACCOUNT? ACCEDI' : 'NON HAI UN ACCOUNT? REGISTRATI'}
            </button>
          </div>

          <div style={{ marginTop: '24px', padding: '12px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '6px' }}>
            <p style={{ fontSize: '11px', color: '#888', lineHeight: '1.6', fontFamily: '"JetBrains Mono", monospace', margin: 0 }}>
              <strong>Nota:</strong> I dati sono salvati nel cloud di Firebase. Accedi da qualsiasi dispositivo!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ===== APP PRINCIPALE =====
  return (
    <div className="grain min-h-screen" style={{ background: '#050505', color: '#f5f5f5' }}>
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: 'radial-gradient(ellipse 80% 80% at 50% 0%, rgba(239, 68, 68, 0.08) 0%, transparent 100%)'
      }} />

      {/* Header */}
      <div className="relative z-10 border-b" style={{ borderColor: '#1a1a1a', padding: '20px', background: 'rgba(5, 5, 5, 0.8)', backdropFilter: 'blur(10px)' }}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div style={{
            fontSize: '28px',
            fontWeight: '900',
            fontStyle: 'italic',
            letterSpacing: '-2px',
            display: 'flex',
            alignItems: 'center',
            gap: '0px'
          }}>
            <span style={{ color: '#f5f5f5' }}>MAN</span>
            <span style={{ color: '#ef4444' }}>B</span>
            <span style={{ color: '#f5f5f5' }}>AGA</span>
          </div>

          {/* Center Title */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ color: '#ef4444', fontSize: '11px', letterSpacing: '3px', marginBottom: '8px', fontFamily: '"JetBrains Mono", monospace' }}>
              ◆ 漫画 PRENOTAZIONI
            </div>
            <h1 className="header-title mb-1" style={{ color: '#f5f5f5', fontSize: '2rem' }}>TAVOLI</h1>
            <p style={{ color: '#888', fontSize: '11px', letterSpacing: '2px', fontFamily: '"JetBrains Mono", monospace', margin: 0 }}>
              FUMETTERIA MANBAGA
            </p>
          </div>

          {/* User Info */}
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#ef4444', fontSize: '12px', fontFamily: '"JetBrains Mono", monospace', fontWeight: '500', marginBottom: '8px' }}>
              {utenteLoggato?.nome}
            </p>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 12px',
                fontSize: '11px',
                borderRadius: '6px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
              }}
            >
              <LogOut size={14} />
              ESCI
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="relative z-10 border-b" style={{ borderColor: '#1a1a1a', background: 'rgba(5, 5, 5, 0.5)', backdropFilter: 'blur(10px)' }}>
        <div className="max-w-6xl mx-auto flex items-center gap-8 px-6 py-4">
          <button
            onClick={() => setActiveTab('tavoli')}
            style={{
              color: activeTab === 'tavoli' ? '#ef4444' : '#888',
              borderBottom: activeTab === 'tavoli' ? '2px solid #ef4444' : '2px solid transparent',
              padding: '8px 0',
              fontSize: '13px',
              letterSpacing: '1px',
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: '500',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Grid3x3 size={16} />
            TAVOLI
          </button>
          <button
            onClick={() => setActiveTab('prenotazioni')}
            style={{
              color: activeTab === 'prenotazioni' ? '#ef4444' : '#888',
              borderBottom: activeTab === 'prenotazioni' ? '2px solid #ef4444' : '2px solid transparent',
              padding: '8px 0',
              fontSize: '13px',
              letterSpacing: '1px',
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: '500',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <List size={16} />
            PRENOTAZIONI ({prenotazioni.length})
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto p-6">
        {successMessage && (
          <div className="success-message mb-8 p-4 flex items-center gap-3 rounded-lg" style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            <Check size={20} style={{ color: '#ef4444', flexShrink: 0 }} />
            <span style={{ color: '#ef4444', fontSize: '14px', fontWeight: '500' }}>{successMessage}</span>
          </div>
        )}

        {/* TAB: TAVOLI */}
        {activeTab === 'tavoli' && (
          <>
            <div className="grid grid-cols-3 gap-6 mb-12">
              <div className="p-6 rounded-lg" style={{
                background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.8) 0%, rgba(20, 20, 20, 0.6) 100%)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}>
                <div style={{ color: '#ef4444', fontSize: '11px', letterSpacing: '2px', fontFamily: '"JetBrains Mono", monospace', marginBottom: '8px' }}>
                  DISPONIBILI
                </div>
                <div className="stat-number mb-2">{tavoliDisponibili}</div>
                <div style={{ height: '3px', background: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    background: '#ef4444',
                    width: `${percentualeDisponibili}%`,
                    transition: 'width 0.6s ease-out'
                  }} />
                </div>
              </div>

              <div className="p-6 rounded-lg" style={{
                background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.8) 0%, rgba(20, 20, 20, 0.6) 100%)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}>
                <div style={{ color: '#ef4444', fontSize: '11px', letterSpacing: '2px', fontFamily: '"JetBrains Mono", monospace', marginBottom: '8px' }}>
                  PRENOTATI
                </div>
                <div className="stat-number mb-2">{16 - tavoliDisponibili}</div>
                <div style={{ height: '3px', background: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    background: '#ef4444',
                    width: `${100 - percentualeDisponibili}%`,
                    transition: 'width 0.6s ease-out'
                  }} />
                </div>
              </div>

              <div className="p-6 rounded-lg" style={{
                background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.8) 0%, rgba(20, 20, 20, 0.6) 100%)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}>
                <div style={{ color: '#ef4444', fontSize: '11px', letterSpacing: '2px', fontFamily: '"JetBrains Mono", monospace', marginBottom: '8px' }}>
                  MAX PERSONE
                </div>
                <div className="stat-number">2</div>
                <p style={{ color: '#666', fontSize: '11px', marginTop: '8px' }}>Per tavolo</p>
              </div>
            </div>

            <div className="mb-16">
              <h2 style={{ color: '#f5f5f5', fontSize: '18px', letterSpacing: '2px', fontFamily: '"JetBrains Mono", monospace', fontWeight: '500', marginBottom: '24px' }}>
                16 TAVOLI DISPONIBILI
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '12px' }}>
                {tavoli.map(tavolo => (
                  <div key={tavolo.id} className="tavolo-item">
                    <button
                      onClick={() => handleTavoloClick(tavolo.id)}
                      disabled={!tavolo.disponibile}
                      style={{
                        width: '100%',
                        position: 'relative',
                        cursor: tavolo.disponibile ? 'pointer' : 'default',
                        background: 'none',
                        border: 'none',
                        padding: 0
                      }}
                    >
                      <div
                        className={tavolo.disponibile ? '' : 'tavolo-prenotato'}
                        style={{
                          aspectRatio: '1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          overflow: 'hidden',
                          borderRadius: '8px',
                          transition: 'all 0.3s ease',
                          background: tavolo.disponibile
                            ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 40, 0.6) 100%)'
                            : 'linear-gradient(135deg, rgba(40, 15, 15, 0.8) 0%, rgba(38, 19, 19, 0.6) 100%)',
                          border: tavolo.disponibile
                            ? '1px solid rgba(100, 100, 100, 0.3)'
                            : '2px solid rgba(239, 68, 68, 0.6)',
                          backdropFilter: 'blur(10px)',
                          boxShadow: tavolo.disponibile
                            ? '0 8px 24px rgba(0, 0, 0, 0.2)'
                            : 'inset 0 0 20px rgba(239, 68, 68, 0.1)'
                        }}
                      >
                        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
                          <div style={{ color: '#ef4444', fontSize: '9px', letterSpacing: '1px', fontFamily: '"JetBrains Mono", monospace', marginBottom: '6px' }}>
                            TABLE
                          </div>
                          <div className="tavolo-numero" style={{ color: '#f5f5f5', fontSize: '2rem', marginBottom: '4px' }}>
                            {tavolo.id}
                          </div>

                          {tavolo.disponibile ? (
                            <div style={{ color: '#666', fontSize: '8px', letterSpacing: '0.5px', fontFamily: '"JetBrains Mono", monospace' }}>
                              PRENOTA
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ef4444' }} />
                                <span style={{ color: '#ef4444', fontSize: '8px', fontFamily: '"JetBrains Mono", monospace', fontWeight: '500' }}>
                                  {tavolo.prenotazione.persone}P
                                </span>
                              </div>
                              <div style={{ color: '#888', fontSize: '7px', fontFamily: '"JetBrains Mono", monospace' }}>
                                {tavolo.prenotazione.orario}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* TAB: PRENOTAZIONI */}
        {activeTab === 'prenotazioni' && (
          <div className="mb-16">
            <h2 style={{ color: '#f5f5f5', fontSize: '18px', letterSpacing: '2px', fontFamily: '"JetBrains Mono", monospace', fontWeight: '500', marginBottom: '24px' }}>
              TUTTE LE PRENOTAZIONI
            </h2>

            {prenotazioni.length === 0 ? (
              <div style={{
                padding: '48px',
                textAlign: 'center',
                borderRadius: '8px',
                background: 'rgba(10, 10, 10, 0.6)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
                backdropFilter: 'blur(10px)'
              }}>
                <p style={{ color: '#888', fontSize: '14px', letterSpacing: '1px', fontFamily: '"JetBrains Mono", monospace' }}>
                  NESSUNA PRENOTAZIONE AL MOMENTO
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
                {prenotazioni.map((prenotazione, index) => {
                  const isMia = prenotazione.utenteId === utenteLoggato?.id;
                  
                  return (
                    <div
                      key={prenotazione.id}
                      className="prenotazione-item"
                      style={{
                        padding: '16px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.8) 0%, rgba(20, 20, 20, 0.6) 100%)',
                        border: isMia ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(239, 68, 68, 0.15)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: isMia ? '0 8px 24px rgba(239, 68, 68, 0.15)' : '0 8px 24px rgba(0, 0, 0, 0.2)',
                        animationDelay: `${index * 0.05}s`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '12px'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#f5f5f5', fontSize: '16px', fontWeight: '500', marginBottom: '4px' }}>
                          {prenotazione.nome}
                        </div>
                        <div style={{ color: '#ef4444', fontSize: '13px', fontFamily: '"JetBrains Mono", monospace', fontWeight: '600', marginBottom: '8px' }}>
                          {prenotazione.orario}
                        </div>
                        <div style={{ color: '#888', fontSize: '11px', fontFamily: '"JetBrains Mono", monospace' }}>
                          di <span style={{ color: '#aaa', fontWeight: '500' }}>{prenotazione.utenteNome}</span>
                          {isMia && <span style={{ color: '#ef4444', marginLeft: '8px' }}>• TUA</span>}
                        </div>
                      </div>

                      {isMia && (
                        <button
                          onClick={() => cancellaPrenotazione(prenotazione.id)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontFamily: '"JetBrains Mono", monospace',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s',
                            flexShrink: 0
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
                            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                          }}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          zIndex: 50,
          backdropFilter: 'blur(8px)'
        }}>
          <div
            className="form-modal"
            style={{
              width: '100%',
              maxWidth: '420px',
              padding: '32px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(5, 5, 5, 0.95) 0%, rgba(20, 20, 20, 0.8) 100%)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
              <div>
                <h2 className="header-title" style={{ color: '#f5f5f5', fontSize: '2rem', marginBottom: '8px' }}>
                  TAVOLO {tavoloSelezionato}
                </h2>
                <p style={{ color: '#ef4444', fontSize: '11px', letterSpacing: '2px', fontFamily: '"JetBrains Mono", monospace' }}>
                  NUOVA PRENOTAZIONE
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  padding: '8px',
                  background: 'rgba(100, 100, 100, 0.2)',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#888',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', color: '#ef4444', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px', fontFamily: '"JetBrains Mono", monospace', fontWeight: '500' }}>
                  NOME PERSONA
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Scrivi il tuo nome"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    borderRadius: '6px',
                    background: 'rgba(20, 20, 20, 0.6)',
                    border: '1px solid rgba(100, 100, 100, 0.2)',
                    color: '#f5f5f5',
                    fontFamily: '"JetBrains Mono", monospace',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                    e.target.style.background = 'rgba(20, 20, 20, 0.9)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(100, 100, 100, 0.2)';
                    e.target.style.background = 'rgba(20, 20, 20, 0.6)';
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#ef4444', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px', fontFamily: '"JetBrains Mono", monospace', fontWeight: '500' }}>
                  ORARIO DI ARRIVO
                </label>
                <input
                  type="time"
                  value={formData.orario}
                  onChange={(e) => setFormData({ ...formData, orario: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    borderRadius: '6px',
                    background: 'rgba(20, 20, 20, 0.6)',
                    border: '1px solid rgba(100, 100, 100, 0.2)',
                    color: '#f5f5f5',
                    fontFamily: '"JetBrains Mono", monospace',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                    e.target.style.background = 'rgba(20, 20, 20, 0.9)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(100, 100, 100, 0.2)';
                    e.target.style.background = 'rgba(20, 20, 20, 0.6)';
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#ef4444', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px', fontFamily: '"JetBrains Mono", monospace', fontWeight: '500' }}>
                  NUMERO PERSONE
                </label>
                <select
                  value={formData.persone}
                  onChange={(e) => setFormData({ ...formData, persone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    borderRadius: '6px',
                    background: 'rgba(20, 20, 20, 0.6)',
                    border: '1px solid rgba(100, 100, 100, 0.2)',
                    color: '#f5f5f5',
                    fontFamily: '"JetBrains Mono", monospace',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                    e.target.style.background = 'rgba(20, 20, 20, 0.9)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(100, 100, 100, 0.2)';
                    e.target.style.background = 'rgba(20, 20, 20, 0.6)';
                  }}
                >
                  <option value="1">1 Persona</option>
                  <option value="2">2 Persone (Massimo)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: '#ef4444', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px', fontFamily: '"JetBrains Mono", monospace', fontWeight: '500' }}>
                  NOTE SPECIALI (Opzionale)
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Allergie, preferenze, istruzioni speciali..."
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    borderRadius: '6px',
                    background: 'rgba(20, 20, 20, 0.6)',
                    border: '1px solid rgba(100, 100, 100, 0.2)',
                    color: '#f5f5f5',
                    fontFamily: '"JetBrains Mono", monospace',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s',
                    resize: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                    e.target.style.background = 'rgba(20, 20, 20, 0.9)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(100, 100, 100, 0.2)';
                    e.target.style.background = 'rgba(20, 20, 20, 0.6)';
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    padding: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    borderRadius: '6px',
                    background: 'rgba(40, 40, 40, 0.6)',
                    border: '1px solid rgba(100, 100, 100, 0.2)',
                    color: '#f5f5f5',
                    cursor: 'pointer',
                    letterSpacing: '1px',
                    fontFamily: '"JetBrains Mono", monospace',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(100, 100, 100, 0.4)';
                    e.currentTarget.style.background = 'rgba(50, 50, 50, 0.8)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(100, 100, 100, 0.2)';
                    e.currentTarget.style.background = 'rgba(40, 40, 40, 0.6)';
                  }}
                >
                  ANNULLA
                </button>
                <button
                  onClick={handleSubmit}
                  style={{
                    padding: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    borderRadius: '6px',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    border: 'none',
                    color: '#050505',
                    cursor: 'pointer',
                    letterSpacing: '1px',
                    fontFamily: '"JetBrains Mono", monospace',
                    boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(239, 68, 68, 0.5)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  CONFERMA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="relative z-10 border-t mt-20" style={{ borderColor: '#1a1a1a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 20px', textAlign: 'center' }}>
          <p style={{ color: '#ef4444', fontSize: '11px', letterSpacing: '2px', fontFamily: '"JetBrains Mono", monospace', marginBottom: '8px' }}>
            ◆ 漫 MANBAGA COMICS & GAMES ◆
          </p>
          <p style={{ color: '#666', fontSize: '12px', letterSpacing: '1px' }}>
            Via Padre Reginaldo Giuliani, 21 • Canosa di Puglia (BT)
          </p>
          <p style={{ color: '#555', fontSize: '10px', marginTop: '12px', fontFamily: '"JetBrains Mono", monospace' }}>
            © 2025 • Progettato con passione per i fan
          </p>
        </div>
      </div>
    </div>
  );
}
