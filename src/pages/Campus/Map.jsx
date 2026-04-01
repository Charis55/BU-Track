import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  ChevronLeft, Activity, Utensils, Navigation, Calendar,
  MapPin, Info, Search, Clock, Users, Dumbbell, BookOpen, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Babcock University center coordinates
const BABCOCK_CENTER = [7.1508, 3.9028];
const DEFAULT_ZOOM = 16;

// Custom marker icons
const createIcon = (color, emoji) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width:40px;height:40px;border-radius:50%;
      background:radial-gradient(circle,${color},${color}cc);
      border:2px solid rgba(255,255,255,0.6);
      box-shadow:0 0 18px ${color}80, 0 4px 12px rgba(0,0,0,0.4);
      display:flex;align-items:center;justify-content:center;
      font-size:18px;cursor:pointer;
      transition:transform 0.2s;
    ">${emoji}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -42],
  });
};

const icons = {
  sports: createIcon('#3b82f6', '🏋️'),
  food: createIcon('#f59e0b', '🍽️'),
  track: createIcon('#10b981', '🏃'),
  academic: createIcon('#8b5cf6', '📚'),
  hostel: createIcon('#ec4899', '🏠'),
  health: createIcon('#ef4444', '🏥'),
  worship: createIcon('#06b6d4', '⛪'),
  admin: createIcon('#64748b', '🏛️'),
};

