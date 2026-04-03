// ─────────────────────────────────────────────────────────────────────────────
// BABCOCK CAMPUS JOGGING ROUTES — Shared between Map.jsx and WorkoutTracker.jsx
// Each route has 25/50/75/100% checkpoints derived from its waypoints.
// ─────────────────────────────────────────────────────────────────────────────

export const JOGGING_ROUTES = [
  {
    id: 'r1',
    name: 'Library Loop',
    difficulty: 'Easy',
    distance: '1.2 km',
    distanceKm: 1.2,
    time: '~8 min',
    timeMin: 8,
    calories: '~60 kcal',
    calPerMin: 7.5,
    color: '#10b981',
    desc: 'A gentle loop through the academic core — great for morning warm-ups.',
    waypoints: [
      [6.8923,  3.7225],  // Laz Otti Library
      [6.8904,  3.7232],  // School of Computing
      [6.8907,  3.7237],  // Business School
      [6.8909,  3.7226],  // Amphitheatre
      [6.89305, 3.72277], // Food Service
      [6.8923,  3.7225],  // → Library (finish)
    ],
    landmarks: ['Laz Otti Library', 'School of Computing', 'Business School', 'Amphitheatre', 'Food Service'],
    checkpoints: [
      { pct: 25,  label: 'School of Computing',   emoji: '💻', note: 'Great start — stay steady!' },
      { pct: 50,  label: 'Business School',        emoji: '📊', note: 'Halfway! Keep your pace.' },
      { pct: 75,  label: 'Food Service',           emoji: '🍛', note: 'Almost there — push through!' },
      { pct: 100, label: 'Laz Otti Library',       emoji: '🏁', note: 'Route complete! Well done.' },
    ],
  },
  {
    id: 'r2',
    name: 'Campus Spine',
    difficulty: 'Moderate',
    distance: '2.6 km',
    distanceKm: 2.6,
    time: '~18 min',
    timeMin: 18,
    calories: '~140 kcal',
    calPerMin: 7.8,
    color: '#3b82f6',
    desc: 'The backbone route connecting admin, academic and social hubs end-to-end.',
    waypoints: [
      [6.88908, 3.72004], // Main Gate
      [6.8893,  3.7218],  // Registry
      [6.8911,  3.7173],  // Teaching Hospital
      [6.8924,  3.7183],  // Campus Center
      [6.8928,  3.7196],  // Bakery
      [6.8912,  3.7205],  // Shopping Complex
      [6.8923,  3.7225],  // Library
      [6.89305, 3.72277], // Food Service
      [6.8909,  3.7226],  // Amphitheatre
      [6.8907,  3.7237],  // Business School
      [6.88908, 3.72004], // → Main Gate (finish)
    ],
    landmarks: ['Main Gate', 'Registry', 'Hospital', 'Campus Center', 'Library', 'Amphitheatre'],
    checkpoints: [
      { pct: 25,  label: 'Teaching Hospital',   emoji: '🏥', note: 'First quarter done — breathe!' },
      { pct: 50,  label: 'Shopping Complex',    emoji: '🛍️', note: 'Halfway through the spine!' },
      { pct: 75,  label: 'Amphitheatre',        emoji: '🎭', note: 'Three quarters! Final stretch.' },
      { pct: 100, label: 'Main Gate',           emoji: '🏁', note: 'Campus Spine complete! 🎉' },
    ],
  },
  {
    id: 'r3',
    name: 'North Hall Circuit',
    difficulty: 'Moderate',
    distance: '3.1 km',
    distanceKm: 3.1,
    time: '~22 min',
    timeMin: 22,
    calories: '~175 kcal',
    calPerMin: 7.9,
    color: '#f59e0b',
    desc: 'Wind through the northern residential cluster — a favourite for evening runs.',
    waypoints: [
      [6.89305, 3.72172], // Neal C. Wilson Hall
      [6.89401, 3.72166], // Winslow Hall
      [6.89442, 3.72249], // Gideon Troopers Hall
      [6.89461, 3.72307], // Bethel Splendour Hall
      [6.89413, 3.72364], // Samuel Akande Hall
      [6.89494, 3.72493], // Ameyo Adadevh Hall
      [6.89488, 3.72607], // Havilah Gold Hall
      [6.89286, 3.72774], // Crystal Hall
      [6.8926,  3.72538], // Nyberg Hall
      [6.89367, 3.72498], // FAD Hall
      [6.89347, 3.72304], // Nelson Mandela Hall
      [6.89305, 3.72172], // → Neal C. Wilson (finish)
    ],
    landmarks: ['Neal C. Wilson', 'Gideon Troopers', 'Ameyo Adadevh', 'Crystal Hall', 'Nyberg Hall'],
    checkpoints: [
      { pct: 25,  label: 'Gideon Troopers Hall',  emoji: '🏠', note: 'First halls done! Stay loose.' },
      { pct: 50,  label: 'Ameyo Adadevh Hall',    emoji: '🌸', note: 'Halfway round the circuit!' },
      { pct: 75,  label: 'Nyberg Hall',            emoji: '🔹', note: 'Three-quarter mark — drive home!' },
      { pct: 100, label: 'Neal C. Wilson Hall',    emoji: '🏁', note: 'North Hall Circuit done! 🎉' },
    ],
  },
  {
    id: 'r4',
    name: 'Stadium & Sports Loop',
    difficulty: 'Hard',
    distance: '3.8 km',
    distanceKm: 3.8,
    time: '~26 min',
    timeMin: 26,
    calories: '~215 kcal',
    calPerMin: 8.3,
    color: '#ef4444',
    desc: 'Race through the sports quarter — from the stadium to the basketball court and back.',
    waypoints: [
      [6.8949,  3.7276],  // Stadium
      [6.89396, 3.72848], // Basketball Court
      [6.89286, 3.72774], // Crystal Hall
      [6.89488, 3.72607], // Havilah Gold Hall
      [6.89494, 3.72493], // Ameyo Adadevh Hall
      [6.89413, 3.72364], // Samuel Akande Hall
      [6.89461, 3.72307], // Bethel Splendour Hall
      [6.89442, 3.72249], // Gideon Troopers Hall
      [6.89346, 3.72061], // Topaz Hall
      [6.8937,  3.71999], // Emerald Hall
      [6.8924,  3.7183],  // Campus Center
      [6.8949,  3.7276],  // → Stadium (finish)
    ],
    landmarks: ['Stadium', 'Basketball Court', 'Crystal Hall', 'Samuel Akande', 'Topaz Hall', 'Stadium'],
    checkpoints: [
      { pct: 25,  label: 'Crystal Hall',         emoji: '🔷', note: 'Basketball section done!' },
      { pct: 50,  label: 'Samuel Akande Hall',   emoji: '🏠', note: 'Halfway — keep the intensity!' },
      { pct: 75,  label: 'Emerald Hall',         emoji: '🟢', note: 'Final stretch to the stadium!' },
      { pct: 100, label: 'Stadium',              emoji: '🏟️', note: 'Sports Loop complete! 💪' },
    ],
  },
  {
    id: 'r5',
    name: 'Full Campus Challenge',
    difficulty: 'Hard',
    distance: '5.9 km',
    distanceKm: 5.9,
    time: '~40 min',
    timeMin: 40,
    calories: '~340 kcal',
    calPerMin: 8.5,
    color: '#8b5cf6',
    desc: 'The ultimate BU run — every corner of campus, start to finish. Not for the faint-hearted.',
    waypoints: [
      [6.88908, 3.72004], // Main Gate
      [6.8893,  3.7218],  // Registry
      [6.8911,  3.7173],  // Teaching Hospital
      [6.8885,  3.7185],  // Water Factory
      [6.8870,  3.7200],  // Farm Office
      [6.8924,  3.7183],  // Campus Center
      [6.8928,  3.7196],  // Bakery
      [6.8923,  3.7225],  // Library
      [6.89305, 3.72277], // Food Service
      [6.8909,  3.7226],  // Amphitheatre
      [6.8907,  3.7237],  // Business School
      [6.89205, 3.72376], // BUSA House
      [6.89305, 3.72172], // Neal C. Wilson Hall
      [6.89401, 3.72166], // Winslow Hall
      [6.89442, 3.72249], // Gideon Troopers Hall
      [6.89461, 3.72307], // Bethel Splendour Hall
      [6.89413, 3.72364], // Samuel Akande Hall
      [6.89494, 3.72493], // Ameyo Adadevh Hall
      [6.89488, 3.72607], // Havilah Gold Hall
      [6.89286, 3.72774], // Crystal Hall
      [6.89396, 3.72848], // Basketball Court
      [6.8949,  3.7276],  // Stadium
      [6.88908, 3.72004], // → Main Gate (finish)
    ],
    landmarks: ['Main Gate', 'Hospital', 'Library', 'BUSA', 'Crystal Hall', 'Stadium', 'Main Gate'],
    checkpoints: [
      { pct: 25,  label: 'Campus Center',     emoji: '🌐', note: 'First leg done — solid effort!' },
      { pct: 50,  label: 'BUSA House',        emoji: '🏠', note: 'Halfway through the full campus!' },
      { pct: 75,  label: 'Crystal Hall',      emoji: '🔷', note: 'Final quarter — give it everything!' },
      { pct: 100, label: 'Main Gate',         emoji: '🏁', note: 'FULL CAMPUS COMPLETE! Legend! 🏆' },
    ],
  },
];

// Subcategory IDs that trigger the route picker in the workout section
export const OUTDOOR_CARDIO_SUB_IDS = ['c_outdoor'];