// Real Babcock University facilities with approximate coordinates
const FACILITIES = [
  // Sports & Fitness
  { id: 1, name: 'Babcock University Sports Complex', type: 'sports', lat: 7.1525, lng: 3.9005, status: 'Open', crowding: 'Medium', description: 'Full gymnasium, basketball courts, and fitness center. Open 6AM–9PM daily.', hours: '6:00 AM – 9:00 PM' },
  { id: 2, name: 'Main Sports Field / Stadium', type: 'track', lat: 7.1540, lng: 3.9015, status: 'Open', crowding: 'Low', description: '400m track, football pitch. Morning joggers 5:30–7AM, evening 5–7PM.', hours: '5:30 AM – 7:00 PM' },
  { id: 3, name: 'Tennis & Basketball Courts', type: 'sports', lat: 7.1530, lng: 3.8995, status: 'Open', crowding: 'Low', description: 'Multiple tennis and basketball courts near the sports complex.', hours: '7:00 AM – 8:00 PM' },

  // Food & Dining
  { id: 4, name: 'BU Cafeteria (Main)', type: 'food', lat: 7.1500, lng: 3.9035, status: 'Open', crowding: 'High', description: 'Main student cafeteria serving breakfast, lunch, and dinner. Buffet-style meals.', hours: '7:00 AM – 7:30 PM' },
  { id: 5, name: 'Tuck Shops / Snack Area', type: 'food', lat: 7.1495, lng: 3.9020, status: 'Open', crowding: 'Medium', description: 'Snacks, fresh juice, shawarma, smoothies. Student favorites!', hours: '8:00 AM – 9:00 PM' },
  { id: 6, name: 'Staff Club Restaurant', type: 'food', lat: 7.1478, lng: 3.9050, status: 'Open', crowding: 'Low', description: 'Restaurant near staff quarters. Quality meals and a quieter atmosphere.', hours: '10:00 AM – 8:00 PM' },

  // Academic Buildings
  { id: 7, name: 'School of Science & Technology', type: 'academic', lat: 7.1502, lng: 3.9055, status: 'Open', crowding: 'Medium', description: 'Engineering, Computer Science, and IT departments. Multiple lecture halls.', hours: '8:00 AM – 5:00 PM' },
  { id: 8, name: 'School of Law & Security Studies', type: 'academic', lat: 7.1488, lng: 3.9070, status: 'Open', crowding: 'Low', description: 'Law faculty and moot court facilities.', hours: '8:00 AM – 5:00 PM' },
  { id: 9, name: 'Babcock Business School', type: 'academic', lat: 7.1510, lng: 3.9065, status: 'Open', crowding: 'Medium', description: 'Business Administration, Accounting, Economics departments.', hours: '8:00 AM – 5:00 PM' },
  { id: 10, name: 'E-Library / Main Library', type: 'academic', lat: 7.1515, lng: 3.9045, status: 'Open', crowding: 'Medium', description: 'Multi-floor library with e-resources, study zones, and quiet areas.', hours: '8:00 AM – 10:00 PM' },

  // Hostels - Male Undergraduate
  { id: 11, name: 'Samuel Akande Hall', type: 'hostel', lat: 7.1535, lng: 3.9060, status: 'Open', crowding: 'N/A', description: 'Male undergraduate hostel block.', hours: '24 Hours' },
  { id: 12, name: 'Neal C. Wilson Hall', type: 'hostel', lat: 7.1540, lng: 3.9050, status: 'Open', crowding: 'N/A', description: 'Male undergraduate hostel block.', hours: '24 Hours' },
  { id: 13, name: 'Emerald Hall', type: 'hostel', lat: 7.1545, lng: 3.9040, status: 'Open', crowding: 'N/A', description: 'Male undergraduate hostel block.', hours: '24 Hours' },
  { id: 17, name: 'Winslow Hall', type: 'hostel', lat: 7.1550, lng: 3.9030, status: 'Open', crowding: 'N/A', description: 'Male undergraduate hostel block.', hours: '24 Hours' },
  { id: 18, name: 'Nelson Mandela Hall', type: 'hostel', lat: 7.1555, lng: 3.9020, status: 'Open', crowding: 'N/A', description: 'Male undergraduate hostel block.', hours: '24 Hours' },
  { id: 19, name: 'Bethel Splendour Hall', type: 'hostel', lat: 7.1560, lng: 3.9010, status: 'Open', crowding: 'N/A', description: 'Male undergraduate hostel block.', hours: '24 Hours' },

  // Hostels - Postgraduate
  { id: 20, name: 'Adeleke Hall', type: 'hostel', lat: 7.1470, lng: 3.9010, status: 'Open', crowding: 'N/A', description: 'Postgraduate hostel block.', hours: '24 Hours' },

  // Hostels - Female Undergraduate
  { id: 21, name: 'Sapphire Hall', type: 'hostel', lat: 7.1460, lng: 3.8990, status: 'Open', crowding: 'N/A', description: 'Female undergraduate hostel block.', hours: '24 Hours' },
  { id: 22, name: 'Nyberg Hall', type: 'hostel', lat: 7.1465, lng: 3.8980, status: 'Open', crowding: 'N/A', description: 'Female undergraduate hostel block.', hours: '24 Hours' },
  { id: 23, name: 'White Hall', type: 'hostel', lat: 7.1470, lng: 3.8970, status: 'Open', crowding: 'N/A', description: 'Female undergraduate hostel block.', hours: '24 Hours' },
  { id: 24, name: 'Diamond Hall', type: 'hostel', lat: 7.1475, lng: 3.8960, status: 'Open', crowding: 'N/A', description: 'Female undergraduate hostel block.', hours: '24 Hours' },
  { id: 25, name: 'Crystal Hall', type: 'hostel', lat: 7.1480, lng: 3.8950, status: 'Open', crowding: 'N/A', description: 'Female undergraduate hostel block.', hours: '24 Hours' },
  { id: 26, name: 'FAD Hall', type: 'hostel', lat: 7.1485, lng: 3.8940, status: 'Open', crowding: 'N/A', description: 'Female undergraduate hostel block.', hours: '24 Hours' },
  { id: 27, name: 'Queen Esther Hall', type: 'hostel', lat: 7.1490, lng: 3.8930, status: 'Open', crowding: 'N/A', description: 'Female undergraduate hostel block.', hours: '24 Hours' },
  { id: 28, name: 'Havilah Gold Hall', type: 'hostel', lat: 7.1495, lng: 3.8920, status: 'Open', crowding: 'N/A', description: 'Female undergraduate hostel block.', hours: '24 Hours' },
  { id: 29, name: 'Ameyo Hall', type: 'hostel', lat: 7.1500, lng: 3.8910, status: 'Open', crowding: 'N/A', description: 'Female undergraduate hostel block.', hours: '24 Hours' },

  // Health & Wellness
  { id: 14, name: 'Babcock University Teaching Hospital', type: 'health', lat: 7.1460, lng: 3.9040, status: 'Open', crowding: 'Medium', description: 'Full teaching hospital with ER, pharmacy, and student health center.', hours: '24 Hours' },

  // Worship
  { id: 15, name: 'Babcock University Church (Main Auditorium)', type: 'worship', lat: 7.1505, lng: 3.9010, status: 'Open', crowding: 'High', description: 'Main worship center seating thousands. Services Wed & Sat.', hours: 'Service Times' },

  // Admin
  { id: 16, name: 'University Admin Block', type: 'admin', lat: 7.1498, lng: 3.9045, status: 'Open', crowding: 'Low', description: 'Registrar, bursary, student affairs, and dean of students.', hours: '8:00 AM – 4:00 PM' },
];

const ROUTES = [
  { id: 1, name: 'Stadium to Cafeteria Loop', distance: '1.8 km', difficulty: 'Easy', time: '15 min', desc: 'Great morning route through campus center.' },
  { id: 2, name: 'Full Campus Perimeter', distance: '3.5 km', difficulty: 'Moderate', time: '30 min', desc: 'The complete Babcock loop. Shaded paths throughout.' },
  { id: 3, name: 'Hostel to Library Sprint', distance: '0.6 km', difficulty: 'Easy', time: '5 min', desc: 'Quick morning dash to grab a study seat.' },
  { id: 4, name: 'Sports Complex Circuit', distance: '2.2 km', difficulty: 'Hard', time: '20 min', desc: 'Hills and stairs. A real workout!' },
];

const CATEGORY_LABELS = {
  sports: { label: 'Sports', color: '#3b82f6', icon: Dumbbell },
  food: { label: 'Dining', color: '#f59e0b', icon: Utensils },
  track: { label: 'Fitness', color: '#10b981', icon: Activity },
  academic: { label: 'Academic', color: '#8b5cf6', icon: BookOpen },
  hostel: { label: 'Hostels', color: '#ec4899', icon: Users },
  health: { label: 'Health', color: '#ef4444', icon: Info },
  worship: { label: 'Worship', color: '#06b6d4', icon: MapPin },
  admin: { label: 'Admin', color: '#64748b', icon: Navigation },
};

function FlyToMarker({ position }) {
  const map = useMap();
  if (position) map.panTo(position, { animate: true, duration: 0.5 });
  return null;
}

const CampusMap = () => {
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  const filtered = FACILITIES.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || f.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="campus-container container animate-fade-in">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}><ChevronLeft size={20} /> Back</button>
        <h1 className="glow-emerald">Campus Guide</h1>
        <div style={{ width: '40px' }} />
      </header>

      <div className="campus-layout">
        {/* Map Section */}
        <section className="map-view-section">
          <div className="glass-card" style={{ borderRadius: '1.5rem', overflow: 'hidden', marginBottom: '1.5rem' }}>
            {/* Search bar overlaid on map */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', top: '1rem', left: '1rem', right: '1rem', zIndex: 1000,
                display: 'flex', gap: '0.5rem'
              }}>
                <div className="glass-card" style={{
                  flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.6rem 1rem', borderRadius: '0.875rem',
                  background: 'rgba(8,12,20,0.85)', border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Search facilities..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{
                      background: 'transparent', border: 'none', color: 'white',
                      outline: 'none', fontSize: '0.85rem', padding: 0, width: '100%'
                    }}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter chips */}
              <div style={{
                position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', zIndex: 1000,
                display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.25rem'
              }}>
                <button
                  onClick={() => setActiveFilter('all')}
                  style={{
                    padding: '0.35rem 0.875rem', borderRadius: '2rem', fontSize: '0.72rem',
                    fontWeight: 700, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                    background: activeFilter === 'all' ? 'var(--accent-emerald)' : 'rgba(8,12,20,0.85)',
                    color: activeFilter === 'all' ? 'white' : 'var(--text-secondary)',
                    ...(activeFilter !== 'all' ? { border: '1px solid rgba(255,255,255,0.1)' } : {})
                  }}
                >All</button>
                {Object.entries(CATEGORY_LABELS).map(([key, cat]) => (
                  <button
                    key={key}
                    onClick={() => setActiveFilter(key)}
                    style={{
                      padding: '0.35rem 0.875rem', borderRadius: '2rem', fontSize: '0.72rem',
                      fontWeight: 700, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                      display: 'flex', alignItems: 'center', gap: '0.35rem',
                      background: activeFilter === key ? cat.color : 'rgba(8,12,20,0.85)',
                      color: activeFilter === key ? 'white' : 'var(--text-secondary)',
                      ...(activeFilter !== key ? { border: '1px solid rgba(255,255,255,0.1)' } : {})
                    }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: cat.color }} />
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Leaflet Map */}
              <MapContainer
                center={BABCOCK_CENTER}
                zoom={DEFAULT_ZOOM}
                style={{ height: '480px', width: '100%' }}
                zoomControl={false}
                attributionControl={false}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                {selectedFacility && (
                  <FlyToMarker position={[selectedFacility.lat, selectedFacility.lng]} />
                )}
                {filtered.map(f => (
                  <Marker
                    key={f.id}
                    position={[f.lat, f.lng]}
                    icon={icons[f.type]}
                    eventHandlers={{
                      click: () => setSelectedFacility(f),
                      mouseover: () => setSelectedFacility(f)
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                      <span style={{ fontWeight: 600, fontFamily: 'Inter, sans-serif', color: '#1a1a2e' }}>{f.name}</span>
                    </Tooltip>
                    <Popup>
                      <div style={{ color: '#1a1a2e', fontFamily: 'Inter, sans-serif' }}>
                        <strong style={{ fontSize: '0.9rem' }}>{f.name}</strong>
                        <br />
                        <span style={{ fontSize: '0.75rem', color: '#666' }}>{f.description}</span>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Facility detail panel */}
          <div className="glass-card info-panel">
            <AnimatePresence mode="wait">
              {selectedFacility ? (
                <motion.div
                  key={selectedFacility.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="facility-header">
                    <div>
                      <h3 style={{ marginBottom: '0.25rem' }}>{selectedFacility.name}</h3>
                      <span style={{ fontSize: '0.8rem', color: CATEGORY_LABELS[selectedFacility.type]?.color }}>
                        {CATEGORY_LABELS[selectedFacility.type]?.label}
                      </span>
                    </div>
                    <span className={`status-pill ${selectedFacility.status.toLowerCase()}`}>
                      {selectedFacility.status}
                    </span>
                  </div>
                  <p className="text-secondary" style={{ margin: '0.75rem 0', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    {selectedFacility.description}
                  </p>
                  <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', margin: '1rem 0' }}>
                    <div className="f-stat"><Clock size={14} style={{ color: 'var(--accent-emerald)' }} /> <span>{selectedFacility.hours}</span></div>
                    {selectedFacility.crowding !== 'N/A' && (
                      <div className="f-stat"><Users size={14} style={{ color: 'var(--accent-gold)' }} /> <span>Crowding: <strong>{selectedFacility.crowding}</strong></span></div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedFacility.lat},${selectedFacility.lng}`, '_blank');
                    }}
                    style={{
                      width: '100%', padding: '0.875rem', background: 'var(--grad-emerald, linear-gradient(135deg, #10b981, #059669))',
                      color: 'white', borderRadius: '0.875rem', fontWeight: 700, border: 'none',
                      cursor: 'pointer', fontSize: '0.9rem', marginTop: '0.5rem',
                      boxShadow: '0 4px 20px rgba(16,185,129,0.2)'
                    }}
                  >
                    <Navigation size={14} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Get Directions in Google Maps
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="empty-panel"
                >
                  <MapPin size={36} style={{ color: 'var(--text-muted)' }} />
                  <p style={{ fontSize: '0.9rem' }}>Tap a marker on the map to see details about that facility.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Sidebar */}
        <section className="routes-section">
          <div className="glass-card events-card">
            <div className="header-flex">
              <h3 style={{ fontWeight: 700 }}>Fitness Events</h3>
              <Calendar size={18} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div className="event-item">
              <div className="event-date">APR 15</div>
              <div className="event-info">
                <h4>Inter-Hostel Marathon</h4>
                <p>Main Stadium • 7:00 AM</p>
              </div>
            </div>
            <div className="event-item">
              <div className="event-date">APR 22</div>
              <div className="event-info">
                <h4>Wellness Week 5K Run</h4>
                <p>Campus Perimeter • 6:00 AM</p>
              </div>
            </div>
          </div>

          <div className="glass-card routes-card">
            <h3 style={{ fontWeight: 700 }}>Jogging Routes</h3>
            <div className="routes-list">
              {ROUTES.map(route => (
                <motion.div key={route.id} whileHover={{ x: 4 }} className="route-item">
                  <div className="route-icon"><Navigation size={16} /></div>
                  <div className="route-info">
                    <h4>{route.name}</h4>
                    <p>{route.distance} • {route.difficulty}</p>
                  </div>
                  <div className="route-time">{route.time}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Facility list for quick navigation */}
          <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>All Facilities ({filtered.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
              {filtered.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFacility(f)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem',
                    background: selectedFacility?.id === f.id ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${selectedFacility?.id === f.id ? 'var(--border-emerald, rgba(16,185,129,0.35))' : 'var(--border-subtle, rgba(255,255,255,0.07))'}`,
                    borderRadius: '0.75rem', cursor: 'pointer', textAlign: 'left', color: 'inherit',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: CATEGORY_LABELS[f.type]?.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{CATEGORY_LABELS[f.type]?.label}</div>
                  </div>
                  <span className={`status-pill ${f.status.toLowerCase()}`} style={{ fontSize: '0.6rem', padding: '0.15rem 0.5rem' }}>{f.status}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CampusMap;
